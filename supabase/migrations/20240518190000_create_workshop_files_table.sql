-- Create workshop_files table
CREATE TABLE IF NOT EXISTS public.workshop_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workshop_id UUID NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    public_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.workshop_files ENABLE ROW LEVEL SECURITY;

-- Policy for viewing workshop files
-- Users can view files if they can view the parent workshop
CREATE POLICY "Users can view workshop files if they can view the parent workshop" ON public.workshop_files
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workshops w
            WHERE w.id = workshop_files.workshop_id
            AND (
                w.is_public = true
                OR w.created_by = auth.uid()
                OR auth.jwt()->>'role' = 'admin'
            )
        )
    );

-- Policy for inserting workshop files
-- Only workshop owners and admins can add files
CREATE POLICY "Workshop owners and admins can add files" ON public.workshop_files
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workshops w
            WHERE w.id = workshop_files.workshop_id
            AND (
                w.created_by = auth.uid()
                OR auth.jwt()->>'role' = 'admin'
            )
        )
    );

-- Policy for updating workshop files
-- Only workshop owners and admins can update files
CREATE POLICY "Workshop owners and admins can update files" ON public.workshop_files
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.workshops w
            WHERE w.id = workshop_files.workshop_id
            AND (
                w.created_by = auth.uid()
                OR auth.jwt()->>'role' = 'admin'
            )
        )
    );

-- Policy for deleting workshop files
-- Only workshop owners and admins can delete files
CREATE POLICY "Workshop owners and admins can delete files" ON public.workshop_files
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.workshops w
            WHERE w.id = workshop_files.workshop_id
            AND (
                w.created_by = auth.uid()
                OR auth.jwt()->>'role' = 'admin'
            )
        )
    );

-- Add updated_at trigger
CREATE TRIGGER set_workshop_files_updated_at
    BEFORE UPDATE ON public.workshop_files
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();