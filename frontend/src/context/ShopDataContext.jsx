import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, fallbackData } from '../services/api';

const ShopDataContext = createContext(null);

export function ShopDataProvider({ children }) {
  const [products, setProducts] = useState(fallbackData.products);
  const [categories, setCategories] = useState(fallbackData.categories);
  const [heroData, setHeroData] = useState(fallbackData.hero);
  const [testimonials, setTestimonials] = useState(fallbackData.testimonials);
  const [settings, setSettings] = useState(fallbackData.settings);

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

  return (
    <ShopDataContext.Provider value={{ products, categories, heroData, testimonials, settings }}>
      {children}
    </ShopDataContext.Provider>
  );
}

export function useShopData() {
  const ctx = useContext(ShopDataContext);
  if (!ctx) {
    throw new Error('useShopData must be used within a ShopDataProvider');
  }
  return ctx;
}
