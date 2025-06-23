'use client';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { LanguageFlag } from '@/components/admin/syllabus/LanguageFlag';
import { Database } from '@/types/supabase';

type WorkshopFile = Database['public']['Tables']['workshop_files']['Row'];

interface WorkshopFileItemProps {
  file: WorkshopFile;
  onEdit: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  isDeleting: boolean;
}

export function WorkshopFileItem({ file, onEdit, onDelete, isDeleting }: WorkshopFileItemProps) {
  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'Unknown';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileLanguage = (file: WorkshopFile): string | null => {
    // First check if language is directly stored
    if (file.language) {
      return file.language;
    }

    // If not, try to extract from file path
    if (file.file_path) {
      const fileName = file.file_path.split('/').pop() || '';
      const parts = fileName.split('_');
      if (parts.length >= 3) {
        const languagePart = parts[2];
        // Convert language codes to readable names
        return languagePart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }

    return null;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xs font-medium text-blue-700">
                {file.file_type ? file.file_type.substring(0, 3).toUpperCase() : 'FILE'}
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {file.title}
            </h4>
            {file.description && (
              <p className="text-sm text-gray-600 truncate">
                {file.description}
              </p>
            )}

            {/* Metadata row */}
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
              <span>{formatFileSize(file.file_size)}</span>
              <span>{new Date(file.created_at).toLocaleDateString()}</span>
              {file.region && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                  {file.region}
                </span>
              )}
              {file.author && (
                <span className="text-gray-600">
                  by {file.author}
                </span>
              )}
            </div>

            {/* Topics and Keywords */}
            {(file.topics && file.topics.length > 0) && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Topics:</span>
                <div className="flex flex-wrap gap-1">
                  {file.topics.slice(0, 3).map((topic, index) => (
                    <span key={index} className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">
                      {topic}
                    </span>
                  ))}
                  {file.topics.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{file.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {(file.keywords && file.keywords.length > 0) && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">Keywords:</span>
                <div className="flex flex-wrap gap-1">
                  {file.keywords.slice(0, 3).map((keyword, index) => (
                    <span key={index} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
                      {keyword}
                    </span>
                  ))}
                  {file.keywords.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{file.keywords.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {getFileLanguage(file) && (
              <div className="flex items-center gap-1">
                <LanguageFlag languageName={getFileLanguage(file)} />
                <span className="text-xs text-gray-600">
                  {getFileLanguage(file)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(file.id)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit file"
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(file.id)}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            title="Delete file"
          >
            {isDeleting ? (
              <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}