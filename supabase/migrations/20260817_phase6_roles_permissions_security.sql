-- ====================================================================
-- PHASE 6: ADMIN ROLES, PERMISSIONS & SECURITY MIGRATION
-- ====================================================================

-- 1. Helper Function: Check user role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

-- 2. Helper Function: Check module permissions
CREATE OR REPLACE FUNCTION public.has_permission(p_permission text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE user_id = auth.uid() 
      AND status = 'Active'
      AND (
        role = 'super_admin' 
        OR (role = 'manager' AND p_permission IN ('manage_bookings', 'view_reports', 'view_analytics'))
        OR (role = 'receptionist' AND p_permission = 'manage_bookings')
        OR (role = 'accountant' AND p_permission IN ('view_reports', 'view_analytics'))
        OR p_permission = ANY(COALESCE(permissions, '{}'::text[]))
      )
  );
$$;

-- 3. Helper Function: Can manage system settings
CREATE OR REPLACE FUNCTION public.can_manage_settings()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE user_id = auth.uid() 
      AND status = 'Active'
      AND (
        role IN ('super_admin', 'manager') 
        OR 'manage_settings' = ANY(COALESCE(permissions, '{}'::text[]))
      )
  );
$$;

-- 4. Helper Function: Can manage staff admins
CREATE OR REPLACE FUNCTION public.can_manage_admins()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE user_id = auth.uid() 
      AND status = 'Active'
      AND (
        role = 'super_admin' 
        OR 'manage_admins' = ANY(COALESCE(permissions, '{}'::text[]))
      )
  );
$$;

-- Grant execution to authenticated and anon
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_permission(text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.can_manage_settings() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.can_manage_admins() TO authenticated, anon;

-- 5. Trigger: Block Privilege Escalation on public.profiles
CREATE OR REPLACE FUNCTION public.check_profile_update_security()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_actor_role text;
  v_actor_can_manage_admins boolean;
BEGIN
  -- If auth.uid() is null (e.g. database maintenance/seeding), allow update
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Fetch actor profile info
  SELECT 
    role, 
    (role = 'super_admin' OR 'manage_admins' = ANY(COALESCE(permissions, '{}'::text[])))
  INTO v_actor_role, v_actor_can_manage_admins
  FROM public.profiles
  WHERE user_id = auth.uid();

  -- Case A: Updating own profile
  IF auth.uid() = OLD.user_id THEN
    -- A non-super_admin cannot alter their own role, permissions, status or email
    IF v_actor_role IS DISTINCT FROM 'super_admin' THEN
      IF OLD.role IS DISTINCT FROM NEW.role THEN
        RAISE EXCEPTION 'Privilege escalation blocked: You cannot modify your own role.';
      END IF;
      IF OLD.permissions IS DISTINCT FROM NEW.permissions THEN
        RAISE EXCEPTION 'Privilege escalation blocked: You cannot modify your own permissions.';
      END IF;
      IF OLD.status IS DISTINCT FROM NEW.status THEN
        RAISE EXCEPTION 'Security restriction: You cannot modify your own account status.';
      END IF;
    END IF;
  ELSE
    -- Case B: Updating another user's profile
    IF NOT COALESCE(v_actor_can_manage_admins, false) THEN
      RAISE EXCEPTION 'Access denied: You do not have permission to modify other staff profiles.';
    END IF;

    -- Non-super_admin cannot promote anyone to super_admin or edit a super_admin profile
    IF v_actor_role IS DISTINCT FROM 'super_admin' THEN
      IF OLD.role = 'super_admin' OR NEW.role = 'super_admin' THEN
        RAISE EXCEPTION 'Access denied: Only a Super Admin can assign or modify the Super Admin role.';
      END IF;
    END IF;
  END IF;

  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


DROP TRIGGER IF EXISTS trg_profile_update_security ON public.profiles;
CREATE TRIGGER trg_profile_update_security
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_profile_update_security();

-- 6. Trigger: Prevent Self-Deletion and Deleting Last Super Admin
CREATE OR REPLACE FUNCTION public.check_profile_delete_security()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_actor_role text;
  v_super_admin_count int;
BEGIN
  SELECT role INTO v_actor_role
  FROM public.profiles
  WHERE user_id = auth.uid();

  IF v_actor_role IS DISTINCT FROM 'super_admin' THEN
    RAISE EXCEPTION 'Access denied: Only a Super Admin can delete staff profiles.';
  END IF;

  IF auth.uid() = OLD.user_id THEN
    RAISE EXCEPTION 'Operation blocked: You cannot delete your own active administrator account.';
  END IF;

  IF OLD.role = 'super_admin' THEN
    SELECT COUNT(*) INTO v_super_admin_count
    FROM public.profiles
    WHERE role = 'super_admin';

    IF v_super_admin_count <= 1 THEN
      RAISE EXCEPTION 'Operation blocked: Cannot delete the only remaining Super Admin.';
    END IF;
  END IF;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_profile_delete_security ON public.profiles;
CREATE TRIGGER trg_profile_delete_security
BEFORE DELETE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_profile_delete_security();

-- 7. Update RLS on public.profiles
DROP POLICY IF EXISTS "profiles_select_authenticated" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_super_admin" ON public.profiles;

CREATE POLICY "profiles_select_authenticated" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "profiles_insert_own" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (
  (auth.uid() = user_id) 
  OR public.can_manage_admins()
);

CREATE POLICY "profiles_update_own_or_admin" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (
  (auth.uid() = user_id) 
  OR public.can_manage_admins()
)
WITH CHECK (
  (auth.uid() = user_id) 
  OR public.can_manage_admins()
);

CREATE POLICY "profiles_delete_super_admin" 
ON public.profiles 
FOR DELETE 
TO authenticated 
USING (
  public.get_my_role() = 'super_admin'
);

-- 8. Update RLS on public.bookings
DROP POLICY IF EXISTS "bookings_select_authenticated" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_staff" ON public.bookings;
DROP POLICY IF EXISTS "bookings_update_staff" ON public.bookings;
DROP POLICY IF EXISTS "bookings_delete_admin" ON public.bookings;

CREATE POLICY "bookings_select_authenticated" 
ON public.bookings 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "bookings_insert_staff" 
ON public.bookings 
FOR INSERT 
TO authenticated 
WITH CHECK (
  public.has_permission('manage_bookings')
);

CREATE POLICY "bookings_update_staff" 
ON public.bookings 
FOR UPDATE 
TO authenticated 
USING (
  public.has_permission('manage_bookings')
)
WITH CHECK (
  public.has_permission('manage_bookings')
);

CREATE POLICY "bookings_delete_admin" 
ON public.bookings 
FOR DELETE 
TO authenticated 
USING (
  public.get_my_role() = 'super_admin' 
  OR public.get_my_role() = 'manager'
);

-- 9. Update RLS on public.invoices & payments
DROP POLICY IF EXISTS "invoices_insert_staff" ON public.invoices;
DROP POLICY IF EXISTS "invoices_update_staff" ON public.invoices;
DROP POLICY IF EXISTS "invoices_delete_admin" ON public.invoices;

CREATE POLICY "invoices_insert_staff" 
ON public.invoices 
FOR INSERT 
TO authenticated 
WITH CHECK (
  public.has_permission('manage_bookings')
);

CREATE POLICY "invoices_update_staff" 
ON public.invoices 
FOR UPDATE 
TO authenticated 
USING (
  public.has_permission('manage_bookings')
)
WITH CHECK (
  public.has_permission('manage_bookings')
);

CREATE POLICY "invoices_delete_admin" 
ON public.invoices 
FOR DELETE 
TO authenticated 
USING (
  public.get_my_role() = 'super_admin' 
  OR public.get_my_role() = 'manager'
);

DROP POLICY IF EXISTS "payments_insert_staff" ON public.payments;
DROP POLICY IF EXISTS "payments_update_staff" ON public.payments;
DROP POLICY IF EXISTS "payments_delete_admin" ON public.payments;

CREATE POLICY "payments_insert_staff" 
ON public.payments 
FOR INSERT 
TO authenticated 
WITH CHECK (
  public.has_permission('manage_bookings')
);

CREATE POLICY "payments_update_staff" 
ON public.payments 
FOR UPDATE 
TO authenticated 
USING (
  public.has_permission('manage_bookings')
)
WITH CHECK (
  public.has_permission('manage_bookings')
);

CREATE POLICY "payments_delete_admin" 
ON public.payments 
FOR DELETE 
TO authenticated 
USING (
  public.get_my_role() = 'super_admin' 
  OR public.get_my_role() = 'manager'
);
