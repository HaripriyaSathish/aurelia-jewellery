import React from 'react';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

export default function Hero({ heroData }) {
  const title = heroData?.title || "The Art of Forever";
  const subtitle = heroData?.subtitle || "Jewellery designed to become part of your story.";
  const tagline = heroData?.tagline || "HAUTE JOAILLERIE & TIMELESS BRILLIANCE";
  const imageUrl = heroData?.image_url || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920&auto=format&fit=crop";

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1E1C1A]">
      
      {/* Background Image with Ken-Burns and Gradient Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt="VETRI Fine Jewellery Haute Joaillerie"
          className="w-full h-full object-cover object-center animate-kenburns scale-105 filter brightness-85 contrast-105"
        />
        {/* Subtle Luxury Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C1A] via-transparent to-black/50" />
      </div>

      {/* Main Editorial Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-24 pb-16">
        
        {/* Editorial Subhead */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#B8945A]/40 bg-black/30 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#B8945A]" />
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.3em] uppercase text-[#E8DDCD]">
            {tagline}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white mb-6 leading-[1.08] drop-shadow-sm">
          {title}
        </h1>

        {/* Description / Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl font-normal text-[#E8DDCD]/90 max-w-2xl mx-auto mb-10 leading-relaxed font-cormorant italic tracking-wide">
          "{subtitle}"
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
          <a
            href="#bestsellers"
            className="w-full sm:w-auto px-8 py-4 bg-[#B8945A] hover:bg-[#a38048] text-white text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(184,148,90,0.35)] hover:shadow-[0_6px_28px_rgba(184,148,90,0.5)] transform hover:-translate-y-0.5"
          >
            DISCOVER THE COLLECTION
          </a>
          <a
            href="#story"
            className="w-full sm:w-auto px-8 py-4 border border-[#E8DDCD]/60 hover:border-[#B8945A] text-white hover:text-[#E8DDCD] text-xs font-medium tracking-[0.25em] uppercase transition-all duration-300 backdrop-blur-sm bg-white/5 flex items-center justify-center gap-2 group"
          >
            <span>EXPLORE OUR STORY</span>
            <ArrowRight className="w-4 h-4 text-[#B8945A] group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>

      {/* Floating Luxury Glass Card */}
      <div className="absolute bottom-8 right-6 md:right-12 z-20 hidden sm:block animate-float">
        <a
          href="#collections"
          className="group block bg-[#FFFDF9]/90 backdrop-blur-md border border-[#B8945A]/40 p-5 rounded-none shadow-[0_12px_40px_rgba(0,0,0,0.3)] hover:border-[#B8945A] transition-all duration-300 max-w-[280px]"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-[#B8945A] font-semibold mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B8945A] animate-ping" />
            FEATURED CAPSULE
          </div>
          <div className="font-serif text-lg text-[#1E1C1A] font-medium tracking-wide group-hover:text-[#B8945A] transition-colors">
            THE ETERNAL COLLECTION
          </div>
          <div className="text-xs text-[#5C574F] mt-1.5 flex items-center justify-between">
            <span>Discover timeless brilliance</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B8945A] group-hover:translate-x-1 transition-transform" />
          </div>
        </a>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-[#E8DDCD]/60 flex flex-col items-center gap-1">
        <span className="text-[9px] uppercase tracking-[0.3em] font-light">SCROLL</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#B8945A]" />
      </div>
    </section>
  );
}
