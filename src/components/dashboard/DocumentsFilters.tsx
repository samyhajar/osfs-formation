'use client';

import { useState } from 'react';
import { DocumentCategory, DocumentPurpose } from '@/types/document';
import { FormField } from '@/components/dashboard/admin/documents/FormField';
import { SelectField } from '@/components/dashboard/admin/documents/SelectField';
// Import the new AdvancedFilters component
import { AdvancedFilters } from './AdvancedFilters';

// Constants for categories only - others moved to AdvancedFilters
const categories: DocumentCategory[] = [
    'Articles',
    'Source materials',
    'Presentations',
    'Formation Programs',
    'Miscellaneous',
    'Videos',
    'Reflections 4 Dimensions'
];
// Removed constants for regions, languages, topics, purposes - they are in AdvancedFilters

// Define the filters structure more explicitly
interface FilterState {
  category: DocumentCategory | '';
  region: string;
  language: string;
  author: string;
  keywords: string;
  topics: string[];
  purpose: DocumentPurpose[];
}

interface DocumentsFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  categoryCounts: Record<DocumentCategory, number>;
}

export default function DocumentsFilters({ filters, onFilterChange, categoryCounts }: DocumentsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // More specific handler for category to handle empty string
   const handleCategoryChange = (value: DocumentCategory | '') => {
    onFilterChange({ category: value });
  };

  const handleTopicChange = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter(t => t !== topic)
      : [...filters.topics, topic];
    onFilterChange({ topics: newTopics });
  };

  const handlePurposeChange = (purpose: DocumentPurpose) => {
    const newPurposes = filters.purpose.includes(purpose)
      ? filters.purpose.filter(p => p !== purpose)
      : [...filters.purpose, purpose];
    onFilterChange({ purpose: newPurposes });
  };

  const handleReset = () => {
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

  // Combine categories with counts for the dropdown
  const categoryOptions: { value: DocumentCategory | ''; label: string }[] = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat, label: `${cat} (${categoryCounts?.[cat] ?? 0})`}))
  ];

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-gray-50"
        >
           {isExpanded ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.707 9.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L10 12.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
           ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 10.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 7.414l-3.293 3.293a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
           )}
        </button>
      </div>

      {/* Basic filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <SelectField<DocumentCategory | ''>
           id="category"
           label="Category"
           value={filters.category}
           onChange={handleCategoryChange}
           options={categoryOptions}
           className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-gray-900"
        />
        <FormField
           id="keywords"
           label="Keywords"
           value={filters.keywords}
           onChange={(value) => onFilterChange({ keywords: value })}
           placeholder="Search by keywords"
        />
        <FormField
           id="author"
           label="Author"
           value={filters.author}
           onChange={(value) => onFilterChange({ author: value })}
           placeholder="Filter by author"
        />
      </div>

      {/* Advanced filters - Render the extracted component */}
      {isExpanded && (
        <AdvancedFilters
          filters={filters} // Pass only the needed filter parts
          onFilterChange={onFilterChange} // Pass the general handler
          onTopicChange={handleTopicChange} // Pass specific handlers
          onPurposeChange={handlePurposeChange}
          onReset={handleReset}
        />
      )}
    </div>
  );
}