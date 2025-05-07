-- Fix user_role enum type to align with application code
DO $$
BEGIN
    -- First drop the old type if it exists
    DROP TYPE IF EXISTS public.user_role CASCADE;

    -- Create the new type with the correct values
    CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'user');

    -- Update the profiles table if it exists to use the new enum
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        -- First update existing records to have valid values before applying the type constraint
        UPDATE public.profiles SET role = 'user' WHERE role = 'formee';
        UPDATE public.profiles SET role = 'editor' WHERE role = 'formator';

        -- Now alter the column to use the new type
        ALTER TABLE public.profiles
        ALTER COLUMN role TYPE public.user_role
        USING role::text::public.user_role;
    END IF;
END$$;

-- Update handle_new_user function to work with the new enum values
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_role_provided text;
  final_user_role public.user_role; -- Using the enum type
BEGIN
  -- Default role is 'user'
  final_user_role := 'user'::public.user_role;

  -- Check if role exists in metadata
  IF NEW.raw_user_meta_data ? 'role' THEN
    user_role_provided := NEW.raw_user_meta_data->>'role';

    -- Check if the provided role is valid within the enum
    IF user_role_provided = 'editor' THEN
      final_user_role := 'editor'::public.user_role;
    ELSIF user_role_provided = 'user' THEN
      final_user_role := 'user'::public.user_role;
    ELSIF user_role_provided = 'admin' THEN
      -- Allow admin creation via signup based on metadata
      final_user_role := 'admin'::public.user_role;
      -- Auto-approve admins (if explicitly set by the system)
      IF NEW.raw_user_meta_data ? 'auto_approve' AND NEW.raw_user_meta_data->>'auto_approve' = 'true' THEN
        INSERT INTO public.profiles (id, email, name, role, created_at, is_approved, approval_date)
        VALUES (
          NEW.id,
          NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'name', ''),
          final_user_role,
          NOW(),
          TRUE,
          NOW()
        );
        RETURN NEW;
      END IF;
    END IF;
  END IF;

  -- Insert the new user into the profiles table (not approved by default)
  INSERT INTO public.profiles (id, email, name, role, created_at, is_approved)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''), -- Use name from metadata
    final_user_role,                              -- Use the determined valid role
    NOW(),
    FALSE
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Re-create the trigger to ensure it uses the updated function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the roleMapping in user-related functions if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        -- Update the is_admin function to use the new role values
        CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
        RETURNS boolean AS $$
        DECLARE
            user_role text;
        BEGIN
            SELECT role::text INTO user_role FROM public.profiles WHERE id = user_id;
            RETURN user_role = 'admin';
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
    END IF;
END$$;