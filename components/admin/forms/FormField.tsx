'use client';
// components/admin/forms/FormField.tsx
// Label + input wrapper that forwards props to the shared Input primitive.
import Input, { type InputProps } from '@/components/ui/Input';

// name comes from register() spread in most usages, so override as optional
interface FormFieldProps extends Omit<InputProps, 'name'> {
  label: string;
  name?: string;
  error?: string;
}

export default function FormField({ label, error, name = '', ...inputProps }: FormFieldProps) {
  return (
    <Input
      label={label}
      error={error}
      name={name}
      {...inputProps}
    />
  );
}
