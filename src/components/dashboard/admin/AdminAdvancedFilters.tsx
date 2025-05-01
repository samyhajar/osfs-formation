'use client';

import { DocumentPurpose } from '@/types/document';

// Constants for options used only here
const regions = [
    'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia'
];
const languages = [
    'English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese'
];
const topics = [
    'Formation', 'Spirituality', 'Community Life', 'Mission', 'Vocation', 'Prayer', 'Scripture'
];
const purposes: DocumentPurpose[] = [
    'General', 'Novitiate', 'Postulancy', 'Scholasticate', 'Ongoing Formation'
];

// Define the filter state relevant to this component
interface AdvancedFilterState {
  region: string;
  language: string;
  topics: string[];
  purpose: DocumentPurpose[];
}

interface AdminAdvancedFiltersProps {
  filters: AdvancedFilterState;
  // Callback for simple input/select changes
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onTopicChange: (topic: string) => void;
  onPurposeChange: (purpose: DocumentPurpose) => void;
  onReset: () => void;
}

export function AdminAdvancedFilters({
  filters,
  onInputChange,
  onTopicChange,
  onPurposeChange,
  onReset,
}: AdminAdvancedFiltersProps) {
  return (
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
            onChange={onInputChange} // Use the passed handler
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
            onChange={onInputChange} // Use the passed handler
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
              onClick={() => onTopicChange(topic)} // Use the passed handler
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.topics.includes(topic)
                  ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/30'
                  : 'bg-gray-100 text-text-secondary border border-gray-200 hover:bg-accent-primary/10 hover:text-accent-primary hover:border-accent-primary/30'
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
              onClick={() => onPurposeChange(purpose)} // Use the passed handler
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.purpose.includes(purpose)
                  ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/30'
                  : 'bg-gray-100 text-text-secondary border border-gray-200 hover:bg-accent-primary/10 hover:text-accent-primary hover:border-accent-primary/30'
              }`}
            >
              {purpose}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-6 text-right">
        <button
          onClick={onReset} // Use the passed handler
          className="text-sm font-medium text-accent-secondary hover:text-accent-primary transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
}