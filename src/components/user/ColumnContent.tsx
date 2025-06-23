import Image from 'next/image';
import { useState } from 'react';
import Lightbox from '@/components/ui/Lightbox';

interface ColumnContentProps {
  content: string;
  galleryUrls?: string[];
  galleryTitles?: string[];
}

export function ColumnContent({
  content,
  galleryUrls = [],
  galleryTitles = []
}: ColumnContentProps) {
  const [galleryLightboxOpen, setGalleryLightboxOpen] = useState(false);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);

  const textElement = (
    <div className="flex-1 flex items-start justify-center py-6">
      <div className="space-y-6 max-w-lg">
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-slate-700 text-lg leading-relaxed font-light text-center">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );

  // Gallery element
  const galleryElement = galleryUrls.length > 0 ? (
    <div className="py-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryUrls.map((url, index) => (
          <button
            key={index}
            type="button"
            className="relative aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => {
              setSelectedGalleryIndex(index);
              setGalleryLightboxOpen(true);
            }}
          >
            <Image
              src={url}
              alt={galleryTitles[index] || `Gallery image ${index + 1}`}
              fill
              className="object-cover"
            />
            {/* Click indicator */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/20">
              <div className="bg-white/90 rounded-full p-1">
                <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </button>
        ))}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="h-full flex flex-col">
        {textElement}
        {galleryElement}
      </div>

      {/* Lightbox for gallery viewing */}
      {galleryUrls.length > 0 && (
        <Lightbox
          isOpen={galleryLightboxOpen}
          onClose={() => setGalleryLightboxOpen(false)}
          images={galleryUrls}
          initialIndex={selectedGalleryIndex}
          title="Gallery"
        />
      )}
    </>
  );
}