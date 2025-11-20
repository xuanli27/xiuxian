'use server'

import { createServerSupabaseClient } from '@/lib/db/supabase'

export async function initializeCave(playerId: number) {
  const supabase = await createServerSupabaseClient()
  
  const { data: player } = await supabase
    .from('players')
    .select('materials')
    .eq('id', playerId)
    .single()
  
  if (!player) {
    throw new Error('玩家不存在')
  }
  
  const materials = typeof player.materials === 'object' && player.materials !== null
    ? player.materials as Record<string, any>
    : {}
  
  // 检查是否已初始化
  if (materials.cave) {
    return { success: true, message: '洞府已存在' }
  }
  
  // 初始化洞府数据
  materials.cave = {
    name: '无名洞府',
    spiritDensity: 100,
    buildings: [],
    resources: {
      spiritualEnergy: 100,
      herbs: 50,
      ores: 30,
      pills: 0,
      artifacts: 0,
    },
    lastCollectAt: new Date().toISOString(),
  }
  
  const { error } = await supabase
    .from('players')
    .update({ materials })
    .eq('id', playerId)
  
  if (error) {
    throw new Error(`初始化洞府失败: ${error.message}`)
  }
  
  return { success: true, message: '洞府已开辟' }
}