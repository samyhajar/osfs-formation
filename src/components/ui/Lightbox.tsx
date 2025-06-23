'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
}

export default function Lightbox({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      goToPrevious();
    } else if (event.key === 'ArrowRight') {
      goToNext();
    } else if (event.key === 'Escape') {
      onClose();
    }
  }, [goToPrevious, goToNext, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, images.length, handleKeyDown]);

  if (!images.length) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative max-w-7xl max-h-full w-full h-full flex flex-col items-center justify-center">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors duration-200"
                aria-label="Close lightbox"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
                  {currentIndex + 1} / {images.length}
                </div>
              )}

              {/* Main image */}
              <div className="relative max-w-full max-h-full flex items-center justify-center">
                <Image
                  src={images[currentIndex]}
                  alt={title || `Image ${currentIndex + 1}`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  priority
                />
              </div>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 hover:scale-110"
                    aria-label="Previous image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 hover:scale-110"
                    aria-label="Next image"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Title */}
              {title && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm max-w-md text-center">
                  {title}
                </div>
              )}

              {/* Thumbnail navigation for multiple images */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                        index === currentIndex
                          ? 'border-white shadow-lg scale-110'
                          : 'border-transparent hover:border-white/50'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}