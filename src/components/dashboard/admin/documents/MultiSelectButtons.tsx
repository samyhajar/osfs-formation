'use client';

interface MultiSelectButtonsProps<T extends string> {
  label: string;
  options: readonly T[];
  selectedOptions: T[];
  onChange: (option: T) => void; // Function to toggle a single option
  disabled?: boolean;
}

export function MultiSelectButtons<T extends string>({
  label,
  options,
  selectedOptions,
  onChange,
  disabled = false,
}: MultiSelectButtonsProps<T>) {

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            type="button" // Ensure it doesn't submit the form
            onClick={() => onChange(option)}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedOptions.includes(option)
                ? 'bg-indigo-600 text-white' // Style for selected
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Style for unselected
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}