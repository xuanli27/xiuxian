'use client'

import Link from 'next/link'
import { SECONDARY_NAV } from '@/config/navigation'
import type { Player } from '@prisma/client'

interface Props {
  player: Player
  canTribulation: boolean
}

export const SecondaryPortals: React.FC<Props> = ({ player, canTribulation }) => {
  return (
    <div className="relative">
      {/* 标题 */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-amber-200 mb-1">仙境入口</h2>
        <p className="text-xs text-slate-500">点击进入各处仙境</p>
      </div>

      {/* 入口网格 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {SECONDARY_NAV.map((portal, index) => {
          // 天劫入口只在可以渡劫时显示
          if (portal.href === '/tribulation' && !canTribulation) {
            return null
          }

          return (
            <Link
              key={portal.href}
              href={portal.href}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-indigo-500/20 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20">
                {/* 图标 */}
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {portal.icon}
                </div>
                
                {/* 标题 */}
                <h3 className="text-sm font-bold text-amber-200 mb-1 group-hover:text-amber-300">
                  {portal.title}
                </h3>
                
                {/* 描述 */}
                <p className="text-xs text-slate-400 line-clamp-2">
                  {portal.description}
                </p>

                {/* 徽章 */}
                {portal.badge && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500/20 border border-red-500/50 rounded-full text-xs text-red-400 animate-pulse">
                    {portal.badge}
                  </div>
                )}

                {/* 悬浮光效 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* 装饰性元素 */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}