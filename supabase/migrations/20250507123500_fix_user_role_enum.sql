-- Fix user_role enum type to align with application code
DO $$
BEGIN
    -- Check if the profiles table exists and handle the column migration carefully
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        -- Store current role values as text, handling all possible existing values
        ALTER TABLE public.profiles ADD COLUMN role_temp text;
        UPDATE public.profiles SET role_temp =
            CASE
                WHEN role::text = 'user' THEN 'user'
                WHEN role::text = 'editor' THEN 'editor'
                WHEN role::text = 'formant' THEN 'editor'
                WHEN role::text = 'admin' THEN 'admin'
                WHEN role::text = 'editor' THEN 'editor'
                WHEN role::text = 'user' THEN 'user'
                ELSE 'user' -- Default fallback
            END;

        -- Drop the old column
        ALTER TABLE public.profiles DROP COLUMN role;
    END IF;

    -- Now drop the old type if it exists
    DROP TYPE IF EXISTS public.user_role CASCADE;

    -- Create the new type with the correct values
    CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'user');

    -- Re-add the role column with the new type if profiles table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        -- Add the role column back with the new type
        ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'user';

        -- Restore the role values from temp column (they should all be valid now)
        UPDATE public.profiles SET role = role_temp::public.user_role WHERE role_temp IS NOT NULL;

        -- Clean up temp column
        ALTER TABLE public.profiles DROP COLUMN role_temp;

        -- Make role column NOT NULL
        ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;
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
DO $outer$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN
        -- Update the is_admin function to use the new role values
        CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
        RETURNS boolean AS $inner$
        DECLARE
            user_role text;
        BEGIN
            SELECT role::text INTO user_role FROM public.profiles WHERE id = user_id;
            RETURN user_role = 'admin';
        END;
        $inner$ LANGUAGE plpgsql SECURITY DEFINER;
    END IF;
END$outer$;