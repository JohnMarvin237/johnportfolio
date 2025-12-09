// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for proper class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string | null | undefined, locale = 'fr-CA'): string {
  if (!date) return 'Présent';

  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
  });
}

/**
 * Format date range
 */
export function formatDateRange(
  startDate: Date | string,
  endDate?: Date | string | null,
  locale = 'fr-CA'
): string {
  const start = formatDate(startDate, locale);
  const end = endDate ? formatDate(endDate, locale) : 'Présent';

  return `${start} - ${end}`;
}

/**
 * Calculate duration between two dates
 */
export function calculateDuration(
  startDate: Date | string,
  endDate?: Date | string | null
): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = endDate
    ? (typeof endDate === 'string' ? new Date(endDate) : endDate)
    : new Date();

  const months = (end.getFullYear() - start.getFullYear()) * 12
    + (end.getMonth() - start.getMonth());

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${months} mois`;
  }

  if (remainingMonths === 0) {
    return `${years} an${years > 1 ? 's' : ''}`;
  }

  return `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Slugify string for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Parse error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Une erreur est survenue';
}

/**
 * Delay function for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
