-- Create or replace the helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  user_role public.user_role;
BEGIN
  -- Get the role of the currently authenticated user
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1; -- Ensure only one row is returned

  RETURN COALESCE(user_role = 'admin', false); -- Return true if admin, false otherwise
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;


-- Drop the previous policy if it exists (to avoid conflicts)
-- Note: If the previous migration (20250502002032) was marked as applied but didn't actually run successfully,
-- dropping it here ensures we replace it cleanly.
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate the policy using the helper function
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT          -- Grant SELECT permission
  TO authenticated    -- To any authenticated user (function check handles security)
  USING (public.is_admin() = true); -- Allow SELECT if the helper function returns true


-- Optional but recommended: Ensure RLS is still enabled (should be redundant but safe)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Commented out as RLS is likely already enabled, uncomment if needed.