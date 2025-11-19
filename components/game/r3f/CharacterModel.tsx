'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  position: [number, number, number]
  scale: number
  glowIntensity: number
}

export const CharacterModel: React.FC<Props> = ({ 
  position, 
  scale, 
  glowIntensity 
}) => {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    // 轻微呼吸动画
    const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    groupRef.current.scale.setScalar(scale + breathe)
  })
  
  return (
    <group ref={groupRef} position={position}>
      {/* 头部 */}
      <Sphere args={[0.2, 32, 32]} position={[0, 0.8, 0]}>
        <meshStandardMaterial 
          color="#4a5568"
          emissive="#3b82f6"
          emissiveIntensity={glowIntensity * 0.3}
        />
      </Sphere>
      
      {/* 身体 */}
      <Sphere args={[0.35, 32, 32]} position={[0, 0.3, 0]}>
        <meshStandardMaterial 
          color="#2d3748"
          emissive="#3b82f6"
          emissiveIntensity={glowIntensity * 0.2}
        />
      </Sphere>
      
      {/* 盘腿（环形） */}
      <Torus 
        args={[0.4, 0.1, 16, 32]} 
        position={[0, -0.2, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial 
          color="#1a202c"
          emissive="#8b5cf6"
          emissiveIntensity={glowIntensity * 0.1}
        />
      </Torus>
    </group>
  )
}