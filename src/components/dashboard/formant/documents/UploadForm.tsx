'use client';

import { useState, FormEvent } from 'react';
// Remove useRouter if no longer needed directly in component
// import { useRouter } from 'next/navigation';
// Remove supabase client and Database types
// import { createClient } from '@/lib/supabase/browser-client';
// import { Database } from '@/types/supabase';
import { DocumentCategory, DocumentPurpose } from '@/types/document';
// Remove useAuth if user info isn't directly needed here
// import { useAuth } from '@/contexts/AuthContext';
import { FileDropzone } from './FileDropzone';
import { UploadProgress } from './UploadProgress';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { DatalistField } from './DatalistField';
import { CheckboxField } from './CheckboxField';
import { MultiSelectButtons } from './MultiSelectButtons';
// Import the custom hook
import { useDocumentUpload } from '@/hooks/useDocumentUpload';

// Constants for Select Options/Buttons
const documentCategories: DocumentCategory[] = [
  'Articles', 'Source materials', 'Presentations', 'Formation Programs',
  'Miscellaneous', 'Videos', 'Reflections 4 Dimensions'
];
const documentPurposes: DocumentPurpose[] = [
  'General', 'Novitiate', 'Postulancy', 'Scholasticate', 'Ongoing Formation'
];
const commonRegions = ['Global', 'Africa', 'Asia', 'Europe', 'North America', 'South America'];
const commonLanguages = ['English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese'];

// Remove DocumentInsert type definition

export default function UploadForm() {
  // State remains for form fields
  // const { user } = useAuth(); // Hook handles auth internally
  // const router = useRouter(); // Hook handles routing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>('Articles');
  const [region, setRegion] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [purpose, setPurpose] = useState<DocumentPurpose[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);

  // Use the custom hook for upload logic
  const { uploadDocument, loading, error: uploadError, uploadProgress } = useDocumentUpload();

  // State for local form validation error
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileUpdate = (newFile: File | null) => {
    setFile(newFile);
    // Reset errors/progress related to the hook if file changes
    setFormError(null);
  };

  const handlePurposeChange = (purp: DocumentPurpose) => {
    setPurpose(prev =>
      prev.includes(purp) ? prev.filter(p => p !== purp) : [...prev, purp]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null); // Clear previous form errors
    if (!file || !category || !title) {
      setFormError('Title, Category, and File are required.');
      return;
    }

    // Call the hook's upload function
    void uploadDocument({
          title,
      description,
      file,
          category,
      region,
      language,
      topics,
      purpose,
      keywords,
      isPublic,
    });
  };

  // Remove the async IIFE and its logic

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md border border-gray-100">
      {/* Display both form validation errors and upload errors */}
      {(formError || uploadError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mb-4">
          {formError || uploadError}
        </div>
      )}

      {/* Form fields remain largely the same, but use 'loading' from the hook */}
      <FormField
        id="title"
        label="Title"
        value={title}
        onChange={setTitle}
        required
        disabled={loading} // Use loading state from hook
      />

      <FormField
        id="description"
        label="Description"
        value={description}
        onChange={setDescription}
        isTextArea
        disabled={loading} // Use loading state from hook
      />

      <FileDropzone file={file} onFileChange={handleFileUpdate} required />

      {/* Use uploadProgress from hook */}
      <UploadProgress progress={uploadProgress} />

      <SelectField
        id="category"
        label="Category"
        value={category}
        onChange={setCategory}
        options={documentCategories.map(cat => ({ value: cat, label: cat }))}
        required
        disabled={loading} // Use loading state from hook
      />

      <DatalistField
        id="region"
        label="Region"
        value={region}
        onChange={setRegion}
        suggestions={commonRegions}
        listId="common-regions"
        disabled={loading} // Use loading state from hook
      />

      <DatalistField
        id="language"
        label="Language"
        value={language}
        onChange={setLanguage}
        suggestions={commonLanguages}
        listId="common-languages"
        disabled={loading} // Use loading state from hook
      />

      <MultiSelectButtons
        label="Purpose"
        options={documentPurposes}
        selectedOptions={purpose}
        onChange={handlePurposeChange}
        disabled={loading} // Use loading state from hook
      />

      <FormField
        id="topics-input"
        label="Topics (comma-separated)"
        value={topics.join(', ')}
        onChange={(value) => setTopics(value.split(',').map(t => t.trim()).filter(t => t))}
        placeholder="e.g., Theology, Spirituality, History"
        disabled={loading} // Use loading state from hook
      />

      <FormField
        id="keywords-input"
        label="Keywords (comma-separated)"
        value={keywords.join(', ')}
        onChange={(value) => setKeywords(value.split(',').map(k => k.trim()).filter(k => k))}
        placeholder="e.g., Vocation, Formation, Prayer"
        disabled={loading} // Use loading state from hook
      />

      <CheckboxField
        id="isPublic"
        label="Make document public"
        checked={isPublic}
        onChange={setIsPublic}
        disabled={loading} // Use loading state from hook
      />

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading || !file} // Use loading state from hook
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition-colors ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? 'Uploading...' : 'Upload Document'} {/* Use loading state from hook */}
        </button>
      </div>
    </form>
  );
}