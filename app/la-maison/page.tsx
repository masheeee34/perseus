'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export default function LaMaisonPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 antialiased pt-40 pb-40 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif]">
      
      {/* ─── 1. HERO ÉDITORIAL ÉPURÉ ─── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="space-y-4"
        >
          <div className="w-12 h-12 relative opacity-85 mx-auto mb-3">
            <Image
              src="/assets/logo/perseus_official.png"
              alt="Perseus Joaillerie"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-mont text-[10px] uppercase tracking-[0.4em] text-[#C5A044] font-bold block">
            Maison Fondée à Los Santos · Portola Drive
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light text-zinc-950 uppercase tracking-tight leading-[1.02]">
            La Maison
          </h1>
        </motion.div>

        <p className="max-w-2xl mx-auto font-serif italic text-zinc-600 text-xl sm:text-2xl font-light leading-relaxed">
          « L&apos;élévation par la matière. L&apos;or et les diamants sculptés pour ceux qui forgent leur propre destin. »
        </p>

        <div className="w-16 h-px bg-[#C5A044] mx-auto pt-2" />
      </section>

      {/* ─── 2. GRAND VISUEL ÉDITORIAL + MANIFESTE ─── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 mt-24">
        <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full bg-zinc-900 overflow-hidden rounded-none border border-zinc-200">
          <Image
            src="/assets/menyoo/PERSEUS_PORTOLA_DRIVE_LOS_SANTOS_1.png"
            alt="Atelier Perseus Portola Drive"
            fill
            className="object-cover object-center grayscale-[0.2] hover:grayscale-0 hover:scale-102 transition-all duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white space-y-1">
            <span className="font-mont text-[9px] uppercase tracking-[0.3em] text-[#C5A044] font-bold">
              Atelier Privé
            </span>
            <p className="font-serif text-xl sm:text-2xl uppercase tracking-wider font-light">
              Portola Drive, Rockford Hills
            </p>
          </div>
        </div>
      </section>

      {/* ─── 3. LE RÉCIT EN DEUX CHAPITRES ÉLÉGANTS ─── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 mt-36 space-y-36">
        
        {/* Chapitre I */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="font-serif text-3xl sm:text-4xl text-[#C5A044]/60 font-light block">
              I.
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-zinc-950 uppercase leading-snug">
              L&apos;Inspiration Antique &amp; L&apos;Audace Urbaine
            </h2>
            <div className="w-10 h-px bg-zinc-300" />
            <p className="font-mont text-sm text-zinc-600 leading-loose">
              Perseus tire son nom et sa puissance du héros grec qui terrassa l&apos;impossible. Nous concevons chaque parure non comme un accessoire éphémère, mais comme une armure d&apos;apparat, capable d&apos;imposer une présence sans prononcer un seul mot.
            </p>
            <p className="font-mont text-sm text-zinc-600 leading-loose">
              Dans les rues de Rockford Hills et les salons feutrés de la métropole, nos créations signent l&apos;appartenance à une élite qui exige la perfection absolue.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] bg-[#F3EFEA] border border-zinc-200/80 p-8 flex items-center justify-center">
              <Image
                src="/assets/campaign/perseus_cuban_chain.png"
                alt="Chaîne Cubaine Perseus"
                fill
                className="object-contain p-8"
              />
            </div>
          </div>
        </div>

        {/* Chapitre II */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7 lg:order-1 order-2">
            <div className="relative aspect-[4/3] bg-[#F3EFEA] border border-zinc-200/80 p-8 flex items-center justify-center">
              <Image
                src="/assets/campaign/perseus_diamond_rings.png"
                alt="Solitaires et Bagues Perseus"
                fill
                className="object-contain p-8"
              />
            </div>
          </div>

          <div className="lg:col-span-5 lg:order-2 order-1 space-y-6">
            <span className="font-serif text-3xl sm:text-4xl text-[#C5A044]/60 font-light block">
              II.
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-zinc-950 uppercase leading-snug">
              Le Savoir-Faire d&apos;Atelier
            </h2>
            <div className="w-10 h-px bg-zinc-300" />
            <p className="font-mont text-sm text-zinc-600 leading-loose">
              Chaque pièce est forgée selon des critères intransigeants : or massif 24 karats fondu à haute température, diamants VVS1 taillés avec une précision géométrique et sertissage invisible pour laisser respirer la lumière.
            </p>
            <p className="font-mont text-sm text-zinc-600 leading-loose">
              Nos artisans travaillent sur mesure, transformant vos désirs en créations éternelles prêtes à traverser les générations.
            </p>
          </div>
        </div>

      </section>

      {/* ─── 4. LES ENGAGEMENTS D'EXCELLENCE (Minimalist 3 Columns) ─── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 mt-36 pt-24 border-t border-zinc-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          
          <div className="space-y-4">
            <span className="font-mont text-[10px] uppercase tracking-[0.3em] text-[#C5A044] font-bold">
              01 · Matières Nobles
            </span>
            <h3 className="font-serif text-2xl font-normal uppercase text-zinc-950">
              Or Massif 24K
            </h3>
            <p className="font-mont text-xs text-zinc-600 leading-relaxed">
              Sélection rigoureuse des métaux les plus denses pour une tenue inaltérable et un éclat chaleureux inimitable.
            </p>
          </div>

          <div className="space-y-4">
            <span className="font-mont text-[10px] uppercase tracking-[0.3em] text-[#C5A044] font-bold">
              02 · Clarté Absolue
            </span>
            <h3 className="font-serif text-2xl font-normal uppercase text-zinc-950">
              Diamants VVS1
            </h3>
            <p className="font-mont text-xs text-zinc-600 leading-relaxed">
              Gemmes d&apos;une pureté immaculée, sélectionnées à la loupe et montées pour capturer chaque éclat de lumière.
            </p>
          </div>

          <div className="space-y-4">
            <span className="font-mont text-[10px] uppercase tracking-[0.3em] text-[#C5A044] font-bold">
              03 · Confidentialité
            </span>
            <h3 className="font-serif text-2xl font-normal uppercase text-zinc-950">
              Salon Sur Rendez-Vous
            </h3>
            <p className="font-mont text-xs text-zinc-600 leading-relaxed">
              Un accueil discret et personnalisé sur Portola Drive pour vos projets de créations uniques et sur-mesure.
            </p>
          </div>

        </div>
      </section>

      {/* ─── 5. SIGNATURE & CALL TO ACTION ─── */}
      <section className="max-w-4xl mx-auto px-6 sm:px-12 mt-40 text-center space-y-10">
        <span className="font-mont text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold block">
          Portola Drive · Los Santos
        </span>
        <h2 className="font-serif text-4xl sm:text-6xl font-light text-zinc-950 uppercase tracking-tight">
          Entrez dans l&apos;univers Perseus
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <Link
            href="/boutique"
            className="w-full sm:w-auto px-12 py-5 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont text-xs uppercase tracking-[0.28em] font-bold transition-all duration-300"
          >
            Découvrir les collections
          </Link>
          <Link
            href="/faq"
            className="w-full sm:w-auto px-12 py-5 border border-zinc-300 hover:border-zinc-950 text-zinc-900 font-mont text-xs uppercase tracking-[0.28em] font-bold transition-all duration-300"
          >
            Contacter la conciergerie
          </Link>
        </div>
      </section>

    </div>
  );
}
