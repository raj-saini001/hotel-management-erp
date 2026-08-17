import { supabase } from '../lib/supabase';

export const transformLogFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    adminName: row.admin_name || 'Vijay Shree (Admin)',
    action: row.action || '',
    entityType: row.entity_type,
    entityId: row.entity_id,
    details: row.details || '',
    ipAddress: row.ip_address || '192.168.1.105',
    timestamp: row.created_at,
  };
};

export const activityService = {
  getActivityLogs: async () => {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[activityService] Error fetching logs from Supabase:', error);
      throw new Error(error.message || 'Failed to load activity logs');
    }

    return (data || []).map(transformLogFromDb);
  },

  logActivity: async (action, details, adminName, entityType = null, entityId = null) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const name =
        adminName ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        'Vijay Shree (Admin)';

      const payload = {
        user_id: user?.id || null,
        admin_name: name,
        action,
        details,
        entity_type: entityType,
        entity_id: entityId ? String(entityId) : null,
        ipAddress: '192.168.1.105',
      };

      const { data, error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: payload.user_id,
          admin_name: payload.admin_name,
          action: payload.action,
          details: payload.details,
          entity_type: payload.entity_type,
          entity_id: payload.entity_id,
          ip_address: payload.ipAddress,
        })
        .select()
        .single();

      if (error) {
        console.warn('[activityService] Non-fatal log insertion notice:', error.message);
        return null;
      }

      return transformLogFromDb(data);
    } catch (err) {
      console.warn('[activityService] Log dispatch caught:', err);
      return null;
    }
  },
};
