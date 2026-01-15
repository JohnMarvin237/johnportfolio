// components/ui/Input.tsx
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

/**
 * Composant Input réutilisable pour formulaires
 * @param label - Label du champ
 * @param error - Message d'erreur
 * @param helperText - Texte d'aide
 * @param className - Classes CSS additionnelles
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    const baseStyles = 'w-full px-4 py-2 border rounded-lg transition-colors duration-200 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800';
    const normalStyles = 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800';
    const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            ${baseStyles}
            ${error ? errorStyles : normalStyles}
            ${className}
          `.trim()}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
