// 預約下單面板，提供雙軌份數選擇與受贈者設定。
/**
 * 模組名稱：訂單抽屜 (OrderDrawer.tsx)
 * 功能描述：處理商品下單、數量選擇及總價計算。支持與國庫規費及公益金系統對接。
 */
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Minus, Plus, ShoppingBag, Users, Heart, Sparkles, MapPin, Search } from "lucide-react";
import { useEmpireStore } from "../store/useEmpireStore";
import { OrderData } from "../types";

interface OrderDrawerProps {
  storeName: string;
  onConfirm: (data: OrderData) => void;
  pricePerUnit: number;
}

export default function OrderDrawer({
  storeName,
  onConfirm,
  pricePerUnit,
}: OrderDrawerProps) {
  const { showOrderPanel, setShowOrderPanel } = useEmpireStore();
  const [selfQuantity, setSelfQuantity] = useState(1);
  const [giftQuantity, setGiftQuantity] = useState(0);
  const [recipientType, setRecipientType] = useState<'family' | 'friend' | 'citizen' | 'id' | null>(null);
  const [subRecipientType, setSubRecipientType] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState('');

  const totalAmount = useMemo(() => 
    (selfQuantity + giftQuantity) * pricePerUnit, 
    [selfQuantity, giftQuantity, pricePerUnit]
  );

  const handleConfirm = () => {
    onConfirm({
      selfQuantity,
      giftQuantity,
      recipientType: giftQuantity > 0 ? recipientType : null,
      subRecipientType: subRecipientType || undefined,
      recipientId: recipientType === 'id' ? `L-${recipientId}` : undefined,
      totalAmount,
    });
    setShowOrderPanel(false);
  };

  const recipients = [
    { id: 'family', label: '送給家人', icon: <Users size={16} /> },
    { id: 'friend', label: '送給好友', icon: <Heart size={16} /> },
    { id: 'citizen', label: '在地空投', icon: <MapPin size={16} /> },
    { id: 'id', label: '定向送禮', icon: <Search size={16} /> },
  ];

  const subOptions: Record<string, string[]> = {
    family: ['媽媽', '爸爸', '老婆', '老公', '小孩'],
    friend: ['女友', '男友', '摯友', '戰友', '青梅竹馬'],
  };

  const handleRecipientClick = (id: any) => {
    if (recipientType === id) {
      setRecipientType(null);
      setSubRecipientType(null);
    } else {
      setRecipientType(id);
      setSubRecipientType(null);
    }
  };

  // 當送禮份數 > 0 且未選擇對象或未輸入 ID 或未選擇二級標籤時，禁止確認
  const isConfirmDisabled = giftQuantity > 0 && (
    !recipientType || 
    (recipientType === 'id' && !recipientId) ||
    ((recipientType === 'family' || recipientType === 'friend') && !subRecipientType)
  );

  return (
    <AnimatePresence>
      {showOrderPanel && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 pt-[40px] pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOrderPanel(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[calc(100vh-80px)] flex flex-col bg-zinc-900/95 border border-gold-primary/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.2)] pointer-events-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-zinc-900 to-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-primary/20 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-gold-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black gold-gradient-text italic tracking-tighter">{storeName}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">預約與送禮面板</p>
                </div>
              </div>
              <button
                onClick={() => setShowOrderPanel(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Myself Quantity */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span className="font-bold text-sm uppercase tracking-wider">自己享用</span>
                  </div>
                  <div className="flex items-center gap-4 bg-black/40 p-1 rounded-xl border border-white/5">
                    <button
                      onClick={() => setSelfQuantity(Math.max(0, selfQuantity - 1))}
                      className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 transition-colors disabled:opacity-30"
                      disabled={selfQuantity <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-black font-mono text-white text-lg">{selfQuantity}</span>
                    <button
                      onClick={() => setSelfQuantity(selfQuantity + 1)}
                      className="p-2 hover:bg-white/5 rounded-lg text-gold-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Gift Quantity */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-sm uppercase tracking-wider">加一份給別人</span>
                  </div>
                  <div className="flex items-center gap-4 bg-black/40 p-1 rounded-xl border border-white/5">
                    <button
                      onClick={() => {
                        const next = Math.max(0, giftQuantity - 1);
                        setGiftQuantity(next);
                        if (next === 0) setRecipientType(null);
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 transition-colors disabled:opacity-30"
                      disabled={giftQuantity <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-black font-mono text-white text-lg">{giftQuantity}</span>
                    <button
                      onClick={() => setGiftQuantity(giftQuantity + 1)}
                      className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Recipient Selection - Only show if giftQuantity > 0 */}
                <AnimatePresence>
                  {giftQuantity > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 space-y-4">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">選擇送禮對象</p>
                        <div className="grid grid-cols-4 gap-2">
                          {recipients.map((r) => (
                            <button
                              key={r.id}
                              onClick={() => handleRecipientClick(r.id)}
                              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                                recipientType === r.id
                                  ? "bg-gold-primary/20 border-gold-primary text-gold-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                              }`}
                            >
                              <div className={`${recipientType === r.id ? 'text-gold-primary' : 'text-gray-500'}`}>
                                {r.icon}
                              </div>
                              <span className="text-[9px] font-black tracking-tight whitespace-nowrap">{r.label}</span>
                            </button>
                          ))}
                        </div>

                        {/* Hierarchical Sub-menu */}
                        <AnimatePresence>
                          {(recipientType === 'family' || recipientType === 'friend') && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-2 flex flex-wrap gap-2">
                                {subOptions[recipientType].map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => setSubRecipientType(opt)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                                      subRecipientType === opt
                                        ? "bg-gold-primary text-black border-gold-primary"
                                        : "bg-white/5 text-white/60 border-white/10 hover:border-white/30"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {recipientType === 'id' && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                          >
                            <div className="relative">
                              <input 
                                type="text"
                                inputMode="numeric"
                                placeholder="L-???"
                                value={recipientId ? `L-${recipientId}` : ""}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '');
                                  setRecipientId(val);
                                }}
                                className="w-full bg-black/40 border border-gold-primary/30 rounded-xl py-4 px-12 text-sm text-white focus:border-gold-primary outline-none transition-all font-mono"
                              />
                              {!recipientId && (
                                <div className="absolute left-12 top-1/2 -translate-y-1/2 text-zinc-600 text-sm font-mono pointer-events-none">
                                  L-???
                                </div>
                              )}
                            </div>
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-primary/40" size={18} />
                          </motion.div>
                        )}

                        {recipientType === 'citizen' && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-gold-primary/5 border border-gold-primary/20 rounded-xl flex items-center gap-3"
                          >
                            <Users size={18} className="text-gold-primary" />
                            <p className="text-[10px] text-gold-primary font-bold uppercase tracking-widest leading-tight">已自動鎖定商圈內 12 位活躍用戶</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-black/40 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">預計總額</p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black font-mono gold-gradient-text">${totalAmount.toLocaleString()}</span>
                    <span className="text-[10px] text-gold-primary/60 font-bold uppercase tracking-widest">L-Coin</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">規費分配</p>
                  <p className="text-[10px] text-gold-primary/60 font-bold">8% 國庫 | 1% 公益 | 1% 回饋</p>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={isConfirmDisabled || (selfQuantity === 0 && giftQuantity === 0)}
                className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-lg ${
                  isConfirmDisabled || (selfQuantity === 0 && giftQuantity === 0)
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-gold-dark via-gold-primary to-gold-dark text-black hover:scale-[1.02] active:scale-[0.95] shadow-gold-primary/40"
                }`}
              >
                {giftQuantity > 0 ? <Sparkles className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                確認預約
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
