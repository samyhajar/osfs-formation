'use client';

import React from 'react';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { DatalistField } from './DatalistField';
import { CheckboxField } from './CheckboxField';
import { MultiSelectButtons } from './MultiSelectButtons';
import { FileDropzone } from './FileDropzone';
import { DocumentCategory, DocumentPurpose } from '@/types/document';

interface DocumentFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  file: File | null;
  handleFileChange: (file: File | null) => void;
  category: DocumentCategory;
  setCategory: (category: DocumentCategory) => void;
  region: string;
  setRegion: (region: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  topics: string[];
  setTopics: (topics: string[]) => void;
  purpose: DocumentPurpose[];
  handlePurposeChange: (purpose: DocumentPurpose) => void;
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  disabled: boolean;
  t: ReturnType<typeof import('next-intl').useTranslations>;
  documentCategories: DocumentCategory[];
  documentPurposes: DocumentPurpose[];
  regions: string[];
  languages: string[];
  showCurrentFile?: boolean;
  currentDocument?: {
    title: string;
    file_type?: string | null;
    file_size?: number | null;
  };
}

export function DocumentFormFields({
  title, setTitle,
  description, setDescription,
  file, handleFileChange,
  category, setCategory,
  region, setRegion,
  language, setLanguage,
  topics, setTopics,
  purpose, handlePurposeChange,
  keywords, setKeywords,
  isPublic, setIsPublic,
  disabled,
  t,
  documentCategories,
  documentPurposes,
  regions,
  languages,
  showCurrentFile = false,
  currentDocument
}: DocumentFormFieldsProps) {
  return (
    <>
      <FormField
        id="title"
        label={t('titleLabel', { fallback: 'Document Title' })}
        value={title}
        onChange={setTitle}
        placeholder={t('titlePlaceholder', { fallback: 'Enter document title' })}
        required
        disabled={disabled}
      />

      <FormField
        id="description"
        label={t('descriptionLabel', { fallback: 'Description' })}
        value={description}
        onChange={setDescription}
        placeholder={t('descriptionPlaceholder', { fallback: 'Brief description of the document' })}
        disabled={disabled}
        isTextArea
      />

      {showCurrentFile && currentDocument && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {t('currentFileLabel', { fallback: 'Current File' })}
          </h3>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xs font-medium text-blue-700">
                {currentDocument.file_type ? currentDocument.file_type.substring(0, 3).toUpperCase() : 'DOC'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{currentDocument.title}</p>
              <p className="text-xs text-gray-500">
                {currentDocument.file_type} • {currentDocument.file_size ? `${Math.round(currentDocument.file_size / 1024)} KB` : 'Unknown size'}
              </p>
            </div>
          </div>
        </div>
      )}

      <FileDropzone
        file={file}
        onFileChange={handleFileChange}
        required={!showCurrentFile}
      />

      <SelectField
        id="category"
        label={t('categoryLabel', { fallback: 'Category' })}
        value={category}
        onChange={(value) => setCategory(value)}
        options={documentCategories.map(cat => ({ value: cat, label: cat }))}
        disabled={disabled}
        required
      />

      <DatalistField
        id="region"
        label={t('regionLabel', { fallback: 'Region' })}
        value={region}
        onChange={setRegion}
        suggestions={regions}
        listId="region-list"
        placeholder={t('regionPlaceholder', { fallback: 'Select or enter region' })}
        disabled={disabled}
      />

      <DatalistField
        id="language"
        label={t('languageLabel', { fallback: 'Language' })}
        value={language}
        onChange={setLanguage}
        suggestions={languages}
        listId="language-list"
        placeholder={t('languagePlaceholder', { fallback: 'Select or enter language' })}
        disabled={disabled}
      />

      <MultiSelectButtons
        label={t('purposeLabel', { fallback: 'Purpose' })}
        options={documentPurposes}
        selectedOptions={purpose}
        onChange={handlePurposeChange}
        disabled={disabled}
      />

      <FormField
        id="topics"
        label={t('topicsLabel', { fallback: 'Topics (comma-separated)' })}
        value={topics.join(', ')}
        onChange={(value) => setTopics(value.split(',').map(t => t.trim()).filter(t => t))}
        placeholder={t('topicsPlaceholder', { fallback: 'e.g., Theology, Spirituality, History' })}
        disabled={disabled}
      />

      <FormField
        id="keywords"
        label={t('keywordsLabel', { fallback: 'Keywords (comma-separated)' })}
        value={keywords.join(', ')}
        onChange={(value) => setKeywords(value.split(',').map(k => k.trim()).filter(k => k))}
        placeholder={t('keywordsPlaceholder', { fallback: 'e.g., Vocation, Formation, Prayer' })}
        disabled={disabled}
      />

      <CheckboxField
        id="isPublic"
        label={t('publicLabel', { fallback: 'Make document public' })}
        checked={isPublic}
        onChange={setIsPublic}
        disabled={disabled}
      />
    </>
  );
}