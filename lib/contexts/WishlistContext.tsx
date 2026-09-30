'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import PerseusAPI from '../api';
import PerseusLogger from '../logger';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWithServer: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage FIRST
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const saved = localStorage.getItem('perseus_wishlist');
        let initialWishlist: Product[] = [];
        if (saved) {
          initialWishlist = JSON.parse(saved);
        }

        // If logged in, sync with server
        if (PerseusAPI.isLoggedIn()) {
          try {
            // MERGE local with server
            const localIds = initialWishlist.map(p => p.id);
            const res = await PerseusAPI.syncWishlist(localIds);
            if (res.success) {
              setWishlist(res.wishlist);
            }
          } catch (e) {
            console.error('Server wishlist sync failed', e);
            setWishlist(initialWishlist);
          }
        } else {
          setWishlist(initialWishlist);
        }
      } catch (e) {
        console.warn('Failed to load wishlist', e);
      }
      setIsLoaded(true);
    };
    
    loadInitial();
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('perseus_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const syncWithServer = useCallback(async () => {
    if (!PerseusAPI.isLoggedIn()) return;
    try {
      const serverWishlist = await PerseusAPI.getWishlist();
      setWishlist(serverWishlist);
    } catch (e) {
      console.error('Failed to refresh wishlist from server', e);
    }
  }, []);

  const toggleWishlist = useCallback(async (product: Product) => {
    // 1. Update local state immediately for snappy UI
    const exists = wishlist.find((item) => item.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
    } else {
      setWishlist(prev => [...prev, product]);
    }

    // 2. Sync with server if logged in
    if (PerseusAPI.isLoggedIn()) {
      try {
        await PerseusAPI.toggleFavorite(product.id);
        PerseusLogger.sendLog('cart', `Sync favori DB: ${product.name}`, { id: product.id });
      } catch (e) {
        console.error('Failed to sync favorite toggle with server', e);
      }
    } else {
      PerseusLogger.sendLog('cart', `${exists ? 'Retrait' : 'Ajout'} favoris local: ${product.name}`, { id: product.id });
    }
  }, [wishlist]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some((item) => item.id === productId);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    localStorage.removeItem('perseus_wishlist');
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist, syncWithServer }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
