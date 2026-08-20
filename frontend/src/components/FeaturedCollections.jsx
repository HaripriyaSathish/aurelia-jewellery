import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function FeaturedCollections({ categories = [], onSelectCategory }) {
  const defaultCollections = [
    {
      id: 'diamonds',
      title: 'DIAMONDS',
      subtitle: 'Solitaires & High Jewelry Rivières',
      tag: 'HAUTE JOAILLERIE',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop',
      colSpan: 'lg:col-span-7',
      aspect: 'aspect-[4/3] lg:aspect-[16/11]',
    },
    {
      id: 'gold',
      title: 'GOLD',
      subtitle: 'Artisan Sculptures & 18K Yellow Gold',
      tag: 'HANDCRAFTED HERITAGE',
      image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop',
      colSpan: 'lg:col-span-5',
      aspect: 'aspect-[4/3] lg:aspect-[16/14]',
    },
    {
      id: 'bridal',
      title: 'BRIDAL',
      subtitle: 'Sacred Vows & Crowning Heirlooms',
      tag: 'ROYAL ATELIER',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
      colSpan: 'lg:col-span-12',
      aspect: 'aspect-[16/9] lg:aspect-[21/9]',
    },
  ];

  return (
    <section id="collections" className="py-12 sm:py-16 bg-[#F8F5F0] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#B8945A]"></span>
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#B8945A]">
              CURATED DOMAINS
            </span>
            <span className="h-px w-8 bg-[#B8945A]"></span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1E1C1A] font-normal tracking-tight mb-3">
            Designed to Be Remembered
          </h2>
          <p className="text-base sm:text-lg text-[#746F68] font-medium max-w-xl mx-auto font-cormorant text-2xl italic">
            Each collection is conceived as an architectural dialogue between pure light, sacred metals, and timeless grace.
          </p>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {defaultCollections.map((col) => (
            <div
              key={col.id}
              onClick={() => onSelectCategory && onSelectCategory(col.id)}
              className={`${col.colSpan} group relative overflow-hidden cursor-pointer shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-500`}
            >
              {/* Image Container with Zoom */}
              <div className={`w-full ${col.aspect} overflow-hidden bg-[#1E1C1A]`}>
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-95"
                />
              </div>

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300" />
              
              {/* Editorial Frame Border */}
              <div className="absolute inset-4 border border-[#FFFDF9]/20 pointer-events-none group-hover:border-[#B8945A]/60 transition-colors duration-500" />

              {/* Card Content Overlay */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] uppercase text-[#E8DDCD] bg-black/40 backdrop-blur-sm px-3 py-1 border border-[#E8DDCD]/20">
                    {col.tag}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center bg-black/30 backdrop-blur-sm text-white group-hover:bg-[#B8945A] group-hover:border-[#B8945A] transition-all duration-300 transform group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide text-white mb-1.5 group-hover:text-[#E8DDCD] transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E8DDCD]/90 font-light tracking-wider uppercase">
                    {col.subtitle}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] text-[#B8945A] uppercase border-b border-[#B8945A]/40 pb-0.5 group-hover:border-[#B8945A]">
                    <span>EXPLORE CAPSULE</span>
                    <Sparkles className="w-3 h-3 text-[#B8945A]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
