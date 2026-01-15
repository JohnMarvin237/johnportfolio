// components/admin/FormField.tsx
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'url' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  error?: string;
  register?: any; // React Hook Form register
  className?: string;
  rows?: number; // For textarea
  options?: { value: string; label: string }[]; // For select
  value?: any; // For controlled components
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  checked?: boolean; // For checkbox
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  register,
  className,
  rows = 4,
  options = [],
  value,
  onChange,
  checked,
}: FormFieldProps) {
  const fieldProps = register ? register(name) : { name, value, onChange };

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...fieldProps}
            id={name}
            rows={rows}
            placeholder={placeholder}
            className={cn(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
              'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
              'text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800',
              'dark:border-gray-600 dark:focus:border-blue-400',
              error && 'border-red-300',
              className
            )}
          />
        );

      case 'select':
        return (
          <select
            {...fieldProps}
            id={name}
            className={cn(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
              'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
              'text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800',
              'dark:border-gray-600 dark:focus:border-blue-400',
              error && 'border-red-300',
              className
            )}
          >
            <option value="">Sélectionner...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              {...fieldProps}
              id={name}
              type="checkbox"
              checked={checked}
              className={cn(
                'h-4 w-4 rounded border-gray-300 text-blue-600',
                'focus:ring-blue-500',
                error && 'border-red-300',
                className
              )}
            />
            <label htmlFor={name} className="ml-2 text-sm text-gray-900">
              {label}
            </label>
          </div>
        );

      default:
        return (
          <input
            {...fieldProps}
            id={name}
            type={type}
            placeholder={placeholder}
            className={cn(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
              'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
              'text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800',
              'dark:border-gray-600 dark:focus:border-blue-400',
              error && 'border-red-300',
              className
            )}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div>
        {renderField()}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}