// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth-helpers';
import { AuthProvider } from '@/lib/hooks/useAuth';
import Sidebar from '@/components/admin/Sidebar';

export const metadata = {
  title: 'Admin Dashboard - Portfolio',
  description: 'Interface d\'administration du portfolio',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication server-side
  const user = await getCurrentUser();

  // Redirect if not authenticated
  if (!user) {
    redirect('/admin/login');
  }

  // Check if user is admin
  if (user.role !== 'admin') {
    redirect('/');
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}