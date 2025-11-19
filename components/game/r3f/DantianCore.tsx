'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface Props {
  position: [number, number, number]
  size: number
  pulsating: boolean
  energy: number
}

export const DantianCore: React.FC<Props> = ({ 
  position, 
  size, 
  pulsating, 
  energy 
}) => {
  const coreRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!coreRef.current) return
    
    // 呼吸效果
    if (pulsating) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1
      coreRef.current.scale.setScalar(1 + pulse)
    }
    
    // 旋转
    coreRef.current.rotation.y += 0.01
  })
  
  return (
    <Sphere 
      ref={coreRef}
      args={[size, 32, 32]} 
      position={position}
    >
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={energy * 2}
        transparent
        opacity={0.8}
      />
    </Sphere>
  )
}