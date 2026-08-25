import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CampaignSection() {
  return (
    <section id="campaign" className="relative min-h-[50vh] sm:min-h-[58vh] flex items-center justify-center overflow-hidden bg-[#1E1C1A]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1920&auto=format&fit=crop"
          alt="VETRI Haute Joaillerie Campaign"
          className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-1000 ease-out filter brightness-75"
        />
        {/* Subtle Luxury Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C1A] via-transparent to-[#1E1C1A]/60" />
      </div>

      {/* Campaign Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white py-14 sm:py-18">
        
        <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1 rounded-full border border-[#B8945A]/40 bg-black/40 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#B8945A]" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#E8DDCD]">
            THE 2026 GLOBAL CAMPAIGN
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white mb-4 leading-tight">
          For Every Version of You
        </h2>

        <p className="font-cormorant text-lg sm:text-xl text-[#E8DDCD]/90 italic max-w-2xl mx-auto mb-6 leading-relaxed">
          “Jewellery that moves with your moments and remains with your memories.”
        </p>

        <div className="flex justify-center">
          <a
            href="#bestsellers"
            className="px-7 py-3.5 bg-[#B8945A] hover:bg-[#96753B] text-white text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(184,148,90,0.4)] flex items-center gap-2 group"
          >
            <span>EXPLORE NEW ARRIVALS</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

      </div>
    </section>
  );
}
