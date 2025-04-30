-- Update the handle_new_user function to handle user roles from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_role user_role;
BEGIN
  -- Default role is 'formant' unless specified in metadata
  user_role := 'formant';

  -- Extract role from user metadata if available
  IF NEW.raw_user_meta_data ? 'role' THEN
    -- Check if the role in metadata is valid
    IF NEW.raw_user_meta_data->>'role' = 'formator' THEN
      user_role := 'formator';
    ELSIF NEW.raw_user_meta_data->>'role' = 'admin' THEN
      user_role := 'admin';
    END IF;
  END IF;

  -- Insert the new user into the profiles table
  INSERT INTO public.profiles (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    user_role,
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;