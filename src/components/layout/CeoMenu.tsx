import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useEmpireStore } from "../../store/useEmpireStore";

interface CeoMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CeoMenu({ isOpen, onClose }: CeoMenuProps) {
  const {
    showMarquee,
    setShowMarquee,
    fixNavbar,
    setFixNavbar
  } = useEmpireStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[7000] bg-black/20 backdrop-blur-sm flex justify-start"
          onClick={onClose}
        >
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-72 h-full bg-black/60 backdrop-blur-2xl border-r border-gold-primary/20 p-8 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black gold-gradient-text italic tracking-tighter">帝國設定</h3>
              <button onClick={onClose} className="text-gold-primary/60 hover:text-gold-primary">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">介面自訂</p>
                
                {/* Toggle: Empire Marquee */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white/80">顯示帝國跑馬燈</span>
                  <button 
                    onClick={() => setShowMarquee(!showMarquee)}
                    className={`w-10 h-5 rounded-full transition-all relative ${showMarquee ? 'bg-gold-primary' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: showMarquee ? 22 : 2 }}
                      className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>

                {/* Toggle: Fixed Navbar */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white/80">固定顯示導航欄</span>
                  <button 
                    onClick={() => setFixNavbar(!fixNavbar)}
                    className={`w-10 h-5 rounded-full transition-all relative ${fixNavbar ? 'bg-gold-primary' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      animate={{ x: fixNavbar ? 22 : 2 }}
                      className="absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-auto border-t border-white/5">
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-gold-primary hover:border-gold-primary transition-all">
                登出帝國系統
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
