import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

export default function BestsellerSection({
  products = [],
  wishlist = [],
  onToggleWishlist,
  onQuickView,
  onAddToCart,
  selectedCategory,
  onSelectCategory
}) {
  const [activeTab, setActiveTab] = useState(selectedCategory || 'all');

  const tabs = [
    { id: 'all', label: 'ALL CREATIONS' },
    { id: 'diamonds', label: 'DIAMONDS' },
    { id: 'gold', label: 'GOLD' },
    { id: 'bridal', label: 'BRIDAL' },
    { id: 'rings', label: 'RINGS' },
    { id: 'necklaces', label: 'NECKLACES' },
  ];

  const filteredProducts = activeTab === 'all'
    ? products
    : products.filter(p =>
        p.category_slug?.toLowerCase() === activeTab.toLowerCase() ||
        p.category_name?.toLowerCase() === activeTab.toLowerCase()
      );

  return (
    <section id="bestsellers" className="py-12 sm:py-16 bg-[#F8F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-px w-8 bg-[#B8945A]"></span>
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#B8945A]">
              ICONIC MASTERPIECES
            </span>
            <span className="h-px w-8 bg-[#B8945A]"></span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1E1C1A] font-normal tracking-tight mb-3">
            Our Most Loved Pieces
          </h2>

          <p className="text-base sm:text-lg text-[#746F68] font-medium max-w-xl mx-auto font-cormorant text-2xl italic">
            Each creation is an embodiment of precision, balanced geometry, and rare luminescent stones.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (onSelectCategory) onSelectCategory(tab.id);
                }}
                className={`px-3.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#1E1C1A] text-white border-b-2 border-[#B8945A] shadow-sm'
                    : 'bg-[#FFFDF9] text-[#746F68] hover:text-[#1E1C1A] border border-[#E8DDCD]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id || product.slug}
              product={product}
              isWishlisted={wishlist.some((w) => w.id === product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Bottom Editorial Callout */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[#746F68] uppercase tracking-[0.25em] font-medium mb-2">
            BESPOKE COMMISSIONS & PRIVATE VAULT APPOINTMENTS AVAILABLE
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.25em] text-[#B8945A] uppercase border-b border-[#B8945A] pb-1 hover:text-[#1E1C1A] hover:border-[#1E1C1A] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>BOOK A PRIVATE CONSULTATION</span>
          </a>
        </div>

      </div>
    </section>
  );
}
