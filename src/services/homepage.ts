import { createClient } from '@/lib/supabase/browser-client';
import type { HomepageContent } from '@/types/homepage';

export async function getHomepageContent(): Promise<HomepageContent | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('homepage_content')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching homepage content:', error);
    return null;
  }

  return data as unknown as HomepageContent;
}

export async function getHomepageContentWithFallback(): Promise<HomepageContent> {
  const content = await getHomepageContent();

  // Return default values if no content is found
  if (!content) {
    return {
      id: 'default',
      title: 'Formation',
      subtitle: 'OSFS Formation Portal',
      welcome_title: 'Welcome to the Formation Portal',
      welcome_message:
        'Access resources, connect with your formation community, and continue your journey of spiritual growth and development.',
      coordinator_name: '',
      coordinator_message: '',
      coordinator_image_url: '',
      show_coordinator_section: false,
      quote_text: 'Tenui Nec Dimittam',
      quote_translation: 'I have held fast and will not let go',
      show_news_section: false,
      news_title: '',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return content;
}
