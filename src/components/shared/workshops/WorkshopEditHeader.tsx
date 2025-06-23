'use client';

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface WorkshopEditHeaderProps {
  onBack: () => void;
  title: string;
  error?: string | null;
}

export function WorkshopEditHeader({ onBack, title, error }: WorkshopEditHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Workshops
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {title}
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}
    </>
  );
}