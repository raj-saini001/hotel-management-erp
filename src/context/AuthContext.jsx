import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { authService, formatUserData, fetchUserProfile } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUserSession = useCallback(async (currentSession) => {
    if (!currentSession?.user) {
      setSession(null);
      setUser(null);
      return null;
    }

    setSession(currentSession);
    const profileRow = await fetchUserProfile(currentSession.user.id);
    const formatted = formatUserData(currentSession.user, profileRow);
    setUser(formatted);
    return formatted;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return null;
    const profileRow = await fetchUserProfile(session.user.id);
    const formatted = formatUserData(session.user, profileRow);
    setUser(formatted);
    return formatted;
  }, [session]);

  useEffect(() => {
    let isMounted = true;

    // Initial session recovery
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('[AuthContext] Session retrieval error:', error);
        }
        if (isMounted) {
          if (data?.session) {
            await syncUserSession(data.session);
          } else {
            setSession(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Auth initialization failed:', err);
        if (isMounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Real-time auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (isMounted) {
        if (currentSession) {
          await syncUserSession(currentSession);
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [syncUserSession]);

  const login = async (usernameOrEmail, password) => {
    const result = await authService.login(usernameOrEmail, password);
    setSession(result.session);
    setUser(result.user);
    return result.user;
  };

  const logout = async () => {
    await authService.logout();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
