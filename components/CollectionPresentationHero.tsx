'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';

interface CollectionPresentationHeroProps {
  onStartDive: (initialLookIndex?: number) => void;
  onOpenGazette?: () => void;
}

export default function CollectionPresentationHero({ onStartDive, onOpenGazette }: CollectionPresentationHeroProps) {
  const [selectedPoster, setSelectedPoster] = useState<number | null>(1); // Default to Duo (middle)

  const collections = [
    {
      id: 'femme',
      index: 0,
      title: 'Silhouette Femme',
      badge: 'Capsule A/W 2026',
      subtitle: 'Denim sculpté, cuir d’agneau & orfèvrerie',
      src: '/assets/campaign/perseus_fall_2026_femme.png',
      alt: 'Perseus Fall Collection 2026 - Silhouette Femme',
    },
    {
      id: 'duo',
      index: 2,
      title: 'Le Duo Mythologique',
      badge: 'Campagne Officielle',
      subtitle: 'L’élégance souveraine de Portola Drive',
      src: '/assets/campaign/perseus_fall_2026_duo.png',
      alt: 'Perseus Fall Collection 2026 - Le Duo',
      featured: true,
    },
    {
      id: 'homme',
      index: 1,
      title: 'Silhouette Homme',
      badge: 'Haute Orfèvrerie',
      subtitle: 'Soie baroque, boucle solaire & derbies de gala',
      src: '/assets/campaign/perseus_fall_2026_homme.png',
      alt: 'Perseus Fall Collection 2026 - Silhouette Homme',
    },
  ];

  return (
    <section className="relative w-full min-h-screen bg-[#0a0a0c] text-white flex flex-col justify-between py-12 sm:py-16 px-4 sm:px-8 lg:px-16 overflow-hidden select-none">
      
      {/* Background Subtle Luxury Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#C5A044]/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,7,0.85)_80%)]" />
      </div>

      {/* En-tête Prestigieux */}
      <div className="relative z-20 max-w-6xl mx-auto text-center space-y-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A044]/30 bg-[#C5A044]/10 text-[#E5C158] text-[10px] font-mono tracking-[0.3em] uppercase"
        >
          <Sparkles size={12} className="text-[#C5A044]" />
          <span>Campagne Officielle · Portola Drive, Rockford Hills</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.18em] uppercase font-light text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        >
          FALL COLLECTION
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-xs sm:text-sm md:text-base font-light tracking-[0.35em] text-[#C5A044] uppercase font-mont max-w-2xl mx-auto"
        >
          The Art of Style &bull; A/W 2026 Collections &bull; Embracing the Exceptional
        </motion.p>
      </div>

      {/* Triptyque des 3 Posters de Campagne */}
      <div className="relative z-20 max-w-7xl mx-auto w-full my-8 sm:my-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center">
          {collections.map((col) => {
            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 * col.index }}
                onClick={() => setSelectedPoster(col.index)}
                className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-500 ${
                  col.featured
                    ? 'md:-translate-y-3 ring-2 ring-[#C5A044]/70 shadow-[0_25px_60px_rgba(197,160,68,0.25)]'
                    : 'hover:-translate-y-1.5 ring-1 ring-white/10 hover:ring-[#C5A044]/40 shadow-[0_15px_35px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Poster Image Container */}
                <div className="relative aspect-[9/16] w-full bg-zinc-950 overflow-hidden">
                  <Image
                    src={col.src}
                    alt={col.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority={col.featured}
                  />

                  {/* Gradient Overlay for Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-block bg-black/60 backdrop-blur-md border border-[#C5A044]/40 text-[#E5C158] text-[9px] font-mont uppercase tracking-[0.25em] px-3 py-1 rounded-full font-semibold">
                      {col.badge}
                    </span>
                  </div>

                  {/* Bottom Information */}
                  <div className="absolute bottom-5 inset-x-5 z-10 space-y-1.5">
                    <h3 className="font-serif text-xl sm:text-2xl text-white uppercase tracking-wider font-light drop-shadow">
                      {col.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-zinc-300 font-mont tracking-widest font-light line-clamp-1">
                      {col.subtitle}
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartDive(col.index);
                        }}
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A044] hover:text-white transition-colors"
                      >
                        <span>Explorer ce look</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Grand Bouton de Plongée Cinématique */}
      <div className="relative z-20 max-w-xl mx-auto w-full text-center space-y-4 pb-4">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onStartDive(selectedPoster !== null ? selectedPoster : 0)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-4 px-10 sm:px-14 py-4 sm:py-5 rounded-full bg-gradient-to-r from-[#C5A044] via-[#E5C158] to-[#C5A044] text-zinc-950 font-mont font-bold text-xs sm:text-sm uppercase tracking-[0.35em] shadow-[0_15px_40px_rgba(197,160,68,0.45)] hover:shadow-[0_20px_55px_rgba(197,160,68,0.65)] transition-all duration-300"
        >
          <Compass className="w-5 h-5 animate-pulse" />
          <span>PLONGER DANS LA COLLECTION</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400">
          IMMERSION 3D DANS LE MONDE PERSEUS &bull; DÉCOUVERTE DÉTAILLÉE DES PIÈCES
        </p>
      </div>

    </section>
  );
}
