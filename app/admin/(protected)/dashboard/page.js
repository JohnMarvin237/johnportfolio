import { prisma } from '@/lib/db/prisma'
import Card from '@/components/ui/Card'
import Link from 'next/link'

async function getDashboardStats() {
  try {
    const [
      projectsCount,
      experiencesCount,
      educationCount,
      certificationsCount,
      volunteerCount,
      messagesCount,
      unreadMessagesCount
    ] = await Promise.all([
      prisma.project.count(),
      prisma.experience.count(),
      prisma.education.count(),
      prisma.certification.count(),
      prisma.volunteer.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } })
    ])

    return {
      projectsCount,
      experiencesCount,
      educationCount,
      certificationsCount,
      volunteerCount,
      messagesCount,
      unreadMessagesCount
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      projectsCount: 0,
      experiencesCount: 0,
      educationCount: 0,
      certificationsCount: 0,
      volunteerCount: 0,
      messagesCount: 0,
      unreadMessagesCount: 0
    }
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      name: 'Projets',
      value: stats.projectsCount,
      icon: '📁',
      href: '/admin/projects',
      color: 'bg-blue-500'
    },
    {
      name: 'Expériences',
      value: stats.experiencesCount,
      icon: '💼',
      href: '/admin/experiences',
      color: 'bg-green-500'
    },
    {
      name: 'Formation',
      value: stats.educationCount,
      icon: '🎓',
      href: '/admin/education',
      color: 'bg-purple-500'
    },
    {
      name: 'Certifications',
      value: stats.certificationsCount,
      icon: '🏆',
      href: '/admin/certifications',
      color: 'bg-yellow-500'
    },
    {
      name: 'Bénévolat',
      value: stats.volunteerCount,
      icon: '🤝',
      href: '/admin/volunteer',
      color: 'bg-pink-500'
    },
    {
      name: 'Messages',
      value: `${stats.unreadMessagesCount}/${stats.messagesCount}`,
      icon: '📧',
      href: '/admin/messages',
      color: 'bg-indigo-500',
      label: 'Non lus / Total'
    }
  ]

  return (
    <>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Vue d'ensemble de votre portfolio
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card hover className="relative overflow-hidden">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${stat.color} text-white rounded-md p-3`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        {stat.label && (
                          <div className="ml-2 text-sm text-gray-500">
                            {stat.label}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/projects/new"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className="flex-shrink-0">
              <span className="text-2xl">➕</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">
                Nouveau projet
              </p>
            </div>
          </Link>

          <Link
            href="/admin/experiences/new"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className="flex-shrink-0">
              <span className="text-2xl">➕</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">
                Nouvelle expérience
              </p>
            </div>
          </Link>

          <Link
            href="/admin/certifications/new"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className="flex-shrink-0">
              <span className="text-2xl">➕</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">
                Nouvelle certification
              </p>
            </div>
          </Link>

          <Link
            href="/admin/messages"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
          >
            <div className="flex-shrink-0">
              <span className="text-2xl">📨</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">
                Voir les messages
              </p>
              {stats.unreadMessagesCount > 0 && (
                <p className="text-xs text-gray-500">
                  {stats.unreadMessagesCount} non lus
                </p>
              )}
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}