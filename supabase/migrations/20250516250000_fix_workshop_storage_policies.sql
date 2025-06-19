-- Migration: Fix workshop storage policies
-- Description: Ensures all necessary storage policies are in place for the workshops bucket

-- First, drop any existing policies for the workshops bucket
DROP POLICY IF EXISTS "Admin Workshop Full Access" ON storage.objects;
DROP POLICY IF EXISTS "Formee Workshop Read Access" ON storage.objects;
DROP POLICY IF EXISTS "workshops_authenticated_uploads" ON storage.objects;
DROP POLICY IF EXISTS "workshops_owner_admin_select" ON storage.objects;
DROP POLICY IF EXISTS "workshops_owner_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "workshops_owner_admin_delete" ON storage.objects;
DROP POLICY IF EXISTS "workshops_editor_read_access" ON storage.objects;
DROP POLICY IF EXISTS "workshop_files_user_read_policy" ON storage.objects;

-- Create policies for admin users (full access)
CREATE POLICY "Admin Workshop Full Access"
ON storage.objects FOR ALL
USING (
  bucket_id = 'workshops' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'workshops' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Create policy for authenticated uploads
CREATE POLICY "workshops_authenticated_uploads"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'workshops' AND
  auth.role() = 'authenticated'
);

-- Create policies for workshop owners and admins
CREATE POLICY "workshops_owner_admin_select"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'workshops' AND
  (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  )
);

CREATE POLICY "workshops_owner_admin_update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'workshops' AND
  (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  )
);

CREATE POLICY "workshops_owner_admin_delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'workshops' AND
  (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  )
);

-- Create policy for editor read access
CREATE POLICY "workshops_editor_read_access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'workshops' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'editor'
  )
);

-- Create policy for user read access
CREATE POLICY "workshop_files_user_read_policy"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'workshops' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'user'
  )
);