import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const hasPlayer = req.auth?.user?.hasPlayer;
  const isRegisterRoute = req.nextUrl.pathname.startsWith('/register');
  const isGameRoute = req.nextUrl.pathname.startsWith('/dashboard') ||
                      req.nextUrl.pathname.startsWith('/tasks') ||
                      req.nextUrl.pathname.startsWith('/sect') ||
                      req.nextUrl.pathname.startsWith('/inventory') ||
                      req.nextUrl.pathname.startsWith('/cave') ||
                      req.nextUrl.pathname.startsWith('/cultivation') ||
                      req.nextUrl.pathname.startsWith('/leaderboard') ||
                      req.nextUrl.pathname.startsWith('/tribulation');
  
  // 未登录用户访问游戏路由，重定向到登录页
  if (isGameRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // 已登录但没有 Player 的用户访问游戏路由，重定向到注册页
  if (isGameRoute && isLoggedIn && !hasPlayer) {
    return NextResponse.redirect(new URL('/register', req.url));
  }
  
  // 已登录且有 Player 的用户访问登录页，重定向到 dashboard
  if (req.nextUrl.pathname.startsWith('/login') && isLoggedIn && hasPlayer) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // 已登录但没有 Player 的用户访问登录页，重定向到注册页
  if (req.nextUrl.pathname.startsWith('/login') && isLoggedIn && !hasPlayer) {
    return NextResponse.redirect(new URL('/register', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};