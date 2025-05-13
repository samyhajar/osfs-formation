'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface Option {
  value: string | number;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: (string | number)[];
  onChange: (selectedValues: (string | number)[]) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export default function MultiSelect({
  options,
  selectedValues,
  onChange,
  label,
  placeholder = 'Select options...',
  disabled = false,
  className = '',
  id,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle selection of an option
  const toggleOption = (value: string | number) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(val => val !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  // Handle keyboard interactions
  const handleKeyDown = (event: React.KeyboardEvent, value: string | number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleOption(value);
    }
  };

  // Display for the selected values in the button
  const selectedDisplay = selectedValues.length > 0
    ? options
        .filter(option => selectedValues.includes(option.value))
        .map(option => option.label)
        .join(', ')
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        id={id}
        className={`relative w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className="block truncate">{selectedDisplay}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <div className="pt-1 pb-1" role="listbox" aria-labelledby={id} tabIndex={-1}>
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => toggleOption(option.value)}
                  onKeyDown={(e) => handleKeyDown(e, option.value)}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                >
                  <div className="flex h-5 items-center">
                    <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <CheckIcon className="h-3 w-3 text-white" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                  <span className="ml-3 block font-medium text-gray-700">
                    {option.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}