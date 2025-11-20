'use client'

import Link from 'next/link'
import { SECONDARY_NAV } from '@/config/navigation'
import type { Player } from '@/types/database'
import clsx from 'clsx'

interface Props {
  player: Player
  canTribulation: boolean
}

export const SecondaryPortals: React.FC<Props> = ({ player, canTribulation }) => {
  return (
    <div className="relative">
      {/* 标题 */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-primary-200 mb-1 font-xianxia tracking-widest">仙境入口</h2>
        <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-primary-500 to-transparent mx-auto opacity-50"></div>
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
              <div className={clsx(
                "relative h-full bg-surface-900/40 backdrop-blur-sm p-4 rounded-2xl border border-surface-700/50 transition-all duration-500",
                "hover:border-primary-500/50 hover:bg-surface-800/60 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/10",
                "flex flex-col items-center text-center"
              )}>
                {/* 图标 */}
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                  {portal.icon}
                </div>

                {/* 标题 */}
                <h3 className="text-sm font-bold text-content-200 mb-1 group-hover:text-primary-300 transition-colors">
                  {portal.title}
                </h3>

                {/* 描述 */}
                <p className="text-[10px] text-content-400 line-clamp-2 group-hover:text-content-300 transition-colors">
                  {portal.description}
                </p>

                {/* 徽章 */}
                {portal.badge && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-danger-900/80 border border-danger-500/50 rounded-full text-[10px] font-bold text-danger-300 animate-pulse shadow-lg shadow-danger-500/20">
                    {portal.badge}
                  </div>
                )}

                {/* 悬浮光效 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/0 to-secondary-500/0 group-hover:from-primary-500/5 group-hover:to-secondary-500/5 transition-all duration-500 pointer-events-none" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}