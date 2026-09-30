'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MagazineDoublePageEditorialSlot() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section 
      id="gazette-section" 
      className="w-full bg-[#FAF8F5] py-28 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-zinc-200/80 select-none scroll-mt-24"
    >
      <div className="max-w-[1450px] mx-auto space-y-16">
        
        {/* En-tête de Presse Minimaliste */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center space-y-4"
        >
          <div className="flex items-center justify-between border-y border-zinc-900/60 py-2.5 text-[9px] sm:text-[11px] font-mont uppercase tracking-[0.25em] text-zinc-800 font-semibold">
            <span>CHRONIQUES &amp; GAZETTE</span>
            <span className="hidden sm:inline">ÉDITION N° 01 · ÉTÉ 2026</span>
            <span>PORTOLA DRIVE · LOS SANTOS</span>
          </div>

          <div className="pt-4 pb-2">
            <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-zinc-950 uppercase leading-none">
              Perseus Magazine
            </h2>
            <p className="font-mont text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#C5A044] font-bold mt-3">
              Revue Officielle de Haute Joaillerie &amp; Art de Vivre
            </p>
          </div>
        </motion.div>

        {/* Double-Page Éditoriale avec Effet 3D Magazine Flip */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-zinc-200/90 shadow-[0_25px_60px_rgba(0,0,0,0.04)] p-6 sm:p-12 lg:p-16 relative overflow-hidden"
        >
          {/* Reliure centrale de livre / magazine (effet papier glacé) */}
          <div className="hidden lg:block absolute inset-y-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-zinc-300 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Page Gauche : Grande Photographie Éditoriale */}
            <div className="lg:col-span-6 space-y-4">
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] w-full bg-zinc-950 overflow-hidden shadow-md cursor-pointer group border border-zinc-100"
              >
                <Image
                  src={isFlipped ? "/assets/imagerie/perseus_photo_015_PERSEUS_STORY_3.png" : "/assets/menyoo/perseus_lifestyle_mirror.png"}
                  alt="Perseus Magazine Édition N° 01"
                  fill
                  className="object-cover object-top transition-all duration-700 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur-sm text-zinc-950 px-4 py-2 text-[9px] font-mont font-bold uppercase tracking-[0.25em]">
                    Cliquer pour feuilleter
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mont uppercase tracking-widest text-zinc-400 pt-1">
                <span>Shooting Exclusif · Suites Rockford</span>
                <span>{isFlipped ? "Page 03 / 08" : "Page 02 / 08"}</span>
              </div>
            </div>

            {/* Page Droite : Article Éditorial & Appel à la Lecture */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-zinc-950 text-white text-[9px] font-mont font-bold uppercase tracking-widest">
                    À LA UNE
                  </span>
                  <span className="font-mont text-xs uppercase tracking-wider text-[#C5A044] font-bold">
                    Riviera &amp; Art de Vivre
                  </span>
                </div>

                <h3 className="font-serif text-3xl sm:text-5xl font-light text-zinc-950 uppercase leading-[1.1] tracking-tight">
                  Perseus Beach Club : Le Nouvel Éden Privé
                </h3>
              </div>

              <p className="font-serif italic text-zinc-700 text-lg sm:text-xl font-light leading-relaxed border-l-2 border-[#C5A044] pl-5 py-1">
                « Transats d&apos;acajou, brise du large et haute joaillerie balnéaire portée face à l&apos;horizon infini. »
              </p>

              <p className="font-mont text-sm text-zinc-600 leading-relaxed font-light">
                Plongez dans les pages de notre premier numéro officiel. Découvrez les secrets d&apos;atelier de Portola Drive, la pureté chirurgicale des diamants VVS1 et les coulisses des réceptions les plus sélectes de San Andreas.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link
                  href="/magazine"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-zinc-950 hover:bg-[#C5A044] text-white text-[10px] font-mont uppercase tracking-[0.3em] font-bold transition-all duration-300 shadow-md"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Feuilleter le Numéro Complet</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <span className="text-xs font-mont text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 3 Articles · 15 min
                </span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
