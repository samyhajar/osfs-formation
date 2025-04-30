-- migrations/YYYYMMDDHHMMSS_update_user_roles_v2.sql

-- Step 1: Rename the existing enum type
ALTER TYPE public.user_role RENAME TO user_role_old;

-- Step 2: Create the new enum type with the correct roles
CREATE TYPE public.user_role AS ENUM ('admin', 'formator', 'formee');

-- Step 3: Update the profiles table
-- Change the column type to the new enum and update existing values
-- Also set the new default value
ALTER TABLE public.profiles
  ALTER COLUMN role DROP DEFAULT,
  ALTER COLUMN role TYPE public.user_role USING role::text::public.user_role,
  ALTER COLUMN role SET DEFAULT 'admin';

-- Step 4: Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_role public.user_role;
  input_role TEXT;
BEGIN
  -- Default role is 'admin' unless specified and valid in metadata
  user_role := 'admin'; -- Set default to admin

  -- Extract role from user metadata if available
  IF NEW.raw_user_meta_data ? 'role' THEN
    input_role := NEW.raw_user_meta_data->>'role';

    -- Check if the role in metadata is one of the valid enum values
    IF input_role = 'formator' THEN
      user_role := 'formator';
    ELSIF input_role = 'formee' THEN -- Add check for 'formee'
      user_role := 'formee';
    -- Keep 'admin' if input_role is 'admin', otherwise it defaults to 'admin' anyway
    ELSIF input_role = 'admin' THEN
        user_role := 'admin';
    END IF;
    -- If input_role is something else, it will keep the default 'admin'
  END IF;

  -- Insert the new user into the profiles table
  INSERT INTO public.profiles (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''), -- Keep name handling
    user_role, -- Use the determined role
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger is still in place (it should be, but doesn't hurt to be sure)
-- This command will succeed if the trigger exists, or create it if it doesn't
-- Assuming the trigger name from previous migrations is correct
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;


-- Step 5: Drop the old enum type
DROP TYPE public.user_role_old;