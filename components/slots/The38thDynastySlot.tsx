'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function The38thDynastySlot() {
  const capsulePieces = [
    {
      id: "38_sovereign",
      num: "01",
      name: "Maillon 38 Sovereign",
      cat: "Orfèvrerie 24K · Chaîne Massive",
      priceStr: "85,000",
      image: "/assets/bijoux/trier/VSQPsXv.png",
      metal: "Or Jaune Massif 24K (240g)",
      desc: "Maillon cubain lourd forgé à la main, fermoir frappé du sceau royal de la Dynastie 38."
    },
    {
      id: "38_gravedigger",
      num: "02",
      name: "Pendentif Gravedigger",
      cat: "Haute Joaillerie · Pendentif",
      priceStr: "62,000",
      image: "/assets/bijoux/trier/artemis.png",
      metal: "Diamants VVS1 & Platine 950",
      desc: "Sculpture joaillière sertie de 850 diamants taille brillant extra-blancs."
    },
    {
      id: "38_chrono",
      num: "03",
      name: "Chrono 38 Tourbillon",
      cat: "Haute Horlogerie · Squelette",
      priceStr: "195,000",
      image: "/assets/bijoux/trier/chronos.png",
      metal: "Titane DLC Noir & Or 24K",
      desc: "Calibre manufacture ajouré avec tourbillon volant suisse et lunette gravée."
    }
  ];

  return (
    <section 
      id="dynasty" 
      className="w-full bg-white text-zinc-950 py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-b border-zinc-200/80 select-none overflow-hidden"
    >
      <div className="max-w-[1450px] mx-auto space-y-16">
        
        {/* En-tête Capsule */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FAF8F5] border border-[#C5A044]/40 text-[#C5A044] text-[9px] font-mont uppercase tracking-[0.35em] font-bold">
            COLLECTION CAPSULE HOMMAGE · ÉDITION LIMITÉE 1/38
          </div>

          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl uppercase tracking-[0.12em] text-zinc-950 font-normal leading-tight">
            The 38th Dynasty
          </h2>

          <p className="font-mont text-xs sm:text-sm text-zinc-600 font-light max-w-xl mx-auto leading-relaxed">
            Une alliance magistrale entre la Haute Orfèvrerie 24K de Portola Drive et l&apos;opulence brute du Sud américain.
          </p>
        </div>

        {/* Campagne Visuelle Grand Format */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] bg-[#FAF8F5] border border-zinc-200 overflow-hidden group">
          <Image
            src="/assets/imagerie/perseus_photo_005_downbelowbaneer.png"
            alt="The 38th Dynasty Campaign"
            fill
            className="object-cover object-center group-hover:scale-103 transition-transform duration-1000 ease-out"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-8 sm:p-12">
            <div className="text-white space-y-2 max-w-xl">
              <span className="text-[9px] font-mont uppercase tracking-[0.4em] text-[#C5A044] font-bold">
                MANIFESTE D&apos;ATELIER
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl uppercase tracking-[0.08em] font-light">
                L&apos;Or Impérial du 38
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-300 font-light font-mont leading-relaxed">
                Chaque pièce est gravée à la pointe diamantée du poinçon officiel de la dynastie et scellée dans un coffret en chêne noirci.
              </p>
            </div>
          </div>
        </div>

        {/* Triptyque des Pièces de la Capsule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {capsulePieces.map((piece) => (
            <div
              key={piece.id}
              className="bg-[#FAF8F5] border border-zinc-200/90 p-8 sm:p-10 flex flex-col justify-between hover:border-[#C5A044] transition-all duration-500 group shadow-[0_5px_25px_rgba(0,0,0,0.02)]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-zinc-200/60 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-serif font-bold text-[#C5A044]">{piece.num}</span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-[9px] font-mont font-bold uppercase tracking-[0.2em] text-zinc-600">
                      {piece.cat}
                    </span>
                  </div>
                  <span className="text-[8px] font-mont uppercase tracking-widest text-[#C5A044] bg-white border border-[#C5A044]/30 px-2 py-0.5">
                    1/38
                  </span>
                </div>

                <div className="relative aspect-square w-full mb-8 overflow-hidden bg-white p-6 flex items-center justify-center border border-zinc-200/80 group-hover:border-[#C5A044]/40 transition-colors">
                  <Image
                    src={piece.image}
                    alt={piece.name}
                    fill
                    className="object-contain p-4 group-hover:scale-108 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-2xl text-zinc-950 group-hover:text-[#C5A044] transition-colors font-normal">
                      {piece.name}
                    </h3>
                    <p className="font-mont text-xs tracking-[0.2em] text-[#C5A044] font-bold">
                      ${piece.priceStr}
                    </p>
                  </div>

                  <p className="font-mont text-xs text-zinc-600 font-light leading-relaxed">
                    {piece.desc}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-[9px] font-mont text-zinc-500 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A044]" />
                    <span>{piece.metal}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200/60 mt-8">
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-3 text-[9px] font-mont uppercase tracking-[0.25em] font-bold text-zinc-950 group-hover:text-[#C5A044] transition-colors"
                >
                  <span>Commander cette création</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform text-[#C5A044]" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
