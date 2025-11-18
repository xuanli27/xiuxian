import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isGameRoute = req.nextUrl.pathname.startsWith('/dashboard') ||
                      req.nextUrl.pathname.startsWith('/tasks') ||
                      req.nextUrl.pathname.startsWith('/sect') ||
                      req.nextUrl.pathname.startsWith('/inventory') ||
                      req.nextUrl.pathname.startsWith('/cave') ||
                      req.nextUrl.pathname.startsWith('/cultivation') ||
                      req.nextUrl.pathname.startsWith('/leaderboard') ||
                      req.nextUrl.pathname.startsWith('/tribulation');
  
  if (isGameRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (req.nextUrl.pathname.startsWith('/login') && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};