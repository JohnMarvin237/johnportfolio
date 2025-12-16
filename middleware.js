import { auth } from '@/lib/auth/config'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'
  const isAuthenticated = !!req.auth
  const isAdmin = req.auth?.user?.role === 'admin'

  // Si c'est une route admin (mais pas la page de login)
  if (isAdminRoute && !isLoginPage) {
    // Rediriger vers login si pas authentifié
    if (!isAuthenticated) {
      const newUrl = new URL('/admin/login', req.nextUrl.origin)
      newUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
      return Response.redirect(newUrl)
    }

    // Rediriger vers home si authentifié mais pas admin
    if (!isAdmin) {
      return Response.redirect(new URL('/', req.nextUrl.origin))
    }
  }

  // Si c'est la page de login et qu'on est déjà authentifié admin
  if (isLoginPage && isAuthenticated && isAdmin) {
    return Response.redirect(new URL('/admin/dashboard', req.nextUrl.origin))
  }
})

export const config = {
  matcher: [
    // Protéger toutes les routes admin
    '/admin/:path*',
    // Exclure les fichiers statiques et API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}