'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/stores/game-store'
import Link from 'next/link'

interface Props {
  onMeditate: () => void
  canBreakthrough: boolean
}

export const SpiritSeaCore: React.FC<Props> = ({ onMeditate, canBreakthrough }) => {
  const player = useGameStore((state) => state.player)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPressed, setIsPressed] = useState(false)
  
  if (!player) return null
  
  const progress = Math.min(100, (player.qi / player.maxQi) * 100)
  const innerDemonLevel = player.innerDemon

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationId: number
    let particles: any[] = []
    
    const render = () => {
      const w = canvas.width
      const h = canvas.height
      
      ctx.clearRect(0, 0, w, h)
      
      // 中央灵核
      const coreSize = 80 + Math.sin(Date.now() / 500) * 8 + (progress / 2)
      const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, coreSize * 2)
      
      // 根据心魔调整颜色
      if (innerDemonLevel > 70) {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)')
        gradient.addColorStop(1, 'transparent')
      } else {
        gradient.addColorStop(0, 'rgba(251, 191, 36, 0.4)')
        gradient.addColorStop(1, 'transparent')
      }
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(w/2, h/2, coreSize * 2, 0, Math.PI*2)
      ctx.fill()

      // 灵核外环
      ctx.beginPath()
      ctx.strokeStyle = innerDemonLevel > 70 ? '#ef4444' : '#fbbf24'
      ctx.lineWidth = 3
      ctx.arc(w/2, h/2, coreSize, 0, Math.PI*2)
      ctx.stroke()

      // 旋转内环
      ctx.save()
      ctx.translate(w/2, h/2)
      ctx.rotate(Date.now() / 1000)
      ctx.beginPath()
      ctx.strokeStyle = innerDemonLevel > 70 ? '#dc2626' : '#f59e0b'
      ctx.globalAlpha = 0.6
      ctx.setLineDash([15, 15])
      ctx.arc(0, 0, coreSize - 15, 0, Math.PI*2)
      ctx.stroke()
      ctx.restore()

      // 灵气粒子
      if (particles.length < 30 + (progress/3)) {
        const angle = Math.random() * Math.PI * 2
        const dist = 100 + Math.random() * 200
        particles.push({
          x: w/2 + Math.cos(angle) * dist,
          y: h/2 + Math.sin(angle) * dist,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 4,
          life: 1
        })
      }

      particles.forEach((p, i) => {
        p.x += p.vx + (w/2 - p.x) * 0.04
        p.y += p.vy + (h/2 - p.y) * 0.04
        p.life -= 0.008
        
        const alpha = p.life * (innerDemonLevel > 70 ? 0.6 : 1)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2)
        ctx.fill()

        if (p.life <= 0 || Math.abs(p.x - w/2) < 10) particles.splice(i, 1)
      })

      animationId = requestAnimationFrame(render)
    }
    render()

    return () => cancelAnimationFrame(animationId)
  }, [progress, innerDemonLevel])

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
            bg-gradient-to-br from-amber-400/20 to-yellow-600/20
            border-2 border-amber-500/50
            backdrop-blur-sm
            transition-all duration-300
            hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/30
            ${isPressed ? 'scale-95' : ''}
            ${canBreakthrough ? 'animate-pulse' : ''}
          `}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-amber-200 text-sm font-bold text-center px-4">
              {isPressed ? '观想中...' : '长按观想'}
            </span>
          </div>
        </button>
        
        {/* 修为进度 */}
        <div className="mt-4 text-center text-slate-400 text-sm">
          修为: {Math.floor(player.qi)} / {player.maxQi}
        </div>
      </div>

      {/* 洞府缩影 - 右下角 */}
      <Link 
        href="/cave"
        className="absolute bottom-32 right-8 pointer-events-auto group"
      >
        <div className="relative">
          <div className="text-6xl group-hover:scale-110 transition-transform filter drop-shadow-lg">
            🏔️
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-xs text-slate-400 group-hover:text-amber-300 transition-colors">
              洞府 {player.caveLevel}级
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}