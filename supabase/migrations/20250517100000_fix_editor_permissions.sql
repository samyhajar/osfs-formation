-- Migration: Fix editor permissions for workshops
-- Description: Adds policies to allow editors to upload and manage workshop files

-- Create policy allowing editors to insert into workshops
DROP POLICY IF EXISTS "Editors and admins can create workshops" ON public.workshops;
CREATE POLICY "Editors and admins can create workshops" ON public.workshops
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt()->>'role' IN ('admin', 'editor') OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );

-- Create policy allowing editors to update their workshops
DROP POLICY IF EXISTS "Editors can update their workshops" ON public.workshops;
CREATE POLICY "Editors can update their workshops" ON public.workshops
  FOR UPDATE
  USING (
    (auth.jwt()->>'role' IN ('admin', 'editor') OR
     EXISTS (
       SELECT 1 FROM public.profiles
       WHERE id = auth.uid() AND role IN ('admin', 'editor')
     ))
    AND auth.uid() = created_by
  );

-- Create policy for storage to allow editors to upload files
DROP POLICY IF EXISTS "workshop_files_editor_admin_upload_policy" ON storage.objects;
CREATE POLICY "workshop_files_editor_admin_upload_policy" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'workshops' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );