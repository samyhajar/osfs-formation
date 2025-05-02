'use client';

import { useTranslations } from 'next-intl';

interface FilterMultiSelectProps<T extends string> {
  label: string;
  options: readonly T[];
  selectedOptions: T[];
  onChange: (option: T) => void;
  translationNamespace: string; // e.g., "AdvancedFilters.topics"
}

// Helper function to generate translation keys (consistent with AdvancedFilters)
const toKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export function FilterMultiSelect<T extends string>({
  label,
  options,
  selectedOptions,
  onChange,
  translationNamespace
}: FilterMultiSelectProps<T>) {
  // Initialize translations - use a generic namespace or pass full path?
  // Using a generic hook here, relying on the full namespace path passed in.
  const t = useTranslations();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label} {/* Label is already translated in the parent */}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              selectedOptions.includes(option)
                ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            {/* Use the full translation key path */}
            {t(`${translationNamespace}.${toKey(option)}`)}
          </button>
        ))}
      </div>
    </div>
  );
}