import { useEffect, useRef } from "react";
import { useEmpireStore } from "../store/useEmpireStore";
import { Tab } from "../types";

export function useStealthTimer(activeTab: Tab, isSearchExpanded: boolean) {
  const {
    isPaused,
    showOrderPanel,
    showSupportPanel,
    setIsUiVisible
  } = useEmpireStore();

  const stealthTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetStealthTimer = (forceVisible = true) => {
    if (forceVisible) setIsUiVisible(true);
    if (stealthTimerRef.current) clearTimeout(stealthTimerRef.current);
    
    if (activeTab !== "home") {
      setIsUiVisible(true);
      return;
    }

    stealthTimerRef.current = setTimeout(() => {
      const state = useEmpireStore.getState();
      if (!state.isPaused && !isSearchExpanded && !state.showOrderPanel && !state.showSupportPanel) {
        setIsUiVisible(false);
      }
    }, 5000);
  };

  useEffect(() => {
    resetStealthTimer();
    return () => {
      if (stealthTimerRef.current) clearTimeout(stealthTimerRef.current);
    };
  }, [isPaused, isSearchExpanded, activeTab, showOrderPanel, showSupportPanel]);

  return { resetStealthTimer };
}
