'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { PerseusCatalog } from '../../lib/catalog';

const LOOKBOOK_CHAPTERS = [
  {
    chapter: 'Chapitre I',
    title: 'L\'Or & La Lumière',
    subtitle: 'Campagne Estivale · Portola Drive',
    desc: 'Des pièces sculptées dans l\'or massif 24 karats et serties de diamants VVS. Une célébration de la lumière de Los Santos à travers des géométries pures.',
    image: '/assets/slider/1.jpg.png',
    isPortrait: false,
    products: PerseusCatalog.slice(0, 4),
  },
  {
    chapter: 'Chapitre II',
    title: 'L\'Intimité du Sanctuaire',
    subtitle: 'Préparatifs Privés · Rockford Hills Suites',
    desc: 'Dans le secret des résidences privées, la parure Perseus révèle son éclat le plus intime. Miroirs dorés, orfèvrerie sculptée et élégance sans concession.',
    image: '/assets/menyoo/perseus_lifestyle_mirror.png',
    isPortrait: true,
    products: PerseusCatalog.slice(4, 8),
  },
  {
    chapter: 'Chapitre III',
    title: 'L\'Odyssée Nocturne',
    subtitle: 'Haute Horlogerie & Joyaux d\'Exception',
    desc: 'L\'alliance du platine massif et des pierres de nuit. Des chronographes d\'atelier façonnés sur-mesure pour les collectionneurs les plus exigeants.',
    image: '/assets/menyoo/seri2.png',
    isPortrait: false,
    products: PerseusCatalog.slice(8, 12),
  },
];

export default function LookbookPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 pt-36 pb-36 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-12 lg:px-16 space-y-36">
        
        {/* Editorial Hero */}
        <header className="text-center max-w-4xl mx-auto space-y-6">
          <span className="text-xs font-mont uppercase tracking-[0.4em] text-[#C5A044] font-bold block">
            Éditorial · Lookbook Officiel 2026
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal uppercase tracking-tight text-zinc-950 leading-[1.05]">
            L&apos;Élégance <br />
            <span className="italic font-light text-zinc-600 block mt-2">Souveraine</span>
          </h1>
          <p className="font-serif italic text-zinc-600 text-lg sm:text-2xl font-light leading-relaxed pt-4">
            Parcourez les séries photographiques exclusives capturées dans les salons privés de la Maison Perseus sur Portola Drive.
          </p>
        </header>

        {/* Chapters */}
        {LOOKBOOK_CHAPTERS.map((chap, idx) => {
          if (chap.isPortrait) {
            return (
              <section key={chap.chapter} className="space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                  
                  {/* Portrait Vertical Image Container - Full Body Visible */}
                  <div className={`lg:col-span-5 flex justify-center ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[9/16] w-full max-w-sm sm:max-w-md bg-zinc-950 shadow-2xl overflow-hidden border border-zinc-200">
                      <Image
                        src={chap.image}
                        alt={chap.title}
                        fill
                        className="object-cover object-top hover:scale-102 transition-transform duration-700"
                        priority
                      />
                    </div>
                  </div>

                  {/* Text Beside Portrait */}
                  <div className={`lg:col-span-7 space-y-8 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="space-y-3">
                      <span className="text-[10px] font-mont uppercase tracking-[0.35em] text-[#C5A044] font-bold block">
                        {chap.chapter} · {chap.subtitle}
                      </span>
                      <h2 className="font-serif text-4xl sm:text-6xl font-normal uppercase tracking-tight text-zinc-950 leading-tight">
                        {chap.title}
                      </h2>
                    </div>
                    <div className="w-16 h-px bg-[#C5A044]" />
                    <p className="font-mont text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl">
                      {chap.desc}
                    </p>
                    <div className="pt-4">
                      <Link
                        href="/boutique"
                        className="inline-flex items-center gap-3 text-xs font-mont uppercase tracking-[0.25em] font-bold text-zinc-950 hover:text-[#C5A044] transition-colors border-b border-zinc-950 hover:border-[#C5A044] pb-1.5"
                      >
                        <span>Découvrir cette sélection</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                </div>
              </section>
            );
          }

          return (
            <section key={chap.chapter} className="space-y-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* Horizontal Landscape Image */}
                <div className={`lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden shadow-xl bg-zinc-950 ${
                  idx % 2 === 1 ? 'lg:order-2' : ''
                }`}>
                  <Image
                    src={chap.image}
                    alt={chap.title}
                    fill
                    className="object-cover object-center hover:scale-103 transition-transform duration-700"
                  />
                </div>

                {/* Text Description */}
                <div className={`lg:col-span-5 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mont uppercase tracking-[0.3em] text-[#C5A044] font-bold block">
                      {chap.chapter} · {chap.subtitle}
                    </span>
                    <h2 className="font-serif text-4xl sm:text-5xl font-normal uppercase tracking-tight text-zinc-950">
                      {chap.title}
                    </h2>
                  </div>
                  <p className="font-mont text-sm text-zinc-600 leading-loose">
                    {chap.desc}
                  </p>
                  <div className="pt-4">
                    <Link
                      href="/boutique"
                      className="inline-flex items-center gap-3 text-xs font-mont uppercase tracking-[0.25em] font-bold text-zinc-950 hover:text-[#C5A044] transition-colors border-b border-zinc-950 hover:border-[#C5A044] pb-1.5"
                    >
                      <span>Découvrir cette sélection</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            </section>
          );
        })}

        {/* Call to Action Footer */}
        <section className="text-center pt-20 border-t border-zinc-200/80 max-w-2xl mx-auto space-y-6">
          <span className="text-xs font-mont uppercase tracking-[0.3em] text-[#C5A044] font-bold">
            Haute Joaillerie &amp; Créations Uniques
          </span>
          <h3 className="font-serif text-4xl font-normal uppercase text-zinc-950">
            Une Pièce Vous Inspire ?
          </h3>
          <p className="font-mont text-sm text-zinc-600 leading-relaxed">
            Consultez l&apos;ensemble de notre catalogue ou prenez rendez-vous au salon privé pour une commande sur mesure.
          </p>
          <div className="pt-4 flex items-center justify-center gap-6">
            <Link
              href="/boutique"
              className="px-10 py-4.5 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont text-xs uppercase tracking-[0.25em] font-bold transition-all shadow-lg"
            >
              Accéder à la Boutique
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
