import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { useEmpireStore } from "../../store/useEmpireStore";
import { NavIcon } from "../ui/InteractionButton";
import { LynaLIcon, ButlerIcon, QuestsIcon, LoungeIcon } from "../ui/EmpireIcons";
import { Tab } from "../../types";

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  resetStealthTimer: (forceVisible?: boolean) => void;
  shouldShowUI: boolean;
}

export function BottomNav({
  activeTab,
  setActiveTab,
  resetStealthTimer,
  shouldShowUI
}: BottomNavProps) {
  const { fixNavbar } = useEmpireStore();

  return (
    <AnimatePresence>
      {(shouldShowUI || fixNavbar) && (
        <motion.nav 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 w-full z-[5000] px-6 pb-8 pt-4 bg-gradient-to-t from-black-deep via-black-deep/95 to-transparent pointer-events-auto"
        >
          <div className="flex items-center justify-between max-w-md mx-auto">
            <NavIcon 
              icon={<LynaLIcon active={activeTab === "home"} />} 
              active={activeTab === "home"} 
              onClick={() => { setActiveTab("home"); resetStealthTimer(true); }} 
            />
            <NavIcon 
              icon={<ButlerIcon active={activeTab === "butler"} />} 
              active={activeTab === "butler"} 
              onClick={() => { setActiveTab("butler"); resetStealthTimer(true); }} 
            />
            
            {/* Plus Button - Special Style */}
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveTab("plus"); resetStealthTimer(true); }}
              className={`w-14 h-14 rounded-2xl bg-gold-primary flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-90 transition-all ${activeTab === "plus" ? 'scale-110 rotate-45' : ''}`}
            >
              <Plus size={32} strokeWidth={3} />
            </button>

            <NavIcon 
              icon={<QuestsIcon active={activeTab === "announcements"} />} 
              active={activeTab === "announcements"} 
              onClick={() => { setActiveTab("announcements"); resetStealthTimer(true); }} 
            />
            <NavIcon 
              icon={<LoungeIcon active={activeTab === "lounge"} />} 
              active={activeTab === "lounge"} 
              onClick={() => { setActiveTab("lounge"); resetStealthTimer(true); }} 
            />
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
