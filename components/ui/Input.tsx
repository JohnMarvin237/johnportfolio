// components/ui/Input.tsx
import React, { forwardRef } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea';
  name: string;
  error?: string;
  rows?: number;
  className?: string;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      type = 'text',
      name,
      placeholder,
      value,
      onChange,
      error,
      required = false,
      rows = 4,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      w-full px-4 py-2 border rounded-lg
      bg-white dark:bg-gray-800
      text-gray-900 dark:text-gray-100
      placeholder-gray-400 dark:placeholder-gray-500
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
      ${error
        ? 'border-red-500 dark:border-red-400'
        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      }
    `;

    const labelStyles = `
      block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1
      ${required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''}
    `;

    const inputElement =
      type === 'textarea' ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          name={name}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          rows={rows}
          required={required}
          className={`${baseStyles} resize-vertical min-h-[100px] ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value as string}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          required={required}
          className={`${baseStyles} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />
      );

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={name} className={labelStyles}>
            {label}
          </label>
        )}
        {inputElement}
        {error && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
