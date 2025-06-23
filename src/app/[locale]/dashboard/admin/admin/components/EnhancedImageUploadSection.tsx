'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryManager } from '@/components/ui/GalleryManager';
import Lightbox from '@/components/ui/Lightbox';

interface EnhancedImageUploadSectionProps {
  // Gallery props
  galleryUrls: string[];
  galleryTitles: string[];
  onGalleryUpdate: (urls: string[], titles: string[]) => void;

  columnName: string;
  columnType: 'left' | 'right';
}

export function EnhancedImageUploadSection({
  galleryUrls,
  galleryTitles,
  onGalleryUpdate,
  columnName,
  columnType
}: EnhancedImageUploadSectionProps) {
  const [showGalleryManager, setShowGalleryManager] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleGalleryImageClick = (index: number) => {
    setLightboxImages(galleryUrls);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const hasGallery = galleryUrls.length > 0;

  return (
    <>
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">{columnName} Column Gallery</h4>
          <button
            type="button"
            onClick={() => setShowGalleryManager(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition text-sm font-medium"
          >
            {hasGallery ? 'Manage Gallery' : 'Add Images'}
          </button>
        </div>

        {/* Gallery Preview */}
        {hasGallery ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {galleryUrls.length} image{galleryUrls.length !== 1 ? 's' : ''} in gallery
              </span>
              <span className="text-xs text-gray-500">Click images to view in lightbox</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {galleryUrls.map((url, index) => (
                <button
                  key={`gallery-${index}`}
                  type="button"
                  className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition aspect-square"
                  onClick={() => handleGalleryImageClick(index)}
                >
                  <Image
                    src={url}
                    alt={galleryTitles[index] || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>

                  {/* Image title */}
                  {galleryTitles[index] && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      {galleryTitles[index]}
                    </div>
                  )}

                  {/* Image number indicator */}
                  <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="space-y-3">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No images in gallery</h3>
                <p className="text-gray-500 mt-1">
                  Click "Add Images" to upload and organize images for this column
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="text-sm font-medium text-blue-900 mb-2">Gallery Features:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Upload multiple images at once</li>
            <li>• Drag and drop to reorder images</li>
            <li>• Add titles/captions to images</li>
            <li>• Click any image to view in full size</li>
            <li>• Images display in a responsive grid for users</li>
          </ul>
        </div>
      </div>

      {/* Gallery Manager Modal */}
      <GalleryManager
        isOpen={showGalleryManager}
        onClose={() => setShowGalleryManager(false)}
        columnType={columnType}
        currentGalleryUrls={galleryUrls}
        currentGalleryTitles={galleryTitles}
        onGalleryUpdate={onGalleryUpdate}
      />

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={lightboxImages}
        initialIndex={lightboxIndex}
      />
    </>
  );
}