import React from "react";
import { motion } from "motion/react";
import { Plus, X } from "lucide-react";

interface CreatePostProps {
  onClose: () => void;
}

export function CreatePost({ onClose }: CreatePostProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-2xl p-8 pt-24 space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black gold-gradient-text italic tracking-tighter">發布帝國動態</h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">領主 0 元 | 子民 200 L</p>
        </div>
        <button onClick={onClose} className="p-3 rounded-full bg-white/5 text-gold-primary">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="aspect-video rounded-3xl border-2 border-dashed border-gold-primary/30 flex flex-col items-center justify-center gap-4 bg-gold-primary/5 hover:bg-gold-primary/10 transition-all cursor-pointer">
          <Plus size={48} className="text-gold-primary/40" />
          <p className="text-sm font-black text-gold-primary/60 uppercase tracking-widest">點擊上傳 .webm 高清影片</p>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">強制屬性標籤 (啟動導購分潤)</p>
          <div className="grid grid-cols-3 gap-3">
            {['食', '衣', '住', '行', '育', '樂'].map(tag => (
              <button key={tag} className="py-4 bg-white/5 border border-white/10 rounded-2xl text-lg font-black text-white hover:border-gold-primary hover:text-gold-primary transition-all">
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gold-primary/10 rounded-3xl border border-gold-primary/20 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white">上傳規費</span>
            <span className="text-lg font-black font-mono text-gold-primary">200 L-Coin</span>
          </div>
          <p className="text-[8px] text-gold-primary/60 font-bold uppercase tracking-widest">領主級別 (LN-001) 已自動減免手續費</p>
        </div>

        <button className="w-full py-6 bg-gold-primary text-black font-black text-xl uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.4)]">
          確認發布
        </button>
      </div>
    </motion.div>
  );
}
