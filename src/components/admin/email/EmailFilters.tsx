'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DocumentCategory } from '@/types/document';
import { Search, Filter, X } from 'lucide-react';

// Define the filters structure
interface FilterState {
  category: DocumentCategory | '';
  language: string;
  keywords: string;
}

interface EmailFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  inHeader?: boolean; // Optional prop to indicate if the filter is in a card header
}

export function EmailFilters({ filters, onFilterChange, inHeader = false }: EmailFiltersProps) {
  const t = useTranslations('EmailPage');
  const [isExpanded, setIsExpanded] = useState(false);

  // Categories list
  const categories: DocumentCategory[] = [
    'Articles',
    'Source materials',
    'Presentations',
    'Formation Programs',
    'Miscellaneous',
    'Videos',
    'Reflections 4 Dimensions'
  ];

  // Languages list
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name as keyof FilterState]: value });
  };

  const handleReset = () => {
    onFilterChange({
      category: '',
      language: '',
      keywords: ''
    });
    setIsExpanded(false);
  };

  return (
    <div className={`${!inHeader ? 'bg-white border border-gray-200 rounded-lg overflow-hidden mb-6' : ''}`}>
      {/* Simple Search and Filter Toggle */}
      <div className="flex items-center">
        <div className="relative flex-1">
          <input
            type="text"
            name="keywords"
            className={`w-full ${inHeader ? 'py-1.5 pl-8 pr-2 text-sm' : 'p-4 py-2 pl-10 pr-4'} rounded-lg border ${inHeader ? 'border-gray-200 bg-white' : 'border-gray-200'} focus:ring-blue-500 focus:border-blue-500`}
            placeholder={t('searchDocuments')}
            value={filters.keywords}
            onChange={handleInputChange}
          />
          <Search className={`absolute ${inHeader ? 'left-2' : 'left-3'} top-1/2 transform -translate-y-1/2 ${inHeader ? 'text-gray-400' : 'text-gray-400'}`} size={inHeader ? 14 : 18} />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`ml-3 ${inHeader ? 'py-1.5 px-2 text-sm' : 'px-3 py-2'} rounded-lg flex items-center gap-2 border ${
            isExpanded || filters.category || filters.language
              ? 'bg-gray-100 text-gray-700 border-gray-200'
              : inHeader ? 'bg-white text-gray-700 border-gray-200' : 'bg-white text-gray-700 border-gray-200'
          }`}
        >
          <Filter size={inHeader ? 14 : 16} />
          <span className="hidden sm:inline">{t('filters')}</span>
          {(filters.category || filters.language) && (
            <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5">
              {(filters.category ? 1 : 0) + (filters.language ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className={`${inHeader ? 'pt-3 mt-3' : 'p-4'} ${!inHeader ? 'border-t border-gray-200 bg-gray-50' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('category')}
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                className={`w-full rounded-lg border ${inHeader ? 'border-gray-200 bg-white' : 'border-gray-200 bg-white'} py-2 px-3`}
              >
                <option value="">{t('allCategories')}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Language filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('language')}
              </label>
              <select
                name="language"
                value={filters.language}
                onChange={handleInputChange}
                className={`w-full rounded-lg border ${inHeader ? 'border-gray-200 bg-white' : 'border-gray-200 bg-white'} py-2 px-3`}
              >
                <option value="">{t('allLanguages')}</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-sm px-3 py-1 rounded text-gray-600 hover:bg-gray-200"
            >
              <X size={14} />
              {t('resetFilters')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}