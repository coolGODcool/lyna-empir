import React, { useRef, useState } from "react";
import { useEmpireStore } from "../store/useEmpireStore";
import { Store } from "../types";

interface GestureOptions {
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  setLikes: (likes: number | ((prev: number) => number)) => void;
  setShowFountain: (show: boolean) => void;
  setFeedbackType: (type: 'play' | 'pause' | null) => void;
  resetStealthTimer: (forceVisible?: boolean) => void;
  setSelectedStore: (store: Store) => void;
}

export function useEmpireGestures({
  isLiked,
  setIsLiked,
  setLikes,
  setShowFountain,
  setFeedbackType,
  resetStealthTimer,
  setSelectedStore
}: GestureOptions) {
  const { 
    isUiVisible, 
    setIsPaused, 
    setShowBounty 
  } = useEmpireStore();

  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const [longPressActive, setLongPressActive] = useState(false);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent, store: Store) => {
    if (!isUiVisible) {
      resetStealthTimer(true);
    }
    
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    touchStartPos.current = { x, y };
    setSelectedStore(store);

    if (!clickTimer.current) {
      clickCount.current = 0;
      clickTimer.current = setTimeout(() => {
        const screenWidth = window.innerWidth;
        const isInCenter = touchStartPos.current.x >= screenWidth * 0.2 && touchStartPos.current.x <= screenWidth * 0.8;

        if (isInCenter) {
          const finalCount = clickCount.current;
          if (finalCount === 1) {
            resetStealthTimer(true);
            setIsPaused(!useEmpireStore.getState().isPaused);
            const nextPaused = useEmpireStore.getState().isPaused;
            (window as any).isUserPaused = nextPaused;
            setFeedbackType(nextPaused ? 'pause' : 'play');
            setTimeout(() => setFeedbackType(null), 500);
          } else if (finalCount === 3) {
            resetStealthTimer(true);
            if (isLiked) {
              setLikes(prev => prev - 1);
              setIsLiked(false);
              setShowFountain(false);
            } else {
              setLikes(prev => prev + 1);
              setIsLiked(true);
              setShowFountain(true);
              setTimeout(() => setShowFountain(false), 1000);
            }
          } else if (finalCount >= 4) {
            resetStealthTimer(true);
            setShowBounty(true);
          }
        }
        clickCount.current = 0;
        clickTimer.current = null;
      }, 400);
    }

    clickCount.current += 1;

    longPressTimer.current = setTimeout(() => {
      setLongPressActive(true);
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      clickCount.current = 0;
    }, 600);
  };

  const handleInteractionEnd = (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const y = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    
    const dx = x - touchStartPos.current.x;
    const dy = y - touchStartPos.current.y;
    
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      clickCount.current = 0;
      setLongPressActive(false);
      return;
    }

    if (longPressActive) {
      setLongPressActive(false);
      return;
    }
  };

  return {
    handleInteractionStart,
    handleInteractionEnd,
    longPressActive
  };
}
