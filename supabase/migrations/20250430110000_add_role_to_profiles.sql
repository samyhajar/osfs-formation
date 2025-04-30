-- Create a new type for roles
CREATE TYPE public.user_role AS ENUM ('admin', 'formant', 'formator');

-- Add role column to profiles table with proper enum type
ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'formant'::public.user_role NOT NULL;

-- Create policy to let admins view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'::public.user_role
  ));

-- Create policy to let admins update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'::public.user_role
  ));

-- Update handle_new_user function to set default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'formant'::public.user_role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;