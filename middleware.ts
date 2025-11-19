import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // 简化的认证检查 - 只检查 session cookie 是否存在
  const sessionToken = req.cookies.get('authjs.session-token') || req.cookies.get('__Secure-authjs.session-token');
  const isLoggedIn = !!sessionToken;
  
  const pathname = req.nextUrl.pathname;
  
  const isGameRoute = pathname.startsWith('/dashboard') ||
                      pathname.startsWith('/tasks') ||
                      pathname.startsWith('/sect') ||
                      pathname.startsWith('/inventory') ||
                      pathname.startsWith('/cave') ||
                      pathname.startsWith('/cultivation') ||
                      pathname.startsWith('/leaderboard') ||
                      pathname.startsWith('/tribulation');
  
  // 未登录用户访问游戏路由，重定向到登录页
  if (isGameRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // 已登录用户访问登录页，重定向到 dashboard
  if (pathname.startsWith('/login') && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};