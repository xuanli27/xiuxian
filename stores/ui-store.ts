import { create } from 'zustand';

interface UIState {
  // Modal 状态
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  
  // Loading 状态
  isLoading: boolean;
  loadingMessage: string;
  
  // Toast 通知
  toasts: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  
  // Actions
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  setLoading: (loading: boolean, message?: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  modalContent: null,
  isLoading: false,
  loadingMessage: '',
  toasts: [],
  
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  
  setLoading: (loading, message = '') => set({ isLoading: loading, loadingMessage: message }),
  
  addToast: (message, type = 'info') => set((state) => ({
    toasts: [...state.toasts, { id: Date.now().toString(), message, type }]
  })),
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));