'use client';

import React from 'react';
import { FolderComponent } from '@/components/shared/FolderComponent';
import { DocumentCategory } from '@/types/document';
import { useAuth } from '@/contexts/AuthContext';
// Add the UserIntroductionHook and Modal imports
import { useUserIntroduction } from '@/components/user/UserIntroductionHook';
import UserIntroductionModal from '@/components/user/UserIntroductionModal';

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

export default function DashboardPage() {
  const { loading: authLoading } = useAuth();

  // Add the user introduction modal hook
  const { introContent, introModalOpen, handleCloseIntroModal, loading: _introLoading } = useUserIntroduction(authLoading);

  // Determine the base path for links - specific to this user page
  const basePath = '/dashboard/user/folders';

  return (
    <div className="space-y-6">
      {/* Add the user introduction modal */}
      {introContent && (
        <UserIntroductionModal
          isOpen={introModalOpen}
          onClose={handleCloseIntroModal}
          introContent={introContent}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-black">Folders</h1>
           <p className="text-gray-500 mt-1">Browse documents by category.</p>
        </div>
      </div>

      {/* Folder Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <FolderComponent
              key={category}
              basePath={basePath}
              categoryName={category}
              categoryTranslationNamespace="DocumentFilters.categories"
            />
          ))}
        </div>
      </div>
    </div>
  );
}