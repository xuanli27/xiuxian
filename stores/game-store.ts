import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Rank as PrismaRank, SectRank as PrismaSectRank, SpiritRootType as PrismaSpiritRootType } from '@prisma/client';

// 游戏状态接口
interface PlayerState {
  qi: number;
  maxQi: number;
  innerDemon: number;
  spiritStones: number;
  caveLevel: number;
  inventory: Record<string, number>;
  materials: Record<string, number>;
  equipped: Record<string, string | null>;
  lastLoginTime: number;
}

interface GameState {
  player: PlayerState | null;
  
  // 初始化
  initPlayer: (data: { qi: number; maxQi: number; innerDemon: number; spiritStones: number; caveLevel: number }) => void;
  
  // 修炼相关
  gainQi: (amount: number) => void;
  tick: () => void;
  
  // 物品相关
  addItem: (itemId: string, count: number) => void;
  useItem: (itemId: string) => void;
  equipItem: (itemId: string, slot: string) => void;
  unequipItem: (slot: string) => void;
  craftItem: (recipeId: string) => boolean;
  
  // 洞府
  upgradeCave: () => boolean;
  
  // 重置
  reset: () => void;
}

const INITIAL_STATE: PlayerState = {
  qi: 0,
  maxQi: 100,
  innerDemon: 0,
  spiritStones: 100,
  caveLevel: 1,
  inventory: {},
  materials: {},
  equipped: {},
  lastLoginTime: Date.now(),
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: null,
      
      initPlayer: (data) => set({
        player: {
          ...INITIAL_STATE,
          ...data,
          lastLoginTime: Date.now(),
        }
      }),
      
      gainQi: (amount) => set((state) => {
        if (!state.player) return state;
        return {
          player: {
            ...state.player,
            qi: Math.min(state.player.maxQi, state.player.qi + amount),
          }
        };
      }),
      
      tick: () => set((state) => {
        if (!state.player) return state;
        const BASE_QI_RATE = 2;
        return {
          player: {
            ...state.player,
            qi: Math.min(state.player.maxQi, state.player.qi + BASE_QI_RATE / 10),
            lastLoginTime: Date.now(),
          }
        };
      }),
      
      addItem: (itemId, count) => set((state) => {
        if (!state.player) return state;
        return {
          player: {
            ...state.player,
            inventory: {
              ...state.player.inventory,
              [itemId]: (state.player.inventory[itemId] || 0) + count,
            }
          }
        };
      }),
      
      useItem: (itemId) => set((state) => {
        if (!state.player) return state;
        const count = state.player.inventory[itemId] || 0;
        if (count <= 0) return state;
        
        return {
          player: {
            ...state.player,
            inventory: {
              ...state.player.inventory,
              [itemId]: count - 1,
            }
          }
        };
      }),
      
      equipItem: (itemId, slot) => set((state) => {
        if (!state.player) return state;
        const count = state.player.inventory[itemId] || 0;
        if (count <= 0) return state;
        
        const currentEquipped = state.player.equipped[slot];
        const newInventory = { ...state.player.inventory };
        const newEquipped = { ...state.player.equipped };
        
        // 卸下当前装备
        if (currentEquipped) {
          newInventory[currentEquipped] = (newInventory[currentEquipped] || 0) + 1;
        }
        
        // 装备新物品
        newInventory[itemId]--;
        newEquipped[slot] = itemId;
        
        return {
          player: {
            ...state.player,
            inventory: newInventory,
            equipped: newEquipped,
          }
        };
      }),
      
      unequipItem: (slot) => set((state) => {
        if (!state.player) return state;
        const itemId = state.player.equipped[slot];
        if (!itemId) return state;
        
        return {
          player: {
            ...state.player,
            equipped: {
              ...state.player.equipped,
              [slot]: null,
            },
            inventory: {
              ...state.player.inventory,
              [itemId]: (state.player.inventory[itemId] || 0) + 1,
            }
          }
        };
      }),
      
      craftItem: (recipeId) => {
        const state = get();
        if (!state.player) return false;
        // TODO: 实现配方逻辑
        return false;
      },
      
      upgradeCave: () => {
        const state = get();
        if (!state.player) return false;
        
        const cost = state.player.caveLevel * 100;
        if (state.player.spiritStones < cost) return false;
        
        set({
          player: {
            ...state.player,
            caveLevel: state.player.caveLevel + 1,
            spiritStones: state.player.spiritStones - cost,
          }
        });
        return true;
      },
      
      reset: () => set({ player: null }),
    }),
    {
      name: 'xiuxian-game-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);