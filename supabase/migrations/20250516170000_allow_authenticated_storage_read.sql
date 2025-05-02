-- Drop the potentially existing restrictive SELECT policy on the documents bucket
-- Note: If the policy name is different, this DROP statement will need adjustment.
DROP POLICY IF EXISTS "Allow owner or admin select" ON storage.objects;

-- Create a new policy allowing any authenticated user to read (SELECT) objects
-- specifically from the 'documents' bucket.
CREATE POLICY "Allow authenticated read access"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.role() = 'authenticated'
);