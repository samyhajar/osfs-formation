'use client';

interface FilterMultiSelectProps<T extends string> {
  label: string;
  options: readonly T[];
  selectedOptions: T[];
  onChange: (option: T) => void;
}

export function FilterMultiSelect<T extends string>({
  label,
  options,
  selectedOptions,
  onChange
}: FilterMultiSelectProps<T>) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}
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
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}