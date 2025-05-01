'use client';

import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { ArrowUpTrayIcon, DocumentIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface FileDropzoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  required?: boolean;
}

export function FileDropzone({
  file,
  onFileChange,
  required = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Necessary to allow drop
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileChange(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
      }
    },
    [onFileChange]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    } else {
      onFileChange(null);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    // Also clear the native input value if needed
    const input = document.getElementById('file-upload') as HTMLInputElement;
    if (input) input.value = '';
  };

  return (
    <div>
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
        Document File {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
      >
        <div className="space-y-1 text-center">
          <ArrowUpTrayIcon className={`mx-auto h-12 w-12 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-500 hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload" // ID matches outer label
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleInputChange}
                required={required && !file} // Only required if no file is selected
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PDF, DOCX, PNG, JPG, etc.</p>
        </div>
      </div>
      {file && (
        <div className="mt-3 flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex items-center space-x-2 text-sm">
            <DocumentIcon className="h-5 w-5 text-gray-500 shrink-0" />
            <span className="text-gray-700 font-medium truncate">{file.name}</span>
            <span className="text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700 ml-4 p-1 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label="Remove file"
          >
            <XCircleIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}