import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CacheState {
  // 缓存的数据
  cachedData: Record<string, { data: any; timestamp: number }>;
  
  // Actions
  setCache: (key: string, data: any, ttl?: number) => void;
  getCache: (key: string, ttl?: number) => any | null;
  clearCache: (key?: string) => void;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 分钟

export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({
      cachedData: {},
      
      setCache: (key, data, ttl = DEFAULT_TTL) => set((state) => ({
        cachedData: {
          ...state.cachedData,
          [key]: {
            data,
            timestamp: Date.now() + ttl,
          }
        }
      })),
      
      getCache: (key, ttl = DEFAULT_TTL) => {
        const cached = get().cachedData[key];
        if (!cached) return null;
        
        // 检查是否过期
        if (Date.now() > cached.timestamp) {
          // 过期，删除缓存
          set((state) => {
            const newCache = { ...state.cachedData };
            delete newCache[key];
            return { cachedData: newCache };
          });
          return null;
        }
        
        return cached.data;
      },
      
      clearCache: (key) => set((state) => {
        if (key) {
          const newCache = { ...state.cachedData };
          delete newCache[key];
          return { cachedData: newCache };
        }
        return { cachedData: {} };
      }),
    }),
    {
      name: 'xiuxian-cache-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);