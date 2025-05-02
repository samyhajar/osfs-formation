'use client';

import { ChangeEvent } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  isTextArea?: boolean;
  rows?: number;
  placeholder?: string;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  isTextArea = false,
  rows = 3,
  placeholder = ''
}: FormFieldProps) {

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const InputComponent = isTextArea ? 'textarea' : 'input';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <InputComponent
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        rows={isTextArea ? rows : undefined}
        placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder:text-gray-400"
        {...(isTextArea ? {} : { type: 'text' })} // Add type="text" only for input
      />
    </div>
  );
}