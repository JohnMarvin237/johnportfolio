'use client'

import { signOut } from 'next-auth/react'
import Button from '@/components/ui/Button'

interface AdminHeaderProps {
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Welcome message */}
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Bienvenue, {user?.name || user?.email || 'Admin'}
            </h2>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Profile info */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {user?.email}
            </div>

            {/* Logout button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}