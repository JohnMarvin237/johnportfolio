import { auth } from '@/lib/auth/config'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import MessagesList from './MessagesList'

export default async function MessagesPage() {
  const session = await auth()
  if (!session || session.user?.role !== 'admin') redirect('/admin/login')
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {messages.length} message{messages.length > 1 ? 's' : ''} - {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
        </p>
      </div>
      <MessagesList initialMessages={JSON.parse(JSON.stringify(messages))} />
    </>
  )
}
