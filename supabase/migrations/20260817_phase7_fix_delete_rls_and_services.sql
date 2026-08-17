-- Phase 7 / Bug Fix Migration: Secure DELETE RLS Policies & Verification
-- Date: 2026-08-17

-- 1. Profiles DELETE policy (allows Super Admin and staff with manage_admins permission)
DROP POLICY IF EXISTS "profiles_delete_super_admin" ON public.profiles;
CREATE POLICY "profiles_delete_super_admin" 
ON public.profiles 
FOR DELETE 
TO authenticated 
USING (
  public.can_manage_admins()
  OR public.get_my_role() = 'super_admin'
);

-- 2. Bookings DELETE policy (allows Super Admin, Manager, and staff with manage_bookings permission)
DROP POLICY IF EXISTS "bookings_delete_admin" ON public.bookings;
CREATE POLICY "bookings_delete_admin" 
ON public.bookings 
FOR DELETE 
TO authenticated 
USING (
  public.has_permission('manage_bookings')
  OR public.get_my_role() IN ('super_admin', 'manager')
);

-- 3. Invoices DELETE policy
DROP POLICY IF EXISTS "invoices_delete_admin" ON public.invoices;
CREATE POLICY "invoices_delete_admin" 
ON public.invoices 
FOR DELETE 
TO authenticated 
USING (
  public.has_permission('manage_bookings')
  OR public.get_my_role() IN ('super_admin', 'manager')
);

-- 4. Payments DELETE policy
DROP POLICY IF EXISTS "payments_delete_admin" ON public.payments;
CREATE POLICY "payments_delete_admin" 
ON public.payments 
FOR DELETE 
TO authenticated 
USING (
  public.has_permission('manage_bookings')
  OR public.get_my_role() IN ('super_admin', 'manager')
);
