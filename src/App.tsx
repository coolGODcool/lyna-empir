/**
 * 模組名稱：帝國中樞 (App.tsx) - 重構後
 * 功能描述：應用程式核心入口。負責導航切換、全域狀態管理、
 * 影片饋送流（Video Feed）的渲染，以及整合所有功能面板。
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// Layout & Features
import { EmpireHeader } from "./components/layout/EmpireHeader";
import { BottomNav } from "./components/layout/BottomNav";
import { CeoMenu } from "./components/layout/CeoMenu";
import { HomeFeed } from "./features/HomeFeed/HomeFeed";
import { CreatePost } from "./features/CreatePost/CreatePost";

// Components
import Butler from "./components/Butler";
import Quests from "./components/Quests";
import Lounge from "./components/Lounge";
import OrderDrawer from "./components/OrderDrawer";
import BountyPanel from "./components/BountyPanel";
import LevelUpAnimation from "./components/LevelUpAnimation";
import CommentPanel from "./components/CommentPanel";
import SupportPanel from "./components/SupportPanel";

// Hooks & Store
import { useEmpireStore } from "./store/useEmpireStore";
import { useStealthTimer } from "./hooks/useStealthTimer";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Types & Constants
import { Tab, OrderData } from "./types";

export default function App() {
  // Local States (Orchestration)
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [activeVideoId, setActiveVideoId] = useState<string | null>("1");
  
  // Interaction States
  const [likes, setLikes] = useState(995);
  const [isLiked, setIsLiked] = useState(false);
  const [showFountain, setShowFountain] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'play' | 'pause' | null>(null);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  
  // UI Control States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);

  // Zustand Store
  const {
    userId,
    balance,
    setBalance,
    charityPool,
    setCharityPool,
    stores,
    selectedStore,
    setSelectedStore,
    isUiVisible,
    isPaused,
    showComments,
    showBounty,
    showLevelUp,
    showOrderPanel,
    showSupportPanel,
    interestWeights
  } = useEmpireStore();

  // Stealth Timer Hook
  const { resetStealthTimer } = useStealthTimer(activeTab, isSearchExpanded);

  // Immersive Logic
  const isImmersivePanelOpen = showComments || showBounty || isMenuOpen || isGameActive;
  const isOverlayPanelOpen = showOrderPanel || showSupportPanel;
  const isPanelOpen = isImmersivePanelOpen || isOverlayPanelOpen;
  const shouldShowUI = !isPanelOpen && !isKeyboardVisible && isUiVisible;

  // Keyboard Detection
  useEffect(() => {
    if (!window.visualViewport) return;
    const handleResize = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;
      const offset = window.innerHeight - viewport.height;
      setIsKeyboardVisible(offset > 100);
    };
    window.visualViewport.addEventListener("resize", handleResize);
    return () => window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  // Algorithm Sorting
  const sortedStores = React.useMemo(() => {
    return [...stores].sort((a, b) => {
      const scoreA = a.tags.reduce((sum, tag) => sum + (interestWeights[tag] || 0), 0);
      const scoreB = b.tags.reduce((sum, tag) => sum + (interestWeights[tag] || 0), 0);
      return scoreB - scoreA;
    });
  }, [stores, interestWeights]);

  // Order Confirmation
  const handleOrderConfirm = (data: OrderData) => {
    const charityFee = data.totalAmount * 0.01;
    const cashback = data.totalAmount * 0.01;
    setBalance(prev => prev - data.totalAmount + cashback);
    setCharityPool(prev => prev + charityFee);
  };

  return (
    <div className="relative h-[100dvh] w-full bg-black-deep overflow-hidden safe-area-bottom touch-manipulation select-none">
      {/* 1. Header */}
      <EmpireHeader 
        activeTab={activeTab}
        isSearchExpanded={isSearchExpanded}
        setIsSearchExpanded={setIsSearchExpanded}
        setIsMenuOpen={setIsMenuOpen}
        resetStealthTimer={resetStealthTimer}
        stores={stores}
        setSelectedStore={setSelectedStore}
        setFeedbackType={setFeedbackType}
      />

      {/* 2. Main Content Switcher */}
      <ErrorBoundary>
      <main className={`h-full w-full transition-all duration-300 ${isImmersivePanelOpen ? 'pb-[env(safe-area-inset-bottom,20px)]' : 'pb-[120px]'}`} style={{ opacity: 1 }}>
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative h-dvh w-full overflow-hidden">
              <HomeFeed 
                stores={sortedStores}
                activeVideoId={activeVideoId}
                setActiveVideoId={setActiveVideoId}
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
                feedbackType={feedbackType}
                setFeedbackType={setFeedbackType}
                resetStealthTimer={resetStealthTimer}
                shouldShowUI={shouldShowUI}
                userId={userId}
                likes={likes}
                setLikes={setLikes}
                isLiked={isLiked}
                setIsLiked={setIsLiked}
                showFountain={showFountain}
                setShowFountain={setShowFountain}
                isInfoExpanded={isInfoExpanded}
                setIsInfoExpanded={setIsInfoExpanded}
              />
            </motion.div>
          )}

          {activeTab === "butler" && (
            <motion.div key="butler" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pt-24 h-full overflow-y-auto">
              <Butler />
            </motion.div>
          )}

          {activeTab === "announcements" && (
            <motion.div key="quests" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pt-24 h-full overflow-y-auto">
              <Quests />
            </motion.div>
          )}

          {activeTab === "lounge" && (
            <motion.div key="lounge" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="pt-24 h-full overflow-y-auto">
              <Lounge userId={userId} onGameToggle={setIsGameActive} />
            </motion.div>
          )}

          {activeTab === "plus" && (
            <motion.div key="plus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CreatePost onClose={() => setActiveTab("home")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </ErrorBoundary>

      {/* 3. Global Overlays (Zustand Controlled) */}
      <CeoMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <OrderDrawer 
        storeName={selectedStore?.name || ""}
        onConfirm={handleOrderConfirm}
        pricePerUnit={150}
      />

      <SupportPanel 
        onConfirm={(amount) => setBalance(prev => prev - amount)}
        balance={balance}
      />

      <CommentPanel 
        storeName={selectedStore?.name || ""}
      />

      <BountyPanel 
        onConfirm={(amount) => setBalance(prev => prev - amount)}
      />

      <LevelUpAnimation 
        levelName="榮耀晉升：銀牌說客"
        commissionRate="0.6%"
      />

      {/* 4. Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        resetStealthTimer={resetStealthTimer}
        shouldShowUI={shouldShowUI}
      />
    </div>
  );
}
