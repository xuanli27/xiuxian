'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { CharacterModel } from './r3f/CharacterModel'
import { MeridiansSystem } from './r3f/MeridiansSystem'
import { QiParticles } from './r3f/QiParticles'
import { DantianCore } from './r3f/DantianCore'

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
    <div className="w-full h-[500px] relative rounded-2xl overflow-hidden bg-gradient-to-b from-surface-900 to-surface-950">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
      >
        {/* 环境光 */}
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 2, 2]} intensity={1} />
        <pointLight position={[0, -2, -2]} intensity={0.5} color="#8b5cf6" />
        
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
        
        {/* 相机控制 */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate={isCultivating}
          autoRotateSpeed={0.5}
        />
        
        {/* 环境贴图 */}
        <Environment preset="night" />
      </Canvas>
      
      {/* UI 覆盖层 */}
      <div className="absolute top-4 left-4 text-primary-300 bg-surface-900/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-surface-800/50">
        <p className="text-sm font-bold">{realm}</p>
        <p className="text-xs opacity-70">{qi.toFixed(0)} / {maxQi}</p>
      </div>
      
      {isCultivating && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-primary-400 text-sm animate-pulse">
          周天运行中...
        </div>
      )}
    </div>
  )
}