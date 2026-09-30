'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Lock
} from 'lucide-react';
import { useCart } from '../lib/contexts/CartContext';
import { useWishlist } from '../lib/contexts/WishlistContext';
import { Product } from '../lib/types';

export default function ProductDetailClient({ 
  product, 
  related 
}: { 
  product: Product; 
  related: Product[] 
}) {
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isWish = isInWishlist ? isInWishlist(product.id) : false;
  const inCart = cart?.find(item => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 pt-36 pb-36 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16">
        
        {/* Navigation retour */}
        <div className="mb-10">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-xs font-mont uppercase tracking-[0.2em] font-bold text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la boutique</span>
          </Link>
        </div>

        {/* Grille Principale Produit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20 items-center">
          
          {/* Cadre Visuel Carré Blanc Macro (Gauche) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square bg-white border border-zinc-200/90 rounded-3xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex items-center justify-center p-8 sm:p-14 group">
              
              <div className="absolute top-6 left-6 z-10">
                <span className="px-3.5 py-1 border border-[#C5A044]/50 bg-[#FAF8F5]/90 backdrop-blur-sm text-[#9A7B2F] text-[9px] font-mont uppercase tracking-widest font-bold rounded-full">
                  {product.collection || 'Collection Portola Drive'}
                </span>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full border border-zinc-200 bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-all"
                aria-label="Favoris"
              >
                <Heart className={`w-5 h-5 ${isWish ? 'fill-red-500 text-red-500' : 'text-zinc-400 hover:text-zinc-900'}`} />
              </button>

              <Image
                src={`/assets/bijoux/trier/${product.file}`}
                alt={product.name}
                fill
                className="object-contain p-6 sm:p-10 group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)]"
                unoptimized={true}
                priority
              />
            </div>
          </div>

          {/* Fiche & Détails de Luxe (Droite) */}
          <div className="lg:col-span-6 space-y-8">
            
            <div className="space-y-3">
              <span className="font-mont text-xs uppercase tracking-[0.3em] text-[#C5A044] font-bold block">
                {product.cat}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl uppercase text-zinc-950 leading-tight">
                {product.name}
              </h1>
              <p className="font-mont text-2xl sm:text-3xl text-[#C5A044] font-bold">
                ${product.priceStr || product.price?.toLocaleString('en-US')}
              </p>
            </div>

            <div className="w-full h-px bg-zinc-200" />

            <div className="space-y-4">
              <h3 className="font-mont text-xs uppercase tracking-widest text-zinc-950 font-bold">
                Description de l&apos;Atelier
              </h3>
              <p className="font-serif italic text-zinc-600 text-base sm:text-lg leading-relaxed">
                {product.desc || 'Création exclusive façonnée à la main dans les ateliers de la Maison Perseus. Matériaux précieux certifiés et finitions haute joaillerie pour une tenue éternelle.'}
              </p>
            </div>

            {/* Boutons d'Action */}
            <div className="space-y-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-5 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont text-xs sm:text-sm uppercase tracking-[0.25em] font-bold rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-4 h-4 text-[#C5A044]" />
                <span>{added ? 'Ajouté à votre écrin !' : 'Acquérir cette création'}</span>
              </button>

              <Link
                href="/checkout"
                className="w-full py-4 border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-mont text-xs uppercase tracking-[0.2em] font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-[#C5A044]" />
                <span>Règlement direct in-game</span>
              </Link>
            </div>

            {/* Garanties Maison */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 text-center">
              <div className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-1.5">
                <ShieldCheck className="w-5 h-5 text-[#C5A044] mx-auto" />
                <p className="font-mont text-[9px] uppercase tracking-wider font-bold text-zinc-900">Authenticité</p>
                <p className="font-mont text-[8.5px] text-zinc-500">Certifiée Perseus</p>
              </div>

              <div className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-1.5">
                <Truck className="w-5 h-5 text-[#C5A044] mx-auto" />
                <p className="font-mont text-[9px] uppercase tracking-wider font-bold text-zinc-900">Livraison LS</p>
                <p className="font-mont text-[8.5px] text-zinc-500">Portola Drive</p>
              </div>

              <div className="p-4 bg-white border border-zinc-200/80 rounded-xl space-y-1.5">
                <Sparkles className="w-5 h-5 text-[#C5A044] mx-auto" />
                <p className="font-mont text-[9px] uppercase tracking-wider font-bold text-zinc-900">Sur-Mesure</p>
                <p className="font-mont text-[8.5px] text-zinc-500">Atelier Privé</p>
              </div>
            </div>

          </div>

        </div>

        {/* Créations Similaires */}
        {related && related.length > 0 && (
          <div className="mt-28 pt-16 border-t border-zinc-200 space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mont text-xs uppercase tracking-[0.3em] text-[#C5A044] font-bold">
                  Suggestions d&apos;Atelier
                </span>
                <h2 className="font-serif text-3xl uppercase text-zinc-950 mt-1">
                  Pièces Complémentaires
                </h2>
              </div>

              <Link
                href="/boutique"
                className="font-mont text-xs uppercase tracking-wider text-[#C5A044] font-bold hover:underline"
              >
                Voir tout le catalogue →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/produit/${item.id}`}
                  className="group bg-white border border-zinc-200/90 rounded-2xl p-5 flex flex-col hover:border-[#C5A044] hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-square bg-[#FAF8F5] rounded-xl mb-4 overflow-hidden flex items-center justify-center p-3">
                    <Image
                      src={`/assets/bijoux/trier/${item.file}`}
                      alt={item.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      unoptimized={true}
                    />
                  </div>
                  <span className="font-mont text-[9px] uppercase tracking-widest text-[#C5A044] font-semibold">
                    {item.cat}
                  </span>
                  <h3 className="font-serif text-base uppercase text-zinc-950 group-hover:text-[#C5A044] transition-colors truncate mt-0.5">
                    {item.name}
                  </h3>
                  <span className="font-mont text-xs text-zinc-950 font-bold mt-1">
                    ${item.priceStr || item.price?.toLocaleString('en-US')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
