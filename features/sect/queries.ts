import { createServerSupabaseClient } from '@/lib/db/supabase';
import { cache } from 'react';
import { getCurrentUserId } from '@/lib/auth/server';
import { SECT_CONFIG } from '@/config/game';

export const getSectInfo = cache(async () => {
  const userId = await getCurrentUserId();
  const supabase = await createServerSupabaseClient();
  
  // 获取玩家信息
  const { data: player } = await supabase
    .from('players')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (player) {
    // 获取玩家的宗门成员关系
    const { data: membership } = await supabase
      .from('sect_members')
      .select('sect_id')
      .eq('player_id', player.id)
      .single();

    if (membership) {
      // 获取宗门信息
      const { data: sect } = await supabase
        .from('sects')
        .select('name, description, reputation')
        .eq('id', membership.sect_id)
        .single();

      // 统计成员数量
      const { count } = await supabase
        .from('sect_members')
        .select('*', { count: 'exact', head: true })
        .eq('sect_id', membership.sect_id);

      if (sect) {
        return {
          name: sect.name,
          description: sect.description,
          totalMembers: count || 0,
          averageLevel: 1,
          totalContribution: sect.reputation,
          ranking: 1
        };
      }
    }
  }
  
  return {
    name: '仙欲宗',
    description: '摸鱼修仙,法力无边',
    totalMembers: 1,
    averageLevel: 1,
    totalContribution: 0,
    ranking: 1
  };
});

export const getPlayerSectStats = cache(async (playerId: number) => {
  const supabase = await createServerSupabaseClient();
  
  const { data: player } = await supabase
    .from('players')
    .select('contribution, sect_rank')
    .eq('id', playerId)
    .single();

  if (!player) {
    return {
      totalContribution: 0,
      rank: 'OUTER' as const,
      joinedAt: new Date()
    };
  }

  return {
    totalContribution: player.contribution,
    rank: player.sect_rank as any,
    joinedAt: new Date()
  };
});

export const getSectPositions = cache(async () => {
  // Return static config for now
  return Object.entries(SECT_CONFIG.ranks.names).map(([key, name]) => ({
    rank: key as any,
    name: name,
    requiredContribution: SECT_CONFIG.ranks.requirements[key as keyof typeof SECT_CONFIG.ranks.requirements] || 0,
    benefits: [],
    permissions: []
  }));
});