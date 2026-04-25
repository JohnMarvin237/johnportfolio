// components/ui/Button.tsx
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

/**
 * Composant Button réutilisable
 * @param variant - Style du bouton (primary, secondary, outline, ghost)
 * @param size - Taille du bouton (sm, md, lg)
 * @param children - Contenu du bouton
 * @param className - Classes CSS additionnelles
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center';

  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabledStyles}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
