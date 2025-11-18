'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GAME_NAV } from '@/config/navigation'
import { useTheme } from '@/hooks/use-theme'
import { Moon, Sun } from 'lucide-react'

export default function GameLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950">
      {/* 顶部 - 极简设计 */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-indigo-500/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - 修仙风格 */}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">🏔️</span>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
                  仙欲宗
                </span>
                <span className="text-xs text-slate-400">摸鱼修仙录</span>
              </div>
            </Link>
            
            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-400 hover:text-amber-300 hover:bg-slate-800/50 transition-all"
              aria-label="切换主题"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8 pb-28 min-h-[calc(100vh-8rem)]">
        {children}
      </main>

      {/* 底部导航 - 修仙风格 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-slate-900/90 backdrop-blur-xl border-t border-indigo-500/30 shadow-2xl">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-2 py-3">
              {GAME_NAV.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-br from-amber-500/20 to-yellow-600/20 text-amber-300 scale-105 shadow-lg shadow-amber-500/20' 
                        : 'text-slate-400 hover:text-amber-200 hover:bg-slate-800/50 hover:scale-105'
                      }
                    `}
                  >
                    <span className={`text-2xl ${isActive ? 'animate-pulse' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="text-xs font-medium text-center leading-tight">
                      {item.title}
                    </span>
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