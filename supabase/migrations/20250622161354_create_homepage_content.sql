-- Create homepage_content table for storing editable homepage content
CREATE TABLE IF NOT EXISTS homepage_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL DEFAULT 'Formation',
  subtitle text NOT NULL DEFAULT 'OSFS Formation Portal',
  welcome_title text NOT NULL DEFAULT 'Welcome to the Formation Portal',
  welcome_message text NOT NULL DEFAULT 'Access resources, connect with your formation community, and continue your journey of spiritual growth and development.',
  coordinator_name text,
  coordinator_message text,
  coordinator_image_url text,
  show_coordinator_section boolean DEFAULT false,
  quote_text text DEFAULT 'Tenui Nec Dimittam',
  quote_translation text DEFAULT 'I have held fast and will not let go',
  show_news_section boolean DEFAULT false,
  news_title text DEFAULT 'Recent News',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create RLS policies
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Allow admins to read, insert, update, delete
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'homepage_content'
    AND policyname = 'Admins can manage homepage content'
  ) THEN
    CREATE POLICY "Admins can manage homepage content" ON homepage_content
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- Allow everyone to read active homepage content (for public display)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'homepage_content'
    AND policyname = 'Everyone can read active homepage content'
  ) THEN
    CREATE POLICY "Everyone can read active homepage content" ON homepage_content
      FOR SELECT USING (active = true);
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_homepage_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_homepage_content_updated_at'
  ) THEN
    CREATE TRIGGER update_homepage_content_updated_at
      BEFORE UPDATE ON homepage_content
      FOR EACH ROW
      EXECUTE FUNCTION update_homepage_content_updated_at();
  END IF;
END $$;

-- Insert default homepage content
INSERT INTO homepage_content (
  title,
  subtitle,
  welcome_title,
  welcome_message,
  coordinator_name,
  coordinator_message,
  show_coordinator_section,
  quote_text,
  quote_translation,
  show_news_section,
  news_title,
  active
)
SELECT
  'Formation',
  'OSFS Formation Portal',
  'Welcome to the Formation Portal',
  'Access resources, connect with your formation community, and continue your journey of spiritual growth and development.',
  'General Formation Coordinator',
  'Welcome to our Formation Portal. This platform serves as your gateway to resources, community connections, and continued spiritual growth. We are committed to supporting you throughout your formation journey.',
  true,
  'Tenui Nec Dimittam',
  'I have held fast and will not let go',
  false,
  'Recent News',
  true
WHERE NOT EXISTS (SELECT 1 FROM homepage_content LIMIT 1);

-- Add comment
COMMENT ON TABLE homepage_content IS 'Stores editable content for the public homepage/landing page';
