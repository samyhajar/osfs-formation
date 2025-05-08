'use client';

import React, { useState } from 'react';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface PDFViewerProps {
  url: string;
  title: string;
  className?: string;
}

export function PDFViewer({ url, title, className = 'w-full h-[70vh]' }: PDFViewerProps) {
  const [viewerError, setViewerError] = useState(false);

  // Function to try Google Docs viewer as fallback
  const openInGoogleViewer = () => {
    window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`, '_blank');
  };

  // Function to open PDF in new tab
  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col">
      {/* PDF Viewer */}
      <object
        data={url}
        type="application/pdf"
        className={`border-0 rounded ${className}`}
        onError={() => setViewerError(true)}
        aria-label={title}
      >
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded p-8">
          <p className="text-gray-700 mb-4 text-center">
            {viewerError
              ? "The PDF viewer encountered an error."
              : "It appears your browser doesn't support embedded PDFs."}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={openInNewTab}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Open PDF in new tab
            </button>
            <button
              onClick={openInGoogleViewer}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Try Google Viewer
            </button>
          </div>
        </div>
      </object>

      {/* Alternative options */}
      <div className="mt-2 flex justify-center gap-4">
        <button
          onClick={openInNewTab}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
          Open in new tab
        </button>
        <button
          onClick={openInGoogleViewer}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1" />
          Try Google Viewer
        </button>
      </div>
    </div>
  );
}