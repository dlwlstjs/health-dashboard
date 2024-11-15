import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAuthenticated(req: NextRequest) {
  const token = req.cookies.get('authToken');
  return !!token;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return NextResponse.next();
  }

  if (!isAuthenticated(req)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'], 
};
