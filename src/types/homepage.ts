export interface HomepageContent {
  id: string;
  title: string;
  subtitle: string;
  welcome_title: string;
  welcome_message: string;
  coordinator_name?: string;
  coordinator_message?: string;
  coordinator_image_url?: string;
  show_coordinator_section: boolean;
  quote_text: string;
  quote_translation: string;
  show_news_section: boolean;
  news_title: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageContentForm {
  title: string;
  subtitle: string;
  welcome_title: string;
  welcome_message: string;
  coordinator_name: string;
  coordinator_message: string;
  coordinator_image_url?: string;
  show_coordinator_section: boolean;
  quote_text: string;
  quote_translation: string;
  show_news_section: boolean;
  news_title: string;
}
