'use client';
// components/admin/forms/DateField.tsx
// A date input that forwards ref-based registration to React Hook Form.
import { forwardRef } from 'react';

interface DateFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  ({ label, name, error, required, ...props }, ref) => {
    const baseStyles = `
      w-full px-4 py-2 border rounded-lg text-sm
      bg-white dark:bg-gray-700
      text-gray-900 dark:text-white
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      transition-colors
      ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}
    `;

    const labelStyles = `
      block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1
      ${required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}
    `;

    return (
      <div className="mb-4">
        <label htmlFor={name} className={labelStyles}>
          {label}
        </label>
        <input
          ref={ref}
          id={name}
          name={name}
          type="date"
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={baseStyles}
          {...props}
        />
        {error && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

DateField.displayName = 'DateField';
export default DateField;
