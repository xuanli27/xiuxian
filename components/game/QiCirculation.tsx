'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface QiCirculationProps {
    className?: string
    isCultivating?: boolean
    realm?: string
}

export function QiCirculation({ className, isCultivating = true, realm = '练气期' }: QiCirculationProps) {
    return (
        <div className={cn("relative w-full aspect-square max-w-md mx-auto", className)}>
            {/* 背景光晕 */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent rounded-full blur-3xl animate-pulse" />

            {/* 经络路径 SVG */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                {/* 人物轮廓 (简化) */}
                <path
                    d="M50 20 C 40 20 35 30 35 40 C 35 55 40 70 50 70 C 60 70 65 55 65 40 C 65 30 60 20 50 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-primary-300"
                />
                {/* 盘腿 */}
                <path
                    d="M35 60 Q 20 70 30 80 L 70 80 Q 80 70 65 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-primary-300"
                />

                {/* 经络路径 - 任脉 (前) */}
                <path
                    id="ren-mai"
                    d="M50 80 L 50 20"
                    fill="none"
                    stroke="url(#qi-gradient)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                />

                {/* 经络路径 - 督脉 (后 - 示意) */}
                <path
                    id="du-mai"
                    d="M50 20 Q 65 40 50 80"
                    fill="none"
                    stroke="url(#qi-gradient)"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                    opacity="0.5"
                />

                <defs>
                    <linearGradient id="qi-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                </defs>
            </svg>

            {/* 能量球动画 */}
            {isCultivating && (
                <>
                    {/* 丹田核心 */}
                    <motion.div
                        className="absolute left-1/2 top-[75%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary-400 rounded-full blur-sm shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* 运行周天粒子 */}
                    <motion.div
                        className="absolute w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]"
                        animate={{
                            offsetDistance: "0%",
                        }}
                        style={{
                            offsetPath: "path('M50 80 L 50 20 Q 65 40 50 80')",
                            offsetRotate: "0deg",
                        }}
                        // @ts-ignore - framer-motion types issue with offsetPath
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                            repeatType: "loop"
                        }}
                    />
                </>
            )}

            {/* 人物剪影/图片占位 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-9xl opacity-20 filter blur-sm">🧘</div>
            </div>

            {/* 状态文字 */}
            <div className="absolute bottom-0 left-0 right-0 text-center">
                <p className="text-primary-200 text-sm font-medium tracking-widest">{realm}</p>
                <p className="text-primary-400/60 text-xs mt-1">
                    {isCultivating ? "周天运行中..." : "暂停修炼"}
                </p>
            </div>
        </div>
    )
}
