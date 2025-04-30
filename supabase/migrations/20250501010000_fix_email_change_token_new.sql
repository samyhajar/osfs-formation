-- This migration fixes the NULL email_change_token_new field in auth.users table
-- The error occurs when NULL is converted to string

DO $$
BEGIN
  -- Update all records in auth.users table where email_change_token_new is NULL
  UPDATE auth.users
  SET
    email_change_token_new = ''
  WHERE email_change_token_new IS NULL;

  -- Make sure the admin user has no NULL string fields
  UPDATE auth.users
  SET
    email_change_token_new = ''
  WHERE email = 'samy.hajar@gmail.com';

  RAISE NOTICE 'Fixed NULL email_change_token_new field in auth.users table';
END
$$;