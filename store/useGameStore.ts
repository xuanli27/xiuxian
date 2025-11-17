
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlayerStats, Rank, SectRank, SpiritRootType, Task, GameView, RANK_THRESHOLDS, SECT_PROMOTION_COST, SHOP_ITEMS, SHOP_PRICES, Theme, RECIPES, CAVE_LEVELS } from '../types';
import { generateOfflineSummary } from '../services/geminiService';

const INITIAL_STATS: PlayerStats = {
  name: '打工人',
  avatar: '',
  rank: Rank.MORTAL,
  sectRank: SectRank.OUTER,
  level: 1,
  qi: 0,
  maxQi: 100,
  spiritRoot: SpiritRootType.WASTE,
  mindState: '刚入职',
  innerDemon: 0,
  contribution: 0,
  spiritStones: 0,
  caveLevel: 1,
  location: '工位',
  history: [],
  inventory: {},
  materials: {},
  theme: 'dark',
  createTime: Date.now(),
  lastLoginTime: Date.now()
};

const OFFLINE_QI_RATE = 0.5; 
const BASE_QI_RATE = 2;

interface GameState {
  view: GameView;
  player: PlayerStats;
  tasks: Task[];
  offlineReport: string | null;
  
  // Actions
  setView: (view: GameView) => void;
  setPlayer: (player: Partial<PlayerStats>) => void;
  setTheme: (theme: Theme) => void;
  setTasks: (tasks: Task[]) => void;
  
  completeTask: (task: Task, success: boolean) => void;
  
  gainQi: (amount: number) => void;
  tick: () => void;
  
  breakthroughSuccess: () => void;
  breakthroughFail: () => void;
  
  promoteSectRank: () => boolean;
  buyItem: (itemId: string) => boolean;
  useItem: (itemId: string) => void;
  
  upgradeCave: () => boolean;
  craftItem: (recipeId: string) => 'SUCCESS' | 'FAIL' | 'NO_RES';
  
  clearOfflineReport: () => void;
  initializeGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      view: GameView.ONBOARDING_SPIRIT,
      player: INITIAL_STATS,
      tasks: [],
      offlineReport: null,

      setView: (view) => set({ view }),
      
      setPlayer: (updates) => set((state) => ({ player: { ...state.player, ...updates } })),
      
      setTheme: (theme) => set((state) => ({ player: { ...state.player, theme } })),
      
      setTasks: (tasks) => set({ tasks }),

      completeTask: (task, success) => set((state) => {
        // Find current task state
        const t = state.tasks.find(x => x.id === task.id);
        if (!t || t.completed) return {};

        if (!success) {
          // Failed task (e.g. lost battle), gain stress
          return {
            player: {
              ...state.player,
              innerDemon: Math.min(100, state.player.innerDemon + 10)
            },
            tasks: state.tasks.map(x => x.id === task.id ? { ...x, completed: true, title: `${x.title} (失败)` } : x)
          };
        }

        // Calculate Rewards
        const newQi = state.player.qi + task.reward.qi;
        const newContrib = state.player.contribution + (task.reward.contribution || 0);
        const newStones = state.player.spiritStones + (task.reward.stones || 0);
        
        // Handle Materials
        const newMaterials = { ...state.player.materials };
        if (task.reward.materials) {
          task.reward.materials.forEach(mat => {
            newMaterials[mat.id] = (newMaterials[mat.id] || 0) + mat.count;
          });
        }

        return {
          player: {
            ...state.player,
            qi: newQi,
            contribution: newContrib,
            spiritStones: newStones,
            materials: newMaterials,
            innerDemon: Math.max(0, state.player.innerDemon - 5) // Success reduces stress slightly
          },
          tasks: state.tasks.map(x => x.id === task.id ? { ...x, completed: true } : x)
        };
      }),

      gainQi: (amount) => set((state) => {
        // Apply Cave Multiplier
        const caveConfig = CAVE_LEVELS.find(c => c.level === state.player.caveLevel) || CAVE_LEVELS[0];
        const multiplier = caveConfig.qiMultiplier;
        
        // Apply Inner Demon Debuff
        let demonFactor = 1.0;
        if (state.player.innerDemon > 80) demonFactor = 0.5;
        else if (state.player.innerDemon > 50) demonFactor = 0.8;

        return {
          player: { ...state.player, qi: state.player.qi + (amount * multiplier * demonFactor) }
        };
      }),

      tick: () => set((state) => {
        if (state.view === GameView.ONBOARDING_MIND || state.view === GameView.ONBOARDING_SPIRIT) return {};
        
        // Passive Gain
        const caveConfig = CAVE_LEVELS.find(c => c.level === state.player.caveLevel) || CAVE_LEVELS[0];
        const multiplier = caveConfig.qiMultiplier;
        
        let demonFactor = 1.0;
        if (state.player.innerDemon > 80) demonFactor = 0.5;

        return {
          player: {
            ...state.player,
            qi: state.player.qi + ((BASE_QI_RATE * multiplier * demonFactor) / 10),
            lastLoginTime: Date.now()
          }
        };
      }),

      breakthroughSuccess: () => set((state) => {
        const ranks = Object.values(Rank);
        const currentIndex = ranks.indexOf(state.player.rank);
        const nextRank = ranks[currentIndex + 1] as Rank || Rank.IMMORTAL;
        return {
          view: GameView.DASHBOARD,
          player: {
            ...state.player,
            rank: nextRank,
            qi: 0,
            level: 1,
            maxQi: RANK_THRESHOLDS[nextRank] || Infinity,
            innerDemon: Math.max(0, state.player.innerDemon - 30)
          }
        };
      }),

      breakthroughFail: () => set((state) => ({
        view: GameView.DASHBOARD,
        player: {
          ...state.player,
          qi: Math.floor(state.player.qi * 0.5),
          innerDemon: Math.min(100, state.player.innerDemon + 25)
        }
      })),

      promoteSectRank: () => {
        const state = get();
        const ranks = Object.values(SectRank);
        const currentIndex = ranks.indexOf(state.player.sectRank);
        if (currentIndex >= ranks.length - 1) return false;

        const nextRank = ranks[currentIndex + 1] as SectRank;
        const cost = SECT_PROMOTION_COST[nextRank];

        if (state.player.contribution >= cost) {
          set({
            player: {
              ...state.player,
              sectRank: nextRank,
              contribution: state.player.contribution - cost
            }
          });
          return true;
        }
        return false;
      },

      buyItem: (itemId: string) => {
        const state = get();
        const cost = SHOP_PRICES[itemId];
        if (state.player.contribution >= cost) {
          const currentCount = state.player.inventory[itemId] || 0;
          set({
            player: {
              ...state.player,
              contribution: state.player.contribution - cost,
              inventory: {
                ...state.player.inventory,
                [itemId]: currentCount + 1
              }
            }
          });
          return true;
        }
        return false;
      },

      useItem: (itemId: string) => {
        const state = get();
        const count = state.player.inventory[itemId];
        if (!count || count <= 0) return;

        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return;

        let updates: Partial<PlayerStats> = {
          inventory: {
            ...state.player.inventory,
            [itemId]: count - 1
          }
        };

        if (item.effect === 'HEAL_QI') {
          updates.qi = state.player.qi + item.value;
        } else if (item.effect === 'REDUCE_DEMON') {
          updates.innerDemon = Math.max(0, state.player.innerDemon - item.value);
        }

        set({ player: { ...state.player, ...updates } });
      },

      upgradeCave: () => {
        const state = get();
        const nextLevelIdx = state.player.caveLevel; // Current level is index + 1
        if (nextLevelIdx >= CAVE_LEVELS.length) return false; // Max level

        const config = CAVE_LEVELS[nextLevelIdx]; // Config for NEXT level
        if (!config) return false;

        // Check Stones
        if (state.player.spiritStones < config.upgradeCost.stones) return false;

        // Check Materials
        if (config.upgradeCost.materials) {
          for (const [matId, count] of Object.entries(config.upgradeCost.materials)) {
            if ((state.player.materials[matId] || 0) < count) return false;
          }
        }

        // Consume Resources
        const newStones = state.player.spiritStones - config.upgradeCost.stones;
        const newMaterials = { ...state.player.materials };
        if (config.upgradeCost.materials) {
           for (const [matId, count] of Object.entries(config.upgradeCost.materials)) {
            newMaterials[matId] -= count;
          }
        }

        set({
          player: {
            ...state.player,
            caveLevel: state.player.caveLevel + 1,
            spiritStones: newStones,
            materials: newMaterials
          }
        });
        return true;
      },

      craftItem: (recipeId: string) => {
        const state = get();
        const recipe = RECIPES.find(r => r.id === recipeId);
        if (!recipe) return 'FAIL';

        // Check Cost
        if (state.player.spiritStones < recipe.baseCost) return 'NO_RES';
        for (const [matId, count] of Object.entries(recipe.materials)) {
            if ((state.player.materials[matId] || 0) < count) return 'NO_RES';
        }

        // Consume
        const newStones = state.player.spiritStones - recipe.baseCost;
        const newMaterials = { ...state.player.materials };
        for (const [matId, count] of Object.entries(recipe.materials)) {
            newMaterials[matId] -= count;
        }

        // Roll Success
        const isSuccess = Math.random() < recipe.successRate;
        
        // Update State
        const newInventory = { ...state.player.inventory };
        if (isSuccess) {
            newInventory[recipe.resultItemId] = (newInventory[recipe.resultItemId] || 0) + 1;
        }

        set({
            player: {
                ...state.player,
                spiritStones: newStones,
                materials: newMaterials,
                inventory: newInventory,
                // Failure increases Inner Demon slightly
                innerDemon: isSuccess ? state.player.innerDemon : Math.min(100, state.player.innerDemon + 5)
            }
        });

        return isSuccess ? 'SUCCESS' : 'FAIL';
      },

      clearOfflineReport: () => set({ offlineReport: null }),

      initializeGame: () => {
        const state = get();
        const now = Date.now();
        const diffSeconds = (now - state.player.lastLoginTime) / 1000;

        // Migration: Ensure new fields exist
        if (state.player.spiritStones === undefined) {
             set(s => ({ player: { ...s.player, spiritStones: 0, caveLevel: 1, materials: {} } }));
        }

        if (diffSeconds > 60 && state.view !== GameView.ONBOARDING_SPIRIT && state.view !== GameView.ONBOARDING_MIND) {
           const gainedQi = diffSeconds * OFFLINE_QI_RATE;
           generateOfflineSummary(diffSeconds / 3600, state.player.rank, state.player.innerDemon).then(summary => {
             set({ offlineReport: `摸鱼离线 ${Math.floor(diffSeconds/60)} 分钟。\n被动吸取灵气 ${Math.floor(gainedQi)}。\n\n${summary}` });
           });
           set((state) => ({
             player: {
               ...state.player,
               qi: state.player.qi + gainedQi,
               lastLoginTime: now
             }
           }));
        } else {
          set((state) => ({ player: { ...state.player, lastLoginTime: now }}));
        }
      }
    }),
    {
      name: 'xiuxian_save_v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
