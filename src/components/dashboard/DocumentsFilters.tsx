'use client';

import { useState } from 'react';
import { DocumentCategory, DocumentPurpose } from '@/types/document';

interface DocumentsFiltersProps {
  filters: {
    category: string;
    region: string;
    language: string;
    author: string;
    keywords: string;
    topics: string[];
    purpose: string[];
  };
  onFilterChange: (filters: any) => void;
  /** Object mapping category names to their document counts */
  categoryCounts: Record<DocumentCategory, number>;
}

export default function DocumentsFilters({ filters, onFilterChange, categoryCounts }: DocumentsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories: DocumentCategory[] = [
    'Articles',
    'Source materials',
    'Presentations',
    'Formation Programs',
    'Miscellaneous',
    'Videos',
    'Reflections 4 Dimensions'
  ];

  const regions = [
    'Africa',
    'Asia',
    'Europe',
    'North America',
    'South America',
    'Australia'
  ];

  const languages = [
    'English',
    'French',
    'German',
    'Spanish',
    'Italian',
    'Portuguese'
  ];

  const topics = [
    'Formation',
    'Spirituality',
    'Community Life',
    'Mission',
    'Vocation',
    'Prayer',
    'Scripture'
  ];

  const purposes: DocumentPurpose[] = [
    'General',
    'Novitiate',
    'Postulancy',
    'Scholasticate',
    'Ongoing Formation'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleTopicChange = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter(t => t !== topic)
      : [...filters.topics, topic];

    onFilterChange({ topics: newTopics });
  };

  const handlePurposeChange = (purpose: string) => {
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

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
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
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-gray-900"
          >
            <option value="" className="text-gray-900">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category} className="text-gray-900">
                {category} ({categoryCounts?.[category] ?? 0})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-900 mb-1">
            Keywords
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={filters.keywords}
            onChange={handleInputChange}
            placeholder="Search by keywords"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-text-primary placeholder:text-text-muted"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-900 mb-1">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={filters.author}
            onChange={handleInputChange}
            placeholder="Filter by author"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Advanced filters that expand/collapse */}
      {isExpanded && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h3 className="text-base font-medium text-gray-900 mb-3">Advanced Filters</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-900 mb-1">
                Region
              </label>
              <select
                id="region"
                name="region"
                value={filters.region}
                onChange={handleInputChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-black"
              >
                <option value="" className="text-black">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region} className="text-black">
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-900 mb-1">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={filters.language}
                onChange={handleInputChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-black"
              >
                <option value="" className="text-black">All Languages</option>
                {languages.map((language) => (
                  <option key={language} value={language} className="text-black">
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Topics</h4>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicChange(topic)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.topics.includes(topic)
                      ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/30'
                      : 'bg-gray-100 text-text-secondary border border-gray-200 hover:bg-gray-200 hover:text-text-primary'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Purpose</h4>
            <div className="flex flex-wrap gap-2">
              {purposes.map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => handlePurposeChange(purpose)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filters.purpose.includes(purpose)
                      ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/30'
                      : 'bg-gray-100 text-text-secondary border border-gray-200 hover:bg-gray-200 hover:text-text-primary'
                  }`}
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-text-secondary bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary/50 transition-colors"
        >
          Reset Filters
        </button>
        <button
          onClick={() => {
            if (isExpanded) {
              // Add logic here to apply filters if needed
              console.log("Applying filters:", filters);
            }
            setIsExpanded(!isExpanded);
          }}
          className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
            isExpanded
              ? 'bg-accent-primary text-white hover:bg-accent-primary/90 focus:ring-accent-primary'
              : 'bg-white text-text-secondary border border-gray-300 hover:bg-gray-50 focus:ring-accent-primary/50'
          }`}
        >
          {isExpanded ? 'Apply Filters' : 'Advanced Filters'}
        </button>
      </div>
    </div>
  );
}