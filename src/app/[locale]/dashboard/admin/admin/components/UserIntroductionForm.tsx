'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { UserIntroductionCoordinatorSection } from './UserIntroductionCoordinatorSection';
import { UserIntroductionColumnSection } from './UserIntroductionColumnSection';

interface UserIntroduction {
  id: string;
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  left_column_gallery_urls?: string[];
  left_column_gallery_titles?: string[];
  right_column_gallery_urls?: string[];
  right_column_gallery_titles?: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserIntroductionFormData {
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  left_column_gallery_urls: string[];
  left_column_gallery_titles: string[];
  right_column_gallery_urls: string[];
  right_column_gallery_titles: string[];
}

interface UserIntroductionFormProps {
  initialData: UserIntroduction | null;
}

export function UserIntroductionForm({ initialData }: UserIntroductionFormProps) {
  const t = useTranslations('Admin.userIntroduction');

  const [formData, setFormData] = useState<UserIntroductionFormData>({
    coordinator_name: initialData?.coordinator_name || '',
    left_column_content: initialData?.left_column_content || '',
    right_column_content: initialData?.right_column_content || '',
    left_column_gallery_urls: initialData?.left_column_gallery_urls || [],
    left_column_gallery_titles: initialData?.left_column_gallery_titles || [],
    right_column_gallery_urls: initialData?.right_column_gallery_urls || [],
    right_column_gallery_titles: initialData?.right_column_gallery_titles || [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGalleryUpdate = (columnType: 'left' | 'right', urls: string[], titles: string[]) => {
    if (columnType === 'left') {
      setFormData(prev => ({
        ...prev,
        left_column_gallery_urls: urls,
        left_column_gallery_titles: titles
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        right_column_gallery_urls: urls,
        right_column_gallery_titles: titles
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.coordinator_name || !formData.left_column_content || !formData.right_column_content) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient<Database>();
      const dataToSave = {
        coordinator_name: formData.coordinator_name,
        left_column_content: formData.left_column_content,
        right_column_content: formData.right_column_content,
        left_column_gallery_urls: formData.left_column_gallery_urls,
        left_column_gallery_titles: formData.left_column_gallery_titles,
        right_column_gallery_urls: formData.right_column_gallery_urls,
        right_column_gallery_titles: formData.right_column_gallery_titles,
        active: true
      };

      let response;
      if (initialData?.id) {
        response = await supabase
          .from('user_introduction')
          .update(dataToSave)
          .eq('id', initialData.id);
      } else {
        response = await supabase
          .from('user_introduction')
          .insert([dataToSave]);
      }

      if (response.error) {
        throw new Error(response.error.message);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving user introduction:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    void handleSubmit(e);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
            {t('saveSuccess', { fallback: 'Content saved successfully!' })}
          </div>
        )}

        <UserIntroductionCoordinatorSection
          coordinatorName={formData.coordinator_name}
          onChange={handleChange}
        />

        <UserIntroductionColumnSection
          columnType="left"
          content={formData.left_column_content}
          galleryUrls={formData.left_column_gallery_urls}
          galleryTitles={formData.left_column_gallery_titles}
          onChange={handleChange}
          onGalleryUpdate={(urls, titles) => handleGalleryUpdate('left', urls, titles)}
        />

        <UserIntroductionColumnSection
          columnType="right"
          content={formData.right_column_content}
          galleryUrls={formData.right_column_gallery_urls}
          galleryTitles={formData.right_column_gallery_titles}
          onChange={handleChange}
          onGalleryUpdate={(urls, titles) => handleGalleryUpdate('right', urls, titles)}
        />

        {/* Submit Button */}
        <div className="flex justify-end bg-white border border-gray-200 rounded-lg p-6">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition text-lg"
          >
            {loading ? 'Saving...' : t('saveButton', { fallback: 'Save Changes' })}
          </button>
        </div>
      </form>
    </div>
  );
}