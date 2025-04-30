-- This migration fixes the NULL email_change field in auth.users table
-- The error occurs when NULL is converted to string

DO $$
BEGIN
  -- Update all records in auth.users table where email_change is NULL to empty string
  UPDATE auth.users
  SET
    email_change = '',
    email_change_token_current = COALESCE(email_change_token_current, ''),
    email_change_confirm_status = COALESCE(email_change_confirm_status, 0),
    phone = COALESCE(phone, ''),
    phone_change = COALESCE(phone_change, ''),
    phone_change_token = COALESCE(phone_change_token, '')
  WHERE email_change IS NULL;

  -- Specific fix for admin user
  UPDATE auth.users
  SET
    email_change = '',
    email_change_token_current = '',
    email_change_confirm_status = 0,
    phone = '',
    phone_change = '',
    phone_change_token = ''
  WHERE email = 'samy.hajar@gmail.com';

  RAISE NOTICE 'Fixed NULL email_change field in auth.users table';
END
$$;