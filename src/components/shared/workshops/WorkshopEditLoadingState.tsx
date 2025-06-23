'use client';

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface WorkshopEditLoadingStateProps {
  onBack: () => void;
  error?: string | null;
}

export function WorkshopEditLoadingState({ onBack, error }: WorkshopEditLoadingStateProps) {
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Workshops
          </button>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Workshops
        </button>
      </div>
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    </div>
  );
}