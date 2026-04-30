'use client';
// components/admin/forms/ArrayField.tsx
// Controlled input for string[] — shows removable chips + an add-item input.
import { useState, type KeyboardEvent } from 'react';
import Button from '@/components/ui/Button';

interface ArrayFieldProps {
  label: string;
  value: string[];
  onChange: (val: string[]) => void;
  error?: string;
  placeholder?: string;
}

export default function ArrayField({
  label,
  value,
  onChange,
  error,
  placeholder = 'Ajouter un élément',
}: ArrayFieldProps) {
  const [inputValue, setInputValue] = useState('');

  function addItem() {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInputValue('');
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  }

  const fieldId = `array-field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
        {label}
      </label>

      {/* Existing chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-3 py-1 text-sm"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="ml-1 rounded-full text-primary-600 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
                aria-label={`Retirer ${item}`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add input */}
      <div className="flex gap-2">
        <input
          id={fieldId}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            flex-1 px-4 py-2 border rounded-lg text-sm
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-colors
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
        />
        <Button type="button" variant="secondary" size="sm" onClick={addItem}>
          Ajouter
        </Button>
      </div>

      {error && (
        <p id={`${fieldId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
