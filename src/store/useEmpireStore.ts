import { create } from 'zustand';
import { Store } from '../types';
import { INITIAL_STORES } from '../constants';

interface EmpireState {
  // 帝國經濟與用戶資訊
  balance: number;
  charityPool: number;
  userId: string;
  trustScore: number;
  
  // 核心數據
  stores: Store[];
  selectedStore: Store | null;
  
  // 全局 UI 開關
  showMarquee: boolean;
  fixNavbar: boolean;
  isUiVisible: boolean;
  isPaused: boolean;
  isUserMuted: boolean;
  
  // 面板控制
  showBounty: boolean;
  showOrderPanel: boolean;
  showSupportPanel: boolean;
  showComments: boolean;
  showLevelUp: boolean;
  
  // 演算法權重
  interestWeights: Record<string, number>;

  // Actions
  setBalance: (balance: number | ((prev: number) => number)) => void;
  setCharityPool: (pool: number | ((prev: number) => number)) => void;
  setUserId: (id: string) => void;
  setTrustScore: (score: number | ((prev: number) => number)) => void;
  setSelectedStore: (store: Store | null) => void;
  setShowMarquee: (show: boolean) => void;
  setFixNavbar: (fix: boolean) => void;
  setIsUiVisible: (visible: boolean) => void;
  setIsPaused: (paused: boolean) => void;
  setIsUserMuted: (muted: boolean) => void;
  setShowBounty: (show: boolean) => void;
  setShowOrderPanel: (show: boolean) => void;
  setShowSupportPanel: (show: boolean) => void;
  setShowComments: (show: boolean) => void;
  setShowLevelUp: (show: boolean) => void;
  updateWeights: (tags: string[]) => void;
}

export const useEmpireStore = create<EmpireState>((set) => ({
  balance: 24500,
  charityPool: 8200000,
  userId: "LN-001",
  trustScore: 98,
  
  stores: INITIAL_STORES,
  selectedStore: INITIAL_STORES[0],
  
  showMarquee: true,
  fixNavbar: false,
  isUiVisible: true,
  isPaused: false,
  isUserMuted: true,
  
  showBounty: false,
  showOrderPanel: false,
  showSupportPanel: false,
  showComments: false,
  showLevelUp: false,
  
  interestWeights: {},

  setBalance: (balance) => set((state) => ({ 
    balance: typeof balance === 'function' ? balance(state.balance) : balance 
  })),
  setCharityPool: (pool) => set((state) => ({ 
    charityPool: typeof pool === 'function' ? pool(state.charityPool) : pool 
  })),
  setUserId: (id) => set({ userId: id }),
  setTrustScore: (score) => set((state) => ({
    trustScore: typeof score === 'function' ? score(state.trustScore) : score
  })),
  setSelectedStore: (store) => set({ selectedStore: store }),
  setShowMarquee: (show) => set({ showMarquee: show }),
  setFixNavbar: (fix) => set({ fixNavbar: fix }),
  setIsUiVisible: (visible) => set({ isUiVisible: visible }),
  setIsPaused: (paused) => set({ isPaused: paused }),
  setIsUserMuted: (muted) => set({ isUserMuted: muted }),
  setShowBounty: (show) => set({ showBounty: show }),
  setShowOrderPanel: (show) => set({ showOrderPanel: show }),
  setShowSupportPanel: (show) => set({ showSupportPanel: show }),
  setShowComments: (show) => set({ showComments: show }),
  setShowLevelUp: (show) => set({ showLevelUp: show }),
  updateWeights: (tags) => set((state) => {
    const next = { ...state.interestWeights };
    tags.forEach(tag => {
      next[tag] = (next[tag] || 0) + 1;
    });
    return { interestWeights: next };
  }),
}));
