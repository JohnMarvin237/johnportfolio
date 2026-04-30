'use client';
// components/admin/forms/BilingualField.tsx
// Renders three inputs (base, FR, EN) for a bilingual field.
// `register` is typed as UseFormRegister<any> because this component is generic
// across multiple entity forms — narrowing to a specific schema would require
// a generic type parameter that adds complexity without catching real bugs here.
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import FormField from './FormField';

interface BilingualFieldProps {
  label: string;
  baseName: string;
  frName: string;
  enName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  errors: FieldErrors;
  type?: 'text' | 'textarea';
  required?: boolean;
}

function getError(errors: FieldErrors, name: string): string | undefined {
  const parts = name.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = errors;
  for (const part of parts) {
    current = current?.[part];
  }
  return current?.message as string | undefined;
}

export default function BilingualField({
  label,
  baseName,
  frName,
  enName,
  register,
  errors,
  type = 'text',
  required = false,
}: BilingualFieldProps) {
  return (
    <div className="mb-2">
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</p>
      <div className="pl-3 border-l-2 border-gray-200 dark:border-gray-600 space-y-0">
        <FormField
          label="Base"
          type={type}
          required={required}
          error={getError(errors, baseName)}
          {...register(baseName)}
        />
        <FormField
          label="Français (FR)"
          type={type}
          error={getError(errors, frName)}
          {...register(frName)}
        />
        <FormField
          label="Anglais (EN)"
          type={type}
          error={getError(errors, enName)}
          {...register(enName)}
        />
      </div>
    </div>
  );
}
