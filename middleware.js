import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth/auth.config'

export default NextAuth(authConfig).auth

export const config = {
  matcher: [
    // Protect admin routes EXCEPT the login page
    '/admin/((?!login).*)',
  ],
}
