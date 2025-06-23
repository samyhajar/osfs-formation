'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ColumnContent } from './ColumnContent';

interface UserIntroduction {
  id: string;
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  left_column_image_url: string | null;
  right_column_image_url: string | null;
  left_column_image_position: 'above' | 'below' | null;
  right_column_image_position: 'above' | 'below' | null;
  left_column_gallery_urls: string[];
  right_column_gallery_urls: string[];
  left_column_gallery_titles: string[];
  right_column_gallery_titles: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserIntroductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  introContent: UserIntroduction;
}

export default function UserIntroductionModal({
  isOpen,
  onClose,
  introContent
}: UserIntroductionModalProps) {
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform bg-white rounded-3xl shadow-2xl transition-all flex flex-col max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-8 text-center border-b border-slate-200">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-slate-800">Welcome to OSFS Formation</h1>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1"></div>
                    <p className="text-slate-600 text-lg font-medium px-4">
                      General Coordinator: {introContent.coordinator_name}
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent flex-1"></div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col lg:flex-row min-h-full">
                                  <div className="flex-1 p-8 lg:p-12">
                  <ColumnContent
                    content={introContent.left_column_content}
                    galleryUrls={introContent.left_column_gallery_urls}
                    galleryTitles={introContent.left_column_gallery_titles}
                  />
                </div>

                <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent mx-8"></div>

                <div className="flex-1 p-8 lg:p-12">
                  <ColumnContent
                    content={introContent.right_column_content}
                    galleryUrls={introContent.right_column_gallery_urls}
                    galleryTitles={introContent.right_column_gallery_titles}
                  />
                </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-t border-slate-200">
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-blue-600"
                    onClick={onClose}
                  >
                    Continue to Dashboard
                  </button>
                </div>
              </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}