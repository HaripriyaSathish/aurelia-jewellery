import React, { useState } from 'react';
import { X, Heart, ShoppingBag, MessageCircle, ShieldCheck, Sparkles, Truck, RefreshCw } from 'lucide-react';

export default function ProductQuickViewModal({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  whatsappNumber = "+919876543210"
}) {
  if (!isOpen || !product) return null;

  const [selectedImg, setSelectedImg] = useState(product.image_url);
  const [selectedSize, setSelectedSize] = useState('Standard / Adjustable');

  const formatPrice = (val) => {
    if (!val) return '';
    const num = parseFloat(val);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const images = [
    product.image_url,
    product.hover_image_url,
  ].filter(Boolean);

  const cleanWhatsAppNum = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsAppNum}?text=${encodeURIComponent(
    `Hello AURELIA, I would like to inquire about the ${product.name} (Ref: ${product.slug || product.id}).`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#FFFDF9] w-full max-w-4xl border border-[#B8945A]/40 shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-[#746F68] hover:text-[#1E1C1A] bg-white/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Gallery Column */}
          <div className="md:col-span-6 bg-[#F8F5F0] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8DDCD]">
            <div className="relative aspect-square overflow-hidden mb-4 bg-white border border-[#E8DDCD]">
              <img
                src={selectedImg || product.image_url}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-[#B8945A] text-white text-[9px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 shadow-sm">
                  CERTIFIED AUTHENTIC
                </span>
              </div>
            </div>

            {/* Thumbnail switcher */}
            {images.length > 1 && (
              <div className="flex gap-3 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    className={`w-16 h-16 border-2 overflow-hidden transition-all ${
                      (selectedImg || product.image_url) === img
                        ? 'border-[#B8945A] opacity-100 scale-105'
                        : 'border-[#E8DDCD] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#B8945A] font-semibold mb-1">
                {product.category_name || "HAUTE JOAILLERIE"}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#1E1C1A] font-medium tracking-tight mb-3">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xl sm:text-2xl font-semibold text-[#1E1C1A]">
                  {formatPrice(product.price)}
                </span>
                {product.old_price && (
                  <span className="text-sm text-[#746F68] line-through">
                    {formatPrice(product.old_price)}
                  </span>
                )}
              </div>

              <p className="text-xs text-[#746F68] font-light leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Specifications Box */}
              <div className="bg-[#F8F5F0] border border-[#E8DDCD] p-4 mb-6 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#746F68]">Precious Metal:</span>
                  <span className="font-medium text-[#1E1C1A]">{product.material}</span>
                </div>
                {product.carat_weight && (
                  <div className="flex justify-between">
                    <span className="text-[#746F68]">Gemstone Carat:</span>
                    <span className="font-medium text-[#1E1C1A]">{product.carat_weight}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#746F68]">Certification:</span>
                  <span className="font-medium text-[#1E1C1A]">GIA / IGI Verified Hallmark</span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1E1C1A] mb-2">
                  Sizing / Option:
                </label>
                <div className="flex gap-2">
                  {['Standard / Adjustable', 'Custom Sizing'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-xs border transition-all ${
                        selectedSize === sz
                          ? 'border-[#B8945A] bg-[#1E1C1A] text-white'
                          : 'border-[#E8DDCD] text-[#746F68] hover:border-[#B8945A]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-[#E8DDCD]">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex-1 py-3.5 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-xs font-semibold tracking-[0.25em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E8DDCD]" />
                  <span>ADD TO SHOPPING BAG</span>
                </button>
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`px-4 py-3.5 border transition-all ${
                    isWishlisted
                      ? 'border-[#B8945A] bg-[#B8945A] text-white'
                      : 'border-[#E8DDCD] text-[#1E1C1A] hover:border-[#B8945A]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>INQUIRE VIA WHATSAPP CONCIERGE</span>
              </a>

              {/* Assurances */}
              <div className="flex items-center justify-around pt-2 text-[10px] text-[#746F68] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#B8945A]" /> Insured Delivery
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#B8945A]" /> Lifetime Care
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-[#B8945A]" /> Easy Exchange
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
