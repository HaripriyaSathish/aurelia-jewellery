import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useShopData } from '../context/ShopDataContext';

import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingContactButtons from './FloatingContactButtons';
import ChatbotWidget from './ChatbotWidget';
import ProductQuickViewModal from './ProductQuickViewModal';
import WishlistDrawer from './WishlistDrawer';
import CartDrawer from './CartDrawer';
import SearchModal from './SearchModal';

export default function Layout() {
  const { settings, products } = useShopData();
  const {
    cart,
    wishlist,
    toastMessage,
    addToCart,
    updateCartQty,
    removeFromCart,
    toggleWishlist,
    removeFromWishlist,
  } = useCart();

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contactOffset, setContactOffset] = useState(24);

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1E1C1A] selection:bg-[#B8945A] selection:text-white flex flex-col justify-between relative font-sans">

      <AnnouncementBar />

      <Navbar
        wishlistCount={wishlist.length}
        cartCount={cart.reduce((total, item) => total + (item.quantity || 1), 0)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        settings={settings}
      />

      <main className="flex-grow">
        <Outlet context={{ onQuickView: setQuickViewProduct, onAddToCart: addToCart, onToggleWishlist: toggleWishlist, wishlist }} />
      </main>

      <Footer settings={settings} />

      <FloatingContactButtons
        settings={settings}
        isChatOpen={isChatOpen}
        onToggleChat={() => setIsChatOpen((v) => !v)}
        onOffsetChange={setContactOffset}
      />

      <ChatbotWidget isOpen={isChatOpen} bottomOffset={contactOffset} />

      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={wishlist.some((w) => w.id === quickViewProduct?.id)}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        whatsappNumber={settings?.whatsapp_number}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemove={removeFromWishlist}
        onAddToCart={addToCart}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateCartQty}
        onRemove={removeFromCart}
        whatsappNumber={settings?.whatsapp_number}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#1E1C1A] text-[#FFFDF9] border border-[#B8945A] px-5 py-3 shadow-2xl text-xs uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#B8945A]"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}
