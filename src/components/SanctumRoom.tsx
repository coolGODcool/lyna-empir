import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Share2, 
  Hand, 
  MessageSquare, 
  Users, 
  Flame, 
  MoreVertical, 
  ChevronLeft,
  Sparkles,
  Zap,
  Gift,
  Maximize2,
  Minimize2
} from "lucide-react";

interface SanctumRoomProps {
  roomTitle: string;
  channelPath: string;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  user: string;
  role: 'CEO' | 'Lord' | 'Citizen';
  text: string;
}

export default function SanctumRoom({ roomTitle, channelPath, onBack }: SanctumRoomProps) {
  const [isImmersive, setIsImmersive] = useState(false);
  const [heat, setHeat] = useState(12800);
  const [hearts, setHearts] = useState(5420);
  const [onlineCount, setOnlineCount] = useState(42);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [showSponsorEffect, setShowSponsorEffect] = useState(false);
  const [showEventPopup, setShowEventPopup] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: '領主_阿爾法', role: 'Lord', text: '帝國的榮光永存！' },
    { id: '2', user: '子民_小明', role: 'Citizen', text: '這首歌太好聽了...' },
    { id: '3', user: 'CEO_萊娜', role: 'CEO', text: '歡迎各位來到聖所。' },
  ]);

  // 模擬數據變化
  useEffect(() => {
    const interval = setInterval(() => {
      setHeat(prev => prev + Math.floor(Math.random() * 10));
      setHearts(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSponsor = () => {
    setShowSponsorEffect(true);
    setTimeout(() => setShowSponsorEffect(false), 5000);
  };

  const handleStartEvent = () => {
    setShowEventPopup(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-transparent">
      {/* 頂層 UI: 左上角資訊 */}
      <AnimatePresence>
        {!isImmersive && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-10 left-6 z-50 space-y-1"
          >
            <div className="flex items-center gap-2 text-[10px] font-mono font-black text-gold-primary/60 uppercase tracking-[0.2em]">
              <span>{channelPath}</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white italic tracking-tighter">{roomTitle}</h2>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <Users size={10} className="text-gold-primary" />
                <span className="text-[10px] font-bold text-white/80">{onlineCount}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 頂層 UI: 右上角熱度 */}
      <AnimatePresence>
        {!isImmersive && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-10 right-6 z-50 flex flex-col items-end gap-1"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-gold-primary/20">
              <Flame size={14} className="text-orange-500 animate-pulse" />
              <span className="text-xs font-black text-gold-primary font-mono">{heat.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-white/40">
              <Heart size={10} className="fill-red-500 text-red-500" />
              <span>{hearts.toLocaleString()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 中間核心區: Echo Sphere */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <EchoSphere isSpeaking={isSpeaking} role="CEO" />
      </div>

      {/* 右側動作欄 */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6">
        <ActionButton icon={<Heart size={24} />} label="喜歡" onClick={() => setHearts(h => h + 1)} />
        <ActionButton icon={<Gift size={24} />} label="贊助" onClick={handleSponsor} />
        <ActionButton icon={<Share2 size={24} />} label="分享" />
        <ActionButton icon={<Hand size={24} />} label="舉手" />
        <ActionButton 
          icon={isImmersive ? <Minimize2 size={24} /> : <Maximize2 size={24} />} 
          label={isImmersive ? "退出沈浸" : "全景沈浸"} 
          onClick={() => setIsImmersive(!isImmersive)} 
        />
      </div>

      {/* 下方聊天區域 */}
      <AnimatePresence>
        {!isImmersive && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-6 right-20 z-40 h-48 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 p-4 bg-black/30 backdrop-blur-md rounded-2xl border border-white/5">
              {messages.map(msg => (
                <div key={msg.id} className="flex items-start gap-2 text-sm">
                  <span className={`font-black whitespace-nowrap ${
                    msg.role === 'CEO' ? 'text-purple-400' : 
                    msg.role === 'Lord' ? 'text-gold-primary' : 'text-blue-400'
                  }`}>
                    [{msg.role}] {msg.user}:
                  </span>
                  <span className="text-white/80 font-serif italic">{msg.text}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-3 flex items-center gap-3">
              <button 
                onClick={handleStartEvent}
                className="px-4 py-2 bg-gold-primary text-black font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Zap size={14} />
                發起活動
              </button>
              <div className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/40 text-xs font-serif italic">
                輸入訊息...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 全屏贊助特效 */}
      <AnimatePresence>
        {showSponsorEffect && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] pointer-events-none"
          >
            <SponsorParticleRain />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gold-primary/20 backdrop-blur-xl p-8 rounded-full border-2 border-gold-primary shadow-[0_0_50px_rgba(212,175,55,0.5)]"
              >
                <div className="text-center">
                  <Sparkles size={48} className="text-gold-primary mx-auto mb-2 animate-spin" />
                  <h3 className="text-3xl font-black gold-gradient-text italic tracking-tighter">領主大額贊助！</h3>
                  <p className="text-white/80 font-serif mt-1">「榮耀歸於帝國」</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 活動彈窗 */}
      <AnimatePresence>
        {showEventPopup && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-card p-8 max-w-sm w-full border-gold-primary/30 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-gold-primary/20 rounded-full flex items-center justify-center mx-auto border border-gold-primary/40">
                <Zap size={32} className="text-gold-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white italic tracking-tighter">發起社群活動</h3>
                <p className="text-sm text-white/60 font-serif">發起活動需支付 100 L 幣，活動將在全帝國廣播。</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowEventPopup(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm"
                >
                  取消
                </button>
                <button 
                  onClick={() => setShowEventPopup(false)}
                  className="flex-1 py-3 rounded-xl bg-gold-primary text-black font-black text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  支付 100 L
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 返回按鈕 (僅在非沈浸模式顯示) */}
      <AnimatePresence>
        {!isImmersive && (
          <button 
            onClick={onBack}
            className="fixed top-28 left-6 z-[400] flex items-center gap-2 px-4 py-2 bg-gold-primary/10 backdrop-blur-md border border-gold-primary/30 rounded-full text-gold-primary font-black text-xs uppercase tracking-widest"
          >
            <ChevronLeft size={16} />
            離開聖所
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- 子組件: 動作按鈕 ---
function ActionButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center gap-1 group"
    >
      <div className="w-12 h-12 flex items-center justify-center text-gold-primary/60 group-hover:text-gold-primary group-hover:scale-110 transition-all">
        {icon}
      </div>
      <span className="text-[10px] font-black text-white/40 group-hover:text-gold-primary transition-colors">{label}</span>
    </button>
  );
}

// --- 子組件: Echo Sphere (Canvas 粒子效果) ---
function EchoSphere({ isSpeaking, role }: { isSpeaking: boolean, role: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const particleCount = 100;

    const resize = () => {
      canvas.width = 400;
      canvas.height = 400;
    };
    resize();

    class Particle {
      x: number; y: number; size: number; speedX: number; speedY: number; life: number;
      constructor() {
        this.x = canvas!.width / 2;
        this.y = canvas!.height / 2;
        this.size = Math.random() * 3 + 1;
        const angle = Math.random() * Math.PI * 2;
        const force = isSpeaking ? Math.random() * 5 + 2 : Math.random() * 2;
        this.speedX = Math.cos(angle) * force;
        this.speedY = Math.sin(angle) * force;
        this.life = 1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.01;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(212, 175, 55, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (isSpeaking && Math.random() > 0.5) {
        particles.push(new Particle());
      }
      
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isSpeaking]);

  const ringColor = role === 'CEO' ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 
                    role === 'Lord' ? 'border-gold-primary shadow-[0_0_20px_rgba(212,175,55,0.5)]' : 
                    'border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.5)]';

  return (
    <div className="relative w-[300px] h-[300px] flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* 上麥者頭像與光圈 */}
      <div className={`relative w-24 h-24 rounded-full border-4 ${ringColor} p-1 overflow-hidden bg-black/40 backdrop-blur-md`}>
        <img 
          src="https://picsum.photos/seed/avatar/200" 
          alt="Speaker" 
          className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
          referrerPolicy="no-referrer"
        />
        {isSpeaking && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-4 border-gold-primary"
          />
        )}
      </div>
      
      {/* 帝國光圈裝飾 */}
      <div className="absolute inset-0 border border-gold-primary/10 rounded-full animate-[spin_10s_linear_infinite]" />
      <div className="absolute inset-4 border border-gold-primary/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
    </div>
  );
}

// --- 子組件: 贊助粒子雨 ---
function SponsorParticleRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class GoldParticle {
      x: number; y: number; size: number; speedY: number; speedX: number; rotation: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = -20;
        this.size = Math.random() * 5 + 2;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.rotation = Math.random() * 360;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += 2;
      }
      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (particles.length < 200) particles.push(new GoldParticle());
      particles = particles.filter(p => p.y < canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
