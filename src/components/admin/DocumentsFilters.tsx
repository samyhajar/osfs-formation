'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl'; // Import useTranslations
import { DocumentCategory, DocumentPurpose } from '@/types/document';
// Import the extracted component from shared location
import { AdvancedFilters } from '@/components/shared/AdvancedFilters';

// Define the filter state type
interface FilterState {
  category: DocumentCategory | ''; // Allow empty string for 'All'
    region: string;
    language: string;
    author: string;
    keywords: string;
    topics: string[];
  purpose: DocumentPurpose[]; // Use DocumentPurpose
}

interface DocumentsFiltersProps {
  filters: FilterState;
  // Use the defined FilterState for the callback parameter, allow partial updates
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  /** Object mapping category names to their document counts */
  categoryCounts: Record<DocumentCategory, number>;
}

// Define category keys for translation mapping
const categoryTranslationKeys: Record<DocumentCategory, string> = {
  'Articles': 'articles',
  'Source materials': 'sourceMaterials',
  'Presentations': 'presentations',
  'Formation Programs': 'formationPrograms',
  'Miscellaneous': 'miscellaneous',
  'Videos': 'videos',
  'Reflections 4 Dimensions': 'reflections4Dimensions'
};

export default function DocumentsFilters({ filters, onFilterChange, categoryCounts }: DocumentsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations('DocumentFilters'); // Initialize translations

  // Keep only categories here
  const categories: DocumentCategory[] = [
    'Articles',
    'Source materials',
    'Presentations',
    'Formation Programs',
    'Miscellaneous',
    'Videos',
    'Reflections 4 Dimensions'
  ];

  // Remove constants for regions, languages, topics, purposes - moved to AdminAdvancedFilters

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Ensure name is a key of FilterState and cast value appropriately if needed
    // Simple case for string values:
    if (name === 'category' || name === 'region' || name === 'language' || name === 'author' || name === 'keywords') {
    onFilterChange({ [name]: value });
    }
  };

  const handleTopicChange = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter(t => t !== topic)
      : [...filters.topics, topic];
    // Provide partial update
    onFilterChange({ topics: newTopics });
  };

  const handlePurposeChange = (purpose: DocumentPurpose) => { // Use DocumentPurpose type
    const newPurposes = filters.purpose.includes(purpose)
      ? filters.purpose.filter(p => p !== purpose)
      : [...filters.purpose, purpose];
    // Provide partial update
    onFilterChange({ purpose: newPurposes });
  };

  const handleReset = () => {
    // Use the full FilterState structure for reset
    onFilterChange({
      category: '',
      region: '',
      language: '',
      author: '',
      keywords: '',
      topics: [],
      purpose: []
    });
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('title')}</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-gray-50"
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 9.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 10.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 7.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Basic filters always visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-1">
            {t('categoryLabel')}
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-gray-900"
          >
            <option value="" className="text-gray-900">{t('allCategoriesOption')}</option>
            {categories.map((category) => (
              // Ensure value type matches FilterState.category
              <option key={category} value={category} className="text-gray-900">
                {t(`categories.${categoryTranslationKeys[category]}`)} ({categoryCounts?.[category] ?? 0})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-900 mb-1">
            {t('keywordsLabel')}
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={filters.keywords}
            onChange={handleInputChange}
            placeholder={t('keywordsPlaceholder')}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-gray-900 placeholder:text-text-muted"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-900 mb-1">
            {t('authorLabel')}
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={filters.author}
            onChange={handleInputChange}
            placeholder={t('authorPlaceholder')}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-gray-900 placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Advanced filters that expand/collapse - Use the new component */}
      {isExpanded && (
        // Use the imported AdvancedFilters component
        <>
          <AdvancedFilters
            filters={filters} // Pass the relevant subset or full filters
            onFilterChange={onFilterChange} // Pass the correct prop
            onTopicChange={handleTopicChange}
            onPurposeChange={handlePurposeChange}
            _onReset={handleReset} // Renamed from onReset to _onReset
          />
          {/* Buttons visible when expanded */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
            {/* Hide Advanced Filters Button (Now on the left) */}
                <button
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-sky-100 text-sky-700 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
            >
              {t('hideAdvancedFilters')}
                </button>
            {/* Reset Filters Button (Now on the right) */}
                <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {t('resetFilters')}
                </button>
          </div>
        </>
      )}

      {/* Container for bottom buttons (visible when collapsed) */}
      {!isExpanded && (
        // Use Flexbox to position buttons side-by-side at the end
        <div className="mt-4 pt-4 flex justify-end gap-2">
          {/* Show Advanced Filters Button */}
          <button
            onClick={() => setIsExpanded(true)}
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-sky-100 text-sky-700 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            {t('showAdvancedFilters')}
          </button>
          {/* Reset Filters Button (visible when collapsed) */}
        <button
            type="button" // Add type="button"
            onClick={handleReset} // Use existing handler
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          {t('resetFilters')}
        </button>
      </div>
      )}
    </div>
  );
}