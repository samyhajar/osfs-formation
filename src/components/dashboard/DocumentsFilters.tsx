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
}

export default function DocumentsFilters({ filters, onFilterChange }: DocumentsFiltersProps) {
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
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Basic filters always visible */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
            Keywords
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={filters.keywords}
            onChange={handleInputChange}
            placeholder="Search by keywords"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={filters.author}
            onChange={handleInputChange}
            placeholder="Filter by author"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Advanced filters that expand/collapse */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-700 mb-3">Advanced Filters</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <select
                id="region"
                name="region"
                value={filters.region}
                onChange={handleInputChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value="">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={filters.language}
                onChange={handleInputChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Topics</h4>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicChange(topic)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.topics.includes(topic)
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Purpose</h4>
            <div className="flex flex-wrap gap-2">
              {purposes.map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => handlePurposeChange(purpose)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.purpose.includes(purpose)
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {purpose}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter actions */}
      <div className={`flex justify-end pt-4 ${isExpanded ? 'border-t border-gray-200 mt-4' : 'mt-4'}`}>
        <button
          onClick={handleReset}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2"
        >
          Reset Filters
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          {isExpanded ? 'Apply Filters' : 'More Filters'}
        </button>
      </div>
    </div>
  );
}