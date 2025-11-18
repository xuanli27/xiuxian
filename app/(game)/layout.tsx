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
    <div className="min-h-screen bg-surface-950">
      {/* 顶部 - 简洁设计 */}
      <header className="sticky top-0 z-40 bg-surface-900/95 backdrop-blur-md border-b border-border-base">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-xl font-xianxia text-primary-400 hover:text-primary-500 transition-colors"
            >
              <span className="text-2xl">🏔️</span>
              <span>仙欲宗</span>
            </Link>
            
            {/* 主题切换 */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-content-400 hover:text-content-100 hover:bg-surface-800 transition-colors"
              aria-label="切换主题"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-6 pb-24">
        {children}
      </main>

      {/* 底部导航 - 所有设备通用 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface-900/95 backdrop-blur-md border-t border-border-base shadow-lg z-50">
        <div className="container mx-auto px-2">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-1 p-2">
            {GAME_NAV.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-primary-600/20 text-primary-400 scale-105' 
                      : 'text-content-400 hover:text-content-100 hover:bg-surface-800'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs text-center leading-tight">{item.title}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}