'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '../../lib/contexts/CartContext';

export default function PanierPage() {
  const { cart, removeFromCart, addToCart, decreaseQuantity, cartCount, clearCart } = useCart();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 pt-40 pb-36 px-6 flex items-center justify-center">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto border border-zinc-200 shadow-sm">
            <ShoppingBag className="w-8 h-8 text-[#C5A044]" />
          </div>
          <p className="font-mont text-xs uppercase tracking-[0.3em] text-[#C5A044] font-bold">Votre Écrin</p>
          <h1 className="font-serif text-4xl text-zinc-900 uppercase">Est Actuellement Vide</h1>
          <p className="text-zinc-600 font-mont text-sm leading-relaxed">
            Explorez notre catalogue de haute joaillerie pour choisir vos pièces d&apos;exception.
          </p>
          <Link
            href="/boutique"
            className="inline-block px-10 py-4 bg-zinc-950 text-white font-mont text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#C5A044] transition-colors rounded-xl shadow-md"
          >
            Découvrir la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 pt-36 pb-36 px-4 sm:px-8 lg:px-16 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex justify-between items-end border-b border-zinc-200/80 pb-8">
          <div>
            <p className="font-mont text-xs uppercase tracking-[0.3em] text-[#C5A044] font-bold mb-2">
              Récapitulatif des Acquisitions
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl text-zinc-950 uppercase tracking-tight">
              Votre Écrin
            </h1>
            <p className="text-zinc-500 font-mont text-xs uppercase tracking-[0.2em] font-medium mt-3">
              {cartCount} création{cartCount > 1 ? 's' : ''} sélectionnée{cartCount > 1 ? 's' : ''}
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-zinc-500 hover:text-red-500 uppercase tracking-wider font-bold transition flex items-center gap-2 pb-1"
          >
            <Trash2 className="w-4 h-4" /> Vider l&apos;écrin
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-14">

          {/* Liste des Pièces (Gauche) */}
          <div className="xl:col-span-7 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 flex items-center gap-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)]"
              >
                {/* Thumbnail */}
                <Link
                  href={`/produit/${item.id}`}
                  className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#FAF8F5] border border-zinc-200 rounded-xl flex-shrink-0 flex items-center justify-center p-2 hover:border-[#C5A044] transition-colors"
                >
                  <Image
                    src={`/assets/bijoux/trier/${item.file}`}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                    unoptimized={true}
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <span className="font-mont text-xs uppercase tracking-wider text-[#C5A044] font-semibold">
                    {item.cat}
                  </span>
                  <Link
                    href={`/produit/${item.id}`}
                    className="block font-serif text-lg sm:text-xl text-zinc-950 uppercase font-normal hover:text-[#C5A044] transition-colors truncate"
                  >
                    {item.name}
                  </Link>
                  <p className="font-mont text-sm text-[#C5A044] font-bold">
                    ${item.price.toLocaleString('en-US')}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex items-center border border-zinc-200 rounded-lg bg-[#FAF8F5]">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-3 py-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-1.5 font-mont text-xs font-bold text-zinc-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="px-3 py-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Total Price Item */}
                <div className="text-right hidden sm:block">
                  <span className="font-mont text-base font-bold text-zinc-950">
                    ${(item.price * item.quantity).toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 text-xs font-mont uppercase tracking-[0.2em] font-bold text-zinc-600 hover:text-zinc-950 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continuer les achats</span>
              </Link>
            </div>
          </div>

          {/* Récapitulatif Total (Droite) */}
          <div className="xl:col-span-5">
            <div className="sticky top-36 bg-white border border-zinc-200/90 rounded-2xl p-8 sm:p-10 shadow-[0_2px_20px_rgba(0,0,0,0.02)] space-y-7">
              <h3 className="font-serif text-2xl uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-4">
                Récapitulatif
              </h3>

              <div className="space-y-3 font-mont text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Sous-total</span>
                  <span className="font-bold text-zinc-950">${subtotal.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Livraison Sécurisée (Portola Drive)</span>
                  <span className="text-[#C5A044] font-bold text-xs uppercase">Offerte</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Taxes &amp; Assurances</span>
                  <span className="text-zinc-950 font-semibold text-xs uppercase">Incluses</span>
                </div>
                <div className="flex justify-between text-xl font-serif text-zinc-950 pt-5 border-t border-zinc-200 uppercase">
                  <span>Montant Total</span>
                  <span className="text-[#C5A044] font-mont text-2xl font-bold">
                    ${subtotal.toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-5 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont text-xs sm:text-sm uppercase tracking-[0.25em] font-bold rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-center"
              >
                <Lock className="w-4 h-4 text-[#C5A044]" />
                <span>Procéder au paiement</span>
              </Link>

              <div className="p-4 bg-[#FAF8F5] border border-zinc-200/80 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C5A044] flex-shrink-0" />
                <p className="font-mont text-xs text-zinc-700 leading-relaxed uppercase tracking-wider font-medium">
                  Protocole de prélèvement bancaire sécurisé Fleeca Bank V2.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
