'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TERRITORIES = [
  {
    name: 'Bagues & Alliances',
    tagline: 'L\'anneau d\'or, promesse d\'éternité',
    img: '/assets/bijoux/trier/DxxSTpC.png',
    href: '/boutique?category=bagues'
  },
  {
    name: 'Colliers & Pendentifs',
    tagline: 'La parure royale qui habille la nuit',
    img: '/assets/bijoux/trier/7Jceye3.png',
    href: '/boutique?category=colliers'
  },
  {
    name: 'Haute Horlogerie',
    tagline: 'Le temps maîtrisé dans l\'or et le saphir',
    img: '/assets/bijoux/trier/1a71fb_b84fc24a5e2f41d9a24aa7d97e20cf3a~mv2.png',
    href: '/boutique?category=montres'
  },
  {
    name: 'Grillz & Parures Buccales',
    tagline: 'L\'éclat au plus près du sourire',
    img: '/assets/bijoux/trier/QeT53ks.png',
    href: '/boutique?category=grillz'
  },
  {
    name: 'Maroquinerie d\'Exception',
    tagline: 'Le cuir noble et ferrures or sur-mesure',
    img: '/assets/bijoux/trier/lq1N6wf.png',
    href: '/boutique?category=sacs'
  },
  {
    name: 'Prêt-à-Porter Haute Couture',
    tagline: 'L\'allure signée des grands soirs',
    img: '/assets/bijoux/trier/gtLa59K.png',
    href: '/boutique'
  }
];

export default function TerritoriesDiscoverySlot() {
  return (
    <section className="w-full bg-[#FAF8F5] py-28 px-6 md:px-16 border-b border-ink/10 select-none">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em] text-[#C5A044] block mb-4">
            LES COLLECTIONS DE LA MAISON
          </span>
          <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-[0.15em] text-[#0A0A0A] font-light leading-tight">
            Six Territoires, Une Même Exigence
          </h2>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TERRITORIES.map((t, idx) => (
            <Link
              key={idx}
              href={t.href}
              className="group bg-white border border-ink/10 p-8 flex flex-col justify-between hover:border-[#C5A044]/60 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(197,160,68,0.1)]"
            >
              <div className="relative aspect-square w-full flex items-center justify-center p-6 mb-6 overflow-hidden bg-[#FAF8F5]/60">
                <Image
                  src={t.img}
                  alt={t.name}
                  width={300}
                  height={300}
                  className="object-contain max-h-full transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-[0_8px_16px_rgba(0,0,0,0.08)]"
                />
              </div>

              <div className="text-left">
                <h3 className="font-serif text-xl uppercase tracking-wider text-[#0A0A0A] group-hover:text-[#C5A044] transition-colors mb-2">
                  {t.name}
                </h3>
                <p className="text-xs text-ink/60 font-light font-mont mb-4">
                  {t.tagline}
                </p>
                <span className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] font-semibold text-[#C5A044] group-hover:translate-x-1 transition-transform">
                  Découvrir <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
