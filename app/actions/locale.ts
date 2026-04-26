'use server'

import { cookies } from 'next/headers'

export async function setLocaleCookie(locale: 'fr' | 'en') {
  const cookieStore = await cookies()
  cookieStore.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    httpOnly: false, // readable client-side for localStorage sync
  })
}
