import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-[#1E1C1A] text-[#E8DDCD] border-b border-[#B8945A]/30 py-2.5 px-4 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-6 hidden md:block"></div>
        <div className="flex items-center justify-center gap-2.5 mx-auto text-center">
          <Sparkles className="w-3.5 h-3.5 text-[#B8945A] animate-pulse-subtle flex-shrink-0" />
          <span className="text-[11px] sm:text-xs">
            COMPLIMENTARY SHIPPING & ELEGANT GIFT PACKAGING ON ALL ORDERS
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#B8945A] animate-pulse-subtle flex-shrink-0" />
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-[#E8DDCD]/60 hover:text-[#E8DDCD] transition-colors p-1"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
