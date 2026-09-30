'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Header from './Header';

interface TunnelDiveProps {
  onDiveComplete: () => void;
  onOpenGazette: () => void;
}

export default function CinemaPortalTunnelDive({ onDiveComplete, onOpenGazette }: TunnelDiveProps) {
  const [isDiving, setIsDiving] = useState(false);

  const startDive = () => {
    if (isDiving) return;
    setIsDiving(true);

    setTimeout(() => {
      onDiveComplete();
    }, 850);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none flex flex-col justify-between">
      
      {/* Grain de Film Argentique 35mm */}
      <div
        className="absolute inset-0 z-40 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '140px 140px',
        }}
      />

      {/* Header Sombre */}
      <div className="relative z-50">
        <Header theme="dark" />
      </div>

      {/* Background 4K Video avec Plongée Cinématographique Directe */}
      <motion.div
        animate={
          isDiving
            ? {
                scale: 3.8,
                filter: 'blur(30px) brightness(1.9)',
                opacity: 0
              }
            : {
                scale: 1,
                filter: 'blur(0px) brightness(1)',
                opacity: 1
              }
        }
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none transform-gpu"
      >
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </motion.div>

      {/* Typographie Centrale */}
      <motion.div
        animate={
          isDiving
            ? { scale: 2.2, opacity: 0, filter: 'blur(20px)' }
            : { scale: 1, opacity: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex flex-col items-center text-center px-6 max-w-5xl mx-auto my-auto"
      >
        <div className="space-y-6">
          <span className="text-[10px] sm:text-[11px] font-mont uppercase tracking-[0.45em] text-[#C5A044] font-semibold block">
            PORTOLA DRIVE · ROCKFORD HILLS
          </span>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-[0.2em] uppercase text-white font-light leading-[1.05] drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            PERSEUS
          </h1>

          <p className="text-xs sm:text-sm font-light text-white/80 tracking-[0.25em] uppercase max-w-2xl mx-auto leading-relaxed font-mont">
            HAUTE JOAILLERIE, ORFÈVRERIE 24K &amp; PIÈCES D&apos;EXCEPTION FAÇONNÉES À LOS SANTOS.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={startDive}
              disabled={isDiving}
              className="inline-flex items-center gap-3 px-10 py-4.5 bg-transparent border border-white text-white hover:bg-white hover:text-black text-[10px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 backdrop-blur-sm shadow-[0_4px_25px_rgba(0,0,0,0.5)] cursor-pointer active:scale-95"
            >
              <span>{isDiving ? 'Immersion...' : 'Entrer dans la Maison'}</span>
            </button>

            <button
              onClick={onOpenGazette}
              className="inline-flex items-center gap-2 text-white/80 hover:text-[#C5A044] text-[10px] uppercase tracking-[0.3em] font-medium transition-colors border-b border-white/30 hover:border-[#C5A044] pb-1 font-mont cursor-pointer"
            >
              Feuilleter la Gazette Perseus <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Barre Inférieure */}
      <div
        onClick={startDive}
        className="relative z-20 pb-8 px-8 sm:px-14 flex items-center justify-between text-white/40 text-[8px] font-mono tracking-[0.3em] cursor-pointer"
      >
        <div>4K CINEMATIC PROJECTION</div>
        <div className="flex items-center gap-2 text-white/70 hover:text-[#C5A044] transition-colors">
          <span className="uppercase tracking-[0.4em]">Défiler pour plonger</span>
          <ChevronDown className="w-3 h-3 animate-bounce" />
        </div>
        <div>LOS SANTOS · 2026</div>
      </div>

    </div>
  );
}
