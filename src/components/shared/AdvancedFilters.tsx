'use client';

import { DocumentPurpose } from '@/types/document';
// Assuming these components are moved to a shared location or duplicated
import { SelectField } from '@/components/admin/documents/SelectField';
import { FilterMultiSelect } from './FilterMultiSelect';

// Constants for options - Could be passed as props or defined here if only used here
const regions = [
    'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia'
];
const languages = [
    'English', 'French', 'German', 'Spanish', 'Italian', 'Portuguese'
];
const topics = [
    'Formation', 'Spirituality', 'Community Life', 'Mission', 'Vocation',
    'Prayer', 'Scripture', 'Community', 'Constitutions', 'Directory',
    'Evaluation', 'History', 'Ministry', 'Origins: Formation Coordinator',
    'Other', 'Psychology', 'Salesian', 'Vows'
];
const purposes: DocumentPurpose[] = [
    'General', 'Novitiate', 'Postulancy', 'Scholasticate', 'Ongoing Formation'
];

// Define the filters structure expected by this component
interface FilterState {
  region: string;
  language: string;
  topics: string[];
  purpose: DocumentPurpose[];
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onTopicChange: (topic: string) => void;
  onPurposeChange: (purpose: DocumentPurpose) => void;
  _onReset: () => void;
}

export function AdvancedFilters({
  filters,
  onFilterChange,
  onTopicChange,
  onPurposeChange,
  _onReset,
}: AdvancedFiltersProps) {
  return (
    <div className="mt-6 pt-4 border-t border-gray-100">
      <h3 className="text-base font-medium text-gray-900 mb-3">Advanced Filters</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
         {/* Using updated SelectField for Region */}
         <SelectField<string>
           id="region"
           label="Region"
           value={filters.region}
           onChange={(value) => onFilterChange({ region: value })}
           options={[
              { value: '', label: 'All Regions' },
              ...regions.map(r => ({ value: r, label: r }))
           ]}
           className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-black"
         />

        {/* Using updated SelectField for Language */}
        <SelectField<string>
           id="language"
           label="Language"
           value={filters.language}
           onChange={(value) => onFilterChange({ language: value })}
           options={[
             { value: '', label: 'All Languages' },
             ...languages.map(l => ({ value: l, label: l }))
           ]}
           className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-accent-primary/50 focus:border-accent-primary sm:text-sm text-black"
         />
      </div>

      {/* Using updated FilterMultiSelect for Topics */}
      <FilterMultiSelect<string>
        label="Topics"
        options={topics}
        selectedOptions={filters.topics}
        onChange={onTopicChange}
      />

      {/* Using updated FilterMultiSelect for Purpose */}
      <div className="mt-4">
         <FilterMultiSelect<DocumentPurpose>
           label="Purpose"
           options={purposes}
           selectedOptions={filters.purpose}
           onChange={onPurposeChange}
         />
      </div>
    </div>
  );
}