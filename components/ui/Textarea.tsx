// components/ui/Textarea.tsx
import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

/**
 * Composant Textarea réutilisable pour formulaires
 * @param label - Label du champ
 * @param error - Message d'erreur
 * @param helperText - Texte d'aide
 * @param className - Classes CSS additionnelles
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    const baseStyles = 'w-full px-4 py-2 border rounded-lg transition-colors duration-200 resize-y text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800';
    const normalStyles = 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800';
    const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`
            ${baseStyles}
            ${error ? errorStyles : normalStyles}
            ${className}
          `.trim()}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${textareaId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${textareaId}-helper`}
            className="mt-1 text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
