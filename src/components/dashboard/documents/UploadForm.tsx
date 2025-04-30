'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentCategory, DocumentPurpose } from '@/types/document';
import { Database } from '@/types/supabase';
import { Button } from '@/components/ui/Button';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

// Assuming zod is installed, add types later
// import { z } from 'zod';
// const UploadSchema = z.object({...});

export default function UploadForm() {
  const { user, supabase } = useAuth(); // Get Supabase client from context
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DocumentCategory | ''>( '');
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  // --- NEW STATE FOR ADDITIONAL FIELDS ---
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [purpose, setPurpose] = useState<DocumentPurpose[]>([]);
  const [keywordsInput, setKeywordsInput] = useState(''); // Input string for keywords
  // --- END NEW STATE ---

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- CONSTANTS FOR OPTIONS ---
  const categories: DocumentCategory[] = [
    'Articles', 'Source materials', 'Presentations', 'Formation Programs',
    'Miscellaneous', 'Videos', 'Reflections 4 Dimensions'
  ];
  const allRegions = [
    'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia', 'General' // Added General maybe?
  ];
  const allLanguages = [
    'English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese'
  ];
  const allTopics = [
    'Formation', 'Spirituality', 'Community Life', 'Mission', 'Vocation', 'Prayer', 'Scripture'
  ];
  const allPurposes: DocumentPurpose[] = [
    'General', 'Novitiate', 'Postulancy', 'Scholasticate', 'Ongoing Formation'
  ];
  // --- END CONSTANTS ---


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  // --- HANDLERS FOR MULTI-SELECT FIELDS ---
   const handleTopicChange = (topic: string) => {
    setTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handlePurposeChange = (purp: DocumentPurpose) => {
    setPurpose(prev =>
      prev.includes(purp) ? prev.filter(p => p !== purp) : [...prev, purp]
    );
  };
  // --- END HANDLERS ---

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!file || !title || !category || !user) {
      setError('Please fill in Title, Category, and select a file.');
      return;
    }
    if (file.size > 100 * 1024 * 1024) { // Example: Limit file size to 100MB
       setError('File size cannot exceed 100MB.');
       return;
    }


    setIsUploading(true);

    try {
      // 1. Upload file to Storage
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${user.id}-${Date.now()}.${fileExt}`;
      const sanitizedCategory = category.replace(/[^a-zA-Z0-9-_]/g, '_');
      const filePath = `${sanitizedCategory}/${uniqueFileName}`;

      console.log(`[UploadForm] Attempting to upload to Storage path: ${filePath}`);
      console.log("[UploadForm] --- Calling supabase.storage.from('documents').upload()... ---");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      console.log("[UploadForm] --- supabase.storage.from('documents').upload() FINISHED. ---");

      if (uploadError) {
        console.error("[UploadForm] Storage Upload Error DETECTED:", uploadError);
        throw new Error(`Storage Error: ${uploadError.message}`);
      }

      console.log("[UploadForm] Storage Upload successful, data:", uploadData);

      // --- Store the FILE PATH ---
      const storagePath = uploadData?.path;
      if (!storagePath) {
        console.error("[UploadForm] Upload succeeded but no path returned from storage.");
        throw new Error("Upload failed: Storage did not return a file path.");
      }
      console.log(`[UploadForm] Storage path obtained: ${storagePath}`);
      // --- End path handling ---

      // 2. Insert metadata into the database
      const keywordsArray = keywordsInput.split(',')
                                        .map(k => k.trim())
                                        .filter(k => k.length > 0);

      const documentData: Database['public']['Tables']['documents']['Insert'] = {
        title,
        description: description || null,
        category,
        content_url: storagePath,
        file_type: fileExt?.toLowerCase() || null,
        file_size: file.size,
        author_id: user.id,
        author_name: user.user_metadata?.name || user.email,
        is_public: isPublic,
        region: region || null,
        language: language || null,
        topics: topics.length > 0 ? topics : null,
        purpose: purpose.length > 0 ? purpose : null,
        keywords: keywordsArray.length > 0 ? keywordsArray : null,
      };

      console.log("[UploadForm] Attempting to insert into DB:", documentData);
      console.log("[UploadForm] --- Calling supabase.from('documents').insert()... ---");
      const { error: insertError } = await supabase
        .from('documents')
        .insert(documentData);
      console.log("[UploadForm] --- supabase.from('documents').insert() FINISHED. ---");

      if (insertError) {
        console.error("[UploadForm] Database Insert Error DETECTED:", insertError);
        // Attempt to clean up storage if DB insert fails
        console.log(`[UploadForm] DB insert failed. Attempting storage cleanup for: ${filePath}`);
        await supabase.storage.from('documents').remove([filePath]);
        console.log(`[UploadForm] Storage cleanup attempt finished for: ${filePath}`);
        throw new Error(`Database Error: ${insertError.message}`);
      }

      console.log("[UploadForm] Database insert successful");

      // Invalidate cache or redirect
      console.log("[UploadForm] Upload complete. Redirecting...");
      router.push('/dashboard');
      router.refresh();

    } catch (err: any) {
      console.error("[UploadForm] CAUGHT error in handleSubmit:", err);
      setError(err.message || 'An unexpected error occurred during upload.');
    } finally {
      console.log("[UploadForm] handleSubmit finally block reached. Setting isUploading=false");
      setIsUploading(false);
    }
  };

  // --- FORM JSX ---
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
      {error && (
        <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-400 rounded-md text-red-700">
          <p className="font-medium">Upload Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text" id="title" value={title} required
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-gray-900 placeholder:text-gray-500"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
          Description
        </label>
        <textarea
          id="description" rows={4} value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-gray-900 placeholder:text-gray-500"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category" value={category} required
          onChange={(e) => setCategory(e.target.value as DocumentCategory)}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-gray-900"
        >
          <option value="" disabled className="text-gray-500">Select a category...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className="text-gray-900">{cat}</option>
          ))}
        </select>
      </div>

      {/* --- NEW FORM FIELDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Region */}
         <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-900 mb-1">Region</label>
            <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-gray-900">
                <option value="" className="text-gray-500">Select Region (Optional)</option>
                {allRegions.map(r => <option key={r} value={r} className="text-gray-900">{r}</option>)}
            </select>
         </div>

         {/* Language */}
         <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-900 mb-1">Language</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}
                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-gray-900">
                <option value="" className="text-gray-500">Select Language (Optional)</option>
                {allLanguages.map(l => <option key={l} value={l} className="text-gray-900">{l}</option>)}
            </select>
         </div>
      </div>

      {/* Topics */}
      <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Topics (Optional)</label>
          <div className="flex flex-wrap gap-2">
              {allTopics.map((topic) => (
                  <button type="button" key={topic} onClick={() => handleTopicChange(topic)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              topics.includes(topic)
                                  ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/30'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                          }`}>
                      {topic}
                  </button>
              ))}
          </div>
      </div>

      {/* Purpose */}
       <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Purpose (Optional)</label>
          <div className="flex flex-wrap gap-2">
              {allPurposes.map((purp) => (
                  <button type="button" key={purp} onClick={() => handlePurposeChange(purp)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              purpose.includes(purp)
                                  ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/30'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                          }`}>
                      {purp}
                  </button>
              ))}
          </div>
      </div>

       {/* Keywords */}
       <div>
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-900 mb-1">
          Keywords (Optional, comma-separated)
        </label>
        <input
          type="text" id="keywords" value={keywordsInput}
          onChange={(e) => setKeywordsInput(e.target.value)}
          placeholder="e.g. prayer, community, vatican ii"
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-gray-900 placeholder:text-gray-500"
        />
      </div>
      {/* --- END NEW FORM FIELDS --- */}

      {/* File Input */}
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-900 mb-1">
          Document File <span className="text-red-500">*</span>
        </label>
        <input
          type="file" id="file" required onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-primary/10 file:text-accent-primary hover:file:bg-accent-primary/20 cursor-pointer"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,image/*,video/*" // Example accepted types
        />
        {file && <p className="mt-2 text-xs text-gray-500">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
      </div>

      {/* Public Toggle */}
       <div className="flex items-center pt-2">
        <input
          id="isPublic" name="isPublic" type="checkbox" checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 text-accent-primary border-gray-300 rounded focus:ring-accent-primary"
        />
        <label htmlFor="isPublic" className="ml-3 block text-sm font-medium text-gray-900">
          Make this document publicly accessible?
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-center pt-6 border-t border-gray-200 gap-3">
         {isUploading && <ArrowPathIcon className="h-5 w-5 text-gray-500 animate-spin" />}
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isUploading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isUploading} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </form>
  );
}