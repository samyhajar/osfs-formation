'use client';

import { FormField } from '@/components/admin/documents/FormField';
import { SelectField } from '@/components/admin/documents/SelectField';
import { DatalistField } from '@/components/admin/documents/DatalistField';
import { CheckboxField } from '@/components/admin/documents/CheckboxField';
import { MultiSelectButtons } from '@/components/admin/documents/MultiSelectButtons';
import { FileDropzone } from '@/components/admin/documents/FileDropzone';
import { UploadProgress } from '@/components/admin/documents/UploadProgress';
import { DocumentCategory, DocumentPurpose } from '@/types/document';
import { useTranslations } from 'next-intl';

// Common data arrays
export const documentCategories: DocumentCategory[] = [
  'Articles', 'Source materials', 'Presentations', 'Formation Programs',
  'Miscellaneous', 'Videos', 'Reflections 4 Dimensions'
];

export const documentPurposes: DocumentPurpose[] = [
  'General', 'Novitiate', 'Postulancy', 'Scholasticate', 'Ongoing Formation'
];

export const commonRegions = [
  'Global', 'Africa', 'Asia', 'Europe', 'North America', 'South America'
];

export const commonLanguages = [
  'English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese'
];

export interface SyllabusFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  file: File | null;
  handleFileUpdate: (file: File | null) => void;
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
  uploading: boolean;
  progress: number;
  t: ReturnType<typeof useTranslations>;
  isEditMode?: boolean;
  replaceFileLabel?: string;
  replaceFileHelper?: string;
}

export function SyllabusFormFields({
  title, setTitle,
  description, setDescription,
  file, handleFileUpdate,
  category, setCategory,
  region, setRegion,
  language, setLanguage,
  topics, setTopics,
  purpose, handlePurposeChange,
  keywords, setKeywords,
  isPublic, setIsPublic,
  uploading, progress,
  t,
  isEditMode = false,
  replaceFileLabel: _replaceFileLabel,
  replaceFileHelper: _replaceFileHelper
}: SyllabusFormFieldsProps) {
  return (
    <>
      <FormField
        id="title"
        label={t('fieldTitleLabel', { default: 'Title' })}
        value={title}
        onChange={setTitle}
        required
        disabled={uploading}
      />

      <FormField
        id="description"
        label={t('fieldDescriptionLabel', { default: 'Description' })}
        value={description}
        onChange={setDescription}
        isTextArea
        disabled={uploading}
      />

      <FileDropzone
        file={file}
        onFileChange={handleFileUpdate}
        required={!isEditMode}
      />

      {uploading && progress < 100 && <UploadProgress progress={progress} />}

      {progress === 100 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
          {t('uploadSuccess', { default: 'Upload successful!' })}
        </div>
      )}

      <SelectField
        id="category"
        label={t('fieldCategoryLabel', { default: 'Category' })}
        value={category}
        onChange={(value) => setCategory(value)}
        options={documentCategories.map(cat => ({ value: cat, label: t(`categories.${cat}`, { default: cat }) }))}
        required
        disabled={uploading}
      />

      <DatalistField
        id="region"
        label={t('fieldRegionLabel', { default: 'Region' })}
        value={region}
        onChange={setRegion}
        suggestions={commonRegions}
        listId="common-regions"
        disabled={uploading}
      />

      <DatalistField
        id="language"
        label={t('fieldLanguageLabel', { default: 'Language' })}
        value={language}
        onChange={setLanguage}
        suggestions={commonLanguages}
        listId="common-languages"
        disabled={uploading}
      />

      <MultiSelectButtons
        label={t('fieldPurposeLabel', { default: 'Purpose' })}
        options={documentPurposes}
        selectedOptions={purpose}
        onChange={handlePurposeChange}
        disabled={uploading}
      />

      <FormField
        id="topics-input"
        label={t('fieldTopicsLabel', { default: 'Topics (comma-separated)' })}
        value={topics.join(', ')}
        onChange={(value) => setTopics(value.split(',').map(t => t.trim()).filter(Boolean))}
        placeholder={t('fieldTopicsPlaceholder', { default: 'e.g., Theology, Spirituality, History' })}
        disabled={uploading}
      />

      <FormField
        id="keywords-input"
        label={t('fieldKeywordsLabel', { default: 'Keywords (comma-separated)' })}
        value={keywords.join(', ')}
        onChange={(value) => setKeywords(value.split(',').map(k => k.trim()).filter(Boolean))}
        placeholder={t('fieldKeywordsPlaceholder', { default: 'e.g., Vocation, Formation, Prayer' })}
        disabled={uploading}
      />

      <CheckboxField
        id="isPublic"
        label={t('fieldIsPublicLabel', { default: 'Make document public' })}
        checked={isPublic}
        onChange={setIsPublic}
        disabled={uploading}
      />
    </>
  );
}