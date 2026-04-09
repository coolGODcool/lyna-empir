import React from "react";

export function NavIcon({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`flex flex-col items-center gap-1 transition-all duration-300 active:scale-95 ${active ? 'scale-110' : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'}`}
    >
      {icon}
    </button>
  );
}

export function InteractionButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
    >
      <div className="w-12 h-12 flex items-center justify-center text-gold-primary transition-all group-hover:scale-110">
        {icon}
      </div>
      <span className="text-[10px] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase tracking-widest opacity-80 group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}
