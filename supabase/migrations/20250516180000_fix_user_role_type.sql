-- First check if the user_role type exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'formator', 'formee');
    END IF;
END$$;

-- Update handle_new_user function to set 'formee' role by default without using metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert new user with formee role by default
  INSERT INTO public.profiles (id, email, name, role, created_at, is_approved)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''), -- Use name from metadata if available
    'formee'::public.user_role,                    -- Default role is always formee
    NOW(),
    FALSE                                          -- Not approved by default
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure columns for approval status exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'is_approved'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'approval_date'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN approval_date TIMESTAMP WITH TIME ZONE;
    END IF;
END$$;