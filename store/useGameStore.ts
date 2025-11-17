import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlayerStats, Rank, SectRank, SpiritRootType, Task, GameView, RANK_THRESHOLDS, SECT_PROMOTION_COST, SHOP_ITEMS, SHOP_PRICES, Theme } from '../types';
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
  location: '工位',
  history: [],
  inventory: {},
  theme: 'dark',
  createTime: Date.now(),
  lastLoginTime: Date.now()
};

const OFFLINE_QI_RATE = 0.5; 
const ONLINE_QI_RATE = 2;

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
  completeTask: (task: Task) => void;
  gainQi: (amount: number) => void;
  tick: () => void;
  breakthroughSuccess: () => void;
  breakthroughFail: () => void;
  promoteSectRank: () => boolean;
  buyItem: (itemId: string) => boolean;
  useItem: (itemId: string) => void;
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

      completeTask: (task) => set((state) => {
        if (state.tasks.find(t => t.id === task.id)?.completed) return {};
        return {
          player: {
            ...state.player,
            qi: state.player.qi + task.reward.qi,
            contribution: state.player.contribution + (task.reward.contribution || 10)
          },
          tasks: state.tasks.map(t => t.id === task.id ? { ...t, completed: true } : t)
        };
      }),

      gainQi: (amount) => set((state) => ({
        player: { ...state.player, qi: state.player.qi + amount }
      })),

      tick: () => set((state) => {
        if (state.view === GameView.ONBOARDING_MIND || state.view === GameView.ONBOARDING_SPIRIT) return {};
        return {
          player: {
            ...state.player,
            qi: state.player.qi + (ONLINE_QI_RATE / 10),
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
            innerDemon: Math.max(0, state.player.innerDemon - 20)
          }
        };
      }),

      breakthroughFail: () => set((state) => ({
        view: GameView.DASHBOARD,
        player: {
          ...state.player,
          qi: Math.floor(state.player.qi * 0.5),
          innerDemon: Math.min(100, state.player.innerDemon + 20)
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

      clearOfflineReport: () => set({ offlineReport: null }),

      initializeGame: () => {
        const state = get();
        const now = Date.now();
        const diffSeconds = (now - state.player.lastLoginTime) / 1000;

        // Ensure theme is valid (migration)
        if (!state.player.theme) {
             set((state) => ({ player: { ...state.player, theme: 'dark' }}));
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