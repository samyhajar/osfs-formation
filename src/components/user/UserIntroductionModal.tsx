'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface UserIntroduction {
  id: string;
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
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
  // No need to set a cookie anymore
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
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full h-[95vh] transform bg-white rounded-lg shadow-xl transition-all flex flex-col">
              <div className="flex-1 flex flex-col p-6 md:p-8 overflow-hidden">
                <div className="w-full text-center mb-6">
                  <p className="text-slate-700 text-xl font-medium">General Coordinator:<br />
                  {introContent.coordinator_name}</p>
                </div>

                <div className="flex flex-col lg:flex-row w-full h-full">
                  <div className="w-full lg:w-1/2 flex items-center justify-center overflow-y-auto py-4 px-4 lg:px-6">
                    <div className="prose max-w-none text-center">
                      {introContent.left_column_content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-slate-700 mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="hidden lg:block w-px bg-slate-200 mx-2 self-stretch"></div>

                  <div className="w-full lg:w-1/2 flex items-center justify-center overflow-y-auto py-4 px-4 lg:px-6">
                    <div className="prose max-w-none text-center">
                      {introContent.right_column_content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-slate-700 mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-auto py-6 flex justify-center">
                  <button
                    type="button"
                    className="py-3 px-8 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                    onClick={onClose}
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}