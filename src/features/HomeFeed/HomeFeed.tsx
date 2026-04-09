import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Heart, Coins, MessageSquare, Share2, Clock, Calendar } from "lucide-react";
import { useEmpireStore } from "../../store/useEmpireStore";
import { useEmpireGestures } from "../../hooks/useEmpireGestures";
import VideoPlayer from "../../components/VideoPlayer";
import { InteractionButton } from "../../components/ui/InteractionButton";
import { Store } from "../../types";

interface HomeFeedProps {
  stores: Store[];
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
  selectedStore: Store | null;
  setSelectedStore: (store: Store) => void;
  feedbackType: 'play' | 'pause' | null;
  setFeedbackType: (type: 'play' | 'pause' | null) => void;
  resetStealthTimer: (forceVisible?: boolean) => void;
  shouldShowUI: boolean;
  userId: string;
  likes: number;
  setLikes: (likes: number | ((prev: number) => number)) => void;
  isLiked: boolean;
  setIsLiked: (liked: boolean) => void;
  showFountain: boolean;
  setShowFountain: (show: boolean) => void;
  isInfoExpanded: boolean;
  setIsInfoExpanded: (expanded: boolean) => void;
}

export function HomeFeed({
  stores,
  activeVideoId,
  setActiveVideoId,
  selectedStore,
  setSelectedStore,
  feedbackType,
  setFeedbackType,
  resetStealthTimer,
  shouldShowUI,
  userId,
  likes,
  setLikes,
  isLiked,
  setIsLiked,
  showFountain,
  setShowFountain,
  isInfoExpanded,
  setIsInfoExpanded
}: HomeFeedProps) {
  const {
    isPaused,
    isUserMuted,
    isUiVisible,
    setShowOrderPanel,
    setShowSupportPanel,
    setShowComments,
    updateWeights
  } = useEmpireStore();

  const { handleInteractionStart, handleInteractionEnd } = useEmpireGestures({
    isLiked,
    setIsLiked,
    setLikes,
    setShowFountain,
    setFeedbackType,
    resetStealthTimer,
    setSelectedStore
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setActiveVideoId(id);
              const store = stores.find(s => s.id === id);
              if (store) setSelectedStore(store);
            }
            
            const video = entry.target.querySelector('video');
            if (video && (window as any).isUserPaused) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    const items = document.querySelectorAll('.snap-item');
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [stores]);

  return (
    <div className="h-full snap-container overflow-y-scroll overflow-x-hidden snap-y snap-mandatory bg-black">
      {stores.map((store) => (
        <div 
          key={store.id} 
          data-id={store.id}
          className="snap-item relative h-dvh w-full snap-start overflow-hidden pointer-events-auto"
          onMouseDown={(e) => handleInteractionStart(e, store)}
          onMouseUp={handleInteractionEnd}
          onTouchStart={(e) => handleInteractionStart(e, store)}
          onTouchEnd={handleInteractionEnd}
        >
          <VideoPlayer 
            src={store.video} 
            poster={store.image} 
            isActive={activeVideoId === store.id} 
            isPaused={isPaused && activeVideoId === store.id}
            muted={isUserMuted}
            feedbackType={activeVideoId === store.id ? feedbackType : null}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
          
          {/* Info Tags - Bottom Left */}
          <div 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setIsInfoExpanded(!isInfoExpanded);
              resetStealthTimer();
            }}
            className={`absolute bottom-32 left-6 right-24 space-y-1 pointer-events-auto z-30 transition-all duration-700 cursor-pointer ${isUiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gold-primary drop-shadow-md">⭐️ #評價: {store.rating}</span>
                <span className="text-white/30 text-[8px]">|</span>
                <span className="text-[10px] font-black text-gold-primary drop-shadow-md">📍 #距離: {store.distance}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white italic tracking-tighter drop-shadow-md">{store.name}</h3>
                <span className="text-white/30 text-[8px]">|</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest drop-shadow-md transition-all ${
                  userId === "LN-001" && store.id === "1" 
                    ? "glow-ceo" 
                    : store.type === 'merchant' 
                      ? "glow-lord text-gold-primary" 
                      : "glow-citizen text-blue-400"
                }`}>
                  {userId === "LN-001" && store.id === "1" ? "帝國 CEO" : store.type === 'merchant' ? "帝國領主" : "帝國子民"}
                </span>
              </div>

              {!isInfoExpanded && (
                <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest animate-pulse pt-1">
                  點擊展開詳情
                </div>
              )}
            </div>
            
            <motion.div 
              initial={false}
              animate={{ 
                height: isInfoExpanded ? "auto" : 0,
                opacity: isInfoExpanded ? 1 : 0,
                marginTop: isInfoExpanded ? 4 : 0
              }}
              className="overflow-hidden space-y-2"
            >
              <div className="flex items-center gap-2 pt-2">
                <div className="w-8 h-8 rounded-full border border-gold-primary/30 overflow-hidden shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                  <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">官方認證帳號</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-white/90 font-bold leading-relaxed drop-shadow-md">
                  {store.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {store.tags.map((tag, idx) => (
                    <span key={idx} className="text-[8px] font-bold text-white/60 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar Interaction Chain */}
          <div className={`absolute right-4 bottom-32 flex flex-col gap-5 items-center z-20 transition-all duration-700 ${shouldShowUI ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}`}>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setShowOrderPanel(true);
                resetStealthTimer();
                updateWeights(store.tags);
              }}
              className="flex flex-col items-center gap-1 mb-2 cursor-pointer active:scale-90 transition-transform group"
            >
              <div className="w-12 h-12 flex items-center justify-center text-gold-primary transition-all">
                <div className="transform transition-transform group-hover:scale-110 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  {store.serviceMode === 'reserve' ? <Calendar size={20} strokeWidth={1.5} /> : <Clock size={20} strokeWidth={1.5} />}
                </div>
              </div>
              <span className="text-[9px] font-black text-gold-primary drop-shadow-md opacity-90 group-hover:opacity-100">
                {store.serviceMode === 'reserve' ? "預約制" : store.queueTime}
              </span>
            </div>

            <InteractionButton 
              icon={<Heart size={18} className={isLiked ? "text-red-500 fill-red-500" : "text-white"} />} 
              label={likes.toLocaleString()} 
              onClick={() => {
                resetStealthTimer();
                updateWeights(store.tags);
                if (isLiked) {
                  setLikes(prev => prev - 1);
                  setIsLiked(false);
                } else {
                  setLikes(prev => prev + 1);
                  setIsLiked(true);
                  setShowFountain(true);
                  setTimeout(() => setShowFountain(false), 1000);
                }
              }}
            />
            <InteractionButton icon={<Coins size={18} />} label="贊助" onClick={() => { setShowSupportPanel(true); resetStealthTimer(); updateWeights(store.tags); }} />
            <InteractionButton icon={<MessageSquare size={18} />} label="留言" onClick={() => { setShowComments(true); resetStealthTimer(); updateWeights(store.tags); }} />
            <InteractionButton icon={<Share2 size={18} />} label="分享" onClick={() => {
              resetStealthTimer();
              updateWeights(store.tags);
              const referralCode = `LYNA-${userId}-${store.id}`;
              navigator.clipboard.writeText(`${window.location.origin}/?shopId=${store.id}&ref=${referralCode}`);
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
