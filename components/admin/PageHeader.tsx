// components/admin/PageHeader.tsx
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          )}
        </div>

        {action && (
          <div className="mt-4 sm:mt-0">
            {action.href ? (
              <Link href={action.href}>
                <Button variant="primary">
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              </Link>
            ) : (
              <Button variant="primary" onClick={action.onClick}>
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}