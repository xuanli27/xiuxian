import { create } from 'zustand';

/**
 * 客户端UI状态管理
 * 注意: 这个store只应该用于管理与后端无关的、短暂的客户端状态，
 * 例如模态框的开关、UI元素的临时状态等。
 * 所有的服务端数据（玩家状态、任务等）都应该通过React Query来管理。
 */

interface UiState {
  isSettingsModalOpen: boolean;
  toggleSettingsModal: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isSettingsModalOpen: false,
  toggleSettingsModal: () => set((state) => ({ isSettingsModalOpen: !state.isSettingsModalOpen })),
}));

// 原始的 useGameStore 已被废弃，其功能由 React Query 和 usePlayer hook 取代。
// 如果确实需要一个跨组件共享的、与游戏逻辑相关的客户端状态，可以在这里重新设计。
// 示例:
// interface GameSessionState {
//   lastEventId: string | null;
//   setLastEventId: (id: string) => void;
// }
// export const useGameSessionStore = create<GameSessionState>()(...)