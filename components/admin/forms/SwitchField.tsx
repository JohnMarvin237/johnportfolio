'use client';
// components/admin/forms/SwitchField.tsx
// Accessible toggle/checkbox for boolean fields.

interface SwitchFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

export default function SwitchField({ label, name, checked, onChange }: SwitchFieldProps) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <button
        type="button"
        id={name}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow
            transform transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer select-none"
        onClick={() => onChange(!checked)}
      >
        {label}
      </label>
    </div>
  );
}
