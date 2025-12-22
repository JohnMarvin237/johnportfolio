// app/admin/login/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion Admin - Portfolio',
  description: 'Page de connexion pour l\'administration du portfolio',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}