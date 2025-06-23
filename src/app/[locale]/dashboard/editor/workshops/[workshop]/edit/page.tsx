'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { FormField } from '@/components/admin/documents/FormField';

import { WorkshopEditHeader } from '@/components/shared/workshops/WorkshopEditHeader';
import { WorkshopEditLoadingState } from '@/components/shared/workshops/WorkshopEditLoadingState';
import { WorkshopFilesSection } from '@/components/shared/workshops/WorkshopFilesSection';

interface Workshop {
  id: string;
  title: string;
  description: string | null;
  folder_path: string | null;
  created_at: string;
  updated_at: string | null;
}

export default function EditWorkshopPage() {
  const params = useParams();
  const router = useRouter();
  const workshopId = params?.workshop?.toString() || '';
  const _t = useTranslations('AdminWorkshopsPage');
  const { user } = useAuth();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showAddFileForm, setShowAddFileForm] = useState(false);

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (!workshopId || !user) return;

      setLoading(true);
      setError(null);

      try {
        const supabase = createClient<Database>();
        const { data, error: fetchError } = await supabase
          .from('workshops')
          .select('*')
          .eq('id', workshopId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error('Workshop not found');
        }

        setWorkshop(data);
        setTitle(data.title);
        setDescription(data.description || '');
      } catch (err) {
        console.error('Error fetching workshop:', err);
        setError(err instanceof Error ? err.message : 'Failed to load workshop');
      } finally {
        setLoading(false);
      }
    };

    void fetchWorkshop();
  }, [workshopId, user]);

  const handleBack = () => {
    router.push('/dashboard/editor/workshops');
  };

  const handleSave = async () => {
    if (!title.trim() || !workshop) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient<Database>();

      // If title changed, we need to handle folder renaming
      const titleChanged = title.trim() !== workshop.title;
      let newFolderPath = workshop.folder_path;

      if (titleChanged) {
        // Generate new folder path
        newFolderPath = title
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_-]/g, '');
      }

      const { error: updateError } = await supabase
        .from('workshops')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          folder_path: newFolderPath,
          updated_at: new Date().toISOString(),
        })
        .eq('id', workshopId);

      if (updateError) {
        throw updateError;
      }

      // TODO: If title changed, move files in storage bucket
      if (titleChanged) {
        console.log('TODO: Move files from', workshop.folder_path, 'to', newFolderPath);
      }

      // Navigate back to workshop view
      router.push(`/dashboard/editor/workshops/${workshopId}`);
    } catch (err) {
      console.error('Error saving workshop:', err);
      setError(err instanceof Error ? err.message : 'Failed to save workshop');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <WorkshopEditLoadingState onBack={handleBack} />;
  }

  if (error && !workshop) {
    return <WorkshopEditLoadingState onBack={handleBack} error={error} />;
  }

  return (
    <div className="space-y-6">
      <WorkshopEditHeader
        onBack={handleBack}
        title="Edit Workshop"
        error={error}
      />

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <FormField
            id="title"
            label="Workshop Title"
            value={title}
            onChange={setTitle}
            required
            disabled={saving}
            placeholder="Enter workshop title..."
          />

          <FormField
            id="description"
            label="Description"
            value={description}
            onChange={setDescription}
            isTextArea
            disabled={saving}
            placeholder="Enter workshop description..."
          />

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={() => void handleSave()}
              disabled={saving || !title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              onClick={handleBack}
              disabled={saving}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <WorkshopFilesSection
        showAddFileForm={showAddFileForm}
        setShowAddFileForm={setShowAddFileForm}
        workshop={workshop}
        workshopId={workshopId}
      />
    </div>
  );
}