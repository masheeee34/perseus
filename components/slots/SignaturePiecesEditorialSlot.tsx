'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignaturePiecesEditorialSlot() {
  const curatedPieces = [
    {
      id: "prs_artemis",
      num: "01",
      name: "Solitaire Artémis",
      cat: "Haute Joaillerie · Bagues",
      badge: "Diamant Poire VVS1",
      metal: "Platine 950 & Or 24K",
      priceStr: "48,000",
      image: "/assets/bijoux/trier/artemis.png",
      desc: "Solitaire impérial taillé à la main. Sertissage griffe invisible sublimant une émeraude centrale et un pavage de diamants purs."
    },
    {
      id: "prs_aurelius",
      num: "02",
      name: "Gourmette Aurelius",
      cat: "Orfèvrerie Pure · Or Massif",
      badge: "Poinçon d'Atelier",
      metal: "Or Jaune Massif 24K",
      priceStr: "24,000",
      image: "/assets/bijoux/trier/VSQPsXv.png",
      desc: "Gourmette royale façonnée en or 24 carats poli miroir. Maillons cubains à double articulation et médaillon souverain."
    },
    {
      id: "prs_chronos",
      num: "03",
      name: "Chrono Manufacture",
      cat: "Haute Horlogerie · Squelette",
      badge: "Tourbillon Volant",
      metal: "Titane & Platine Brossé",
      priceStr: "195,000",
      image: "/assets/bijoux/trier/chronos.png",
      desc: "Montre d'exception au mouvement entièrement ajouré. Balancier en or massif et réserve de marche de 72 heures."
    }
  ];

  return (
    <section 
      id="creations" 
      className="w-full bg-[#FAF8F5] text-zinc-950 pt-16 pb-28 px-6 sm:px-12 lg:px-20 border-b border-zinc-200/80 select-none overflow-hidden"
    >
      <div className="max-w-[1450px] mx-auto space-y-16">
        
        {/* En-tête Éditorial Vogue */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#C5A044] font-mont block">
            SÉLECTION PRIVÉE · DIRECTRICE ARTISTIQUE
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl uppercase tracking-[0.12em] text-zinc-950 font-normal leading-tight">
            Pièces Signées <br />
            <span className="font-normal text-zinc-900">Raelyn May</span>
          </h2>

          <p className="font-mont text-xs sm:text-sm text-zinc-600 font-light max-w-xl mx-auto leading-relaxed pt-2">
            Chaque création de cette sélection exclusive incarne la vision intime et le savoir-faire ancestral de nos ateliers de Portola Drive.
          </p>
        </div>

        {/* GRANDE GRILLE ÉDITORIALE (3 PIÉDESTAUX PURS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {curatedPieces.map((piece) => (
            <div
              key={piece.id}
              className="bg-white border border-zinc-200/90 p-8 sm:p-10 flex flex-col justify-between hover:border-[#C5A044] shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_60px_rgba(197,160,68,0.12)] transition-all duration-500 group"
            >
              <div>
                {/* En-tête de carte */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-serif font-bold text-[#C5A044]">{piece.num}</span>
                    <span className="text-zinc-300">·</span>
                    <span className="text-[9px] font-mont font-bold uppercase tracking-[0.25em] text-zinc-600">
                      {piece.cat}
                    </span>
                  </div>
                  <span className="text-[8px] font-mont uppercase tracking-widest text-zinc-500 bg-[#FAF8F5] border border-zinc-200 px-2 py-0.5">
                    {piece.badge}
                  </span>
                </div>

                {/* Piédestal Visuel Blanc Pur */}
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
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-2xl sm:text-3xl text-zinc-950 group-hover:text-[#C5A044] transition-colors font-normal">
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

              {/* Bouton Commander */}
              <div className="pt-6 border-t border-zinc-100 mt-8">
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-3 text-[9px] font-mont uppercase tracking-[0.25em] font-bold text-zinc-950 group-hover:text-[#C5A044] transition-colors"
                >
                  <span>Examiner la pièce</span>
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
