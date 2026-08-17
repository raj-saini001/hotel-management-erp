import { supabase } from '../lib/supabase';

export const fetchUserProfile = async (userId) => {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }
    return data[0];
  } catch (err) {
    console.warn('[authService] Error fetching user profile:', err);
    return null;
  }
};

export const formatUserData = (supabaseUser, profileRow = null) => {
  if (!supabaseUser) return null;
  const meta = supabaseUser.user_metadata || {};
  return {
    id: profileRow?.id || supabaseUser.id,
    userId: supabaseUser.id,
    email: profileRow?.email || supabaseUser.email || '',
    name:
      profileRow?.full_name ||
      meta.full_name ||
      meta.name ||
      supabaseUser.email?.split('@')[0] ||
      'Staff Admin',
    role: profileRow?.role || meta.role || 'receptionist',
    status: profileRow?.status || meta.status || 'Active',
    avatar:
      profileRow?.avatar_url ||
      meta.avatar_url ||
      meta.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    permissions: Array.isArray(profileRow?.permissions)
      ? profileRow.permissions
      : Array.isArray(meta.permissions)
      ? meta.permissions
      : [],
    rawUser: supabaseUser,
  };
};

export const authService = {
  login: async (usernameOrEmail, password) => {
    let email = (usernameOrEmail || '').trim();
    // Allow typing "admin" as shortcut for the super admin account
    if (email.toLowerCase() === 'admin') {
      email = 'admin@grandstay.com';
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (
        error.message.includes('Invalid login credentials') ||
        error.message.includes('invalid_grant') ||
        error.status === 400
      ) {
        throw new Error('Invalid email or password. Please verify your credentials.');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Email address is not confirmed. Please check your inbox.');
      }
      throw new Error(error.message || 'Authentication failed. Please try again.');
    }

    // Clean up any legacy localStorage tokens if present
    localStorage.removeItem('hotel_admin_token');
    localStorage.removeItem('hotel_admin_user');

    // Fetch authoritative database profile
    const profileRow = await fetchUserProfile(data.user.id);
    const formattedUser = formatUserData(data.user, profileRow);

    return { user: formattedUser, session: data.session };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    // Ensure legacy keys are cleaned up
    localStorage.removeItem('hotel_admin_token');
    localStorage.removeItem('hotel_admin_user');

    if (error) {
      console.error('Supabase signOut error:', error);
      throw new Error(error.message || 'Logout failed');
    }
    return true;
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error fetching Supabase session:', error);
      return null;
    }
    return data?.session || null;
  },

  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return null;
    }
    const profileRow = await fetchUserProfile(data.user.id);
    return formatUserData(data.user, profileRow);
  },

  refreshProfile: async (userId) => {
    return await fetchUserProfile(userId);
  },
};
