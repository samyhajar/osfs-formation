-- Drop existing policy first
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Add RLS policy to allow admin users to select any profile.
-- This is necessary for the user management page.
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    -- Check if the currently authenticated user's role is 'admin'
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );