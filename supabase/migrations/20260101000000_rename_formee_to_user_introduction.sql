-- Rename formee_introduction table to user_introduction
ALTER TABLE IF EXISTS public.formee_introduction RENAME TO user_introduction;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage formee_introduction" ON public.user_introduction;
DROP POLICY IF EXISTS "Authenticated users can read formee_introduction" ON public.user_introduction;

-- Recreate policies with new names
CREATE POLICY "Admins can manage user_introduction"
ON public.user_introduction
FOR ALL
TO authenticated
USING (is_admin());

-- All authenticated users can read the user_introduction table
CREATE POLICY "Authenticated users can read user_introduction"
ON public.user_introduction
FOR SELECT
TO authenticated
USING (true);