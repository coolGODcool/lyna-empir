import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useEmpireStore } from "../../store/useEmpireStore";
import SearchSystem from "../SearchSystem";
import { Store } from "../../types";

interface EmpireHeaderProps {
  activeTab: string;
  isSearchExpanded: boolean;
  setIsSearchExpanded: (expanded: boolean) => void;
  setIsMenuOpen: (open: boolean) => void;
  resetStealthTimer: (forceVisible?: boolean) => void;
  stores: Store[];
  setSelectedStore: (store: Store) => void;
  setFeedbackType: (type: 'play' | 'pause' | null) => void;
}

export function EmpireHeader({
  activeTab,
  isSearchExpanded,
  setIsSearchExpanded,
  setIsMenuOpen,
  resetStealthTimer,
  stores,
  setSelectedStore,
  setFeedbackType
}: EmpireHeaderProps) {
  const {
    showMarquee,
    charityPool,
    isUiVisible,
    isPaused,
    setIsPaused,
    isUserMuted,
    setIsUserMuted,
    setShowOrderPanel
  } = useEmpireStore();

  const getQuarterlyProgress = () => {
    const now = new Date();
    const month = now.getMonth();
    const quarterStartMonth = Math.floor(month / 3) * 3;
    const quarterStart = new Date(now.getFullYear(), quarterStartMonth, 1);
    const nextQuarterStart = new Date(now.getFullYear(), quarterStartMonth + 3, 1);
    
    const totalDays = (nextQuarterStart.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (now.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24);
    
    return Math.min(100, Math.max(0, Math.floor((daysPassed / totalDays) * 100)));
  };

  const quarterlyProgress = getQuarterlyProgress();

  return (
    <header className="fixed top-0 left-0 w-full z-[6000] flex flex-col pointer-events-auto">
      <AnimatePresence initial={false}>
        {showMarquee && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 24, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="w-full flex items-center overflow-hidden pointer-events-none bg-black/10 backdrop-blur-[1px] relative"
          >
            <div className="absolute inset-0 marquee-dragon-bg" />
            <div className="whitespace-nowrap animate-marquee flex gap-12 relative z-10">
              <span className="text-[11px] font-black text-gold-primary uppercase tracking-[0.2em]">
                本季結算 {quarterlyProgress}% | 帝國公告：領主 5566 完成交易，8% 稅收已入庫！ 🏛️ 國庫資產已達 ${(charityPool / 1000000).toFixed(1)}M 🏛️
              </span>
              <span className="text-[11px] font-black text-gold-primary uppercase tracking-[0.2em]">
                本季結算 {quarterlyProgress}% | 帝國公告：領主 5566 完成交易，8% 稅收已入庫！ 🏛️ 國庫資產已達 ${(charityPool / 1000000).toFixed(1)}M 🏛️
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeTab === "home" && isUiVisible && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between px-6 py-2 gap-4"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); resetStealthTimer(true); }}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gold-primary/70 hover:text-gold-primary transition-all active:scale-95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
              >
                <Menu size={22} strokeWidth={1.2} />
              </button>
              
              <div className="flex-1 min-w-0">
                <SearchSystem 
                  onExpandChange={(expanded) => {
                    setIsSearchExpanded(expanded);
                    if (expanded) resetStealthTimer(true);
                  }}
                  onStoreSelect={(id) => {
                    const store = stores.find(s => s.id === id);
                    if (store) {
                      setSelectedStore(store);
                      setShowOrderPanel(true);
                      resetStealthTimer(true);
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-6 flex-shrink-0 ml-4">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  resetStealthTimer(true);
                  const nextPaused = !isPaused;
                  setIsPaused(nextPaused);
                  (window as any).isUserPaused = nextPaused;
                  setFeedbackType(nextPaused ? 'pause' : 'play');
                  setTimeout(() => setFeedbackType(null), 500);
                }}
                className="w-10 h-10 flex items-center justify-center text-gold-primary/70 hover:text-gold-primary transition-all active:scale-95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
              >
                {isPaused ? <Play size={22} strokeWidth={1.2} fill="currentColor" /> : <Pause size={22} strokeWidth={1.2} fill="currentColor" />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); resetStealthTimer(true); setIsUserMuted(!isUserMuted); }}
                className="w-10 h-10 flex items-center justify-center text-gold-primary/70 hover:text-gold-primary transition-all active:scale-95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
              >
                {isUserMuted ? <VolumeX size={22} strokeWidth={1.2} /> : <Volume2 size={22} strokeWidth={1.2} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
