// app/admin/dashboard/page.tsx
import DashboardStats from '@/components/admin/DashboardStats';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { prisma } from '@/lib/db/prisma';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  // Get recent messages
  const recentMessages = await prisma.contactMessage.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      subject: true,
      createdAt: true,
      read: true,
    },
  });

  // Get recent projects
  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true,
      featured: true,
    },
  });

  // Get top pages
  const topPages = await prisma.pageView.groupBy({
    by: ['path'],
    _count: {
      path: true,
    },
    orderBy: {
      _count: {
        path: 'desc',
      },
    },
    take: 5,
  });

  return {
    recentMessages,
    recentProjects,
    topPages: topPages.map(page => ({
      path: page.path,
      views: page._count.path,
    })),
  };
}

export default async function DashboardPage() {
  const { recentMessages, recentProjects, topPages } = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-2 text-gray-600">
          Vue d'ensemble de votre portfolio
        </p>
      </div>

      <DashboardStats />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Messages récents</h2>
            <Link href="/admin/messages">
              <Button variant="outline" size="sm">Voir tout</Button>
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <Link
                  key={message.id}
                  href={`/admin/messages/${message.id}`}
                  className="px-6 py-4 hover:bg-gray-50 block transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {message.name}
                        </p>
                        {!message.read && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Nouveau
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {message.subject || 'Sans objet'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(message.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="px-6 py-4 text-sm text-gray-500">Aucun message</p>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Projets récents</h2>
            <Link href="/admin/projects">
              <Button variant="outline" size="sm">Voir tout</Button>
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="px-6 py-4 hover:bg-gray-50 block transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {project.title}
                        </p>
                        {project.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="px-6 py-4 text-sm text-gray-500">Aucun projet</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pages les plus visitées</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {topPages.length > 0 ? (
            topPages.map((page, index) => (
              <div key={index} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-8">#{index + 1}</span>
                    <p className="text-sm font-medium text-gray-900">{page.path}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{page.views} vues</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((page.views / topPages[0].views) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="px-6 py-4 text-sm text-gray-500">Aucune donnée disponible</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/projects/new">
            <Button variant="outline" className="w-full justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouveau projet
            </Button>
          </Link>
          <Link href="/admin/experiences/new">
            <Button variant="outline" className="w-full justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle expérience
            </Button>
          </Link>
          <Link href="/admin/certifications/new">
            <Button variant="outline" className="w-full justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle certification
            </Button>
          </Link>
          <Link href="/admin/messages">
            <Button variant="outline" className="w-full justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Voir les messages
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}