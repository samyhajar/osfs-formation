-- Function definition for get_category_counts
CREATE OR REPLACE FUNCTION public.get_category_counts()
RETURNS TABLE (category public.document_category, count bigint) -- Corrected type name (lowercase, no quotes)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    doc.category,
    COUNT(doc.id) as count
  FROM
    public.documents doc -- Adjust schema if needed
  WHERE
    doc.category IS NOT NULL
  GROUP BY
    doc.category;
END;
$$;

-- Grant execute permission to the authenticated role (if users need to be logged in)
-- Ensure the role exists and adjust if needed (e.g., service_role, anon)
GRANT EXECUTE ON FUNCTION public.get_category_counts() TO authenticated;

-- Grant execute permission to the anon role (if unauthenticated users can access)
-- Uncomment if needed
-- GRANT EXECUTE ON FUNCTION public.get_category_counts() TO anon;