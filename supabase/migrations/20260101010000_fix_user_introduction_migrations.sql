-- Check if formee_introduction table exists and migrate the data if it does
DO $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if formee_introduction table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'formee_introduction'
    ) INTO table_exists;

    -- If formee_introduction exists, migrate data and rename table
    IF table_exists THEN
        -- First check if user_introduction already exists
        IF NOT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = 'user_introduction'
        ) THEN
            -- Rename the table
            ALTER TABLE public.formee_introduction RENAME TO user_introduction;

            -- Update the trigger names if they exist
            IF EXISTS (
                SELECT FROM pg_trigger
                WHERE tgname = 'enforce_single_active_intro'
                AND tgrelid = 'public.user_introduction'::regclass
            ) THEN
                ALTER TRIGGER enforce_single_active_intro ON public.user_introduction
                RENAME TO enforce_single_active_intro_user;
            END IF;

            -- Update RLS policies if they exist
            IF EXISTS (
                SELECT FROM pg_policy
                WHERE polname = 'Admins can manage formee_introduction'
                AND polrelid = 'public.user_introduction'::regclass
            ) THEN
                ALTER POLICY "Admins can manage formee_introduction" ON public.user_introduction
                RENAME TO "Admins can manage user_introduction";
            END IF;

            IF EXISTS (
                SELECT FROM pg_policy
                WHERE polname = 'Authenticated users can read formee_introduction'
                AND polrelid = 'public.user_introduction'::regclass
            ) THEN
                ALTER POLICY "Authenticated users can read formee_introduction" ON public.user_introduction
                RENAME TO "Authenticated users can read user_introduction";
            END IF;
        ELSE
            -- If user_introduction already exists, copy data from formee_introduction
            INSERT INTO public.user_introduction (
                coordinator_name,
                left_column_content,
                right_column_content,
                active,
                created_at,
                updated_at
            )
            SELECT
                coordinator_name,
                left_column_content,
                right_column_content,
                active,
                created_at,
                updated_at
            FROM public.formee_introduction
            WHERE NOT EXISTS (
                SELECT 1 FROM public.user_introduction ui
                WHERE ui.coordinator_name = public.formee_introduction.coordinator_name
                AND ui.active = public.formee_introduction.active
            );

            -- Then drop the formee_introduction table
            DROP TABLE public.formee_introduction;
        END IF;
    END IF;
END $$;

-- Ensure RLS policies are set correctly for user_introduction
DROP POLICY IF EXISTS "Admins can manage user_introduction" ON public.user_introduction;
DROP POLICY IF EXISTS "Authenticated users can read user_introduction" ON public.user_introduction;

-- Recreate policies with new names
CREATE POLICY "Admins can manage user_introduction"
ON public.user_introduction
FOR ALL
TO authenticated
USING (is_admin());

-- All authenticated users can read the user_introduction table
CREATE POLICY "Authenticated users can read user_introduction"
ON public.user_introduction
FOR SELECT
TO authenticated
USING (true);