-- First, insert a user in the auth.users table
-- NOTE: Replace 'your-email@example.com' with your actual email
-- The password is hashed as 'password123' - you should change this after login
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  confirmation_token,
  recovery_token
) VALUES (
  gen_random_uuid(),  -- Generate a random UUID
  '00000000-0000-0000-0000-000000000000',  -- Default instance ID
  'samy.hajar@gmail.com',  -- User's email
  crypt('samyto2508C/', gen_salt('bf')),  -- User's password
  NOW(),  -- Email already confirmed
  NOW(),  -- Created now
  NOW(),  -- Updated now
  'authenticated',  -- Default role
  '',  -- No confirmation token needed
  ''  -- No recovery token needed
);

-- The trigger will create a profile automatically, but we need to update the role to admin
-- Make sure to replace the email with the same one you used above
UPDATE public.profiles
SET role = 'admin', name = 'Samy Hajar'
WHERE email = 'samy.hajar@gmail.com';