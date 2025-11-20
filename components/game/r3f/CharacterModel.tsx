'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Box, Cylinder } from '@react-three/drei'
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
      <Sphere args={[0.18, 32, 32]} position={[0, 0.75, 0]}>
        <meshStandardMaterial
          color="#5a6c7d"
          emissive="#3b82f6"
          emissiveIntensity={glowIntensity * 0.3}
          roughness={0.7}
        />
      </Sphere>
      
      {/* 颈部 */}
      <Cylinder args={[0.08, 0.08, 0.1, 16]} position={[0, 0.62, 0]}>
        <meshStandardMaterial
          color="#4a5568"
          emissive="#3b82f6"
          emissiveIntensity={glowIntensity * 0.2}
        />
      </Cylinder>
      
      {/* 躯干（上半身） */}
      <Box args={[0.4, 0.5, 0.25]} position={[0, 0.3, 0]}>
        <meshStandardMaterial
          color="#2d3748"
          emissive="#3b82f6"
          emissiveIntensity={glowIntensity * 0.2}
          roughness={0.8}
        />
      </Box>
      
      {/* 左肩 */}
      <Sphere args={[0.12, 16, 16]} position={[-0.25, 0.48, 0]}>
        <meshStandardMaterial
          color="#374151"
          emissive="#3b82f6"
          emissiveIntensity={glowIntensity * 0.15}
        />
      </Sphere>
      
      {/* 右肩 */}
      <Sphere args={[0.12, 16, 16]} position={[0.25, 0.48, 0]}>
        <meshStandardMaterial
          color="#374151"
          emissive="#3b82f6"
          emissiveIntensity={glowIntensity * 0.15}
        />
      </Sphere>
      
      {/* 左手臂 */}
      <Cylinder args={[0.06, 0.06, 0.35, 12]} position={[-0.25, 0.25, 0.15]} rotation={[0.5, 0, 0.3]}>
        <meshStandardMaterial
          color="#4a5568"
          emissive="#3b82f6"
          emissiveIntensity={glowIntensity * 0.1}
        />
      </Cylinder>
      
      {/* 右手臂 */}
      <Cylinder args={[0.06, 0.06, 0.35, 12]} position={[0.25, 0.25, 0.15]} rotation={[0.5, 0, -0.3]}>
        <meshStandardMaterial
          color="#4a5568"
          emissive="#3b82f6"
          emissiveIntensity={glowIntensity * 0.1}
        />
      </Cylinder>
      
      {/* 左手 */}
      <Sphere args={[0.08, 12, 12]} position={[-0.2, 0.08, 0.3]}>
        <meshStandardMaterial
          color="#5a6c7d"
          emissive="#8b5cf6"
          emissiveIntensity={glowIntensity * 0.2}
        />
      </Sphere>
      
      {/* 右手 */}
      <Sphere args={[0.08, 12, 12]} position={[0.2, 0.08, 0.3]}>
        <meshStandardMaterial
          color="#5a6c7d"
          emissive="#8b5cf6"
          emissiveIntensity={glowIntensity * 0.2}
        />
      </Sphere>
      
      {/* 下半身/盘腿底座 */}
      <Cylinder args={[0.35, 0.45, 0.25, 32]} position={[0, -0.05, 0]}>
        <meshStandardMaterial
          color="#1a202c"
          emissive="#8b5cf6"
          emissiveIntensity={glowIntensity * 0.15}
          roughness={0.9}
        />
      </Cylinder>
      
      {/* 左腿（盘腿状） */}
      <Box args={[0.15, 0.12, 0.4]} position={[-0.2, -0.15, 0.1]} rotation={[0.3, 0.2, 0]}>
        <meshStandardMaterial
          color="#1f2937"
          emissive="#8b5cf6"
          emissiveIntensity={glowIntensity * 0.1}
        />
      </Box>
      
      {/* 右腿（盘腿状） */}
      <Box args={[0.15, 0.12, 0.4]} position={[0.2, -0.15, 0.1]} rotation={[0.3, -0.2, 0]}>
        <meshStandardMaterial
          color="#1f2937"
          emissive="#8b5cf6"
          emissiveIntensity={glowIntensity * 0.1}
        />
      </Box>
      
      {/* 打坐垫 */}
      <Cylinder args={[0.5, 0.5, 0.08, 32]} position={[0, -0.28, 0]}>
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#8b5cf6"
          emissiveIntensity={glowIntensity * 0.3}
          roughness={0.6}
        />
      </Cylinder>
    </group>
  )
}