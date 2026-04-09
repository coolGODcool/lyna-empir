import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Coins, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import { useEmpireStore } from "../store/useEmpireStore";

interface SupportPanelProps {
  onConfirm: (amount: number) => void;
  balance?: number;
}

/**
 * 模組名稱：贊助面板 2.0 (SupportPanel.tsx)
 * 功能描述：重構後的贊助邏輯。包含最低 30 L-COIN 門檻、累加式快捷鍵、黑金視覺主題。
 */
export default function SupportPanel({ onConfirm, balance = 24500 }: SupportPanelProps) {
  const { showSupportPanel, setShowSupportPanel } = useEmpireStore();
  const MIN_DONATION = 30;
  const [amount, setAmount] = useState<number>(MIN_DONATION);
  const [isSuccess, setIsSuccess] = useState(false);

  // 當面板開啟時重置狀態
  useEffect(() => {
    if (showSupportPanel) {
      setAmount(MIN_DONATION);
      setIsSuccess(false);
    }
  }, [showSupportPanel]);

  const handleAddAmount = (val: number) => {
    setAmount(prev => prev + val);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) {
      setAmount(0);
    } else {
      setAmount(val);
    }
  };

  const handleConfirm = () => {
    if (amount >= MIN_DONATION) {
      setIsSuccess(true);
      setTimeout(() => {
        onConfirm(amount);
        setShowSupportPanel(false);
      }, 1500);
    }
  };

  const handleReset = () => {
    setAmount(MIN_DONATION);
  };

  const isInvalid = amount < MIN_DONATION;

  return (
    <AnimatePresence>
      {showSupportPanel && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center sm:items-center p-4 pt-[40px]">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSupportPanel(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Panel Content */}
          <motion.div 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md max-h-[calc(100vh-80px)] flex flex-col bg-black-matte border border-gold-primary/30 rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold-primary/10 flex justify-between items-center bg-gradient-to-r from-gold-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center border border-gold-primary/20">
                  <Coins className="text-gold-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black gold-gradient-text italic tracking-tighter">帝國國庫贊助</h3>
                  <p className="text-[10px] text-gold-light/40 uppercase tracking-widest font-bold">Empire Treasury Support</p>
                </div>
              </div>
              <button onClick={() => setShowSupportPanel(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">
              {isSuccess ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-20 h-20 rounded-full bg-gold-primary/20 flex items-center justify-center border-2 border-gold-primary animate-pulse">
                    <CheckCircle2 className="text-gold-primary" size={40} />
                  </div>
                  <h4 className="text-2xl font-black text-white italic">贊助成功！</h4>
                  <p className="text-sm text-gold-light/60">感謝領主對帝國國庫的貢獻</p>
                </motion.div>
              ) : (
                <>
                  {/* Amount Display & Input */}
                  <div className="space-y-4">
                    <div className="relative">
                      <input 
                        type="number"
                        inputMode="numeric"
                        value={amount === 0 ? "" : amount}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full bg-white/5 border-2 border-gold-primary/20 rounded-2xl py-6 px-8 text-4xl font-black text-center text-gold-primary focus:border-gold-primary focus:outline-none transition-all placeholder:text-white/10"
                      />
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gold-primary/40 font-black text-xl">L</div>
                    </div>
                    
                    {/* Warning Message */}
                    <AnimatePresence>
                      {isInvalid && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center justify-center gap-2 text-red-500/80 text-[11px] font-bold"
                        >
                          <AlertCircle size={12} />
                          <span>贊助門檻：{MIN_DONATION} L-COIN 起</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Shortcut Keys */}
                  <div className="grid grid-cols-4 gap-3">
                    {[5, 10, 50, 100].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleAddAmount(val)}
                        className="py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black text-sm hover:bg-gold-primary/10 hover:border-gold-primary/40 active:scale-95 transition-all"
                      >
                        +{val}
                      </button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4 pt-4 pb-[env(safe-area-inset-bottom)]">
                    {/* Revenue Split Display */}
                    <p className="text-[10px] text-gold-primary/60 text-center font-bold uppercase tracking-widest">
                      規費 19% | 公益 1% | 創作者 80%
                    </p>

                    <button
                      disabled={isInvalid}
                      onClick={handleConfirm}
                      className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-[0.2em] transition-all shadow-lg ${
                        isInvalid 
                          ? "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed" 
                          : "bg-gold-primary text-black border border-gold-light hover:brightness-110 active:scale-[0.98] shadow-gold-primary/20"
                      }`}
                    >
                      確認贊助
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleReset}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-sm hover:text-white hover:bg-white/10 transition-all"
                      >
                        <RotateCcw size={16} />
                        重製
                      </button>
                      <button
                        onClick={() => setShowSupportPanel(false)}
                        className="py-4 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-sm hover:text-white hover:bg-white/10 transition-all"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
