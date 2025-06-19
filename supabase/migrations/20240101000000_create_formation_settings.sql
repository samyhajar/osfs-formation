-- Create formation_settings table to store selected formation personnel
CREATE TABLE IF NOT EXISTS formation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  selected_member_ids JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_by UUID REFERENCES auth.users(id)
);

-- Create RLS policies
ALTER TABLE formation_settings ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins can manage formation settings" ON formation_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Editor and user can only read
CREATE POLICY "Users can read formation settings" ON formation_settings
  FOR SELECT USING (true);

-- Insert initial row
INSERT INTO formation_settings (selected_member_ids)
VALUES ('[]'::jsonb)
ON CONFLICT DO NOTHING;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_formation_settings_updated_at
    BEFORE UPDATE ON formation_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();