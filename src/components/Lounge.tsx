// 領主交誼廳，提供社交互動與即時資訊分享。
/**
 * 模組名稱：帝國交誼廳 (Lounge.tsx)
 * 功能描述：社交與數據展示區。包含限領主進入的「戰爭指揮室」以及「E-Card 競技場」的入口。
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Spade,
  Heart,
  Club,
  Gamepad2,
  Gavel,
  Mic2,
  ChevronLeft,
  ArrowRight,
  Sparkles
} from "lucide-react";
import ECardArena from "./ECardArena";
import AuctionHouse from "./AuctionHouse";
import SanctumRoom from "./SanctumRoom";

type View = "lobby" | "game" | "echo" | "auction" | "sanctum";

interface LoungeProps {
  userId?: string;
  onGameToggle?: (active: boolean) => void;
}

/**
 * 模組名稱：帝國交誼廳 (Lounge.tsx)
 * 重構目標：兩層式導航架構 (大廳門面 -> 各廳功能)
 */
export default function Lounge({ userId = "User_001", onGameToggle }: LoungeProps) {
  const [view, setView] = useState<View>("lobby");
  const [selectedRoom, setSelectedRoom] = useState<{ title: string; path: string } | null>(null);

  // 當進入子廳時，通知 App 進入沈浸模式 (隱藏導航)
  useEffect(() => {
    onGameToggle?.(view !== "lobby");
  }, [view, onGameToggle]);

  const handleBack = () => {
    setView("lobby");
    setSelectedRoom(null);
  };

  const handleEnterRoom = (title: string, path: string) => {
    setSelectedRoom({ title, path });
    setView("sanctum");
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {view === "lobby" ? (
          <LobbyView onSelect={setView} />
        ) : (
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="h-full w-full"
          >
            {/* 返回按鈕 - 常駐左上角 (在聖所內部時由組件自行控制顯示) */}
            {view !== "sanctum" && (
              <button 
                onClick={handleBack}
                className="fixed top-28 left-6 z-[400] flex items-center gap-2 px-4 py-2 bg-gold-primary/10 backdrop-blur-md border border-gold-primary/30 rounded-full text-gold-primary font-black text-xs uppercase tracking-widest hover:bg-gold-primary/20 transition-all active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <ChevronLeft size={16} />
                返回大廳
              </button>
            )}

            {view === "game" && <ECardArena />}
            {view === "auction" && <AuctionHouse userId={userId} />}
            {view === "echo" && <EchoHall onEnterRoom={handleEnterRoom} />}
            {view === "sanctum" && selectedRoom && (
              <SanctumRoom 
                roomTitle={selectedRoom.title} 
                channelPath={selectedRoom.path} 
                onBack={() => setView("echo")} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- 第一層：帝國大廳 (Lobby) ---
function LobbyView({ onSelect }: { onSelect: (v: View) => void }) {
  return (
    <motion.div 
      key="lobby"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full flex flex-col p-6 pt-10"
    >
      <div className="mb-10">
        <div className="flex items-center gap-2 text-gold-primary/60 mb-2">
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.5em] font-mono font-black">Imperial Social Hub</span>
        </div>
        <h1 className="text-5xl font-black gold-gradient-text italic tracking-tighter leading-none">帝國大廳</h1>
        <p className="text-sm text-gold-light/40 font-serif mt-2 italic">「權力、聲望與財富的交匯之巔。」</p>
      </div>

      {/* 水平排列卡片 - 全屏高度感 - 支援橫向捲動與 Snap */}
      <div className="flex-1 flex gap-8 overflow-x-auto pb-32 no-scrollbar snap-x snap-mandatory px-2">
        <EntryCard 
          title="GAME 廳"
          subtitle="E-Card 競技場"
          description="階級叛亂與心理博弈的終極戰場，勝者為王。"
          icon={<Gamepad2 size={80} className="text-purple-400 drop-shadow-[0_0_25px_rgba(168,85,247,0.9)]" />}
          color="purple"
          onClick={() => onSelect("game")}
        />
        <EntryCard 
          title="L-Echo 廳"
          subtitle="帝國共鳴室"
          description="即時語音與數據共鳴，聽見帝國最深處的心跳。"
          icon={<Mic2 size={80} className="text-gold-primary drop-shadow-[0_0_25px_rgba(212,175,55,0.9)]" />}
          color="gold"
          onClick={() => onSelect("echo")}
        />
        <EntryCard 
          title="拍賣場"
          subtitle="財富收割機"
          description="稀有資產與權力憑證的公開競逐，財富重新洗牌。"
          icon={<Gavel size={80} className="text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.9)]" />}
          color="red"
          onClick={() => onSelect("auction")}
        />
      </div>
    </motion.div>
  );
}

// --- 入口卡片組件 (EntryCard) ---
interface EntryCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: "purple" | "gold" | "red";
  onClick: () => void;
}

function EntryCard({ title, subtitle, description, icon, color, onClick }: EntryCardProps) {
  const colorMap = {
    purple: "from-purple-500/30 to-transparent border-purple-500/40 group-hover:border-purple-500/80 shadow-purple-500/30",
    gold: "from-gold-primary/30 to-transparent border-gold-primary/40 group-hover:border-gold-primary/80 shadow-gold-primary/30",
    red: "from-red-500/30 to-transparent border-red-500/40 group-hover:border-red-500/80 shadow-red-500/30",
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.03, 
        rotateY: 8,
        rotateX: -2,
        z: 100
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      className={`relative flex-shrink-0 w-[82vw] sm:w-[340px] h-full rounded-[2.5rem] p-10 bg-black/40 backdrop-blur-3xl border-2 flex flex-col justify-between group cursor-pointer overflow-hidden transition-all duration-700 snap-center shadow-2xl`}
    >
      {/* 內部動態光暈 */}
      <div className={`absolute -inset-full opacity-0 group-hover:opacity-30 transition-opacity duration-1000 bg-gradient-to-tr ${color === 'purple' ? 'from-purple-600' : color === 'gold' ? 'from-gold-primary' : 'from-red-600'} via-transparent to-transparent rotate-45 pointer-events-none`} />
      
      {/* 頂部資訊 */}
      <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
        <div className="flex items-center gap-3 mb-3">
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className={`w-2.5 h-2.5 rounded-full ${color === 'purple' ? 'bg-purple-500' : color === 'gold' ? 'bg-gold-primary' : 'bg-red-500'} shadow-[0_0_10px_currentColor]`} 
          />
          <span className="text-[11px] font-mono font-black uppercase tracking-[0.4em] text-white/50">{subtitle}</span>
        </div>
        <h3 className={`text-6xl font-black italic tracking-tighter mb-6 leading-none ${color === 'gold' ? 'gold-gradient-text' : 'text-white'}`}>
          {title}
        </h3>
      </div>

      {/* 中間圖標 - 3D 懸浮感 */}
      <div className="relative z-10 flex justify-center py-10 transform group-hover:scale-125 transition-transform duration-1000 ease-out" style={{ transform: "translateZ(80px)" }}>
        <div className="relative">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-0 blur-[60px] opacity-50 ${color === 'purple' ? 'bg-purple-500' : color === 'gold' ? 'bg-gold-primary' : 'bg-red-500'}`} 
          />
          <div className="relative z-10 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {icon}
          </div>
        </div>
      </div>

      {/* 底部描述 */}
      <div className="relative z-10 space-y-8" style={{ transform: "translateZ(30px)" }}>
        <p className="text-base text-white/70 font-serif leading-relaxed italic border-l-2 border-gold-primary/30 pl-4">
          "{description}"
        </p>
        
        <div className={`flex items-center justify-between pt-8 border-t border-white/10 ${colorMap[color]} transition-all duration-500`}>
          <span className="text-[11px] font-black text-gold-primary uppercase tracking-[0.5em]">Enter Chamber</span>
          <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center group-hover:bg-gold-primary group-hover:text-black transition-all duration-500">
            <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 金色流光邊框效果 */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-primary/30 transition-colors duration-700 pointer-events-none rounded-[2.5rem]" />
    </motion.div>
  );
}

// --- L-Echo 廳 Placeholder ---
function EchoHall({ onEnterRoom }: { onEnterRoom: (title: string, path: string) => void }) {
  const rooms = [
    { id: '1', title: '鳳山跑團交流', path: '鳳山 > 體育 > 路跑團', online: 42 },
    { id: '2', title: '帝國戰略週報', path: '帝國 > 政治 > 戰略室', online: 128 },
    { id: '3', title: '深夜微醺電台', path: '休閒 > 娛樂 > 語音廳', online: 65 },
  ];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 space-y-8">
      <div className="relative">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gold-primary/20 rounded-full blur-3xl"
        />
        <Mic2 size={80} className="text-gold-primary relative z-10" />
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black gold-gradient-text italic tracking-tighter">L-Echo 帝國共鳴室</h2>
        <p className="text-sm text-gold-light/60 font-serif">「聽見權力的回響，與領主共振。」</p>
      </div>

      <div className="grid grid-cols-1 w-full max-w-xs gap-4">
        {rooms.map(room => (
          <motion.div 
            key={room.id} 
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEnterRoom(room.title, room.path)}
            className="glass-card p-4 border-white/5 bg-white/5 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-white">{room.title}</span>
              </div>
              <span className="text-[8px] text-white/40 font-mono uppercase tracking-widest">{room.path}</span>
            </div>
            <span className="text-[10px] text-gold-primary font-mono">{room.online} 領主</span>
          </motion.div>
        ))}
      </div>

      <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-mono">System Initializing...</p>
    </div>
  );
}
