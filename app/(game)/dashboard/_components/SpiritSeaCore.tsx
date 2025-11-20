'use client'

import React, { useEffect, useRef, useState } from 'react'
import { usePlayer } from '@/hooks/use-player';
import Link from 'next/link'
import { Mountain } from 'lucide-react';

interface Props {
  onMeditate: () => void
  canBreakthrough: boolean
}

export const SpiritSeaCore: React.FC<Props> = ({ onMeditate, canBreakthrough }) => {
  const { player } = usePlayer();
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPressed, setIsPressed] = useState(false)

  const progress = player ? Math.min(100, (player.qi / player.max_qi) * 100) : 0
  const innerDemonLevel = player?.inner_demon ?? 0

  useEffect(() => {
    if (!player || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationId: number
    const particles: {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      life: number
    }[] = []

    const render = () => {
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      // 中央灵核
      const coreSize = 80 + Math.sin(Date.now() / 500) * 8 + (progress / 2)
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, coreSize * 2)

      // 根据心魔调整颜色
      if (innerDemonLevel > 70) {
        gradient.addColorStop(0, 'rgba(220, 38, 38, 0.4)') // danger-600
        gradient.addColorStop(1, 'transparent')
      } else {
        gradient.addColorStop(0, 'rgba(234, 179, 8, 0.4)') // primary-500
        gradient.addColorStop(1, 'transparent')
      }

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, coreSize * 2, 0, Math.PI * 2)
      ctx.fill()

      // 灵核外环
      ctx.beginPath()
      ctx.strokeStyle = innerDemonLevel > 70 ? '#dc2626' : '#eab308'
      ctx.lineWidth = 3
      ctx.arc(w / 2, h / 2, coreSize, 0, Math.PI * 2)
      ctx.stroke()

      // 旋转内环
      ctx.save()
      ctx.translate(w / 2, h / 2)
      ctx.rotate(Date.now() / 1000)
      ctx.beginPath()
      ctx.strokeStyle = innerDemonLevel > 70 ? '#b91c1c' : '#ca8a04'
      ctx.globalAlpha = 0.6
      ctx.setLineDash([15, 15])
      ctx.arc(0, 0, coreSize - 15, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()

      // 灵气粒子
      if (particles.length < 30 + (progress / 3)) {
        const angle = Math.random() * Math.PI * 2
        const dist = 100 + Math.random() * 200
        particles.push({
          x: w / 2 + Math.cos(angle) * dist,
          y: h / 2 + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 4,
          life: 1
        })
      }

      particles.forEach((p, i) => {
        p.x += p.vx + (w / 2 - p.x) * 0.04
        p.y += p.vy + (h / 2 - p.y) * 0.04
        p.life -= 0.008

        const alpha = p.life * (innerDemonLevel > 70 ? 0.6 : 1)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        if (p.life <= 0 || Math.abs(p.x - w / 2) < 10) particles.splice(i, 1)
      })

      animationId = requestAnimationFrame(render)
    }
    render()

    return () => cancelAnimationFrame(animationId)
  }, [player, progress, innerDemonLevel])

  if (!player) return null

  const handleMouseDown = () => {
    setIsPressed(true)
    onMeditate()
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* 识海背景画布 */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* 中央互动区域 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className={`
            relative w-40 h-40 rounded-full
            bg-gradient-to-br from-primary-400/20 to-secondary-600/20
            border-2 border-primary-500/50
            backdrop-blur-sm
            transition-all duration-300
            hover:scale-110 hover:shadow-2xl hover:shadow-primary-500/30
            ${isPressed ? 'scale-95 ring-4 ring-primary-500/30' : ''}
            ${canBreakthrough ? 'animate-pulse shadow-[0_0_30px_rgba(234,179,8,0.6)]' : ''}
          `}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-primary-100 text-sm font-bold text-center px-4 font-xianxia tracking-widest">
              {isPressed ? '观想中...' : '长按观想'}
            </span>
          </div>
        </button>

        {/* 修为进度 */}
        <div className="mt-6 text-center text-content-400 text-xs font-mono bg-surface-900/50 px-3 py-1 rounded-full border border-surface-700 inline-block w-full">
          修为: {Math.floor(player.qi)} / {player.max_qi}
        </div>
      </div>

      {/* 洞府缩影 - 右下角 */}
      <Link
        href="/cave"
        className="absolute bottom-32 right-8 pointer-events-auto group"
      >
        <div className="relative bg-surface-900/50 p-4 rounded-2xl border border-surface-700 hover:border-primary-500/50 transition-all duration-300 hover:scale-105">
          <div className="text-4xl group-hover:scale-110 transition-transform filter drop-shadow-lg mb-1">
            <Mountain size={32} className="text-content-200 group-hover:text-primary-400 transition-colors" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-xs font-bold text-content-400 group-hover:text-primary-300 transition-colors bg-surface-950/80 px-2 py-0.5 rounded-full">
              洞府 {player.cave_level}级
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}