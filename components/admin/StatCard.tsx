'use client';
// components/admin/StatCard.tsx
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: number;
  href?: string;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, href, icon }: StatCardProps) {
  const content = (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow">
      {icon && (
        <div className="flex-shrink-0 text-primary-500 dark:text-primary-400">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
