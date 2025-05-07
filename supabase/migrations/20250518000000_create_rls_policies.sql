-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to view any approved profile
CREATE POLICY "Profiles are viewable by authenticated users if approved"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_approved = true OR auth.uid() = id);

-- Create a policy that allows users to update only their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create a policy that allows admins to update any profile
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (true);

-- Create a policy for admins to delete profiles
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow users to select themselves regardless of approval status
CREATE POLICY "Users can always view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create a default policy for insert that allows the system to create profiles
-- This is needed for the handle_new_user trigger function
CREATE POLICY "System can create profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (true);