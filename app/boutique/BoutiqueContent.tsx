'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import { useCart } from '../../lib/contexts/CartContext';
import { Product } from '../../lib/types';
import PerseusAPI from '../../lib/api';
import WishlistHeart from '../../components/WishlistHeart';

const CATEGORIES = [
  { id: 'cat-bagues', name: 'Bagues & Bracelets' },
  { id: 'cat-colliers', name: 'Colliers & Pendentifs' },
  { id: 'cat-montres', name: 'Montres' },
  { id: 'cat-grillz', name: 'Grillz' },
  { id: 'v-sacs', name: 'Maroquinerie' },
];

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name';

export default function BoutiqueContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('default');
  const [showFilters, setShowFilters] = useState(false);

  // Handle URL category/query params
  useEffect(() => {
    const cat = searchParams?.get('category') || searchParams?.get('q');
    const catLower = cat?.toLowerCase() || '';
    if (catLower) {
      const match = CATEGORIES.find(c =>
        c.name.toLowerCase().includes(catLower) ||
        c.id.includes(catLower) ||
        catLower.includes(c.id.replace('cat-', '').replace('v-', ''))
      );
      if (match) setSelectedCategory([match.id]);
    }
  }, [searchParams]);

  // Fetch products from API based on filters
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams: any = {};
        
        // Handle category mapping
        if (selectedCategory.length > 0) {
          // Join multiple categories for the server to handle OR pick the first one
          // For now, let's pass them as a list if the API supports it or filter locally if needed
          // API currently takes one 'category' string param. 
          // Let's refine API to handle multiple or just take the first for now.
          queryParams.category = selectedCategory[0].replace('cat-', '');
        }

        const q = searchParams?.get('q');
        if (q) queryParams.q = q;

        // Map UI sort keys to API sort keys
        if (sortBy === 'price-asc') queryParams.sort = 'price_asc';
        else if (sortBy === 'price-desc') queryParams.sort = 'price_desc';
        else if (sortBy === 'name') queryParams.sort = 'name'; // API uses id asc by default

        const data = await PerseusAPI.getProducts(queryParams);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, sortBy, searchParams]);

  // Fetch user for VIP check
  useEffect(() => {
    async function fetchUser() {
      if (!PerseusAPI.isLoggedIn()) {
        setUser(null);
        return;
      }
      try {
        const u = await PerseusAPI.getProfile();
        setUser(u);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    }
    fetchUser();
  }, []);

  const searchQuery = searchParams?.get('q')?.toLowerCase() || '';

  const filteredProducts = products; // Already filtered by server

  const toggleCategory = (id: string) =>
    setSelectedCategory(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-canvas text-ink pt-36 pb-24">
      <div className="max-w-[1700px] mx-auto px-6 lg:px-12 xl:px-20">

        {/* ─── Header ─── */}
        <header className="mb-14 md:mb-20">
          <p className="font-mont uppercase tracking-ultra-wide text-gold text-[9px] mb-4">Collection Complète • Catalogue</p>
          <h1 className="font-serif text-4xl md:text-7xl font-normal text-ink uppercase tracking-tight mb-4">
            La Boutique Perseus
          </h1>
          <p className="text-ink-muted font-mont text-xs tracking-[0.35em] uppercase">
            L&apos;excellence à portée de main —{' '}
            <span className="text-gold font-medium">{filteredProducts.length} pièce{filteredProducts.length > 1 ? 's' : ''}</span>
            {searchQuery && ` pour "${searchQuery}"`}
          </p>
        </header>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-3 text-ink text-[11px] font-bold tracking-[0.25em] uppercase mb-8 border-[0.5px] border-ink/20 px-5 py-3 hover:border-gold transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? 'Fermer' : 'Filtres'}
          {selectedCategory.length > 0 && <span className="bg-gold text-white text-[9px] px-1.5 py-0.5 rounded ml-1 font-bold">{selectedCategory.length}</span>}
        </button>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

          {/* ─── Sidebar ─── */}
          <aside className={`w-full lg:w-52 xl:w-60 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-32 space-y-12">

              {/* Categories */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink">Catégories</h3>
                  {selectedCategory.length > 0 && (
                    <button onClick={() => setSelectedCategory([])} className="flex items-center gap-1 text-[9px] text-gold hover:text-gold-light uppercase tracking-widest font-bold transition">
                      <X className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {CATEGORIES.map(cat => (
                    <label key={cat.id} className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative flex-shrink-0">
                        <input
                          type="checkbox"
                          className="peer appearance-none w-3.5 h-3.5 border-[0.5px] border-ink/30 checked:border-gold checked:bg-gold transition cursor-pointer"
                          checked={selectedCategory.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 pointer-events-none">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className={`text-[11px] uppercase tracking-widest transition-colors leading-none ${selectedCategory.includes(cat.id) ? 'text-gold font-bold' : 'text-ink-muted group-hover:text-ink'}`}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-ink mb-6">Trier</h3>
                <div className="space-y-3">
                  {[
                    { value: 'default' as const, label: 'Par défaut' },
                    { value: 'price-asc' as const, label: 'Prix ↑' },
                    { value: 'price-desc' as const, label: 'Prix ↓' },
                    { value: 'name' as const, label: 'Nom A-Z' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`block text-[11px] uppercase tracking-widest transition-colors ${sortBy === opt.value ? 'text-gold font-bold' : 'text-ink-muted hover:text-ink'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ─── Product Grid ─── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="py-32 flex flex-col items-center gap-4">
                <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                <p className="text-[10px] uppercase tracking-[.3em] text-ink-muted">Chargement du catalogue...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-32 text-center">
                <p className="text-ink-muted font-mont text-xs uppercase tracking-widest mb-6">Aucun résultat.</p>
                <button onClick={() => { setSelectedCategory([]); }} className="text-gold text-[10px] font-bold uppercase tracking-widest hover:text-gold-light transition border-b border-gold pb-1">
                  Afficher tout
                </button>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, i) => (
                    <motion.div 
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1], delay: Math.min(i * 0.03, 0.3) }}
                      className="group product-card flex flex-col justify-between"
                    >
                      <div className="relative aspect-square overflow-hidden bg-white border-[0.5px] border-ink/10 flex items-center justify-center p-6 md:p-8 shadow-[0_4px_20px_rgba(18,17,16,0.03)]">
                        {/* Heart / Wishlist Button */}
                        <div className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-md rounded-full border border-ink/10 transition-all group-hover:scale-110 shadow-sm">
                          <WishlistHeart product={product} />
                        </div>

                        {product.is_exclusive === 1 && (
                          <span className="absolute top-3 left-3 z-10 bg-gold text-white text-[8px] font-bold px-2 py-0.5 tracking-tighter uppercase shadow-sm">Exclusif</span>
                        )}
                        {product.ribbon && !product.is_exclusive && (
                          <span className="absolute top-3 left-3 z-10 bg-canvas-warm border border-gold/30 text-gold text-[8px] font-mont px-2 py-0.5 uppercase tracking-wider">{product.ribbon}</span>
                        )}
                        <Image
                          src={`/assets/bijoux/trier/${product.file}`}
                          alt={product.name}
                          width={280}
                          height={280}
                          priority={i < 4}
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className={`w-full h-full object-contain transition-transform duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.08] drop-shadow-[0_10px_20px_rgba(18,17,16,0.1)] ${product.is_exclusive && (!user || user.vip_level === 'standard') ? 'grayscale opacity-40 blur-[2px]' : ''}`}
                        />
                        {/* Quick actions overlay */}
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end pb-6 gap-2">
                          {product.is_exclusive && (!user || user.vip_level === 'standard') ? (
                             <div className="text-center px-4 mb-4">
                               <p className="text-gold text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Membres VIP Uniquement</p>
                               <Link href="/profil" className="text-ink/60 hover:text-ink text-[8px] uppercase tracking-widest transition-colors font-bold border-b border-ink/20 pb-0.5">Améliorer mon rang</Link>
                             </div>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className="ghost-btn-luxury !py-2.5 !px-6 !text-[8px] !tracking-[0.25em] w-[85%] justify-center translate-y-4 group-hover:translate-y-0 duration-500 bg-white/90"
                            >
                              <ShoppingBag className="w-3 h-3" /> Ajouter à l&apos;Écrin
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="p-6 bg-canvas border-t-[0.5px] border-ink/10 group-hover:border-gold/40 transition-colors">
                        <p className="text-[8px] uppercase tracking-[0.3em] font-light mb-1.5 text-gold">{product.cat}</p>
                        <Link href={`/produit/${product.id}`} className="block font-serif text-lg text-ink tracking-wide uppercase hover:text-gold transition-colors mb-2 leading-tight font-normal">
                          {product.name}
                        </Link>
                        <p className="font-mont text-xs tracking-[0.2em] text-gold font-medium">${product.priceStr}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
