-- This migration fixes NULL fields in the admin user record
-- First, check if admin user exists and has NULL fields
DO $$
DECLARE
  admin_user_id UUID;
  has_null_fields BOOLEAN;
BEGIN
  -- Get admin user ID
  SELECT id INTO admin_user_id
  FROM public.profiles
  WHERE email = 'samy.hajar@gmail.com' AND role = 'admin';

  -- Check if user exists and has NULL fields
  IF admin_user_id IS NOT NULL THEN
    SELECT
      (avatar_url IS NULL) OR
      (name IS NULL) OR
      (email IS NULL) OR
      (created_at IS NULL)
    INTO has_null_fields
    FROM public.profiles
    WHERE id = admin_user_id;

    -- Update NULL fields if needed
    IF has_null_fields THEN
      UPDATE public.profiles
      SET
        name = COALESCE(name, 'Samy Hajar'),
        email = COALESCE(email, 'samy.hajar@gmail.com'),
        avatar_url = COALESCE(avatar_url, ''),
        created_at = COALESCE(created_at, NOW())
      WHERE id = admin_user_id;

      RAISE NOTICE 'Fixed NULL fields for admin user %', admin_user_id;
    ELSE
      RAISE NOTICE 'Admin user % has no NULL fields', admin_user_id;
    END IF;
  ELSE
    RAISE NOTICE 'Admin user not found, no action taken';
  END IF;
END
$$;