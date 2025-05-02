'use client';

import React from 'react';
import { FolderComponent } from '@/components/shared/FolderComponent';
import { DocumentCategory } from '@/types/document';

// TODO: Import Header component
// TODO: Import DocumentGrid or DocumentCard component
// TODO: Fetch documents based on selected category

// Define the categories (same as used in filters/upload)
const categories: DocumentCategory[] = [
    'Articles',
    'Source materials',
    'Presentations',
    'Formation Programs',
    'Miscellaneous',
    'Videos',
    'Reflections 4 Dimensions'
];

export default function FoldersPage() {
  // Determine the base path for links - specific to this formant page
  const basePath = '/dashboard/formant';

  return (
    <div className="flex flex-col h-full">
      {/* TODO: Add Header component */}
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Folders</h1>

        {/* Folder Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((category) => (
              <FolderComponent
                key={category}
                basePath={basePath} // Pass the base path
                categoryName={category}
                categoryTranslationNamespace="documents.categories" // Add the missing prop
              />
            ))}
          </div>
        </div>

        {/* Document grid section removed as navigation handles this */}

      </main>
    </div>
  );
}