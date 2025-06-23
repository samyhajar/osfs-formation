'use client';

import { FormField } from '@/components/admin/documents/FormField';
import { DatalistField } from '@/components/admin/documents/DatalistField';
import { LanguageFlag } from '@/components/admin/syllabus/LanguageFlag';
import { EditTopicsSelector } from './EditTopicsSelector';
import { commonRegions, commonLanguages } from './constants';

interface FileEditFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  region: string;
  setRegion: (region: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  author: string;
  setAuthor: (author: string) => void;
  topics: string[];
  setTopics: (topics: string[]) => void;
  keywords: string[];
  handleKeywordsChange: (value: string) => void;
  saving: boolean;
}

export function FileEditFormFields({
  title,
  setTitle,
  description,
  setDescription,
  region,
  setRegion,
  language,
  setLanguage,
  author,
  setAuthor,
  topics,
  setTopics,
  keywords,
  handleKeywordsChange,
  saving
}: FileEditFormFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        id="title"
        label="File Title"
        value={title}
        onChange={setTitle}
        required
        disabled={saving}
        placeholder="Enter file title..."
      />

      <FormField
        id="description"
        label="Description"
        value={description}
        onChange={setDescription}
        isTextArea
        disabled={saving}
        placeholder="Enter file description..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <DatalistField
            id="region"
            label="Region"
            value={region}
            onChange={setRegion}
            suggestions={commonRegions}
            listId="file-regions"
            disabled={saving}
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <DatalistField
                id="language"
                label="Language"
                value={language}
                onChange={setLanguage}
                suggestions={commonLanguages}
                listId="file-languages"
                disabled={saving}
              />
            </div>
            {language && (
              <div className="mt-6 flex items-center">
                <LanguageFlag languageName={language} />
              </div>
            )}
          </div>
        </div>
      </div>

      <FormField
        id="author"
        label="Author"
        value={author}
        onChange={setAuthor}
        disabled={saving}
        placeholder="Enter author name..."
      />

      <div className="space-y-4">
        <EditTopicsSelector
          topics={topics}
          onChange={setTopics}
          disabled={saving}
        />

        <FormField
          id="keywords"
          label="Keywords (comma-separated)"
          value={keywords.join(', ')}
          onChange={handleKeywordsChange}
          disabled={saving}
          placeholder="e.g., prayer, meditation, guidance"
        />
      </div>
    </div>
  );
}