'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { HomepageContent, HomepageContentForm } from '@/types/homepage';
import { Button } from '@/components/ui/Button';
import { HomepageMainTitleSection } from './HomepageMainTitleSection';
import { HomepageWelcomeSection } from './HomepageWelcomeSection';
import { HomepageCoordinatorSection } from './HomepageCoordinatorSection';
import { HomepageQuoteSection } from './HomepageQuoteSection';
import { HomepageNewsSection } from './HomepageNewsSection';

interface HomepageSettingsFormProps {
  initialData: HomepageContent | null;
}

export function HomepageSettingsForm({ initialData }: HomepageSettingsFormProps) {
  const t = useTranslations('HomepageSettings');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<HomepageContentForm>({
    title: initialData?.title || 'Formation',
    subtitle: initialData?.subtitle || 'OSFS Formation Portal',
    welcome_title: initialData?.welcome_title || 'Welcome to the Formation Portal',
    welcome_message: initialData?.welcome_message || 'Access resources, connect with your formation community, and continue your journey of spiritual growth and development.',
    coordinator_name: initialData?.coordinator_name || '',
    coordinator_message: initialData?.coordinator_message || '',
    coordinator_image_url: initialData?.coordinator_image_url || '',
    show_coordinator_section: initialData?.show_coordinator_section || false,
    quote_text: initialData?.quote_text || 'Tenui Nec Dimittam',
    quote_translation: initialData?.quote_translation || 'I have held fast and will not let go',
    show_news_section: initialData?.show_news_section || false,
    news_title: initialData?.news_title || 'Recent News',
  });

  const handleInputChange = (field: keyof HomepageContentForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient<Database>();

      if (initialData?.id) {
        // Update existing record
        const { error } = await supabase
          .from('homepage_content')
          .update({
            title: formData.title,
            subtitle: formData.subtitle,
            welcome_title: formData.welcome_title,
            welcome_message: formData.welcome_message,
            coordinator_name: formData.coordinator_name || null,
            coordinator_message: formData.coordinator_message || null,
            coordinator_image_url: formData.coordinator_image_url || null,
            show_coordinator_section: formData.show_coordinator_section,
            quote_text: formData.quote_text,
            quote_translation: formData.quote_translation,
            show_news_section: formData.show_news_section,
            news_title: formData.news_title,
          })
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        // Create new record (deactivate others first)
        await supabase
          .from('homepage_content')
          .update({ active: false })
          .eq('active', true);

        const { error } = await supabase
          .from('homepage_content')
          .insert({
            title: formData.title,
            subtitle: formData.subtitle,
            welcome_title: formData.welcome_title,
            welcome_message: formData.welcome_message,
            coordinator_name: formData.coordinator_name || null,
            coordinator_message: formData.coordinator_message || null,
            coordinator_image_url: formData.coordinator_image_url || null,
            show_coordinator_section: formData.show_coordinator_section,
            quote_text: formData.quote_text,
            quote_translation: formData.quote_translation,
            show_news_section: formData.show_news_section,
            news_title: formData.news_title,
            active: true,
          });

        if (error) throw error;
      }

      setMessage({ type: 'success', text: t('saveSuccess', { fallback: 'Homepage content saved successfully!' }) });
    } catch (error) {
      console.error('Error saving homepage content:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to save homepage content'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    void handleSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <HomepageMainTitleSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      <HomepageWelcomeSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      <HomepageCoordinatorSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      <HomepageQuoteSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      <HomepageNewsSection
        formData={formData}
        onInputChange={handleInputChange}
      />

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button
          type="submit"
          disabled={saving}
          loading={saving}
          className="px-6 py-2"
        >
          {saving ? t('saving', { fallback: 'Saving...' }) : t('saveButton', { fallback: 'Save Changes' })}
        </Button>
      </div>
    </form>
  );
}