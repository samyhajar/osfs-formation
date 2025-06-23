'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface UploadProgress {
  currentFile: number;
  totalFiles: number;
  fileName: string;
  fileProgress: number;
}

interface MultiFileUploadProgressProps {
  progress: UploadProgress | null;
}

export function MultiFileUploadProgress({ progress }: MultiFileUploadProgressProps) {
  if (!progress) return null;

  const overallProgress = ((progress.currentFile - 1) / progress.totalFiles) * 100 +
                         (progress.fileProgress / progress.totalFiles);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin mr-2" />
          <span className="text-sm font-medium text-gray-700">
            Uploading files...
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {progress.currentFile} of {progress.totalFiles}
        </span>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Overall Progress</span>
          <span>{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Current File Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span className="truncate flex-1 mr-2">
            Current: {progress.fileName}
          </span>
          <span>{progress.fileProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress.fileProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}