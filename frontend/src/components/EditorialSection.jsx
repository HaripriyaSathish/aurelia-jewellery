import React from 'react';
import { ArrowRight, Award, ShieldCheck } from 'lucide-react';

export default function EditorialSection() {
  return (
    <section id="story" className="py-12 sm:py-16 bg-[#FFFDF9] border-y border-[#E8DDCD]/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Split Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-[#E8DDCD]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop"
                alt="AURELIA Haute Joaillerie Model Portrait"
                className="w-full h-[400px] sm:h-[480px] object-cover object-center filter contrast-[1.02] hover:scale-102 transition-transform duration-700"
              />
            </div>

            {/* Inset Secondary Image */}
            <div className="absolute -bottom-6 -right-4 sm:-right-6 w-36 sm:w-52 z-20 shadow-[0_16px_36px_rgba(0,0,0,0.15)] border-4 border-[#FFFDF9] hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop"
                alt="High Diamond Detailing"
                className="w-full h-36 sm:h-48 object-cover"
              />
            </div>

            {/* Decorative Gold Accent Frame */}
            <div className="absolute -top-4 -left-4 z-0 w-28 h-28 border border-[#B8945A]/30 pointer-events-none hidden md:block" />
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-6 lg:pl-4">
            
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[1px] bg-[#B8945A]" />
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#B8945A]">
                THE MAISON HERITAGE
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1E1C1A] tracking-tight leading-[1.15] mb-4">
              Crafted for a Lifetime of Moments
            </h2>

            <p className="font-cormorant text-lg sm:text-xl text-[#1E1C1A]/85 italic mb-4 leading-relaxed">
              “Every piece begins with a story, shaped through exceptional craftsmanship and finished with a dedication to timeless beauty.”
            </p>

            <p className="text-sm sm:text-base text-[#746F68] font-normal leading-relaxed mb-6">
              At AURELIA, haute joaillerie is elevated beyond ornament into wearable artistry. Each mastercut stone is ethically sourced and meticulously set by master artisans who have preserved generational lapidary traditions, creating heirlooms that transcend time.
            </p>

            {/* Hallmarks List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 border-t border-b border-[#E8DDCD]/80 py-4">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#B8945A] flex-shrink-0 mt-0.5" />
                <div><h4 className="text-sm font-bold uppercase tracking-wider text-[#1E1C1A]">
                  GIA & IGI Certified</h4>
                  <p className="text-xs text-[#746F68] font-medium">Strict DEF colour & IF-VVS clarity stones.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 text-[#B8945A] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#1E1C1A]">100% Conflict Free</h4>
                  <p className="text-xs text-[#746F68] font-medium">Ethically mined & verified origin traceability.</p>
                </div>
              </div>
            </div>

            {/* Button */}
            <a
              href="#craftsmanship"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#1E1C1A] hover:bg-[#B8945A] text-[#FFFDF9] text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 group shadow-md"
            >
              <span>OUR CRAFTSMANSHIP</span>
              <ArrowRight className="w-4 h-4 text-[#B8945A] group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}
