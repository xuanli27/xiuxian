import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isLoggedIn = !!user
  const isRegisterRoute = request.nextUrl.pathname.startsWith('/register')
  const isLoginRoute = request.nextUrl.pathname.startsWith('/login')
  const isAuthCallback = request.nextUrl.pathname.startsWith('/auth/callback')
  const isGameRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                      request.nextUrl.pathname.startsWith('/tasks') ||
                      request.nextUrl.pathname.startsWith('/sect') ||
                      request.nextUrl.pathname.startsWith('/inventory') ||
                      request.nextUrl.pathname.startsWith('/cave') ||
                      request.nextUrl.pathname.startsWith('/cultivation') ||
                      request.nextUrl.pathname.startsWith('/leaderboard') ||
                      request.nextUrl.pathname.startsWith('/tribulation') ||
                      request.nextUrl.pathname.startsWith('/events')

  // 允许认证回调
  if (isAuthCallback) {
    return supabaseResponse
  }

  // 未登录用户访问游戏路由，重定向到登录页
  if (isGameRoute && !isLoggedIn) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 已登录用户访问游戏路由，检查是否有角色
  if (isGameRoute && isLoggedIn) {
    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!player) {
      const url = request.nextUrl.clone()
      url.pathname = '/register'
      return NextResponse.redirect(url)
    }
  }

  // 已登录用户访问登录页，检查是否有角色
  if (isLoginRoute && isLoggedIn) {
    const { data: player } = await supabase
      .from('players')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const url = request.nextUrl.clone()
    url.pathname = player ? '/dashboard' : '/register'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}