'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  ArrowRight, 
  Phone, 
  HelpCircle, 
  Calendar, 
  Truck
} from 'lucide-react';
import { PerseusCatalog } from '../lib/catalog';
import { Product } from '../lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INSPIRATION_ITEMS = [
  {
    label: 'HAUTE HORLOGERIE',
    file: 'c0UpA45.png',
    href: '/boutique?category=cat-montres',
  },
  {
    label: 'BAGUES DE PRESTIGE',
    file: 'EZQLEW1.png',
    href: '/boutique?category=cat-bagues',
  },
  {
    label: 'ICÔNES DE PORTOLA',
    file: '94O9KYF.png',
    href: '/boutique?category=cat-bracelets',
  },
  {
    label: 'COLLIERS D\'EXCEPTION',
    file: 'kzIvu6w.png',
    href: '/boutique?category=cat-colliers',
  },
];

const QUICK_TAGS = [
  { label: 'CADEAUX POUR ELLE', query: 'collier' },
  { label: 'CADEAUX POUR LUI', query: 'montre' },
  { label: 'BAGUES', query: 'bague' },
  { label: 'BRACELETS', query: 'bracelet' },
  { label: 'MONTRES', query: 'montre' },
  { label: 'MAROQUINERIE', query: 'sac' },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults: Product[] = query.trim() === '' ? [] : PerseusCatalog.filter(p => {
    const q = query.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.cat.toLowerCase().includes(q) ||
      (p.collection && p.collection.toLowerCase().includes(q)) ||
      (p.desc && p.desc.toLowerCase().includes(q))
    );
  }).slice(0, 8);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex flex-col justify-start overflow-y-auto"
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-[#FAF8F5] border-b border-zinc-200/90 shadow-2xl pt-10 pb-16 px-6 sm:px-12 lg:px-20 text-zinc-900 relative"
          >
            <div className="max-w-[1400px] mx-auto">
              
              <div className="flex items-center justify-between mb-12">
                <div className="w-10" />
                
                <Link
                  href="/"
                  onClick={onClose}
                  className="font-serif uppercase tracking-[0.4em] text-3xl sm:text-4xl text-zinc-950 font-normal hover:opacity-80 transition-opacity"
                >
                  PERSEUS
                </Link>

                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 flex items-center justify-center text-zinc-600 hover:text-zinc-950 transition-all shadow-sm"
                  aria-label="Fermer la recherche"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="max-w-2xl mx-auto mb-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className="flex items-center border-b-2 border-zinc-900 pb-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher des créations, bagues, montres..."
                    className="w-full bg-transparent text-zinc-900 text-lg sm:text-xl font-serif italic outline-none placeholder:text-zinc-400 placeholder:not-italic"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="text-zinc-400 hover:text-zinc-900 mr-4 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont text-xs uppercase tracking-[0.25em] font-bold transition-colors whitespace-nowrap shadow-sm"
                  >
                    Rechercher
                  </button>
                </form>
              </div>

              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-16">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => setQuery(tag.query)}
                    className="px-4 py-2 border border-zinc-300 bg-white hover:border-[#C5A044] hover:text-[#C5A044] text-zinc-700 font-mont text-[10.5px] uppercase tracking-[0.18em] font-semibold transition-all shadow-sm rounded-none"
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              {query.trim() !== '' ? (
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-8">
                    <span className="font-mont text-xs uppercase tracking-[0.2em] text-[#C5A044] font-bold">
                      Résultats en direct ({searchResults.length} créations)
                    </span>
                    <Link
                      href={`/boutique?q=${encodeURIComponent(query)}`}
                      onClick={onClose}
                      className="text-xs font-mont uppercase tracking-widest text-zinc-600 hover:text-zinc-950 font-semibold"
                    >
                      Voir tout dans la boutique →
                    </Link>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="font-serif text-2xl text-zinc-900 mb-2">Aucune création trouvée</p>
                      <p className="font-mont text-xs text-zinc-500 uppercase tracking-widest">
                        Essayez avec un autre mot-clé (ex: Bague, Rolex, Or, Diamant, Nerisya...)
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                      {searchResults.map((item) => (
                        <Link
                          key={item.id}
                          href={`/produit/${item.id}`}
                          onClick={onClose}
                          className="group flex flex-col bg-white border border-zinc-200 p-4 rounded-none hover:border-[#C5A044] transition-all shadow-sm"
                        >
                          <div className="relative aspect-square bg-[#FAF8F5] mb-3 overflow-hidden flex items-center justify-center p-4">
                            <Image
                              src={`/assets/bijoux/trier/${item.file}`}
                              alt={item.name}
                              fill
                              className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                              unoptimized={true}
                            />
                          </div>
                          <span className="font-mont text-[9px] uppercase tracking-widest text-[#C5A044] font-medium">
                            {item.cat}
                          </span>
                          <h4 className="font-serif text-base uppercase text-zinc-900 group-hover:text-[#C5A044] transition-colors truncate">
                            {item.name}
                          </h4>
                          <span className="font-mont text-xs text-zinc-900 font-bold mt-1">
                            ${item.priceStr || item.price.toLocaleString('en-US')}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 border-t border-zinc-200">
                  
                  <div className="lg:col-span-6 space-y-6">
                    <h3 className="font-mont text-xs uppercase tracking-[0.25em] font-bold text-zinc-950">
                      Trouvez l&apos;Inspiration
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {INSPIRATION_ITEMS.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={onClose}
                          className="group flex flex-col items-center text-center"
                        >
                          <div className="relative aspect-[3/4] w-full bg-white border border-zinc-200 rounded-none overflow-hidden flex items-center justify-center p-3 mb-3 group-hover:border-zinc-400 transition-colors shadow-sm">
                            <Image
                              src={`/assets/bijoux/trier/${item.file}`}
                              alt={item.label}
                              fill
                              className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                              unoptimized={true}
                            />
                          </div>
                          <span className="font-mont text-[9px] uppercase tracking-[0.2em] text-zinc-800 font-semibold group-hover:text-[#C5A044] transition-colors leading-tight">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3 space-y-6 lg:border-l lg:border-zinc-200 lg:pl-10">
                    <h3 className="font-mont text-xs uppercase tracking-[0.25em] font-bold text-zinc-950">
                      Articles &amp; Univers
                    </h3>
                    
                    <div className="space-y-4">
                      {[
                        { title: "Haute Horlogerie & Savoir-Faire", href: "/boutique?category=cat-montres" },
                        { title: "L'Odyssée de Perseus, Chapitre II", href: "/la-maison" },
                        { title: "Le Cercle Privilège & VIP", href: "/le-cercle" },
                        { title: "Lookbook Portola Drive", href: "/lookbook" },
                        { title: "À la Une · Actualités", href: "/magazine" },
                      ].map((art) => (
                        <Link
                          key={art.title}
                          href={art.href}
                          onClick={onClose}
                          className="flex items-center justify-between py-1 text-xs font-mont text-zinc-700 hover:text-[#C5A044] uppercase tracking-wider font-medium group transition-colors"
                        >
                          <span>{art.title}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-1 group-hover:text-[#C5A044] transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3 bg-white border border-zinc-200/90 p-6 sm:p-8 rounded-none space-y-5 shadow-sm">
                    <h3 className="font-mont text-xs uppercase tracking-[0.25em] font-bold text-zinc-950">
                      Service Client
                    </h3>
                    
                    <div className="space-y-4 font-mont text-xs">
                      <Link
                        href="/faq"
                        onClick={onClose}
                        className="flex items-center gap-3 text-zinc-700 hover:text-zinc-950 font-medium transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-[#C5A044]" />
                        <span>Section Aide &amp; FAQ</span>
                      </Link>

                      <Link
                        href="/la-maison"
                        onClick={onClose}
                        className="flex items-center gap-3 text-zinc-700 hover:text-zinc-950 font-medium transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-[#C5A044]" />
                        <span>Prendre Rendez-vous en Boutique</span>
                      </Link>

                      <Link
                        href="/cgv"
                        onClick={onClose}
                        className="flex items-center gap-3 text-zinc-700 hover:text-zinc-950 font-medium transition-colors"
                      >
                        <Truck className="w-4 h-4 text-[#C5A044]" />
                        <span>Expédition &amp; Livraison Sécurisée</span>
                      </Link>

                      <div className="pt-2 border-t border-zinc-100 flex items-center gap-3 text-zinc-500 text-[11px]">
                        <Phone className="w-4 h-4 text-[#C5A044]" />
                        <span>Portola Drive, Los Santos</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
