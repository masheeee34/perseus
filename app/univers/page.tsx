'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Gem, Clock, ShieldCheck } from 'lucide-react';

const UNIVERS_SECTIONS = [
  {
    title: 'Haute Joaillerie',
    subtitle: 'L\'Art du Sertissage & Pierres Rares',
    desc: 'Chaque bague, collier et bracelet est façonné à la main par nos maîtres joailliers sur Portola Drive avec des métaux nobles et des gemmes d\'une pureté absolue.',
    image: '/assets/menyoo/PERSEUS_PORTOLA_DRIVE_LOS_SANTOS_1.png',
    link: '/boutique?category=cat-bagues',
    icon: Gem,
  },
  {
    title: 'Haute Horlogerie',
    subtitle: 'Mécaniques & Garde-Temps de Prestige',
    desc: 'L\'alliance des mouvements de haute précision et de l\'orfèvrerie d\'exception. Des pièces numérotées conçues pour traverser les époques.',
    image: '/assets/menyoo/1perseus.png',
    link: '/boutique?category=cat-montres',
    icon: Clock,
  },
];

export default function UniversPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 pt-36 pb-36 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif]">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 space-y-24">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="font-mont text-xs uppercase tracking-[0.35em] text-[#C5A044] font-bold">
            Maison Perseus · Portola Drive
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl uppercase text-zinc-950">
            Nos Univers
          </h1>
          <p className="font-serif italic text-zinc-600 text-lg sm:text-xl leading-relaxed">
            Découvrez l&apos;étendue du savoir-faire d&apos;exception de nos ateliers de Los Santos.
          </p>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {UNIVERS_SECTIONS.map((uni) => {
            const Icon = uni.icon;
            return (
              <div
                key={uni.title}
                className="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                  <Image
                    src={uni.image}
                    alt={uni.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4 p-2.5 bg-white/90 backdrop-blur-md rounded-xl text-[#C5A044] shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="font-mont text-xs uppercase tracking-widest text-[#C5A044] font-semibold">
                      {uni.subtitle}
                    </span>
                    <h2 className="font-serif text-3xl uppercase text-zinc-950">
                      {uni.title}
                    </h2>
                    <p className="font-mont text-xs text-zinc-600 leading-relaxed">
                      {uni.desc}
                    </p>
                  </div>

                  <Link
                    href={uni.link}
                    className="inline-flex items-center gap-2 font-mont text-xs uppercase tracking-[0.2em] font-bold text-zinc-950 group-hover:text-[#C5A044] transition-colors"
                  >
                    <span>Explorer l&apos;atelier</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
