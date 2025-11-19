'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  count: number
  speed: number
  color: string
}

export const QiParticles: React.FC<Props> = ({ count, speed, color }) => {
  const pointsRef = useRef<THREE.Points>(null)
  
  const [geometry, velocities] = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 0.5 + Math.random() * 0.5
      
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.random() * 2 - 1
      positions[i * 3 + 2] = Math.sin(angle) * radius
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = Math.random() * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    return [geo, velocities]
  }, [count])
  
  useFrame(() => {
    if (!pointsRef.current) return
    
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      positionArray[i * 3] += velocities[i * 3] * speed
      positionArray[i * 3 + 1] += velocities[i * 3 + 1] * speed
      positionArray[i * 3 + 2] += velocities[i * 3 + 2] * speed
      
      if (positionArray[i * 3 + 1] > 1.5) {
        positionArray[i * 3 + 1] = -1
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.02}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}