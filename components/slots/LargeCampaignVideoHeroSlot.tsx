'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LargeCampaignVideoHeroSlot({ onExploreClick }: { onExploreClick?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleScrollToBoutique = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('boutique-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen min-h-[750px] flex flex-col justify-end pb-24 sm:pb-32 overflow-hidden bg-black select-none"
    >
      {/* 4K Background Video Canvas with subtle dark atmosphere */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/assets/menyoo/PERSEUS_PORTOLA_DRIVE_LOS_SANTOS_1.png"
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.38]"
        >
          <source src="/video/PERSEUS_2.mp4" type="video/mp4" />
        </video>

        {/* Soft luxury dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35 pointer-events-none" />
      </motion.div>

      {/* Hero Typography & Actions (Matching user screenshot exactly) */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto"
      >
        <div className="space-y-6">
          {/* Surtitre Gold */}
          <span className="text-[10px] sm:text-[11px] font-mont uppercase tracking-[0.45em] text-[#C5A044] font-semibold block">
            PORTOLA DRIVE · ROCKFORD HILLS
          </span>

          {/* Main Monumental Serif Title */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.2em] uppercase text-white font-light leading-[1.05] drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            PERSEUS
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm font-light text-white/80 tracking-[0.25em] uppercase max-w-2xl mx-auto leading-relaxed font-mont">
            HAUTE JOAILLERIE, ORFÈVRERIE 24K &amp; PIÈCES D&apos;EXCEPTION FAÇONNÉES À LOS SANTOS.
          </p>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={handleScrollToBoutique}
              className="inline-flex items-center gap-3 px-9 py-4 border border-white text-white hover:bg-white hover:text-black text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 backdrop-blur-sm"
            >
              Accéder à la Boutique (435 Pièces)
            </button>

            <Link
              href="/magazine"
              className="inline-flex items-center gap-2 text-white/80 hover:text-[#C5A044] text-[10px] uppercase tracking-[0.3em] font-medium transition-colors border-b border-white/30 hover:border-[#C5A044] pb-1 font-mont"
            >
              Feuilleter la Gazette Perseus <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Bottom Défiler Indicator */}
      <div
        onClick={handleScrollToBoutique}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <span className="text-[8px] uppercase tracking-[0.4em] text-white font-light">Défiler</span>
        <div className="w-[1px] h-6 bg-white/40 animate-pulse" />
      </div>
    </section>
  );
}
