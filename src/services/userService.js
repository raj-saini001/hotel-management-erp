import { createClient } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { activityService } from './activityService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Create an isolated auth client without localStorage session persistence.
// This guarantees that creating a new staff account will NEVER log out or overwrite the currently authenticated admin session.
const createIsolatedAuthClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'isolated_staff_auth_client',
    },
  });
};

export const transformProfileFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.full_name || 'Staff User',
    email: row.email || '',
    role: row.role || 'receptionist',
    status: row.status || 'Active',
    avatar:
      row.avatar_url ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    permissions: Array.isArray(row.permissions) ? row.permissions : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const userService = {
  getAllAdmins: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[userService] Error fetching staff profiles:', error);
      throw new Error(error.message || 'Failed to fetch admin list');
    }

    return (data || []).map(transformProfileFromDb);
  },

  createAdmin: async (adminData) => {
    if (!adminData.email || !adminData.password) {
      throw new Error('Email and password are required to create a staff account');
    }

    const email = adminData.email.trim().toLowerCase();

    // Check if email already exists in profiles
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .limit(1);

    if (existingProfiles && existingProfiles.length > 0) {
      throw new Error(`A staff account with the email "${email}" already exists.`);
    }

    const permissions =
      Array.isArray(adminData.permissions) && adminData.permissions.length > 0
        ? adminData.permissions
        : ['manage_bookings'];

    const avatarUrl =
      adminData.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    // 1. Create the Auth User in Supabase Auth via isolated client to preserve current session
    const isolatedClient = createIsolatedAuthClient();

    const { data: authData, error: authError } = await isolatedClient.auth.signUp({
      email,
      password: adminData.password,
      options: {
        data: {
          full_name: adminData.name,
          role: adminData.role || 'receptionist',
          status: adminData.status || 'Active',
          avatar_url: avatarUrl,
          permissions,
        },
      },
    });

    if (authError) {
      console.error('[userService] Supabase Auth sign up error:', authError);
      if (authError.message?.toLowerCase().includes('already registered')) {
        throw new Error(`The email address "${email}" is already registered in the system.`);
      }
      throw new Error(authError.message || 'Failed to create staff login credentials');
    }

    const authUser = authData?.user;
    if (!authUser || !authUser.id) {
      throw new Error('Authentication user could not be initialized');
    }

    // 2. Fetch/Upsert the profile record in public.profiles with valid authUser.id
    const { data: profileRows, error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: authUser.id,
          full_name: adminData.name,
          email,
          role: adminData.role || 'receptionist',
          status: adminData.status || 'Active',
          avatar_url: avatarUrl,
          permissions,
        },
        { onConflict: 'user_id' }
      )
      .select();

    if (profileError) {
      console.error('[userService] Error saving profile record:', profileError);
      // Fallback: check if trigger/upsert created the profile record
      const { data: fallbackRows } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .limit(1);

      if (fallbackRows && fallbackRows.length > 0) {
        const fallbackRow = fallbackRows[0];
        await activityService.logActivity(
          'Admin Created',
          `Added new staff profile ${fallbackRow.full_name} (${fallbackRow.role})`,
          undefined,
          'profile',
          fallbackRow.id
        );
        return transformProfileFromDb(fallbackRow);
      }
      throw new Error(profileError.message || 'Failed to create staff profile record');
    }

    const profileRow = profileRows?.[0];

    // 3. Log the activity
    if (profileRow) {
      await activityService.logActivity(
        'Admin Created',
        `Added new staff profile ${profileRow.full_name} (${profileRow.role})`,
        undefined,
        'profile',
        profileRow.id
      );
    }

    return transformProfileFromDb(profileRow);
  },

  updateAdmin: async (id, adminData) => {
    const payload = {
      full_name: adminData.name,
      email: adminData.email ? adminData.email.trim().toLowerCase() : undefined,
      role: adminData.role,
      status: adminData.status,
      permissions: Array.isArray(adminData.permissions) ? adminData.permissions : [],
    };

    if (adminData.avatar) {
      payload.avatar_url = adminData.avatar;
    }

    const { data: updatedRows, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[userService] Error updating admin profile:', error);
      throw new Error(error.message || 'Failed to update staff profile');
    }

    if (!updatedRows || updatedRows.length === 0) {
      throw new Error('Access denied: You do not have permission to modify this staff profile.');
    }

    const updatedProfile = updatedRows[0];

    await activityService.logActivity(
      'Admin Updated',
      `Updated staff permissions/role for ${updatedProfile.full_name}`,
      undefined,
      'profile',
      updatedProfile.id
    );

    return transformProfileFromDb(updatedProfile);
  },

  deleteAdmin: async (id) => {
    if (!id) {
      throw new Error('Invalid staff identifier');
    }

    const { data: targetRows } = await supabase
      .from('profiles')
      .select('id, user_id, full_name, role')
      .eq('id', id)
      .limit(1);

    const target = targetRows?.[0];

    const { data: deletedRows, error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('[userService] Error deleting admin profile:', error);
      throw new Error(error.message || 'Failed to delete staff profile');
    }

    if (!deletedRows || deletedRows.length === 0) {
      throw new Error('Access denied: You do not have permission to delete this staff account, or the record does not exist.');
    }

    if (target) {
      await activityService.logActivity(
        'Admin Deleted',
        `Removed admin profile ${target.full_name} (${target.role})`,
        undefined,
        'profile',
        target.id
      );
    }

    return true;
  },
};

