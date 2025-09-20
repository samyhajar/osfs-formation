-- Disable email confirmations in Supabase Auth
-- This migration disables the built-in email confirmation system
-- so that we can handle all emails through Omnisend instead

-- Note: This is a placeholder migration. The actual email confirmation
-- setting needs to be changed in the Supabase Dashboard under:
-- Authentication → Settings → Email → Enable email confirmations

-- The setting should be set to false to disable Supabase's built-in email system
-- and allow our custom Omnisend integration to handle all email sending.

-- This migration serves as documentation of the required change.
-- The actual configuration change must be made in the Supabase Dashboard.
