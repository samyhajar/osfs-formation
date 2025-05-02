-- Update the handle_new_user function to correctly handle roles from metadata
-- Use 'formee' as default and explicitly check for 'admin', 'formator', 'formee'.
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
      -- Ensure allowing admin creation via signup is intended.
      final_user_role := 'admin';
    ELSE
       -- Optional: Log or raise an error for invalid roles.
       -- raise warning 'Invalid role provided in metadata: %. Falling back to default.', user_role_provided;
    END IF;
  END IF;

  -- Insert the new user into the profiles table
  INSERT INTO public.profiles (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''), -- Use name from metadata
    final_user_role,                              -- Use the determined valid role
    NOW()
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