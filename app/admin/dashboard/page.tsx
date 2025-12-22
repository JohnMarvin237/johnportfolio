// app/admin/dashboard/page.tsx
import StatsCard from '@/components/admin/StatsCard';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { prisma } from '@/lib/db/prisma';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

async function getDashboardStats() {
  const [
    projectsCount,
    experiencesCount,
    educationCount,
    certificationsCount,
    volunteerCount,
    messagesCount,
    unreadMessagesCount,
    featuredProjectsCount,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.certification.count(),
    prisma.volunteer.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.project.count({ where: { featured: true } }),
  ]);

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

  return {
    stats: {
      projectsCount,
      experiencesCount,
      educationCount,
      certificationsCount,
      volunteerCount,
      messagesCount,
      unreadMessagesCount,
      featuredProjectsCount,
    },
    recentMessages,
    recentProjects,
  };
}

export default async function DashboardPage() {
  const { stats, recentMessages, recentProjects } = await getDashboardStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-2 text-gray-600">
          Vue d'ensemble de votre portfolio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Projets"
          value={stats.projectsCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />

        <StatsCard
          title="Expériences"
          value={stats.experiencesCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />

        <StatsCard
          title="Messages"
          value={stats.messagesCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          trend={
            stats.unreadMessagesCount > 0
              ? { value: `${stats.unreadMessagesCount} non lu${stats.unreadMessagesCount > 1 ? 's' : ''}`, isPositive: true }
              : undefined
          }
        />

        <StatsCard
          title="Certifications"
          value={stats.certificationsCount}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Formations"
          value={stats.educationCount}
          className="md:col-span-1"
        />
        <StatsCard
          title="Bénévolat"
          value={stats.volunteerCount}
          className="md:col-span-1"
        />
        <StatsCard
          title="Projets Featured"
          value={stats.featuredProjectsCount}
          className="md:col-span-1"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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