'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/game-store';
import { updatePlayerProgress } from '@/features/player/actions';
import type { Player } from '@prisma/client';

/**
 * 游戏状态同步 Hook
 * 负责在本地 Zustand store 和服务端数据库之间同步
 */
export function useGameSync(serverPlayer: Player) {
  const localPlayer = useGameStore((state) => state.player);
  const initPlayer = useGameStore((state) => state.initPlayer);

  // 初始化：从服务端加载数据到本地 store
  useEffect(() => {
    if (!localPlayer && serverPlayer) {
      initPlayer({
        qi: serverPlayer.qi,
        maxQi: serverPlayer.maxQi,
        innerDemon: serverPlayer.innerDemon,
        spiritStones: serverPlayer.spiritStones,
        caveLevel: serverPlayer.caveLevel,
      });
    }
  }, [serverPlayer, localPlayer, initPlayer]);

  // 定期同步：每 30 秒将本地状态保存到服务端
  useEffect(() => {
    if (!localPlayer) return;

    const syncInterval = setInterval(async () => {
      try {
        await updatePlayerProgress({
          playerId: serverPlayer.id,
          qi: localPlayer.qi,
          innerDemon: localPlayer.innerDemon,
          spiritStones: localPlayer.spiritStones,
          caveLevel: localPlayer.caveLevel,
        });
        console.log('游戏进度已同步');
      } catch (error) {
        console.error('同步失败:', error);
      }
    }, 30000); // 30 秒

    return () => clearInterval(syncInterval);
  }, [localPlayer, serverPlayer.id]);

  // 页面卸载时同步
  useEffect(() => {
    if (!localPlayer) return;

    const handleBeforeUnload = async () => {
      await updatePlayerProgress({
        playerId: serverPlayer.id,
        qi: localPlayer.qi,
        innerDemon: localPlayer.innerDemon,
        spiritStones: localPlayer.spiritStones,
        caveLevel: localPlayer.caveLevel,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [localPlayer, serverPlayer.id]);
}