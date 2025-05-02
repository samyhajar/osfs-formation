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
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              selectedOptions.includes(option)
                ? 'border-blue-500 bg-blue-100 text-blue-700' // Style to match Topics: border, light bg, dark text
                : 'border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200' // Add transparent border for unselected
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}