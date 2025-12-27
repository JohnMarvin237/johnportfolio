// app/auth/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentification - Portfolio',
  description: 'Page d\'authentification du portfolio',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}