import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, TrendingUp, Video } from "lucide-react";
import { useEmpireStore } from "../store/useEmpireStore";

const mockVideos = [
  { name: "萊娜精品咖啡體驗", orders: 12, lcoin: 36 },
  { name: "帝國和牛燒肉探店", orders: 8, lcoin: 24 },
  { name: "黑金威士忌吧夜訪", orders: 3, lcoin: 9 },
];

export default function CreatorRevenuePanel() {
  const { showCreatorRevenue, setShowCreatorRevenue } = useEmpireStore();

  const totalLcoin = mockVideos.reduce((sum, v) => sum + v.lcoin, 0);
  const totalOrders = mockVideos.reduce((sum, v) => sum + v.orders, 0);
  const totalGmv = totalOrders * 300;

  return (
    <AnimatePresence>
      {showCreatorRevenue && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center sm:items-center p-4 pt-[40px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreatorRevenue(false)}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md max-h-[calc(100vh-80px)] flex flex-col bg-black-matte border border-gold-primary/30 rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gold-primary/10 flex justify-between items-center bg-gradient-to-r from-gold-primary/5 to-transparent flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center border border-gold-primary/20">
                  <TrendingUp className="text-gold-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black gold-gradient-text italic tracking-tighter">創作者收益</h3>
                  <p className="text-[10px] text-gold-light/40 uppercase tracking-widest font-bold">Creator Revenue</p>
                </div>
              </div>
              <button onClick={() => setShowCreatorRevenue(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* 本月總收益 */}
              <div className="glass-card p-6 text-center space-y-1 border border-gold-primary/20">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">本月帶單 L幣收益</p>
                <p className="text-5xl font-black gold-gradient-text">{totalLcoin}</p>
                <p className="text-[10px] text-gold-primary/60 font-bold">L-COIN</p>
              </div>

              {/* 數據摘要 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-4 border border-white/5 space-y-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">帶單筆數</p>
                  <p className="text-2xl font-black text-white">{totalOrders}</p>
                  <p className="text-[9px] text-gray-600">本月累計</p>
                </div>
                <div className="glass-card p-4 border border-white/5 space-y-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">帶動消費</p>
                  <p className="text-2xl font-black text-white">NT${totalGmv.toLocaleString()}</p>
                  <p className="text-[9px] text-gray-600">預估交易額</p>
                </div>
              </div>

              {/* 影片收益列表 */}
              <div className="space-y-3">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Video size={12} /> 影片帶單明細
                </p>
                {mockVideos.map((video, idx) => (
                  <div key={idx} className="glass-card p-4 border border-white/5 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{video.name}</p>
                      <p className="text-[10px] text-gray-500">{video.orders} 筆訂單</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-sm font-black text-gold-primary">+{video.lcoin}</p>
                      <p className="text-[9px] text-gray-600">L-COIN</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 說明 */}
              <div className="p-4 bg-gold-primary/5 rounded-2xl border border-gold-primary/10">
                <p className="text-[10px] text-gold-primary/70 leading-relaxed font-bold">
                  💡 每筆透過你影片帶來的訂單，你獲得 <span className="text-gold-primary">0.3–1%</span> L幣回饋。
                  L幣可於帝國各領地兌換商品，越多人透過你的影片消費，你賺得越多。
                </p>
              </div>

              <div className="pb-[env(safe-area-inset-bottom)]" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
