'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../lib/contexts/CartContext';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/admin') || pathname === '/app' || pathname === '/mobile') {
    return null;
  }

  const isHomePage = pathname === '/';

  const navLinks = [
    { href: '/boutique', label: 'Joaillerie' },
    { href: '/lookbook', label: 'Lookbook' },
    { href: '/la-maison', label: 'La Maison' },
    { href: '/le-cercle', label: 'Le Cercle' },
    { href: '/magazine', label: 'Magazine' },
  ];

  const textColorClass = isHomePage ? 'text-white' : 'text-ink';

  return (
    <>
      {/* ─── En-tête Fixé au Sommet (100% Transparent & Épuré) ─── */}
      <header className="absolute top-0 left-0 w-full z-50 py-8 bg-transparent">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 flex items-center justify-between">
          
          {/* Logo PERSEUS */}
          <Link
            href="/"
            className={`font-serif uppercase tracking-[0.4em] text-xl sm:text-2xl font-normal hover:opacity-75 transition-opacity ${textColorClass}`}
          >
            PERSEUS
          </Link>

          {/* Navigation Centrale */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-14">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mont uppercase tracking-[0.3em] text-[10px] hover:opacity-70 transition-opacity duration-200 font-light ${textColorClass}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions Droite */}
          <div className={`flex items-center gap-6 sm:gap-8 ${textColorClass}`}>
            <Link
              href="/boutique"
              className="hover:opacity-70 transition-opacity duration-200"
              aria-label="Favoris"
            >
              <Heart className="w-4 h-4 stroke-[1.5]" />
            </Link>

            <Link
              href="/profil"
              className="hover:opacity-70 transition-opacity duration-200"
              aria-label="Espace Membre"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
            </Link>

            <Link
              href="/panier"
              className="relative hover:opacity-70 transition-opacity duration-200"
              aria-label="Panier d'achats"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className={`absolute -top-2 -right-2 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center ${
                  isHomePage ? 'bg-white text-black' : 'bg-ink text-white'
                }`}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden hover:opacity-70 transition-opacity duration-200"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Menu Mobile Plein Écran Noir Mat ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[990] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 w-80 bg-[#0A0A0A] border-l-[0.5px] border-white/10 p-10 z-[999] flex flex-col justify-between md:hidden shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-16">
                  <span className="font-serif uppercase tracking-[0.35em] text-lg text-white font-normal">
                    PERSEUS
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5 stroke-[1.5]" />
                  </button>
                </div>
                <nav className="flex flex-col space-y-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="font-serif text-2xl uppercase tracking-wider text-white hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-10 border-t-[0.5px] border-white/10">
                <p className="font-mont text-[9px] uppercase tracking-[0.3em] text-white/40">
                  Portola Drive • Los Santos
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
