'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GAME_NAV } from '@/config/navigation'
import { useTheme } from '@/hooks/use-theme'
import { Moon, Sun, Mountain } from 'lucide-react'
import clsx from 'clsx'

export default function GameLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-surface-950 text-content-200 selection:bg-primary-500/30">
      {/* 顶部 - 极简设计 */}
      <header className="sticky top-0 z-40 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - 修仙风格 */}
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                <Mountain size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold font-xianxia bg-gradient-to-r from-primary-200 via-primary-100 to-primary-200 bg-clip-text text-transparent">
                  仙欲宗
                </span>
                <span className="text-[10px] text-content-400 tracking-widest">摸鱼修仙录</span>
              </div>
            </Link>

            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-content-400 hover:text-primary-300 hover:bg-surface-800 transition-all"
              aria-label="切换主题"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8 pb-32 min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* 底部导航 - 修仙风格 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-surface-950/90 backdrop-blur-xl border-t border-surface-800 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-2 py-2">
              {GAME_NAV.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all duration-300 relative overflow-hidden group",
                      isActive
                        ? "text-primary-300"
                        : "text-content-500 hover:text-content-200 hover:bg-surface-900"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 to-transparent opacity-50" />
                    )}
                    <span className={clsx(
                      "text-2xl transition-transform duration-300",
                      isActive ? "scale-110 -translate-y-1 filter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" : "group-hover:scale-105"
                    )}>
                      {item.icon}
                    </span>
                    <span className={clsx(
                      "text-[10px] font-medium text-center leading-tight transition-colors",
                      isActive ? "font-bold" : ""
                    )}>
                      {item.title}
                    </span>

                    {isActive && (
                      <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-400 shadow-[0_0_5px_rgba(234,179,8,0.8)]" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}