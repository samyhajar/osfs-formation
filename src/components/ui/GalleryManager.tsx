'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

interface GalleryImage {
  url: string;
  title?: string;
  id: string;
}

interface GalleryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  columnType: 'left' | 'right';
  currentGalleryUrls: string[];
  currentGalleryTitles: string[];
  onGalleryUpdate: (urls: string[], titles: string[]) => void;
}

export function GalleryManager({
  isOpen,
  onClose,
  columnType,
  currentGalleryUrls,
  currentGalleryTitles,
  onGalleryUpdate
}: GalleryManagerProps) {
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize selected images from current gallery
  useEffect(() => {
    if (isOpen) {
      const selected = currentGalleryUrls.map((url, index) => ({
        url,
        title: currentGalleryTitles[index] || '',
        id: `selected-${index}`
      }));
      setSelectedImages(selected);
      void loadAllImages();
    }
  }, [isOpen, currentGalleryUrls, currentGalleryTitles]);

  const loadAllImages = async () => {
    setLoading(true);
    try {
      const supabase = createClient<Database>();

      // Get all images from the images bucket
      const { data: files, error } = await supabase.storage
        .from('images')
        .list('user-introduction', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      const images: GalleryImage[] = [];
      for (const file of files || []) {
        // Create signed URL for private bucket
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('images')
          .createSignedUrl(`user-introduction/${file.name}`, 31536000); // 1 year expiry

        if (signedUrlError) {
          console.error('Error creating signed URL:', signedUrlError);
          continue;
        }

        images.push({
          url: signedUrlData.signedUrl,
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          id: file.name
        });
      }

      setAllImages(images);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    setUploading(true);
    try {
      const supabase = createClient<Database>();
      const newImages: GalleryImage[] = [];

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `user-introduction/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Create signed URL for the uploaded image
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from('images')
          .createSignedUrl(filePath, 31536000); // 1 year expiry

        if (signedUrlError) throw signedUrlError;

        newImages.push({
          url: signedUrlData.signedUrl,
          title: file.name.replace(/\.[^/.]+$/, ''),
          id: fileName
        });
      }

      setAllImages(prev => [...newImages, ...prev]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (image: GalleryImage) => {
    const isSelected = selectedImages.some(img => img.url === image.url);

    if (isSelected) {
      setSelectedImages(prev => prev.filter(img => img.url !== image.url));
    } else {
      setSelectedImages(prev => [...prev, image]);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null) return;

    const newImages = [...selectedImages];
    const draggedImage = newImages[draggedIndex];

    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    setSelectedImages(newImages);
    setDraggedIndex(null);
  };

  const handleTitleChange = (index: number, title: string) => {
    setSelectedImages(prev => prev.map((img, i) =>
      i === index ? { ...img, title } : img
    ));
  };

  const handleSave = () => {
    const urls = selectedImages.map(img => img.url);
    const titles = selectedImages.map(img => img.title || '');
    onGalleryUpdate(urls, titles);
    onClose();
  };

  const handleDeleteImage = async (imageUrl: string) => {
    try {
      const supabase = createClient<Database>();

      // Extract file path from signed URL - need to get the original file path
      // Find the image in our allImages array to get the original file name
      const imageToDelete = allImages.find(img => img.url === imageUrl);
      if (!imageToDelete) {
        console.error('Could not find image to delete');
        return;
      }

      const filePath = `user-introduction/${imageToDelete.id}`;

      const { error } = await supabase.storage
        .from('images')
        .remove([filePath]);

      if (error) throw error;

      // Remove from all images and selected images
      setAllImages(prev => prev.filter(img => img.url !== imageUrl));
      setSelectedImages(prev => prev.filter(img => img.url !== imageUrl));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Gallery Manager - {columnType === 'left' ? 'Left' : 'Right'} Column
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* All Images Panel */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">All Images</h3>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && void handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition text-sm"
                  >
                    {uploading ? 'Uploading...' : 'Upload Images'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {allImages.map((image) => (
                    <div
                      key={image.id}
                      className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition ${
                        selectedImages.some(img => img.url === image.url)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleImageSelect(image)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleImageSelect(image);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Select image ${image.title || 'Untitled'}`}
                    >
                      <Image
                        src={image.url}
                        alt={image.title || 'Gallery image'}
                        width={150}
                        height={100}
                        className="w-full h-24 object-cover"
                      />

                      {/* Selection indicator */}
                      {selectedImages.some(img => img.url === image.url) && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          ✓
                        </div>
                      )}

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          void handleDeleteImage(image.url);
                        }}
                        className="absolute top-2 left-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-sm"
                      >
                        ×
                      </button>

                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">{image.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Images Panel */}
          <div className="w-1/2 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Selected Images ({selectedImages.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Drag and drop to reorder. Click to edit titles.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedImages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No images selected</p>
                  <p className="text-sm mt-2">Select images from the left panel to add them to your gallery</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedImages.map((image, index) => (
                    <div
                      key={`${image.url}-${index}`}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition ${
                        draggedIndex === index ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Drag handle */}
                      <div className="text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                        </svg>
                      </div>

                      {/* Image thumbnail */}
                      <Image
                        src={image.url}
                        alt={image.title || 'Selected image'}
                        width={60}
                        height={40}
                        className="w-15 h-10 object-cover rounded"
                      />

                      {/* Title input */}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={image.title || ''}
                          onChange={(e) => handleTitleChange(index, e.target.value)}
                          placeholder="Image title (optional)"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save Gallery
          </button>
        </div>
      </div>
    </div>
  );
}