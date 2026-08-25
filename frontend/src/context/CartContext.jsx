import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [toastMessage, setToastMessage] = useState('');

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('vetri_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('vetri_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('vetri_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('vetri_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  }, []);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from your wishlist`);
        return prev.filter((item) => item.id !== product.id);
      }
      showToast(`Added "${product.name}" to your wishlist`);
      return [...prev, product];
    });
  }, [showToast]);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity = (updated[existingIdx].quantity || 1) + quantity;
        showToast(`Updated "${product.name}" in shopping bag`);
        return updated;
      }
      showToast(`Added "${product.name}" to shopping bag`);
      return [...prev, { ...product, quantity }];
    });
  }, [showToast]);

  const updateCartQty = useCallback((id, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        toastMessage,
        showToast,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
