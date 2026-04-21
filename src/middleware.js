import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const SESSION_COOKIE = 'admin_session';

export async function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // ── Guard 1: /loginGwi requires ?pass=*** in the URL ──────────────────────
  if (pathname === '/loginGwi') {
    const pass = searchParams.get('pass');

    if (!pass) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // The pass itself is validated server-side during form submission.
    // Here we just ensure *something* is present to avoid exposing the page.
    return NextResponse.next();
  }

  // ── Guard 2: /admin/* requires a valid JWT session cookie ─────────────────
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const payload = await verifyToken(token);

    if (!payload) {
      // Token invalid / expired — clear it and redirect
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }

    // Attach user info to headers for downstream Server Components
    const headers = new Headers(request.headers);
    headers.set('x-user-id', String(payload.id));
    headers.set('x-user-role', String(payload.role));

    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/loginGwi', '/admin/:path*'],
};
