-- First, let's clean up any existing profile entries
DELETE FROM public.profiles WHERE email = 'samy.hajar@gmail.com';

-- Check if the user already exists
DO $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'samy.hajar@gmail.com'
  ) INTO user_exists;

  -- If user doesn't exist, create it
  IF NOT user_exists THEN
    -- Temporarily disable the trigger
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

    -- Now insert a fresh user
    WITH inserted_user AS (
      INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        role,
        aud,
        confirmation_token,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data
      ) VALUES (
        gen_random_uuid(),  -- Generate a random UUID
        '00000000-0000-0000-0000-000000000000',  -- Default instance ID
        'samy.hajar@gmail.com',  -- User's email
        crypt('samyto2508C/', gen_salt('bf')),  -- User's password
        NOW(),  -- Email already confirmed
        NOW(),  -- Created now
        NOW(),  -- Updated now
        'authenticated',  -- Default role
        'authenticated',  -- Required aud value
        '',  -- No confirmation token needed
        '',  -- No recovery token needed
        '{"provider":"email","providers":["email"]}',  -- Required app metadata
        '{"name":"Samy Hajar"}'  -- User metadata with name
      ) RETURNING id
    )
    -- Create the profile with admin role
    INSERT INTO public.profiles (
      id,
      email,
      name,
      role,
      created_at
    )
    SELECT
      id,
      'samy.hajar@gmail.com',
      'Samy Hajar',
      'admin',
      NOW()
    FROM inserted_user;

    -- Re-enable the trigger
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  ELSE
    -- If user exists, ensure we have a profile for them
    INSERT INTO public.profiles (
      id,
      email,
      name,
      role,
      created_at
    )
    SELECT
      id,
      'samy.hajar@gmail.com',
      'Samy Hajar',
      'admin',
      NOW()
    FROM auth.users
    WHERE email = 'samy.hajar@gmail.com'
    AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE email = 'samy.hajar@gmail.com'
    );

    -- Update the user's email_change fields
    UPDATE auth.users
    SET
      email_change = '',
      email_change_token_current = '',
      email_change_confirm_status = 0,
      phone = '',
      phone_change = '',
      phone_change_token = '',
      phone_confirmed_at = NULL,
      banned_until = NULL,
      invited_at = NULL
    WHERE email = 'samy.hajar@gmail.com';
  END IF;
END $$;