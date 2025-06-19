'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { ImageUploadSection } from './ImageUploadSection';
import { useFormHandlers } from './UserIntroductionFormHandlers';

interface UserIntroduction {
  id: string;
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  left_column_image_url?: string;
  left_column_image_position?: 'above' | 'below';
  right_column_image_url?: string;
  right_column_image_position?: 'above' | 'below';
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserIntroductionFormData {
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  left_column_image_url?: string;
  left_column_image_position?: 'above' | 'below';
  right_column_image_url?: string;
  right_column_image_position?: 'above' | 'below';
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
    left_column_image_url: initialData?.left_column_image_url || '',
    left_column_image_position: initialData?.left_column_image_position || 'above',
    right_column_image_url: initialData?.right_column_image_url || '',
    right_column_image_position: initialData?.right_column_image_position || 'above',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingLeft, setUploadingLeft] = useState(false);
  const [uploadingRight, setUploadingRight] = useState(false);

  const { handleImageUpload, handleImageDelete } = useFormHandlers(
    formData, setFormData, setError, setUploadingLeft, setUploadingRight
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const dataToSave: Database['public']['Tables']['user_introduction']['Insert'] = {
        coordinator_name: formData.coordinator_name,
        left_column_content: formData.left_column_content,
        right_column_content: formData.right_column_content,
        left_column_image_url: formData.left_column_image_url || null,
        left_column_image_position: formData.left_column_image_position || 'above',
        right_column_image_url: formData.right_column_image_url || null,
        right_column_image_position: formData.right_column_image_position || 'above',
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

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
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

        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Left Column</h3>
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
          </div>

          <ImageUploadSection
            imageUrl={formData.left_column_image_url}
            uploading={uploadingLeft}
            onUpload={(file) => void handleImageUpload(file, 'left')}
            onDelete={() => void handleImageDelete('left')}
            position={formData.left_column_image_position || 'above'}
            onPositionChange={(value) => setFormData(prev => ({ ...prev, left_column_image_position: value as 'above' | 'below' }))}
            columnName="Left"
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Right Column</h3>
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

          <ImageUploadSection
            imageUrl={formData.right_column_image_url}
            uploading={uploadingRight}
            onUpload={(file) => void handleImageUpload(file, 'right')}
            onDelete={() => void handleImageDelete('right')}
            position={formData.right_column_image_position || 'above'}
            onPositionChange={(value) => setFormData(prev => ({ ...prev, right_column_image_position: value as 'above' | 'below' }))}
            columnName="Right"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md font-medium transition"
          >
            {loading ? 'Saving...' : t('saveButton', { fallback: 'Save Changes' })}
          </button>
        </div>
      </div>
    </form>
  );
}