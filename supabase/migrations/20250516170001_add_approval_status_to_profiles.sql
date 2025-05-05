-- Add approval status to profiles table
ALTER TABLE public.profiles ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN approval_date TIMESTAMP WITH TIME ZONE;

-- Update handle_new_user function to set is_approved to false for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_role_provided text;
  final_user_role user_role; -- Assuming user_role is the enum type
BEGIN
  -- Default role is 'formee' (valid enum value)
  final_user_role := 'formee';

  -- Check if role exists in metadata
  IF NEW.raw_user_meta_data ? 'role' THEN
    user_role_provided := NEW.raw_user_meta_data->>'role';

    -- Check if the provided role is valid within the enum
    IF user_role_provided = 'formator' THEN
      final_user_role := 'formator';
    ELSIF user_role_provided = 'formee' THEN
      final_user_role := 'formee';
    ELSIF user_role_provided = 'admin' THEN
      -- Allow admin creation via signup based on metadata
      final_user_role := 'admin';
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
    ELSE
       -- Optional: Log or raise an error for invalid roles.
       -- raise warning 'Invalid role provided in metadata: %. Falling back to default.', user_role_provided;
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