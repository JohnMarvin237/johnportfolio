// components/ui/Card.tsx
import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Composant Card réutilisable
 * @param children - Contenu de la carte
 * @param className - Classes CSS additionnelles
 * @param hover - Activer l'effet hover
 * @param padding - Taille du padding interne
 */
export default function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
}: CardProps) {
  const baseStyles = 'bg-white dark:bg-[#161b22] rounded-xl border border-gray-200 dark:border-[#30363d] shadow-lg';

  const hoverStyles = hover
    ? 'transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:-translate-y-1'
    : '';

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${hoverStyles}
        ${paddings[padding]}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}

/**
 * Card Header - Section d'en-tête de la carte
 */
export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Title - Titre de la carte
 */
export function CardTitle({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 dark:text-white transition-colors ${className}`}>
      {children}
    </h3>
  );
}

/**
 * Card Content - Contenu principal de la carte
 */
export function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-gray-700 dark:text-gray-300 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Footer - Section de pied de page de la carte
 */
export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-4 flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
}
