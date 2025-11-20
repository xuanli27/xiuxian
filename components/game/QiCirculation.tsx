'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface QiCirculationProps {
    className?: string
    isCultivating?: boolean
    realm?: string
}

// 周天运行路径点 (任督二脉 - 小周天)
const MERIDIAN_PATH = [
    { x: 50, y: 75 },  // 1. 会阴 (起点，任脉起始)
    { x: 50, y: 65 },  // 2. 丹田 (气海)
    { x: 50, y: 55 },  // 3. 中脘
    { x: 50, y: 45 },  // 4. 膻中 (心轮)
    { x: 50, y: 35 },  // 5. 天突 (喉轮)
    { x: 50, y: 20 },  // 6. 百会 (顶轮，任脉终点)
    { x: 52, y: 22 },  // 7. 转向督脉
    { x: 55, y: 28 },  // 8. 玉枕 (后脑)
    { x: 56, y: 38 },  // 9. 大椎 (颈后)
    { x: 56, y: 48 },  // 10. 命门 (腰后)
    { x: 55, y: 58 },  // 11. 腰阳关
    { x: 52, y: 68 },  // 12. 长强 (尾骨)
    { x: 50, y: 75 },  // 13. 回到会阴 (完成一周天)
]

export function QiCirculation({ className, isCultivating = true, realm = '练气期' }: QiCirculationProps) {
    const [particlePosition, setParticlePosition] = useState(0)

    useEffect(() => {
        if (!isCultivating) return

        const interval = setInterval(() => {
            setParticlePosition((prev) => (prev + 1) % MERIDIAN_PATH.length)
        }, 400) // 每400ms移动一个点,完整周天约3.2秒

        return () => clearInterval(interval)
    }, [isCultivating])

    const currentPos = MERIDIAN_PATH[particlePosition]
    const nextPos = MERIDIAN_PATH[(particlePosition + 1) % MERIDIAN_PATH.length]

    return (
        <div className={cn("relative w-full aspect-square max-w-md mx-auto", className)}>
            {/* 背景光晕 */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" />

            {/* 经络路径 SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {/* 人物轮廓 (简化) */}
                <path
                    d="M50 20 C 40 20 35 30 35 40 C 35 55 40 70 50 70 C 60 70 65 55 65 40 C 65 30 60 20 50 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-cyan-300/30"
                />
                {/* 盘腿 */}
                <path
                    d="M35 60 Q 20 70 30 80 L 70 80 Q 80 70 65 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-cyan-300/30"
                />

                {/* 任脉路径 (前面，从下到上) */}
                <path
                    d="M50 75 L 50 65 L 50 55 L 50 45 L 50 35 L 50 20"
                    fill="none"
                    stroke="url(#qi-gradient)"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                    className="opacity-50"
                />
                
                {/* 督脉路径 (后面，从上到下) */}
                <path
                    d="M50 20 Q 52 22 55 28 Q 56 38 56 48 Q 55 58 52 68 Q 51 72 50 75"
                    fill="none"
                    stroke="url(#du-gradient)"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                    className="opacity-50"
                />

                {/* 主要穴位标记 */}
                <circle cx="50" cy="75" r="2" fill="#22d3ee" opacity="0.8">
                    <title>会阴</title>
                </circle>
                <circle cx="50" cy="65" r="1.5" fill="#22d3ee" opacity="0.6">
                    <title>丹田</title>
                </circle>
                <circle cx="50" cy="45" r="1.5" fill="#22d3ee" opacity="0.6">
                    <title>膻中</title>
                </circle>
                <circle cx="50" cy="20" r="2" fill="#3b82f6" opacity="0.8">
                    <title>百会</title>
                </circle>
                <circle cx="56" cy="48" r="1.5" fill="#8b5cf6" opacity="0.6">
                    <title>命门</title>
                </circle>

                <defs>
                    <linearGradient id="qi-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="du-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                </defs>
            </svg>

            {/* 能量球动画 */}
            {isCultivating && (
                <>
                    {/* 丹田核心 - 呼吸效果 */}
                    <motion.div
                        className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-cyan-400 rounded-full blur-sm"
                        style={{
                            boxShadow: '0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4)'
                        }}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* 运行周天粒子 - 手动计算路径 */}
                    <motion.div
                        className="absolute w-2.5 h-2.5 bg-cyan-300 rounded-full"
                        style={{
                            left: `${currentPos.x}%`,
                            top: `${currentPos.y}%`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: '0 0 12px rgba(34, 211, 238, 1), 0 0 20px rgba(34, 211, 238, 0.6)',
                            filter: 'blur(0.5px)'
                        }}
                        animate={{
                            left: `${nextPos.x}%`,
                            top: `${nextPos.y}%`,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: "linear"
                        }}
                    />

                    {/* 拖尾粒子 */}
                    <motion.div
                        className="absolute w-1.5 h-1.5 bg-cyan-400/60 rounded-full blur-sm"
                        style={{
                            left: `${MERIDIAN_PATH[(particlePosition - 1 + MERIDIAN_PATH.length) % MERIDIAN_PATH.length].x}%`,
                            top: `${MERIDIAN_PATH[(particlePosition - 1 + MERIDIAN_PATH.length) % MERIDIAN_PATH.length].y}%`,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                </>
            )}

            {/* 人物剪影/图片占位 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-9xl opacity-15 filter blur-[2px]">🧘</div>
            </div>

            {/* 状态文字 */}
            <div className="absolute bottom-0 left-0 right-0 text-center pb-2">
                <p className="text-cyan-200 text-sm font-medium tracking-widest">{realm}</p>
                <p className="text-cyan-400/60 text-xs mt-1">
                    {isCultivating ? "周天运行中..." : "暂停修炼"}
                </p>
            </div>
        </div>
    )
}
