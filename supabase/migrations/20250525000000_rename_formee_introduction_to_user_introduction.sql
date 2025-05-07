-- Rename the formee_introduction table to user_introduction
ALTER TABLE public.formee_introduction RENAME TO user_introduction;

-- Update the trigger names
ALTER TRIGGER enforce_single_active_intro ON public.user_introduction
RENAME TO enforce_single_active_intro_user;

-- Update the policy names
ALTER POLICY "Admins can manage formee_introduction" ON public.user_introduction
RENAME TO "Admins can manage user_introduction";

ALTER POLICY "Authenticated users can read formee_introduction" ON public.user_introduction
RENAME TO "Authenticated users can read user_introduction";