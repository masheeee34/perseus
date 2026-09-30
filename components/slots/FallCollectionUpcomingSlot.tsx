'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function FallCollectionUpcomingSlot() {
  const router = useRouter();
  const [isDiving, setIsDiving] = useState(false);

  const handleSmoothDive = () => {
    setIsDiving(true);
    setTimeout(() => {
      router.push('/collections/fall-2026');
    }, 550);
  };

  return (
    <>
      {/* ─── 1. PLONGEON SMOOTH : ZOOM FLUIDE DANS L'IMAGE SANS ARTIFICE ─── */}
      <AnimatePresence>
        {isDiving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF8F5]/95 backdrop-blur-md select-none cursor-wait pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.16 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[560px] aspect-[1152/2048] max-h-[90vh]"
            >
              <Image
                src="/assets/campaign/perseus_fall_2026_duo.png"
                alt="Perseus Fall Collection 2026"
                fill
                priority
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 2. SECTION SUR LA PAGE PRINCIPALE : L'IMAGE MAJESTUEUSE DU DUO EN ENTIER ─── */}
      <section 
        id="fall-collection"
        className="w-full bg-[#FAF8F5] text-zinc-950 pt-20 pb-24 px-6 sm:px-12 flex flex-col items-center border-b border-zinc-200/80 select-none overflow-hidden"
      >
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#C5A044] font-mont block">
            COMING SOON · AUTOMNE 2026
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl uppercase tracking-[0.12em] text-zinc-950 font-normal leading-tight">
            Fall Collection
          </h2>

          <p className="font-mont text-xs text-zinc-500 uppercase tracking-[0.25em] font-light">
            Portola Drive · Rockford Hills
          </p>
        </div>

        {/* L'IMAGE SEULE DES DEUX PERSONNAGES EN ENTIER (SANS AUCUN CADRE BOÎTE) */}
        <div 
          onClick={handleSmoothDive}
          className="relative w-full max-w-[560px] aspect-[1152/2048] cursor-pointer overflow-hidden group shadow-[0_15px_45px_rgba(0,0,0,0.06)] hover:shadow-[0_25px_65px_rgba(197,160,68,0.22)] transition-all duration-700"
        >
          <Image
            src="/assets/campaign/perseus_fall_2026_duo.png"
            alt="Perseus Fall Collection 2026 · Portola Drive"
            fill
            sizes="(max-width: 768px) 95vw, 560px"
            priority
            className="object-contain group-hover:scale-103 transition-transform duration-700 ease-out"
          />
        </div>

        {/* LIEN MINIMAL EN DESSOUS */}
        <div 
          onClick={handleSmoothDive}
          className="mt-8 inline-flex items-center gap-2 text-[10px] font-mont uppercase tracking-[0.3em] font-bold text-zinc-900 hover:text-[#C5A044] transition-colors cursor-pointer border-b border-zinc-900 hover:border-[#C5A044] pb-1 group"
        >
          <span>Dévoilement prochainement · Coming Soon</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C5A044]" />
        </div>
      </section>
    </>
  );
}
