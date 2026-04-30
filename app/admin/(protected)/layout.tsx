// app/admin/(protected)/layout.tsx
// Server Component auth guard for all protected admin routes.
// Reads the HttpOnly auth_token cookie directly — no client-side API call needed.
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db/prisma';
import { SESSION_COOKIE_NAME } from '@/lib/auth/session';
import AdminShell from '@/components/admin/AdminShell';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/admin/login');
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    redirect('/admin/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <AdminShell user={{ ...user, name: user.name ?? '' }}>
      {children}
    </AdminShell>
  );
}
