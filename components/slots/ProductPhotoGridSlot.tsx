'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductPhotoGridSlot() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const curatedPieces = [
    {
      id: "prs_artemis_solitaire",
      name: "Solitaire Artémis",
      cat: "Haute Joaillerie · Bagues",
      badge: "Diamant VVS1",
      priceStr: "48,000",
      image: "/assets/bijoux/trier/artemis.png",
      desc: "Solitaire impérial en platine et diamant poire 5 carats."
    },
    {
      id: "prs_aurelius_24k",
      name: "Gourmette Aurelius 24K",
      cat: "Orfèvrerie · Or Massif",
      badge: "Poinçon d'Atelier",
      priceStr: "24,000",
      image: "/assets/bijoux/trier/VSQPsXv.png",
      desc: "Gourmette royale en or massif 24K poli miroir et guilloché."
    },
    {
      id: "prs_chronos_tourbillon",
      name: "Chrono Manufacture",
      cat: "Haute Horlogerie",
      badge: "Mouvement Squelette",
      priceStr: "195,000",
      image: "/assets/bijoux/trier/chronos.png",
      desc: "Boîtier platine ajouré révélant un tourbillon volant suisse."
    }
  ];

  const getCardTransform = (idx: number) => {
    if (hoveredIdx === idx) {
      return {
        rotateY: 0,
        z: 70,
        scale: 1.04,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      };
    }
    if (hoveredIdx !== null) {
      return {
        rotateY: idx === 0 ? 14 : idx === 2 ? -14 : 0,
        z: -25,
        scale: 0.97,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      };
    }
    // Default 3D Arcade Curve
    if (idx === 0) return { rotateY: 10, z: -10, scale: 1 };
    if (idx === 1) return { rotateY: 0, z: 30, scale: 1.02 };
    if (idx === 2) return { rotateY: -10, z: -10, scale: 1 };
    return { rotateY: 0, z: 0, scale: 1 };
  };

  return (
    <section 
      id="creations" 
      className="w-full bg-[#FAF8F5] text-zinc-950 py-24 sm:py-32 px-6 sm:px-12 lg:px-16 border-b border-zinc-200/80 select-none overflow-hidden [perspective:1800px]"
    >
      <div className="max-w-[1450px] mx-auto space-y-16">
        
        {/* En-tête Éditorial Vogue */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#C5A044] font-mont block">
            SÉLECTION PRIVÉE · DIRECTRICE ARTISTIQUE
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl uppercase tracking-[0.14em] text-zinc-950 font-normal leading-tight">
            Pièces Signées <br />
            <span className="font-normal">Raelyn May</span>
          </h2>

          <p className="font-mont text-xs sm:text-sm text-zinc-600 font-light max-w-xl mx-auto leading-relaxed pt-2">
            Chaque création de cette sélection exclusive incarne la vision intime et le savoir-faire de nos ateliers de Portola Drive.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* LA GALERIE EN ROTONDE / ARCADE 3D (3 PIÉDESTAUX INCURVÉS)   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 [transform-style:preserve-3d] pt-4">
          {curatedPieces.map((piece, idx) => (
            <motion.div
              key={piece.id}
              animate={getCardTransform(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="bg-white border border-zinc-200/90 p-8 sm:p-10 flex flex-col justify-between hover:border-[#C5A044] shadow-[0_10px_35px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(197,160,68,0.14)] transition-shadow duration-500 transform-gpu cursor-pointer group"
            >
              <div>
                {/* En-tête de carte */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
                  <span className="text-[9px] font-mont font-bold uppercase tracking-[0.25em] text-[#C5A044]">
                    {piece.cat}
                  </span>
                  <span className="text-[8px] font-mont uppercase tracking-widest text-zinc-500 bg-[#FAF8F5] border border-zinc-200 px-2 py-0.5">
                    {piece.badge}
                  </span>
                </div>

                {/* Piédestal Visuel Blanc */}
                <div className="relative aspect-square w-full mb-8 overflow-hidden bg-[#FAF8F5] p-6 flex items-center justify-center border border-zinc-100 group-hover:border-zinc-200 transition-colors">
                  <Image
                    src={piece.image}
                    alt={piece.name}
                    fill
                    className="object-contain p-4 group-hover:scale-108 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                </div>

                {/* Détails du Bijou */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mont uppercase tracking-widest text-zinc-400 block">
                    {piece.desc}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-zinc-950 group-hover:text-[#C5A044] transition-colors font-light">
                    {piece.name}
                  </h3>
                  <p className="font-mont text-xs tracking-[0.25em] text-[#C5A044] font-bold pt-1">
                    ${piece.priceStr}
                  </p>
                </div>
              </div>

              {/* Bouton Examiner */}
              <div className="pt-6 border-t border-zinc-100 mt-8">
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-3 text-[9px] font-mont uppercase tracking-[0.25em] font-bold text-zinc-950 group-hover:text-[#C5A044] transition-colors"
                >
                  <span>Examiner la pièce</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#C5A044]" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
