'use client';

import { ChangeEvent } from 'react';

// Define structure for options with value and label
interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectFieldProps<T extends string> {
  id: string;
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectOption<T>[]; // Options are now objects
  required?: boolean;
  disabled?: boolean;
  className?: string; // Allow passing custom classes
}

export function SelectField<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  className = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black bg-white"
}: SelectFieldProps<T>) {

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as T);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={className} // Use the passed or default className
      >
        {/* Map over option objects */}
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}