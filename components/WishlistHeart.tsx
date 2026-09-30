'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../lib/contexts/WishlistContext';
import { Product } from '../lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface WishlistHeartProps {
  product: Product;
  size?: number;
}

export default function WishlistHeart({ product, size = 18 }: WishlistHeartProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const active = isInWishlist(product.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      className={`relative flex items-center justify-center transition-all duration-300 ${
        active ? 'text-red-500 scale-110' : 'text-white/40 hover:text-white'
      }`}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active ? 'active' : 'inactive'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Heart 
            size={size} 
            fill={active ? 'currentColor' : 'none'} 
            strokeWidth={active ? 0 : 2}
          />
        </motion.div>
      </AnimatePresence>

      {/* Pop effect on click */}
      {active && (
        <motion.div
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          className="absolute inset-0 bg-red-500/20 rounded-full pointer-events-none"
        />
      )}
    </button>
  );
}
