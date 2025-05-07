-- First drop all policies that depend on the role column
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Drop the trigger that depends on the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Now drop the function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop the column from profiles table that uses the enum type
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Drop the enum type if it exists
DROP TYPE IF EXISTS public.user_role;

-- Recreate the enum type properly
CREATE TYPE public.user_role AS ENUM ('admin', 'formant', 'formator');

-- Add the role column back to profiles
ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'formant'::public.user_role NOT NULL;

-- Recreate the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'formant'::public.user_role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Recreate policies for profiles table
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'::public.user_role
  ));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'::public.user_role
  ));