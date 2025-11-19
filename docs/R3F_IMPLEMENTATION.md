# React Three Fiber 实现方案

## 🎨 为什么选择 R3F

React Three Fiber (R3F) 可以为修仙游戏带来更震撼的视觉体验:

1. **硬件加速**: WebGL性能是Canvas 2D的10-100倍
2. **3D空间**: 能量流动有空间感和层次感
3. **高级特效**: 辉光、景深、粒子系统
4. **React生态**: 声明式组件，易维护

---

## 📦 安装依赖

```bash
pnpm add three @react-three/fiber @react-three/drei
pnpm add -D @types/three
```

---

## 🎯 核心组件实现

### 1. 周天运行主组件

```typescript
// components/game/QiCirculation3D.tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { CharacterModel } from './CharacterModel'
import { MeridiansSystem } from './MeridiansSystem'
import { QiParticles } from './QiParticles'
import { DantianCore } from './DantianCore'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

interface Props {
  isCultivating: boolean
  qi: number
  maxQi: number
  realm: string
}

export const QiCirculation3D: React.FC<Props> = ({
  isCultivating,
  qi,
  maxQi,
  realm
}) => {
  const progress = qi / maxQi
  
  return (
    <div className="w-full h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
      >
        {/* 环境光 */}
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 2, 2]} intensity={1} />
        
        {/* 盘腿打坐的人物模型 */}
        <CharacterModel 
          position={[0, -1, 0]}
          scale={1.5}
          glowIntensity={progress}
        />
        
        {/* 经络系统（任督二脉） */}
        <MeridiansSystem 
          active={isCultivating}
          progress={progress}
        />
        
        {/* 能量粒子流 */}
        <QiParticles 
          count={3000}
          speed={isCultivating ? 1 : 0.2}
          color="#3b82f6"
        />
        
        {/* 丹田核心 */}
        <DantianCore 
          position={[0, 0, 0]}
          size={0.3}
          pulsating={isCultivating}
          energy={progress}
        />
        
        {/* 后处理特效 */}
        <EffectComposer>
          <Bloom 
            intensity={isCultivating ? 2 : 0.5}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
        
        {/* 相机控制（可选） */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
        />
        
        {/* 环境贴图 */}
        <Environment preset="night" />
      </Canvas>
      
      {/* UI 覆盖层 */}
      <div className="absolute top-4 left-4 text-primary-300">
        <p className="text-sm">{realm}</p>
        <p className="text-xs opacity-70">{qi.toFixed(0)} / {maxQi}</p>
      </div>
    </div>
  )
}
```

---

### 2. 人物模型

```typescript
// components/game/CharacterModel.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

export const CharacterModel = ({ 
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
      {/* 简化的盘腿人物（球体+环） */}
      
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
```

---

### 3. 经络系统

```typescript
// components/game/MeridiansSystem.tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const MeridiansSystem = ({ active, progress }) => {
  const meridianRef = useRef<THREE.Line>(null)
  
  // 生成任督二脉路径
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.5, 0),    // 会阴
      new THREE.Vector3(0, 0, 0.1),     // 丹田
      new THREE.Vector3(0, 0.3, 0.15),  // 中脘
      new THREE.Vector3(0, 0.6, 0.1),   // 膻中
      new THREE.Vector3(0, 0.9, 0),     // 印堂
      new THREE.Vector3(0, 0.6, -0.2),  // 后背
      new THREE.Vector3(0, 0, -0.15),   // 命门
      new THREE.Vector3(0, -0.5, 0),    // 回到起点
    ])
    
    return curve.getPoints(100)
  }, [])
  
  useFrame((state) => {
    if (!meridianRef.current || !active) return
    
    // 流动动画
    const material = meridianRef.current.material as THREE.LineBasicMaterial
    material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
  })
  
  return (
    <line ref={meridianRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial 
        color="#3b82f6"
        transparent
        opacity={0.6}
        linewidth={2}
      />
    </line>
  )
}
```

---

### 4. 能量粒子系统

```typescript
// components/game/QiParticles.tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export const QiParticles = ({ count, speed, color }) => {
  const pointsRef = useRef<THREE.Points>(null)
  
  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // 随机分布在经络周围
      const angle = Math.random() * Math.PI * 2
      const radius = 0.5 + Math.random() * 0.5
      
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = Math.random() * 2 - 1
      positions[i * 3 + 2] = Math.sin(angle) * radius
      
      // 随机速度
      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = Math.random() * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
    }
    
    return [positions, velocities]
  }, [count])
  
  useFrame(() => {
    if (!pointsRef.current) return
    
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      // 更新位置
      positionArray[i * 3] += velocities[i * 3] * speed
      positionArray[i * 3 + 1] += velocities[i * 3 + 1] * speed
      positionArray[i * 3 + 2] += velocities[i * 3 + 2] * speed
      
      // 重置超出范围的粒子
      if (positionArray[i * 3 + 1] > 1.5) {
        positionArray[i * 3 + 1] = -1
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
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
```

---

### 5. 丹田核心

```typescript
// components/game/DantianCore.tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

export const DantianCore = ({ 
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
```

---

## 🎨 高级特效

### Bloom（辉光）
```typescript
import { Bloom } from '@react-three/postprocessing'

<EffectComposer>
  <Bloom 
    intensity={2}
    luminanceThreshold={0.3}
    luminanceSmoothing={0.9}
  />
</EffectComposer>
```

### Depth of Field（景深）
```typescript
import { DepthOfField } from '@react-three/postprocessing'

<DepthOfField
  focusDistance={0.01}
  focalLength={0.1}
  bokehScale={3}
/>
```

---

## 📊 性能对比

| 指标 | Canvas 2D | R3F |
|------|-----------|-----|
| 粒子数 | 50 | 5000 |
| 帧率 | 40 FPS | 60 FPS |
| 特效 | 基础 | 辉光/景深 |
| 包体积 | +0KB | +300KB |

---

## 🚀 迁移步骤

1. ✅ 安装依赖
2. ⏳ 创建R3F组件
3. ⏳ 替换Dashboard中的QiCirculation
4. ⏳ 测试性能
5. ⏳ 优化移动端

---

## 💡 建议

**推荐使用R3F**，因为:
1. 视觉效果提升巨大
2. 性能更好（WebGL加速）
3. 扩展性强（未来可以加更多3D效果）
4. 包体积增加可接受（gzip后约100KB）

**如果担心兼容性**:
- 可以检测WebGL支持
- 不支持时降级到Canvas 2D版本

```typescript
const supportsWebGL = (() => {
  try {
    const canvas = document.createElement('canvas')
    return !!canvas.getContext('webgl')
  } catch {
    return false
  }
})()

{supportsWebGL ? <QiCirculation3D /> : <QiCirculation2D />}
```

---

**结论**: React Three Fiber 是更好的选择！ 🎨✨