import React, { useState } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

export default function SearchModal({
  isOpen,
  onClose,
  products = [],
  onQuickView
}) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const formatPrice = (val) => {
    if (!val) return '';
    const num = parseFloat(val);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const filtered = query.trim() === ''
    ? products.slice(0, 4)
    : products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.material?.toLowerCase().includes(query.toLowerCase()) ||
        p.category_name?.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-20 p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#FFFDF9] w-full max-w-2xl border border-[#B8945A]/40 shadow-2xl z-10 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#746F68] hover:text-[#1E1C1A]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8945A] font-semibold block mb-2">
            CATALOGUE SEARCH
          </span>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search diamonds, rings, gold, necklaces..."
              autoFocus
              className="w-full pl-11 pr-4 py-3.5 bg-[#F8F5F0] border border-[#E8DDCD] text-sm text-[#1E1C1A] placeholder-[#746F68] focus:outline-none focus:border-[#B8945A] transition-colors"
            />
            <Search className="w-5 h-5 text-[#B8945A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs text-[#746F68]">
            <span>{query ? `Results for "${query}"` : "Suggested Creations"}</span>
            <span>{filtered.length} items</span>
          </div>

          <div className="divide-y divide-[#E8DDCD]/60 max-h-80 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-[#746F68] text-xs">
                No matching haute joaillerie found. Try searching for "Diamond", "Gold", or "Necklace".
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onQuickView(item);
                    onClose();
                  }}
                  className="py-3 flex items-center justify-between group cursor-pointer hover:bg-[#F8F5F0]/60 px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 object-cover border border-[#E8DDCD]"
                    />
                    <div>
                      <h4 className="font-serif text-sm font-medium text-[#1E1C1A] group-hover:text-[#B8945A] transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-[#746F68] uppercase tracking-wider block">
                        {item.category_name} • {item.material}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#1E1C1A]">
                      {formatPrice(item.price)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#B8945A] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
