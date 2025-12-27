// components/admin/BilingualFormField.tsx
import { cn } from '@/lib/utils';

interface BilingualFormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'url';
  placeholder?: string;
  placeholderFr?: string;
  placeholderEn?: string;
  required?: boolean;
  errorFr?: string;
  errorEn?: string;
  register?: any; // React Hook Form register
  className?: string;
  rows?: number; // For textarea
}

export default function BilingualFormField({
  label,
  name,
  type = 'text',
  placeholder,
  placeholderFr,
  placeholderEn,
  required = false,
  errorFr,
  errorEn,
  register,
  className,
  rows = 4,
}: BilingualFormFieldProps) {
  const renderField = (lang: 'fr' | 'en') => {
    const fieldName = `${name}_${lang}`;
    const fieldProps = register ? register(fieldName) : { name: fieldName };
    const fieldPlaceholder = lang === 'fr'
      ? (placeholderFr || `${placeholder} (Français)`)
      : (placeholderEn || `${placeholder} (English)`);
    const error = lang === 'fr' ? errorFr : errorEn;

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...fieldProps}
            id={fieldName}
            rows={rows}
            placeholder={fieldPlaceholder}
            className={cn(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
              'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
              error && 'border-red-300',
              className
            )}
          />
        );

      default:
        return (
          <input
            {...fieldProps}
            id={fieldName}
            type={type}
            placeholder={fieldPlaceholder}
            className={cn(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm',
              'focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
              error && 'border-red-300',
              className
            )}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* French Field */}
        <div>
          <label htmlFor={`${name}_fr`} className="block text-sm text-gray-700 mb-1">
            <span className="inline-flex items-center gap-1">
              🇫🇷 Français
              {required && <span className="text-xs text-gray-500">(requis)</span>}
            </span>
          </label>
          {renderField('fr')}
          {errorFr && <p className="mt-1 text-sm text-red-600">{errorFr}</p>}
        </div>

        {/* English Field */}
        <div>
          <label htmlFor={`${name}_en`} className="block text-sm text-gray-700 mb-1">
            <span className="inline-flex items-center gap-1">
              🇬🇧 English
              {!required && <span className="text-xs text-gray-500">(optional)</span>}
            </span>
          </label>
          {renderField('en')}
          {errorEn && <p className="mt-1 text-sm text-red-600">{errorEn}</p>}
        </div>
      </div>
    </div>
  );
}