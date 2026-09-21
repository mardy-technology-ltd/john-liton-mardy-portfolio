import { NextResponse } from 'next/server';
import { verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;
    const isLoginPage = pathname === '/admin/login';

    // If user is already authenticated and visits /admin/login, redirect to /admin dashboard
    if (isLoginPage) {
      if (session) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // If user is NOT authenticated and tries to access /admin or /admin/*, redirect to /admin/login
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      if (pathname !== '/admin') {
        loginUrl.searchParams.set('from', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
