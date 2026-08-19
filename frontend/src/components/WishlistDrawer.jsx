import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Heart } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist = [],
  onRemove,
  onAddToCart,
  onQuickView
}) {
  if (!isOpen) return null;

  const formatPrice = (val) => {
    if (!val) return '';
    const num = parseFloat(val);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] shadow-2xl flex flex-col justify-between border-l border-[#E8DDCD] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#E8DDCD] flex items-center justify-between bg-[#F8F5F0]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#B8945A] fill-current" />
              <h2 className="font-serif text-xl font-medium tracking-wide text-[#1E1C1A]">
                Your Saved Pieces ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#746F68] hover:text-[#1E1C1A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 text-[#E8DDCD] mx-auto mb-3" />
                <h3 className="font-serif text-lg text-[#1E1C1A] mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-[#746F68] max-w-xs mx-auto mb-6">
                  Explore our curated collections and save your favorite haute joaillerie treasures.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#1E1C1A] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#B8945A] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white border border-[#E8DDCD] hover:border-[#B8945A]/60 transition-colors"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      onQuickView(item);
                      onClose();
                    }}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4
                          onClick={() => {
                            onQuickView(item);
                            onClose();
                          }}
                          className="font-serif text-sm font-medium text-[#1E1C1A] hover:text-[#B8945A] cursor-pointer line-clamp-1"
                        >
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-[#746F68] hover:text-red-600 p-0.5 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-[#746F68] uppercase tracking-wider block">
                        {item.material}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8DDCD]/40">
                      <span className="text-xs font-semibold text-[#1E1C1A]">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        onClick={() => {
                          onAddToCart(item);
                        }}
                        className="text-[10px] font-semibold uppercase tracking-wider text-[#B8945A] hover:text-[#1E1C1A] flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer actions */}
          {wishlist.length > 0 && (
            <div className="p-6 border-t border-[#E8DDCD] bg-[#F8F5F0] space-y-3">
              <button
                onClick={() => {
                  wishlist.forEach((item) => onAddToCart(item));
                  onClose();
                }}
                className="w-full py-3.5 bg-[#1E1C1A] hover:bg-[#B8945A] text-white text-xs font-semibold tracking-[0.25em] uppercase transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#E8DDCD]" />
                <span>ADD ALL TO SHOPPING BAG</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
