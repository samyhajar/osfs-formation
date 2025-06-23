'use client';

import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { ArrowUpTrayIcon, DocumentIcon, XCircleIcon, PencilIcon } from '@heroicons/react/24/outline';

export interface FileWithTitle {
  file: File;
  title: string;
  id: string;
}

interface MultiFileDropzoneProps {
  files: FileWithTitle[];
  onFilesChange: (files: FileWithTitle[]) => void;
  required?: boolean;
}

// Helper function to get filename without extension for use as default title
const getFileNameWithoutExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
};

export function MultiFileDropzone({
  files,
  onFilesChange,
  required = false,
}: MultiFileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

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
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFiles: FileWithTitle[] = Array.from(e.dataTransfer.files).map((file) => ({
          file,
          title: getFileNameWithoutExtension(file.name),
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }));

        onFilesChange([...files, ...newFiles]);
        e.dataTransfer.clearData();
      }
    },
    [files, onFilesChange]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: FileWithTitle[] = Array.from(e.target.files).map((file) => ({
        file,
        title: getFileNameWithoutExtension(file.name),
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }));

      onFilesChange([...files, ...newFiles]);

      // Clear the input so the same files can be selected again if needed
      e.target.value = '';
    }
  };

  const handleRemoveFile = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  const handleEditTitle = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditValue(currentTitle);
  };

  const handleSaveTitle = (id: string) => {
    if (editValue.trim()) {
      onFilesChange(files.map(f =>
        f.id === id ? { ...f, title: editValue.trim() } : f
      ));
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveTitle(id);
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div>
      <label htmlFor="multi-file-upload" className="block text-sm font-medium text-gray-700 mb-1">
        Document Files {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
          isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        }`}
      >
        <div className="space-y-1 text-center">
          <ArrowUpTrayIcon className={`mx-auto h-12 w-12 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="multi-file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-500 hover:text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span>Upload files</span>
              <input
                id="multi-file-upload"
                name="multi-file-upload"
                type="file"
                multiple
                className="sr-only"
                onChange={handleInputChange}
                required={required && files.length === 0}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PDF, DOCX, PNG, JPG, etc. (Multiple files allowed)</p>
        </div>
      </div>

      {/* Display selected files */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files ({files.length})</h4>
          {files.map((fileWithTitle) => (
            <div key={fileWithTitle.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <DocumentIcon className="h-5 w-5 text-gray-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  {editingId === fileWithTitle.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e, fileWithTitle.id)}
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        // autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveTitle(fileWithTitle.id)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 truncate">{fileWithTitle.title}</span>
                        <button
                          type="button"
                          onClick={() => handleEditTitle(fileWithTitle.id, fileWithTitle.title)}
                          className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          title="Edit title"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {fileWithTitle.file.name} ({(fileWithTitle.file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(fileWithTitle.id)}
                className="text-red-500 hover:text-red-700 ml-4 p-1 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shrink-0"
                aria-label="Remove file"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}