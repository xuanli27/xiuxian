import type { EventContext } from './types';
import type { Player } from '@/types/enums';

export function buildEventContext(
  player: Player,
  recentEvents: string[] = []
): EventContext {
  return {
    playerId: player.id,
    playerState: {
      rank: player.rank,
      level: player.level,
      qi: player.qi,
      spiritStones: player.spiritStones,
      mindState: player.mindState,
    },
    recentEvents,
  };
}

export function calculateEventWeight(eventType: 'MAJOR' | 'MINOR' | 'CHAIN'): number {
  switch (eventType) {
    case 'MAJOR':
      return 3;
    case 'CHAIN':
      return 2;
    case 'MINOR':
      return 1;
    default:
      return 1;
  }
}