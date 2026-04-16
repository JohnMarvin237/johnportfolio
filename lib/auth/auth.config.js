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
      const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
      const isLoginPage = request.nextUrl.pathname === '/admin/login'
      const isAuthenticated = !!auth
      const isAdmin = auth?.user?.role === 'admin'

      if (isAdminRoute && !isLoginPage) {
        if (!isAuthenticated) return false
        if (!isAdmin) return Response.redirect(new URL('/', request.nextUrl.origin))
      }

      if (isLoginPage && isAuthenticated && isAdmin) {
        return Response.redirect(new URL('/admin/dashboard', request.nextUrl.origin))
      }

      return true
    },
  },
}
