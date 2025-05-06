'use client';

import { Document } from './types';
import { LanguageFlag } from './LanguageFlag';

type DocumentRowProps = {
  doc: Document;
  selected: boolean;
  documentsConfirmed: boolean;
  onToggle: (id: string) => void;
  formatDate: (dateString: string) => string;
  t: (key: string, options?: Record<string, string | number>) => string;
};

export const DocumentRow = ({
  doc,
  selected,
  documentsConfirmed,
  onToggle,
  formatDate,
  t
}: DocumentRowProps) => {
  return (
    <tr
      key={doc.id}
      onClick={() => !documentsConfirmed && onToggle(doc.id)}
      className={`hover:bg-gray-50 cursor-pointer ${documentsConfirmed ? 'opacity-90' : ''} ${
        selected ? 'bg-blue-50' : ''
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap flex items-center justify-center">
        <div className={`h-5 w-5 rounded border flex items-center justify-center ${
          selected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
        }`}>
          {selected && (
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-left">
        <div className="text-sm font-medium text-gray-900">{doc.title}</div>
        <div className="text-xs text-gray-500">by {doc.author_name || t('unknownAuthor')}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 inline-block">
          {doc.file_type ? doc.file_type.toUpperCase() : '-'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
        <div className="flex justify-center">
          <LanguageFlag languageName={doc.language ?? null} />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {doc.region || '--'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 inline-block">
          {doc.category || '-'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {formatDate(doc.created_at)}
      </td>
    </tr>
  );
};