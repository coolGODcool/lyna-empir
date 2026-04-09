import React from "react";
import { Crown, Scroll, Spade } from "lucide-react";

export function LynaLIcon({ active }: { active: boolean }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-gradient-to-br from-gold-light via-gold-primary to-gold-dark border-2 border-white/20 shadow-[0_0_15px_rgba(212,175,55,0.6)]' : 'border-2 border-gold-primary/30'}`}>
      <span className={`text-lg font-black italic tracking-tighter ${active ? 'text-black' : 'gold-gradient-text'}`}>L</span>
    </div>
  );
}

export function ButlerIcon({ active }: { active: boolean }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-gold-primary/20 border-2 border-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'border-2 border-gold-primary/30'}`}>
      <Crown size={18} className={active ? "text-gold-light" : "text-gold-primary/60"} />
    </div>
  );
}

export function QuestsIcon({ active }: { active: boolean }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-gold-primary/20 border-2 border-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'border-2 border-gold-primary/30'}`}>
      <Scroll size={18} className={active ? "text-gold-light" : "text-gold-primary/60"} />
    </div>
  );
}

export function LoungeIcon({ active }: { active: boolean }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${active ? 'bg-gold-primary/20 border-2 border-gold-primary shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'border-2 border-gold-primary/30'}`}>
      <Spade size={18} className={active ? "text-gold-light" : "text-gold-primary/60"} />
    </div>
  );
}
