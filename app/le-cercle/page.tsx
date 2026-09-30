'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const PARTNERS = [
  {
    num: "01",
    name: "Pharaoh",
    type: "Haute Maroquinerie & Parfums",
    desc: "Alliance prestigieuse alliant l'esthétique royale égyptienne aux finitions de haute facture contemporaine.",
    logo: "/assets/partenaires/PHARAOH-3.png",
    darkLogo: false
  },
  {
    num: "02",
    name: "Bahama Mamas",
    type: "Nightlife & Événements d'Exception",
    desc: "Le sanctuaire des nuits exclusives où la Maison Perseus habille les personnalités les plus en vue de San Andreas.",
    logo: "/assets/partenaires/bahama_loween-blanc.png",
    darkLogo: true
  },
  {
    num: "03",
    name: "Fleeca Private Banking",
    type: "Passerelle Financière In-Game",
    desc: "Partenaire bancaire officiel garantissant la fluidité, la discrétion et la sécurité absolue de chaque transaction.",
    logo: "/assets/logo/perseus_official.png",
    darkLogo: false
  },
  {
    num: "04",
    name: "Val-de-Grâce",
    type: "Édition & Chroniques Lifestyle",
    desc: "Couverture éditoriale d'élite célébrant l'artisanat, la haute joaillerie et la distinction à Los Santos.",
    logo: "/assets/partenaires/PMEGNe1.png",
    darkLogo: false
  }
];

export default function LeCerclePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 antialiased pt-40 pb-40 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif]">
      
      {/* ─── HERO HEADER ─── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-12 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="space-y-3"
        >
          <span className="font-mont text-[10px] uppercase tracking-[0.4em] text-[#C5A044] font-bold block">
            Alliances Stratégiques &amp; Privilèges
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl font-light text-zinc-950 uppercase tracking-tight">
            Le Cercle
          </h1>
        </motion.div>

        <p className="max-w-2xl mx-auto font-serif italic text-zinc-600 text-lg sm:text-xl font-light leading-relaxed">
          « Une réunion de maisons d&apos;excellence, guidées par la même quête d&apos;incomparable. »
        </p>

        <div className="w-16 h-px bg-[#C5A044] mx-auto pt-2" />
      </section>

      {/* ─── LISTE ÉPURÉE DES PARTENAIRES ─── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-12 mt-28 divide-y divide-zinc-200 border-y border-zinc-200">
        {PARTNERS.map((partner) => (
          <div
            key={partner.num}
            className="py-14 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center group transition-colors"
          >
            <div className="md:col-span-2 flex items-center gap-4">
              <span className="font-serif text-2xl text-[#C5A044] font-light">
                {partner.num}
              </span>
              <div className={`w-16 h-16 relative ${partner.darkLogo ? 'bg-zinc-950' : 'bg-white'} border border-zinc-200 p-2 flex items-center justify-center`}>
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>

            <div className="md:col-span-5 space-y-1">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-zinc-950 uppercase group-hover:text-[#C5A044] transition-colors">
                {partner.name}
              </h2>
              <p className="font-mont text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                {partner.type}
              </p>
            </div>

            <div className="md:col-span-5">
              <p className="font-mont text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {partner.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ─── CONTACT PRIVILÈGE ─── */}
      <section className="max-w-3xl mx-auto px-6 sm:px-12 mt-32 text-center space-y-8">
        <h3 className="font-serif text-3xl font-light text-zinc-950 uppercase">
          Rejoindre Le Cercle
        </h3>
        <p className="font-mont text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-xl mx-auto">
          Votre institution souhaite initier une collaboration exclusive ou organiser un événement privé avec la Maison Perseus ?
        </p>
        <div>
          <Link
            href="/faq"
            className="inline-block px-10 py-4.5 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont text-xs uppercase tracking-[0.25em] font-bold transition-all"
          >
            Contacter les relations publiques
          </Link>
        </div>
      </section>

    </div>
  );
}
