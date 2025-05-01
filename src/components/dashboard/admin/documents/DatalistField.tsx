'use client';

import { ChangeEvent } from 'react';

interface DatalistFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: readonly string[];
  listId: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function DatalistField({
  id,
  label,
  value,
  onChange,
  suggestions,
  listId, // Unique ID for the datalist element
  required = false,
  disabled = false,
  placeholder = ''
}: DatalistFieldProps) {

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        list={listId} // Connect input to datalist
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
      />
      <datalist id={listId}>
        {suggestions.map(suggestion => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    </div>
  );
}