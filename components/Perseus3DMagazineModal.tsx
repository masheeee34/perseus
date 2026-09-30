'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, BookOpen, ArrowRight } from 'lucide-react';

interface MagazineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Perseus3DMagazineModal({ isOpen, onClose }: MagazineModalProps) {
  const [currentPage, setCurrentPage] = useState(0); // 0 = Couverture, 1 = Beach Club, 2 = Orfèvrerie 24K, 3 = Fashion Week

  const spreads = [
    {
      title: "PERSEUS BEACH CLUB : LE NOUVEL ÉDEN PRIVÉ",
      subtitle: "Riviera & Art de Vivre · Chroniques d'Été",
      quote: "« Transats d'acajou, brise du large et haute joaillerie balnéaire portée face à l'horizon infini. »",
      leftImg: "/assets/imagerie/perseus_photo_001_rebecca101bis.png",
      leftCaption: "Cliché N° 01 — Suites Privées Rockford & Beach Club",
      text: "Plongez dans l'intimité du tout nouveau sanctuaire balnéaire de la Maison. Quand le sable doré de Vespucci rencontre la pureté chirurgicale des diamants VVS1 et les pièces d'exception façonnées à la main sur Portola Drive. Un art de vivre où chaque rayon de soleil fait scintiller l'or 24 carats.",
      pageNumbers: "02 — 03"
    },
    {
      title: "L'ORFÈVRERIE MYTHOLOGIQUE DE PORTOLA DRIVE",
      subtitle: "Secrets d'Atelier · Maîtrise 24K",
      quote: "« Forgé dans le feu des légendes, scellé par le poinçon de la déesse. »",
      leftImg: "/assets/imagerie/perseus_photo_020_1perseus.png",
      leftCaption: "Cliché N° 02 — L'Aegis Reliquaire & L'Héritage Mythologique",
      text: "Dans le secret le plus absolu des ateliers de Rockford Hills, les artisans orfèvres de Perseus perpétuent des techniques séculaires. Chaque maillon cubain, chaque serti clos et chaque gravure mythologique répondent aux standards les plus intransigeants de la haute joaillerie mondiale.",
      pageNumbers: "04 — 05"
    },
    {
      title: "PARIS FASHION WEEK : L'ALLURE AFFLUENTE",
      subtitle: "Maroquinerie Couture & Joyaux Portés",
      quote: "« L'élégance absolue ne se crie pas, elle s'impose par la pureté de ses lignes. »",
      leftImg: "/assets/imagerie/perseus_photo_022_ashlyn2.png",
      leftCaption: "Cliché N° 03 — Défilé Officiel & Sac Perkin Epsom",
      text: "Présentée en avant-première lors de la semaine de la mode, la collection Maroquinerie & Bagues Signées par Raelyn May a captivé les regards des plus grands collectionneurs internationaux. Une harmonie parfaite entre cuir d'exception et or massif.",
      pageNumbers: "06 — 07"
    }
  ];

  const nextPage = () => {
    if (currentPage < spreads.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/92 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 select-none overflow-hidden"
      >
        
        {/* Barre de contrôle supérieure */}
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between border-b border-white/20 pb-4 text-white z-50">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#C5A044]" />
            <span className="font-serif uppercase tracking-[0.3em] text-sm sm:text-base font-light">
              Gazette Perseus · Édition N° 01
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono tracking-widest text-white/60 hidden sm:inline">
              {currentPage === 0 ? "COUVERTURE OFFICIELLE" : `DOUBLE-PAGE ${spreads[currentPage - 1].pageNumbers}`}
            </span>

            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Cœur du Lecteur 3D */}
        <div className="w-full max-w-5xl mx-auto my-auto flex items-center justify-center relative perspective-[2000px] py-2">
          
          {/* Navigation Flèches */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`absolute left-0 sm:-left-8 z-40 p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-black transition-all cursor-pointer ${currentPage === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === spreads.length}
            className={`absolute right-0 sm:-right-8 z-40 p-3 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-black transition-all cursor-pointer ${currentPage === spreads.length ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110'}`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* ════ 1. COUVERTURE DU MAGAZINE (PAGE 0) ════ */}
          {currentPage === 0 && (
            <motion.div
              key="cover"
              initial={{ rotateY: -20, scale: 0.9, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ rotateY: -80, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={nextPage}
              className="w-full max-w-[440px] sm:max-w-[480px] bg-[#FAF8F5] p-6 sm:p-8 border border-[#C5A044]/50 shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative group cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Reflet papier glacé */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />

              {/* Header Couverture */}
              <div className="text-center space-y-2 relative z-10 border-b border-zinc-900/40 pb-3">
                <div className="flex items-center justify-between text-[8px] font-mont uppercase tracking-[0.25em] text-zinc-600 font-bold">
                  <span>REVUE DE LUXE</span>
                  <span>LOS SANTOS</span>
                  <span>ÉTÉ 2026</span>
                </div>
                <h1 className="font-serif text-4xl sm:text-6xl uppercase tracking-[0.2em] text-zinc-950 font-light">
                  PERSEUS
                </h1>
                <span className="text-[8px] sm:text-[9px] font-mont uppercase tracking-[0.35em] text-[#C5A044] font-bold block">
                  HAUTE JOAILLERIE &amp; ART DE VIVRE
                </span>
              </div>

              {/* Photo Centrale Couverture */}
              <div className="relative aspect-[3/4] w-full my-4 overflow-hidden border border-zinc-300 bg-zinc-950 shadow-inner">
                <Image
                  src="/assets/imagerie/perseus_photo_025_rebecca82.png"
                  alt="Couverture Perseus Gazette"
                  fill
                  unoptimized
                  className="object-cover object-top group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-3 border border-zinc-200 text-left">
                  <span className="text-[7px] font-mont uppercase tracking-widest text-[#C5A044] font-bold block">
                    DOSSIER EXCLUSIF
                  </span>
                  <p className="font-serif text-xs sm:text-sm text-zinc-950 uppercase font-light leading-tight">
                    L&apos;Héritage Portola Drive &amp; Le Beach Club
                  </p>
                </div>
              </div>

              {/* Footer Couverture */}
              <div className="pt-3 border-t border-zinc-900/40 flex items-center justify-between text-zinc-800 relative z-10">
                <span className="text-[8px] font-mont uppercase tracking-[0.25em] font-semibold">
                  N° 01 · ÉDITION LIMITÉE
                </span>
                <div className="inline-flex items-center gap-2 text-[9px] font-mont uppercase tracking-[0.25em] font-bold text-zinc-950 group-hover:text-[#C5A044] transition-colors">
                  <span>Cliquer pour ouvrir</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#C5A044]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ 2. DOUBLE-PAGE ÉDITORIALE DU JOURNAL (PAGES 1, 2, 3) ════ */}
          {currentPage > 0 && (
            <motion.div
              key={`spread-${currentPage}`}
              initial={{ rotateY: 25, opacity: 0, scale: 0.95 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: -25, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-[#FAF8F5] border border-zinc-300 shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative p-6 sm:p-10 lg:p-12 overflow-hidden"
            >
              {/* Reliure centrale du journal */}
              <div className="hidden lg:block absolute inset-y-0 left-1/2 w-[2px] bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-300 pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.1)]" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Page Gauche (Photo d'Atelier / Reportage) */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] w-full bg-zinc-900 overflow-hidden shadow-md border border-zinc-200">
                    <Image
                      src={spreads[currentPage - 1].leftImg}
                      alt={spreads[currentPage - 1].title}
                      fill
                      unoptimized
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-mont uppercase tracking-widest text-zinc-500 border-t border-zinc-200 pt-2">
                    <span>{spreads[currentPage - 1].leftCaption}</span>
                    <span className="font-mono">{spreads[currentPage - 1].pageNumbers.split('—')[0]}</span>
                  </div>
                </div>

                {/* Page Droite (Article & Typographie Didot) */}
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="space-y-1.5 border-b border-zinc-200 pb-3">
                    <span className="text-[8px] font-mont uppercase tracking-[0.35em] text-[#C5A044] font-bold block">
                      {spreads[currentPage - 1].subtitle}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-zinc-950 uppercase font-light leading-tight">
                      {spreads[currentPage - 1].title}
                    </h2>
                  </div>

                  <p className="font-serif italic text-zinc-800 text-base sm:text-lg font-light leading-relaxed border-l-2 border-[#C5A044] pl-4 py-1">
                    {spreads[currentPage - 1].quote}
                  </p>

                  <p className="font-mont text-xs sm:text-sm text-zinc-600 font-light leading-relaxed">
                    {spreads[currentPage - 1].text}
                  </p>

                  <div className="pt-3 flex items-center justify-between border-t border-zinc-200">
                    <div className="flex items-center gap-4">
                      {currentPage < spreads.length ? (
                        <button
                          onClick={nextPage}
                          className="inline-flex items-center gap-2 text-[9px] font-mont uppercase tracking-[0.25em] font-bold text-zinc-950 hover:text-[#C5A044] transition-colors cursor-pointer"
                        >
                          <span>Page Suivante</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#C5A044]" />
                        </button>
                      ) : (
                        <Link
                          href="/boutique"
                          onClick={onClose}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-950 hover:bg-[#C5A044] text-white text-[9px] font-mont uppercase tracking-[0.25em] font-bold transition-all"
                        >
                          <span>Accéder au Catalogue</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                    <span className="font-mono text-[9px] text-zinc-400">
                      {spreads[currentPage - 1].pageNumbers}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </div>

        {/* Indicateurs de pages */}
        <div className="max-w-md mx-auto flex items-center justify-center gap-3 z-50">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${currentPage === idx ? 'w-8 bg-[#C5A044]' : 'w-2 bg-white/30 hover:bg-white/60'}`}
              aria-label={`Page ${idx}`}
            />
          ))}
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
