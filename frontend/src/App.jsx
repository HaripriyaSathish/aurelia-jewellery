import React, { useState, useEffect } from 'react';
import { apiService, fallbackData } from './services/api';

import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedCollections from './components/FeaturedCollections';
import EditorialSection from './components/EditorialSection';
import BestsellerSection from './components/BestsellerSection';
import CampaignSection from './components/CampaignSection';
import Craftsmanship from './components/Craftsmanship';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import MapSection from './components/MapSection';
import ContactSection from './components/ContactSection';
import Newsletter from './components/Newsletter';
import FloatingContactButtons from './components/FloatingContactButtons';
import Footer from './components/Footer';

import ProductQuickViewModal from './components/ProductQuickViewModal';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';

export default function App() {
  // Data States
  const [products, setProducts] = useState(fallbackData.products);
  const [categories, setCategories] = useState(fallbackData.categories);
  const [heroData, setHeroData] = useState(fallbackData.hero);
  const [testimonials, setTestimonials] = useState(fallbackData.testimonials);
  const [settings, setSettings] = useState(fallbackData.settings);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Interactive UI States
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Wishlist & Cart in LocalStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('aurelia_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('aurelia_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('aurelia_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('aurelia_cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch initial dynamic data from Django API
  useEffect(() => {
    async function loadData() {
      try {
        const [prodsData, catsData, heroRes, testRes, setRes] = await Promise.allSettled([
          apiService.getProducts(),
          apiService.getCategories(),
          apiService.getHeroBanner(),
          apiService.getTestimonials(),
          apiService.getShopSettings(),
        ]);

        if (prodsData.status === 'fulfilled' && prodsData.value?.length > 0) {
          setProducts(prodsData.value);
        }
        if (catsData.status === 'fulfilled' && catsData.value?.length > 0) {
          setCategories(catsData.value);
        }
        if (heroRes.status === 'fulfilled' && heroRes.value) {
          setHeroData(heroRes.value);
        }
        if (testRes.status === 'fulfilled' && testRes.value?.length > 0) {
          setTestimonials(testRes.value);
        }
        if (setRes.status === 'fulfilled' && setRes.value) {
          setSettings(setRes.value);
        }
      } catch (err) {
        console.warn('Using fallback data:', err);
      }
    }

    loadData();
  }, []);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  // Wishlist handlers
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from your wishlist`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Added "${product.name}" to your wishlist`);
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  // Cart handlers
  const handleAddToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity = (updated[existingIdx].quantity || 1) + quantity;
        showToast(`Updated "${product.name}" in shopping bag`);
        return updated;
      } else {
        showToast(`Added "${product.name}" to shopping bag`);
        return [...prev, { ...product, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Category select handler (scrolls down to bestsellers)
  const handleSelectCategory = (catSlug) => {
    setSelectedCategory(catSlug);
    const elem = document.getElementById('bestsellers');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1E1C1A] selection:bg-[#B8945A] selection:text-white flex flex-col justify-between relative font-sans">
      
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Transparent Luxury Navbar */}
      <Navbar
        wishlistCount={wishlist.length}
        cartCount={cart.reduce((total, item) => total + (item.quantity || 1), 0)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        settings={settings}
      />

      {/* Main Page Flow */}
      <main className="flex-grow">
        
        {/* 3. Full-Screen Hero */}
        <Hero heroData={heroData} />

        {/* 4. Featured Collections */}
        <FeaturedCollections
          categories={categories}
          onSelectCategory={handleSelectCategory}
        />

        {/* 5. Editorial Story Section */}
        <EditorialSection />

        {/* 6. Bestselling Jewellery */}
        <BestsellerSection
          products={products}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 7. Full-Width Campaign */}
        <CampaignSection />

        {/* 8. Craftsmanship */}
        <Craftsmanship />

        {/* 9. Services */}
        <Services />

        {/* 10. Testimonials */}
        <Testimonials testimonials={testimonials} />

        {/* 11. Location & Google Map Integration */}
        <MapSection settings={settings} />

        {/* 12. Contact Section */}
        <ContactSection settings={settings} />

        {/* 13. Newsletter */}
        <Newsletter />

      </main>

      {/* 14. Luxury Dark Footer */}
      <Footer settings={settings} />

      {/* 15. Fixed Floating Contact Buttons (Intelligent Footer Avoidance) */}
      <FloatingContactButtons settings={settings} />

      {/* Modals & Slide-out Drawers */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={wishlist.some((w) => w.id === quickViewProduct?.id)}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        whatsappNumber={settings?.whatsapp_number}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemove={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemove={handleRemoveFromCart}
        whatsappNumber={settings?.whatsapp_number}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      {/* Luxury Toast Notification */}
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
