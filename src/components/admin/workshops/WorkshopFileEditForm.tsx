'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { FileEditFormFields } from './FileEditFormFields';
import { CheckIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

type WorkshopFile = Database['public']['Tables']['workshop_files']['Row'];

interface WorkshopFileEditFormProps {
  file: WorkshopFile;
  onSave: (updatedFile: WorkshopFile) => void;
  onCancel: () => void;
}

export default function WorkshopFileEditForm({ file, onSave, onCancel }: WorkshopFileEditFormProps) {
  const [title, setTitle] = useState(file.title);
  const [description, setDescription] = useState(file.description || '');
  const [region, setRegion] = useState(file.region || '');
  const [language, setLanguage] = useState(file.language || '');
  const [author, setAuthor] = useState(file.author || '');
  const [topics, setTopics] = useState<string[]>(file.topics || []);
  const [keywords, setKeywords] = useState<string[]>(file.keywords || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract metadata from file path if not already in database
  useEffect(() => {
    // Only parse from filename if metadata is not already stored in database
    if (!file.region && !file.language && !file.author && file.file_path) {
      // Parse metadata from file path structure: folder/title_region_language_author_timestamp.ext
      const fileName = file.file_path.split('/').pop() || '';
      const parts = fileName.split('_');

      if (parts.length >= 4) {
        // Extract metadata from filename structure
        const regionPart = parts[1] || '';
        const languagePart = parts[2] || '';
        const authorPart = parts[3] || '';

        setRegion(regionPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        setLanguage(languagePart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        setAuthor(authorPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
      }
    }
  }, [file.file_path, file.region, file.language, file.author]);

  const handleKeywordsChange = (value: string) => {
    const keywordArray = value.split(',').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
    setKeywords(keywordArray);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient<Database>();

      // Update the workshop file record
      const { data: updatedFile, error: updateError } = await supabase
        .from('workshop_files')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          region: region.trim() || null,
          language: language.trim() || null,
          author: author.trim() || null,
          topics: topics.length > 0 ? topics : null,
          keywords: keywords.length > 0 ? keywords : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', file.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      if (!updatedFile) {
        throw new Error('Failed to update file');
      }

      toast.success('File updated successfully!');
      onSave(updatedFile);
    } catch (err) {
      console.error('Error saving file:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save file';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileTypeDisplay = (fileType: string | null): string => {
    if (!fileType) return 'Unknown';
    return fileType.toUpperCase();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Edit File</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
              {getFileTypeDisplay(file.file_type)}
            </span>
            <span>{formatFileSize(file.file_size)}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <FileEditFormFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        region={region}
        setRegion={setRegion}
        language={language}
        setLanguage={setLanguage}
        author={author}
        setAuthor={setAuthor}
        topics={topics}
        setTopics={setTopics}
        keywords={keywords}
        handleKeywordsChange={handleKeywordsChange}
        saving={saving}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={() => void handleSave()}
          disabled={saving || !title.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckIcon className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}