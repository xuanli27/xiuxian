'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Zap, Database, ShieldAlert, Coins, Crown, Sparkles, Menu, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui'
import { SpiritSeaCore } from './SpiritSeaCore'
import { SecondaryPortals } from './SecondaryPortals'
import clsx from 'clsx'
import { usePlayer } from '@/hooks/use-player'
import { getCurrentPlayerRealmInfo } from '@/features/cultivation/actions'
import { REALM_CONFIG } from '@/config/game'
import { AnimatePresence, motion } from 'framer-motion'

export const Dashboard: React.FC = () => {
  const {
    player,
    isLoading: isPlayerLoading,
    meditate,
    isMeditating,
    breakthrough,
    isBreakingThrough
  } = usePlayer()

  const { data: realmInfo, isLoading: isRealmLoading } = useQuery({
    queryKey: ['realm-info'],
    queryFn: () => getCurrentPlayerRealmInfo(),
    enabled: !!player,
  })

  const [showMenu, setShowMenu] = useState(false)

  if (isPlayerLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <div className="text-primary-200 text-xl font-xianxia tracking-widest animate-pulse">
            天地灵气汇聚中...
          </div>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-surface-950 p-4">
        <div className="max-w-md w-full bg-surface-900/50 backdrop-blur-xl p-8 rounded-3xl border border-surface-800 shadow-2xl">
          <h2 className="text-3xl font-bold text-primary-400 mb-4 font-xianxia">踏入仙途</h2>
          <p className="text-content-400 mb-8 leading-relaxed">
            道友尚未在此界留下足迹，何不立即重塑肉身，开启修仙之旅？
          </p>
          <Button
            onClick={() => window.location.href = '/register'}
            className="w-full py-6 text-lg bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-lg shadow-primary-500/20"
          >
            重塑肉身
          </Button>
        </div>
      </div>
    );
  }

  if (isRealmLoading || !realmInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <div className="text-primary-200/80 text-lg font-xianxia tracking-widest animate-pulse">
            感悟境界中...
          </div>
        </div>
      </div>
    )
  }

  const canBreakthrough = player.qi >= player.maxQi * 0.8
  const progress = Math.min(100, (player.qi / player.maxQi) * 100)
  const displayRank = `${realmInfo.name} ${player.level}重`

  return (
    <div className="relative min-h-screen -m-8 -mb-28 overflow-hidden bg-surface-950 text-content-100 font-sans selection:bg-primary-500/30">

      {/* 沉浸式背景层 */}
      <div className="absolute inset-0 z-0">
        <SpiritSeaCore
          onMeditate={() => meditate({ duration: 10 })}
          canBreakthrough={canBreakthrough}
        />
        {/* 氛围遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-surface-950/80 via-transparent to-surface-950/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      </div>

      {/* HUD UI 层 */}
      <div className="relative z-10 h-full flex flex-col justify-between min-h-screen pb-32 pointer-events-none">

        {/* 顶部 HUD */}
        <header className="pt-6 px-6 flex justify-between items-start pointer-events-auto">
          {/* 玩家状态卡片 */}
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-surface-900/80 backdrop-blur-md border border-surface-700/50 flex items-center justify-center overflow-hidden shadow-2xl shadow-black/50 group-hover:border-primary-500/50 transition-colors duration-500">
                {(player.avatar?.startsWith('data:') || player.avatar?.startsWith('http')) ? (
                  <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl filter drop-shadow-lg">{player.avatar || '🧘'}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-surface-900 rounded-full flex items-center justify-center border border-surface-700 text-[10px] font-bold text-primary-400 shadow-lg">
                {player.level}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-content-100 font-xianxia tracking-wide drop-shadow-md">
                  {player.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] text-primary-300 font-medium backdrop-blur-sm">
                  {realmInfo.name}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-content-400 font-mono">
                <span className="flex items-center gap-1">
                  <Coins size={12} className="text-amber-400" />
                  {player.spiritStones}
                </span>
                <span className="w-px h-3 bg-surface-700" />
                <span className="flex items-center gap-1">
                  <Database size={12} className="text-blue-400" />
                  {Math.floor(player.qi)}
                </span>
              </div>
            </div>
          </div>

          {/* 右侧功能入口 (移动端折叠) */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="lg:hidden p-3 rounded-xl bg-surface-900/80 backdrop-blur-md border border-surface-700/50 text-content-200 hover:bg-surface-800 transition-all active:scale-95"
            >
              {showMenu ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="hidden lg:flex gap-3">
              <StatPill
                icon={<ShieldAlert size={14} />}
                label="心魔"
                value={`${Math.floor(player.innerDemon)}%`}
                color={player.innerDemon > 50 ? "text-danger-400" : "text-emerald-400"}
                alert={player.innerDemon > 80}
              />
              <StatPill
                icon={<Crown size={14} />}
                label="贡献"
                value={player.contribution}
                color="text-purple-400"
              />
            </div>
          </div>
        </header>

        {/* 移动端菜单 */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 right-6 z-50 flex flex-col gap-2 pointer-events-auto lg:hidden"
            >
              <StatPill
                icon={<ShieldAlert size={14} />}
                label="心魔"
                value={`${Math.floor(player.innerDemon)}%`}
                color={player.innerDemon > 50 ? "text-danger-400" : "text-emerald-400"}
                alert={player.innerDemon > 80}
                className="bg-surface-900/95 shadow-xl"
              />
              <StatPill
                icon={<Crown size={14} />}
                label="贡献"
                value={player.contribution}
                color="text-purple-400"
                className="bg-surface-900/95 shadow-xl"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 中间留白，展示灵核 */}
        <div className="flex-1 flex items-center justify-center pointer-events-none">
          {/* 可以在这里添加一些浮动的文字提示或特效 */}
        </div>

        {/* 底部控制栏 */}
        <footer className="px-6 pb-8 pointer-events-auto">
          <div className="flex flex-col lg:flex-row items-end gap-6">

            {/* 左侧：次级入口 (折叠式/卡片式) */}
            <div className="w-full lg:w-auto lg:flex-1 order-2 lg:order-1">
              <div className="bg-surface-900/40 backdrop-blur-md border border-surface-700/30 rounded-3xl p-4 hover:bg-surface-900/60 transition-colors duration-300">
                <SecondaryPortals player={player} canTribulation={canBreakthrough} />
              </div>
            </div>

            {/* 右侧：核心操作 (突破/修炼) */}
            <div className="w-full lg:w-96 order-1 lg:order-2 flex flex-col gap-4">

              {/* 进度条卡片 */}
              <div className="bg-surface-900/80 backdrop-blur-xl border border-surface-700/50 rounded-3xl p-5 shadow-2xl relative overflow-hidden group hover:border-primary-500/30 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-medium text-content-300">当前修为</span>
                    <span className="text-2xl font-bold font-mono text-primary-400">{progress.toFixed(1)}%</span>
                  </div>

                  <div className="h-2 bg-surface-950 rounded-full overflow-hidden border border-surface-800/50">
                    <div
                      className="h-full bg-gradient-to-r from-primary-600 via-primary-400 to-secondary-400 relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>

                  <div className="flex justify-between mt-2 text-[10px] text-content-500 font-mono uppercase tracking-wider">
                    <span>{Math.floor(player.qi)} QI</span>
                    <span>{player.maxQi} MAX</span>
                  </div>
                </div>
              </div>

              {/* 主按钮 */}
              <Button
                size="lg"
                disabled={!canBreakthrough || isBreakingThrough}
                onClick={() => breakthrough()}
                className={clsx(
                  "w-full h-16 text-lg font-bold font-xianxia tracking-widest relative overflow-hidden transition-all duration-500 rounded-2xl shadow-xl",
                  canBreakthrough
                    ? "bg-gradient-to-r from-danger-600 to-orange-600 hover:from-danger-500 hover:to-orange-500 shadow-danger-900/50 hover:shadow-danger-600/50 hover:scale-[1.02]"
                    : "bg-surface-800 text-content-400 border border-surface-700 hover:bg-surface-700"
                )}
              >
                {isBreakingThrough ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <Sparkles className="animate-spin" /> 突破天道...
                  </span>
                ) : canBreakthrough ? (
                  <span className="flex items-center gap-2">
                    <Zap className="animate-bounce" /> 突破境界
                  </span>
                ) : (
                  <span className="flex items-center gap-2 opacity-50">
                    <Database size={18} /> 积累底蕴
                  </span>
                )}

                {canBreakthrough && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)] animate-pulse pointer-events-none" />
                )}
              </Button>

            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

// 辅助组件：顶部状态胶囊
const StatPill = ({ icon, label, value, color, alert, className }: any) => (
  <div className={clsx(
    "flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-900/60 backdrop-blur-md border border-surface-700/50",
    alert && "border-danger-500/50 bg-danger-900/20 animate-pulse",
    className
  )}>
    <span className={clsx("opacity-80", color)}>{icon}</span>
    <div className="flex flex-col leading-none">
      <span className="text-[8px] text-content-500 uppercase tracking-wider mb-0.5">{label}</span>
      <span className={clsx("text-xs font-bold font-mono", color)}>{value}</span>
    </div>
  </div>
)