'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

interface UserIntroduction {
  id: string;
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserIntroductionFormProps {
  initialData: UserIntroduction | null;
}

export function UserIntroductionForm({ initialData }: UserIntroductionFormProps) {
  const t = useTranslations('UserIntroduction');
  const [formData, setFormData] = useState<Partial<UserIntroduction>>(
    initialData || {
      coordinator_name: '',
      left_column_content: '',
      right_column_content: '',
      active: true,
    }
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Ensure required fields are present
    if (!formData.coordinator_name || !formData.left_column_content || !formData.right_column_content) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient<Database>();

      let response;

      // Create a properly typed object that matches the Database type
      const dataToSave: Database['public']['Tables']['user_introduction']['Insert'] = {
        coordinator_name: formData.coordinator_name,
        left_column_content: formData.left_column_content,
        right_column_content: formData.right_column_content,
        active: true
      };

      if (initialData?.id) {
        // Update existing record
        response = await supabase
          .from('user_introduction')
          .update(dataToSave)
          .eq('id', initialData.id);
      } else {
        // Create new record - insert expects an array of objects
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

  // We extract the onSubmit handler to fix the Promise issue
  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    void handleSubmit(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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

      <div className="space-y-4">
        <div>
          <label htmlFor="coordinator_name" className="block text-sm font-medium text-gray-700 mb-1">
            {t('coordinatorNameLabel', { fallback: 'General Coordinator Name' })}
          </label>
          <input
            type="text"
            id="coordinator_name"
            name="coordinator_name"
            value={formData.coordinator_name || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="left_column_content" className="block text-sm font-medium text-gray-700 mb-1">
            {t('leftColumnLabel', { fallback: 'Left Column Content' })}
          </label>
          <textarea
            id="left_column_content"
            name="left_column_content"
            value={formData.left_column_content || ''}
            onChange={handleChange}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            {t('textFormatInfo', { fallback: 'Use double line breaks to create paragraphs.' })}
          </p>
        </div>

        <div>
          <label htmlFor="right_column_content" className="block text-sm font-medium text-gray-700 mb-1">
            {t('rightColumnLabel', { fallback: 'Right Column Content' })}
          </label>
          <textarea
            id="right_column_content"
            name="right_column_content"
            value={formData.right_column_content || ''}
            onChange={handleChange}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? t('saving', { fallback: 'Saving...' }) : t('saveButton', { fallback: 'Save' })}
        </button>
      </div>
    </form>
  );
}