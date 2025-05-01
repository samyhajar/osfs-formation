'use client';

interface UploadProgressProps {
  progress: number;
}

export function UploadProgress({ progress }: UploadProgressProps) {
  if (progress <= 0 || progress >= 100) {
    return null; // Don't show if not started or completed
  }

  return (
    <div className="mt-4 space-y-1">
      <div className="flex justify-between text-sm font-medium text-gray-600">
        <span>Uploading...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}