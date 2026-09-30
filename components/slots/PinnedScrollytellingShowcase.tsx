'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PinnedScrollytellingShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Track translates from 0% to -66.666% across scroll
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.666667%']);

  const showcaseItems = [
    {
      num: "01",
      name: "Solitaire Artémis",
      cat: "Haute Joaillerie · Pièce Unique",
      badge: "Diamant Poire VVS1",
      metal: "Platine 950 & Or Solaire 24K",
      priceStr: "48,000",
      image: "/assets/bijoux/trier/artemis.png",
      quote: "« La pureté absolue taillée dans la lumière d'un diamant d'exception. »",
      desc: "Chaque facette est polie à la main par nos maîtres lapidaires. Sertissage griffe invisible sublimant une émeraude et des diamants de pureté chirurgicale."
    },
    {
      num: "02",
      name: "Gourmette Aurelius 24K",
      cat: "Orfèvrerie Pure · Or Massif",
      badge: "Poinçon d'Atelier Portola",
      metal: "Or Jaune Massif 24 Carats (180g)",
      priceStr: "24,000",
      image: "/assets/bijoux/trier/VSQPsXv.png",
      quote: "« La puissance du métal brut forgé selon les codes de l'antique noblesse. »",
      desc: "Maillons cubains à double articulation guillochés à la main. Fermoir sécurisé frappé du médaillon souverain Perseus."
    },
    {
      num: "03",
      name: "Chrono Manufacture",
      cat: "Haute Horlogerie · Squelette",
      badge: "Tourbillon Volant Suisse",
      metal: "Boîtier Titane & Platine Brossé",
      priceStr: "195,000",
      image: "/assets/bijoux/trier/chronos.png",
      quote: "« La haute précision du temps battant au rythme d'un échappement d'art. »",
      desc: "Cadran ajouré révélant les finitions perlées et anglées à la main. Réserve de marche de 72 heures avec balancier en or massif."
    }
  ];

  return (
    <section ref={containerRef} className="relative w-full h-[320vh] bg-[#FAF8F5] select-none">
      
      {/* ÉCRAN FIXE STICKY */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between pt-24 pb-8 px-6 sm:px-12 border-b border-zinc-200">
        
        {/* En-tête Fixe de l'Écrin */}
        <div className="flex items-center justify-between max-w-[1400px] w-full mx-auto border-b border-zinc-200/80 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#C5A044]" />
            <span className="text-[10px] font-mont font-bold uppercase tracking-[0.35em] text-[#C5A044]">
              PRÉSENTATION D&apos;ATELIER · SÉLECTION RAELYN MAY
            </span>
          </div>

          <div className="text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase hidden sm:block">
            FAITES DÉFILER VERS LE BAS POUR DÉCOUVRIR LES PIÈCES (01 — 03)
          </div>
        </div>

        {/* RUNWAY HORIZONTAL GLIDE */}
        <div className="relative w-full flex-1 flex items-center overflow-hidden my-auto">
          <motion.div 
            style={{ x }} 
            className="flex flex-row flex-nowrap h-full items-center w-[300%]"
          >
            {showcaseItems.map((item) => (
              <div
                key={item.num}
                className="w-full h-full flex-shrink-0 flex items-center justify-center px-4 sm:px-10 lg:px-16"
                style={{ width: '33.333333%' }}
              >
                <div className="max-w-[1250px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-6 sm:p-10 border border-zinc-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
                  
                  {/* Piédestal Visuel Blanc */}
                  <div className="lg:col-span-5 relative aspect-square w-full max-h-[380px] bg-[#FAF8F5] p-6 flex items-center justify-center border border-zinc-100 group overflow-hidden">
                    <div className="absolute top-4 left-4 text-[12px] font-serif font-bold text-[#C5A044]">
                      {item.num} / 03
                    </div>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-4 hover:scale-108 transition-transform duration-700 ease-out"
                      unoptimized
                    />
                    <div className="absolute bottom-4 right-4 text-[8px] font-mont uppercase tracking-widest text-zinc-500 bg-white px-2.5 py-1 border border-zinc-200">
                      {item.badge}
                    </div>
                  </div>

                  {/* Storytelling & Détails */}
                  <div className="lg:col-span-7 space-y-4 text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mont uppercase tracking-[0.35em] text-[#C5A044] font-bold block">
                        {item.cat}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-zinc-950 uppercase tracking-[0.08em] font-normal leading-tight">
                        {item.name}
                      </h3>
                      <p className="font-mont text-sm tracking-[0.25em] text-[#C5A044] font-bold pt-0.5">
                        ${item.priceStr}
                      </p>
                    </div>

                    <p className="font-serif italic text-zinc-700 text-sm sm:text-base font-light leading-relaxed border-l-2 border-[#C5A044] pl-4">
                      {item.quote}
                    </p>

                    <p className="font-mont text-xs text-zinc-600 font-light leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-zinc-100">
                      <div className="flex items-center gap-2 text-[10px] font-mont text-zinc-700 uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-[#C5A044]" />
                        <span>{item.metal}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/boutique"
                        className="inline-flex items-center gap-3 px-8 py-3 bg-zinc-950 text-white hover:bg-[#C5A044] text-[9px] font-mont uppercase tracking-[0.3em] font-bold transition-all duration-300 shadow-md"
                      >
                        <span>Commander cette pièce</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Barre de Progression au Scroll */}
        <div className="flex items-center justify-between max-w-[1400px] w-full mx-auto border-t border-zinc-200/80 pt-3 text-[9px] font-mont text-zinc-500 uppercase tracking-widest">
          <span>ATELIERS DE PORTOLA DRIVE</span>
          <div className="flex items-center gap-3">
            <span className="text-zinc-950 font-bold">DÉFILER VERS LE BAS</span>
            <div className="w-20 h-[2px] bg-zinc-200 relative overflow-hidden">
              <motion.div 
                style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
                className="absolute inset-0 bg-[#C5A044]"
              />
            </div>
          </div>
          <span>LOS SANTOS · ÉDITION 2026</span>
        </div>

      </div>

    </section>
  );
}
