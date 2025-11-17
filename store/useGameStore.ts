
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlayerStats, Rank, SectRank, SpiritRootType, Task, GameView, EquipmentSlot } from '../types';
import { RANK_CONFIG, SECT_PROMOTION_COST, SHOP_ITEMS, SHOP_PRICES, RECIPES, CAVE_LEVELS, MATERIALS, ALL_ITEMS, getRankLabel } from '../data/constants';
import { generateOfflineSummary } from '../services/geminiService';

const calculateMaxQi = (rank: Rank, level: number) => {
  const config = RANK_CONFIG[rank];
  return Math.floor(config.baseQi * Math.pow(config.qiMult, level - 1));
};

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
  equipped: {
    [EquipmentSlot.HEAD]: null,
    [EquipmentSlot.BODY]: null,
    [EquipmentSlot.WEAPON]: null,
    [EquipmentSlot.ACCESSORY]: null
  },
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
  
  setView: (view: GameView) => void;
  setPlayer: (player: Partial<PlayerStats>) => void;
  setTheme: (theme: any) => void;
  setTasks: (tasks: Task[]) => void;
  
  completeTask: (task: Task, success: boolean) => void;
  
  gainQi: (amount: number) => void;
  tick: () => void;
  
  minorBreakthrough: () => void;
  breakthroughSuccess: () => void;
  breakthroughFail: () => void;
  
  promoteSectRank: () => boolean;
  buyItem: (itemId: string) => boolean;
  useItem: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (slot: EquipmentSlot) => void;
  
  upgradeCave: () => boolean;
  craftItem: (recipeId: string) => 'SUCCESS' | 'FAIL' | 'NO_RES';
  
  clearOfflineReport: () => void;
  initializeGame: () => void;
  
  getBonuses: () => { qiMultiplier: number, demonReduction: number, flatQi: number };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      view: GameView.INTRO,
      player: INITIAL_STATS,
      tasks: [],
      offlineReport: null,

      setView: (view) => set({ view }),
      
      setPlayer: (updates) => set((state) => ({ player: { ...state.player, ...updates } })),
      
      setTheme: (theme) => set((state) => ({ player: { ...state.player, theme } })),
      
      setTasks: (tasks) => set({ tasks }),

      getBonuses: () => {
        const state = get();
        let qiMultiplier = 0;
        let demonReduction = 0;
        let flatQi = 0;
        
        Object.values(state.player.equipped).forEach(itemId => {
            if (itemId) {
                const item = ALL_ITEMS.find(i => i.id === itemId);
                if (item && item.bonus) {
                    qiMultiplier += item.bonus.qiMultiplier || 0;
                    demonReduction += item.bonus.demonReduction || 0;
                    flatQi += item.bonus.flatQi || 0;
                }
            }
        });
        return { qiMultiplier, demonReduction, flatQi };
      },

      completeTask: (task, success) => {
        const state = get();
        const t = state.tasks.find(x => x.id === task.id);
        if (!t || t.completed) return;

        if (!success) {
          set({
            player: {
              ...state.player,
              innerDemon: Math.min(100, state.player.innerDemon + 10)
            },
            tasks: state.tasks.map(x => x.id === task.id ? { ...x, completed: true, title: `${x.title} (失败)` } : x)
          });
          return;
        }

        const bonuses = state.getBonuses();
        const baseQi = task.reward.qi;
        const bonusQi = baseQi * bonuses.qiMultiplier;
        const totalQi = baseQi + bonusQi + bonuses.flatQi;

        const newQi = state.player.qi + totalQi;
        const newContrib = state.player.contribution + (task.reward.contribution || 0);
        const newStones = state.player.spiritStones + (task.reward.stones || 0);
        
        const newMaterials = { ...state.player.materials };
        if (task.reward.materials) {
          task.reward.materials.forEach(mat => {
            newMaterials[mat.id] = (newMaterials[mat.id] || 0) + mat.count;
          });
        }

        // Demon reduction from equipment also applies to task completion stress relief? 
        // Or maybe it just helps avoid stress. Let's say it increases the relief.
        const demonRelief = 5 * (1 + bonuses.demonReduction);

        set({
          player: {
            ...state.player,
            qi: newQi,
            contribution: newContrib,
            spiritStones: newStones,
            materials: newMaterials,
            innerDemon: Math.max(0, state.player.innerDemon - demonRelief)
          },
          tasks: state.tasks.map(x => x.id === task.id ? { ...x, completed: true } : x)
        });
      },

      gainQi: (amount) => {
          const state = get();
          const caveConfig = CAVE_LEVELS.find(c => c.level === state.player.caveLevel) || CAVE_LEVELS[0];
          const bonuses = state.getBonuses();
          
          const multiplier = caveConfig.qiMultiplier + bonuses.qiMultiplier;
          
          let demonFactor = 1.0;
          // Equipment can mitigate demon effects
          const effectiveDemon = Math.max(0, state.player.innerDemon * (1 - bonuses.demonReduction));

          if (effectiveDemon > 80) demonFactor = 0.5;
          else if (effectiveDemon > 50) demonFactor = 0.8;

          set({
            player: { ...state.player, qi: state.player.qi + (amount * multiplier * demonFactor) + bonuses.flatQi }
          });
      },

      tick: () => {
        const state = get();
        if (state.view === GameView.ONBOARDING_MIND || state.view === GameView.ONBOARDING_SPIRIT || state.view === GameView.INTRO) return;
        
        const caveConfig = CAVE_LEVELS.find(c => c.level === state.player.caveLevel) || CAVE_LEVELS[0];
        const bonuses = state.getBonuses();

        const multiplier = caveConfig.qiMultiplier + bonuses.qiMultiplier;
        
        const effectiveDemon = Math.max(0, state.player.innerDemon * (1 - bonuses.demonReduction));
        let demonFactor = 1.0;
        if (effectiveDemon > 80) demonFactor = 0.5;

        set({
          player: {
            ...state.player,
            qi: state.player.qi + ((BASE_QI_RATE * multiplier * demonFactor) / 10) + (bonuses.flatQi / 10),
            lastLoginTime: Date.now()
          }
        });
      },

      minorBreakthrough: () => set((state) => {
        const nextLevel = state.player.level + 1;
        const nextMaxQi = calculateMaxQi(state.player.rank, nextLevel);
        
        return {
          player: {
            ...state.player,
            level: nextLevel,
            qi: 0,
            maxQi: nextMaxQi,
            innerDemon: Math.max(0, state.player.innerDemon - 5)
          }
        };
      }),

      breakthroughSuccess: () => set((state) => {
        const ranks = Object.values(Rank);
        const currentIndex = ranks.indexOf(state.player.rank);
        const nextRank = ranks[currentIndex + 1] as Rank || Rank.IMMORTAL;
        const nextMaxQi = calculateMaxQi(nextRank, 1);

        return {
          view: GameView.DASHBOARD,
          player: {
            ...state.player,
            rank: nextRank,
            level: 1,
            qi: 0,
            maxQi: nextMaxQi,
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

        const item = ALL_ITEMS.find(i => i.id === itemId);
        if (!item) return;
        
        // If it's equipment, route to equipItem (though usually triggered by separate button)
        if (item.type === 'ARTIFACT') {
            state.equipItem(itemId);
            return;
        }

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

      equipItem: (itemId: string) => {
          const state = get();
          const item = ALL_ITEMS.find(i => i.id === itemId);
          if (!item || !item.slot || (state.player.inventory[itemId] || 0) <= 0) return;

          const slot = item.slot;
          const currentEquippedId = state.player.equipped[slot];
          
          let newInventory = { ...state.player.inventory };
          let newEquipped = { ...state.player.equipped };

          // If something is already equipped, unequip it first (add back to inventory)
          if (currentEquippedId) {
              newInventory[currentEquippedId] = (newInventory[currentEquippedId] || 0) + 1;
          }

          // Remove new item from inventory
          newInventory[itemId]--;
          
          // Equip new item
          newEquipped[slot] = itemId;

          set({
              player: {
                  ...state.player,
                  inventory: newInventory,
                  equipped: newEquipped
              }
          });
      },

      unequipItem: (slot: EquipmentSlot) => {
          const state = get();
          const itemId = state.player.equipped[slot];
          if (!itemId) return;

          set({
              player: {
                  ...state.player,
                  equipped: {
                      ...state.player.equipped,
                      [slot]: null
                  },
                  inventory: {
                      ...state.player.inventory,
                      [itemId]: (state.player.inventory[itemId] || 0) + 1
                  }
              }
          });
      },

      upgradeCave: () => {
        const state = get();
        const nextLevelIdx = state.player.caveLevel; 
        if (nextLevelIdx >= CAVE_LEVELS.length) return false;

        const config = CAVE_LEVELS[nextLevelIdx]; 
        if (!config) return false;

        if (state.player.spiritStones < config.upgradeCost.stones) return false;

        if (config.upgradeCost.materials) {
          for (const [matId, count] of Object.entries(config.upgradeCost.materials)) {
            if ((state.player.materials[matId] || 0) < count) return false;
          }
        }

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

        if (state.player.spiritStones < recipe.baseCost) return 'NO_RES';
        for (const [matId, count] of Object.entries(recipe.materials)) {
            if ((state.player.materials[matId] || 0) < count) return 'NO_RES';
        }

        const newStones = state.player.spiritStones - recipe.baseCost;
        const newMaterials = { ...state.player.materials };
        for (const [matId, count] of Object.entries(recipe.materials)) {
            newMaterials[matId] -= count;
        }

        const isSuccess = Math.random() < recipe.successRate;
        
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

        let updates: Partial<PlayerStats> = {};
        if (!state.player.maxQi || state.player.maxQi < 100) {
            updates.maxQi = calculateMaxQi(state.player.rank, state.player.level);
        }
        if(!state.player.level) updates.level = 1;
        
        // Initialize equipped if missing (migration)
        if (!state.player.equipped) {
            updates.equipped = INITIAL_STATS.equipped;
        }

        if (Object.keys(updates).length > 0) {
             set(s => ({ player: { ...s.player, ...updates } }));
        }

        const isIntroOrOnboarding = state.view === GameView.INTRO || state.view === GameView.ONBOARDING_SPIRIT || state.view === GameView.ONBOARDING_MIND;

        if (diffSeconds > 60 && !isIntroOrOnboarding) {
           const bonuses = state.getBonuses();
           const equipmentBonus = bonuses.qiMultiplier > 0 ? `(含装备加成 ${(bonuses.qiMultiplier*100).toFixed(0)}%)` : '';
           const gainedQi = diffSeconds * OFFLINE_QI_RATE * (1 + bonuses.qiMultiplier);
           
           const rankLabel = getRankLabel(state.player.rank, state.player.level);
           generateOfflineSummary(diffSeconds / 3600, rankLabel, state.player.innerDemon).then(summary => {
             set({ offlineReport: `摸鱼离线 ${Math.floor(diffSeconds/60)} 分钟。\n被动吸取灵气 ${Math.floor(gainedQi)} ${equipmentBonus}。\n\n${summary}` });
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
      name: 'xiuxian_save_v4',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
