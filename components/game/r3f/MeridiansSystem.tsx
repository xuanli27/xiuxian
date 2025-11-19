'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  active: boolean
  progress: number
}

export const MeridiansSystem: React.FC<Props> = ({ active, progress }) => {
  const lineRef = useRef<any>(null)
  
  // 生成任督二脉路径
  const points = useMemo(() => [
    [0, -0.5, 0],    // 会阴
    [0, 0, 0.1],     // 丹田
    [0, 0.3, 0.15],  // 中脘
    [0, 0.6, 0.1],   // 膻中
    [0, 0.9, 0],     // 印堂
    [0, 0.6, -0.2],  // 后背
    [0, 0, -0.15],   // 命门
    [0, -0.5, 0],    // 回到起点
  ] as [number, number, number][], [])
  
  useFrame((state) => {
    if (!lineRef.current || !active) return
    
    // 流动动画
    const material = lineRef.current.material as THREE.LineBasicMaterial
    material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
  })
  
  return (
    <Line
      ref={lineRef}
      points={points}
      color="#3b82f6"
      lineWidth={2}
      transparent
      opacity={0.6}
    />
  )
}