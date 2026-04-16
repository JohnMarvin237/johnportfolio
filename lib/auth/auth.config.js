/**
 * Auth config (edge-compatible) — NO Prisma, NO database imports.
 * Used by middleware.js which runs in Edge Runtime.
 * The full config with PrismaAdapter is in config.js.
 */

export const authConfig = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  providers: [], // Providers are added in config.js (they need Prisma)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
    async authorized({ auth, request }) {
      const isLoginPage = request.nextUrl.pathname === '/admin/login'
      const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
      const isAuthenticated = !!auth
      const isAdmin = auth?.user?.role === 'admin'

      // Login page: redirect to dashboard if already authenticated, otherwise allow
      if (isLoginPage) {
        if (isAuthenticated && isAdmin) {
          return Response.redirect(new URL('/admin/dashboard', request.nextUrl.origin))
        }
        return true
      }

      // Other admin routes: require authentication + admin role
      if (isAdminRoute) {
        if (!isAuthenticated) return false
        if (!isAdmin) return Response.redirect(new URL('/', request.nextUrl.origin))
      }

      return true
    },
  },
}
