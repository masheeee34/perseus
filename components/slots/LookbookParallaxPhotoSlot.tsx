'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import EditorialLink from '../ui-luxury/EditorialLink';

interface LookbookParallaxPhotoSlotProps {
  imageSrc?: string;
}

export default function LookbookParallaxPhotoSlot({
  imageSrc = '/assets/menyoo/PERSEUS_PORTOLA_DRIVE_LOS_SANTOS_1.png'
}: LookbookParallaxPhotoSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[88vh] min-h-[650px] overflow-hidden bg-black border-b-[0.5px] border-white/10"
    >
      {/* ─── Image Parallaxe Plein Écran (Zéro Fondu Laiteux) ─── */}
      <motion.div 
        style={{ y, backgroundImage: `url(${imageSrc})` }}
        className="absolute inset-0 w-full h-[130%] bg-cover bg-center -top-[15%] filter brightness-[0.55] contrast-[1.2]"
      />
      
      {/* Ombre Pure Cinéma pour Contraste Chirurgical */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* ─── Citation Sculpturale Vogue ─── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto space-y-10 z-10">
        <h2 className="font-serif text-4xl sm:text-6xl lg:text-8xl uppercase tracking-tight text-white font-normal leading-[1.15] pb-4 overflow-visible drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
          L&apos;ÉLÉGANCE N&apos;EST PAS UN PRIVILÈGE. <br />
          <span className="italic normal-case text-liquid-gold font-normal block mt-2 sm:mt-4 pb-4 overflow-visible leading-normal">
            c&apos;est une décision.
          </span>
        </h2>
        
        <cite className="font-mont uppercase tracking-[0.4em] text-white/70 text-[10px] sm:text-[11px] not-italic font-light block">
          — Maison Perseus • Portola Drive
        </cite>

        <div className="pt-4">
          <EditorialLink href="/lookbook" variant="gold">
            Explorer le Lookbook Éditorial
          </EditorialLink>
        </div>
      </div>
    </section>
  );
}
