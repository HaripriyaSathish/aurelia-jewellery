import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Sparkles } from 'lucide-react';

export default function ProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onQuickView,
  onAddToCart
}) {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (val) => {
    if (!val) return '';
    const num = parseFloat(val);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const primaryImg = product.image_url || 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop';
  const hoverImg = product.hover_image_url || primaryImg;

  return (
    <div
      className="group relative flex flex-col bg-[#FFFDF9] border border-[#E8DDCD]/80 hover:border-[#B8945A] transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#F8F5F0]">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {product.is_bestseller && (
            <span className="bg-[#1E1C1A] text-[#E8DDCD] text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 border border-[#B8945A]/40 shadow-sm">
              BESTSELLER
            </span>
          )}
          {product.is_new && (
            <span className="bg-[#B8945A] text-white text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 shadow-sm">
              NEW ARRIVAL
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-sm ${
            isWishlisted
              ? 'bg-[#B8945A] text-white'
              : 'bg-white/80 text-[#1E1C1A] hover:text-[#B8945A] hover:bg-white'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Primary and Hover Image swap */}
        <img
          src={primaryImg}
          alt={product.name}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isHovered && hoverImg !== primaryImg ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />
        {hoverImg && hoverImg !== primaryImg && (
          <img
            src={hoverImg}
            alt={`${product.name} view`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        )}

        {/* Quick View Floating Action */}
        <div className="absolute inset-x-0 bottom-3 px-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 py-2.5 bg-[#FFFDF9]/95 hover:bg-[#1E1C1A] hover:text-white text-[#1E1C1A] text-[10px] font-semibold tracking-[0.2em] uppercase border border-[#B8945A]/40 transition-colors flex items-center justify-center gap-1.5 shadow-md backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5 text-[#B8945A]" />
            <span>QUICK VIEW</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between text-center bg-[#FFFDF9]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#746F68] font-medium block mb-1">
            {product.category_name || "Haute Joaillerie"}
          </span>
          
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif text-lg sm:text-xl text-[#1E1C1A] hover:text-[#B8945A] font-medium tracking-tight mb-2 cursor-pointer transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#746F68] font-light line-clamp-1 mb-3">
            {product.material}
          </p>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="text-sm sm:text-base font-semibold text-[#1E1C1A] tracking-wider">
              {formatPrice(product.price)}
            </span>
            {product.old_price && (
              <span className="text-xs text-[#746F68]/70 line-through">
                {formatPrice(product.old_price)}
              </span>
            )}
          </div>

          {/* Add to Bag Button */}
          <button
            onClick={() => onAddToCart(product)}
            className="w-full py-2.5 px-4 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-[11px] font-semibold tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#E8DDCD]" />
            <span>ADD TO BAG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
