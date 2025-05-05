'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

interface FormeeIntroduction {
  id: string;
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface FormeeIntroductionFormProps {
  initialData: FormeeIntroduction | null;
}

export function FormeeIntroductionForm({ initialData }: FormeeIntroductionFormProps) {
  const t = useTranslations('FormeeIntroduction');
  const [formData, setFormData] = useState<Partial<FormeeIntroduction>>(
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

    try {
      const supabase = createClient<Database>();

      // The TypeScript error occurs because formee_introduction is not in the Database type yet
      // We'll use proper type casting
      let response;

      if (initialData?.id) {
        // Update existing record
        response = await supabase
          .from('formee_introduction' as keyof Database['public']['Tables'])
          .update({
            coordinator_name: formData.coordinator_name,
            left_column_content: formData.left_column_content,
            right_column_content: formData.right_column_content,
            active: true, // Ensure it's active
          })
          .eq('id', initialData.id);
      } else {
        // Create new record
        response = await supabase
          .from('formee_introduction' as keyof Database['public']['Tables'])
          .insert({
            coordinator_name: formData.coordinator_name,
            left_column_content: formData.left_column_content,
            right_column_content: formData.right_column_content,
            active: true,
          });
      }

      if (response.error) {
        throw new Error(response.error.message);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving formee introduction:', err);
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
          <p className="mt-1 text-xs text-gray-500">
            {t('textFormatInfo', { fallback: 'Use double line breaks to create paragraphs.' })}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`
            inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            ${loading ? 'bg-accent-primary/70' : 'bg-accent-primary hover:bg-accent-primary/90'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary
          `}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {t('savingButton', { fallback: 'Saving...' })}
            </>
          ) : (
            t('saveButton', { fallback: 'Save Changes' })
          )}
        </button>
      </div>
    </form>
  );
}