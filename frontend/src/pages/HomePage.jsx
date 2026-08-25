import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useShopData } from '../context/ShopDataContext';

import Hero from '../components/Hero';
import FeaturedCollections from '../components/FeaturedCollections';
import EditorialSection from '../components/EditorialSection';
import BestsellerSection from '../components/BestsellerSection';
import CampaignSection from '../components/CampaignSection';
import Craftsmanship from '../components/Craftsmanship';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import MapSection from '../components/MapSection';
import ContactSection from '../components/ContactSection';
import Newsletter from '../components/Newsletter';

export default function HomePage() {
  const { products, categories, heroData, testimonials, settings } = useShopData();
  const { onQuickView, onAddToCart, onToggleWishlist, wishlist } = useOutletContext();

  const handleSelectCategory = (catSlug) => {
    const elem = document.getElementById('bestsellers');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Hero heroData={heroData} />

      <FeaturedCollections
        categories={categories}
        onSelectCategory={handleSelectCategory}
      />

      <EditorialSection />

      <BestsellerSection
        products={products}
        wishlist={wishlist}
        onToggleWishlist={onToggleWishlist}
        onQuickView={onQuickView}
        onAddToCart={onAddToCart}
      />

      <CampaignSection />

      <Craftsmanship />

      <Services />

      <Testimonials testimonials={testimonials} />

      <MapSection settings={settings} />

      <ContactSection settings={settings} />

      <Newsletter />
    </>
  );
}
