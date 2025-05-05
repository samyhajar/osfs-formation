-- Migration: Create moddatetime function
-- Description: Creates the function to automatically update updated_at timestamps.

CREATE OR REPLACE FUNCTION moddatetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';