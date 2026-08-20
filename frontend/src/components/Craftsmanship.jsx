import React from 'react';
import { Gem, Hammer, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Craftsmanship() {
  const pillars = [
    {
      num: '01',
      title: 'SOURCING',
      subtitle: 'Exceptional materials selected with care.',
      description: 'Conflict-free Kimberley Process certified diamonds of DEF color and VVS+ clarity, paired with responsibly mined 18K and 22K precious gold.',
      icon: Gem,
    },
    {
      num: '02',
      title: 'CRAFTSMANSHIP',
      subtitle: 'Designed and created by expert artisans.',
      description: 'Generational lapidary masters utilize ancient hand-forging alongside advanced micron-level laser setting to achieve fluid articulation.',
      icon: Hammer,
    },
    {
      num: '03',
      title: 'FINISHING',
      subtitle: 'Every detail refined to perfection.',
      description: 'Triple-stage hand polishing, rigorous microscope prong inspection, and bespoke hallmarking ensure a lifelong luminous luster.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="craftsmanship" className="py-12 sm:py-16 bg-[#FFFDF9] border-y border-[#E8DDCD]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#B8945A]"></span>
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#B8945A]">
              THE ATELIER TRADITION
            </span>
            <span className="h-px w-8 bg-[#B8945A]"></span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1E1C1A] font-normal tracking-tight mb-3">
            The Details Make the Difference
          </h2>

          <p className="text-sm sm:text-base text-[#746F68] font-normal max-w-xl mx-auto font-cormorant text-xl italic">
            Behind every piece of AURELIA haute joaillerie lies hundreds of hours of patient artisan mastery.
          </p>
        </div>

        {/* 3 Pillars & Craftsmanship Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: 3 Stages */}
          <div className="lg:col-span-6 space-y-5">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className="p-5 sm:p-6 bg-[#F8F5F0] border border-[#E8DDCD] hover:border-[#B8945A] transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="font-cinzel text-xl sm:text-2xl font-semibold text-[#B8945A] block">
                        {pillar.num}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif text-base sm:text-lg font-medium tracking-wide text-[#1E1C1A] group-hover:text-[#B8945A] transition-colors">
                          {pillar.title}
                        </h3>
                        <Icon className="w-3.5 h-3.5 text-[#B8945A]" />
                      </div>

                      <p className="text-[11px] uppercase tracking-wider text-[#1E1C1A] font-medium mb-1.5">
                        {pillar.subtitle}
                      </p>

                      <p className="text-sm text-[#746F68] font-normal leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Macro Craftsmanship Photo */}
          <div className="lg:col-span-6 relative">
            <div className="relative overflow-hidden border border-[#E8DDCD] shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop"
                alt="Artisan Jeweller Setting Diamond Solitaire"
                className="w-full h-[400px] sm:h-[460px] object-cover object-center filter contrast-[1.03] hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 p-3.5 bg-[#FFFDF9]/95 backdrop-blur-md border border-[#B8945A]/40 text-[#1E1C1A]">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B8945A] mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B8945A]" />
                  <span>MASTER ATELIER INSPECTION</span>
                </div>
                <p className="text-xs text-[#746F68] font-medium">
                  Every prong is hand-adjusted under 40x magnification for zero gemstone movement and flawless fire.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
