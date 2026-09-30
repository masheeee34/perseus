'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import CinemaPortalTunnelDive from './CinemaPortalTunnelDive';
import FallCollectionUpcomingSlot from './slots/FallCollectionUpcomingSlot';
import SignaturePiecesEditorialSlot from './slots/SignaturePiecesEditorialSlot';
import The38thDynastySlot from './slots/The38thDynastySlot';
import VogueEditorialDiptychSlot from './slots/VogueEditorialDiptychSlot';
import AegisReliquaryCollectionPhotoSlot from './slots/AegisReliquaryCollectionPhotoSlot';
import MagazineDoublePageEditorialSlot from './slots/MagazineDoublePageEditorialSlot';
import VipCircleInvitationFormSlot from './slots/VipCircleInvitationFormSlot';
import Perseus3DMagazineModal from './Perseus3DMagazineModal';
import LenisLuxurySmoothScroll from './LenisLuxurySmoothScroll';

export default function CartierMaisonExperience() {
  const [isEntered, setIsEntered] = useState(false);
  const [isMagazineModalOpen, setIsMagazineModalOpen] = useState(false);

  const handleDiveComplete = () => {
    setIsEntered(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const returnToGate = () => {
    setIsEntered(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FAF8F5] text-zinc-950 overflow-x-hidden select-none">
      
      {/* 3D Journal / Magazine Interactive Reader */}
      <Perseus3DMagazineModal
        isOpen={isMagazineModalOpen}
        onClose={() => setIsMagazineModalOpen(false)}
      />

      {/* ─── 1. LE PORTAIL DE DÉPART (CINÉMA 4K) ─────────────────── */}
      <AnimatePresence mode="wait">
        {!isEntered && (
          <CinemaPortalTunnelDive
            onDiveComplete={handleDiveComplete}
            onOpenGazette={() => setIsMagazineModalOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* ─── 2. LE SALON RÉVÉLÉ (100% VOGUE BLANCHE & SCROLL FLUIDE) ─ */}
      {isEntered && (
        <LenisLuxurySmoothScroll>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col bg-[#FAF8F5]"
          >
            {/* Header avec retour au portail */}
            <Header theme="light" onLogoClick={returnToGate} />

            <main className="w-full flex flex-col pt-20">
              
              {/* 0. NOUVELLE COLLECTION : FALL COLLECTION PORTOLA DRIVE */}
              <FallCollectionUpcomingSlot />

              {/* 1. Les Pièces Signées par Raelyn May (Grille Pleine Page) */}
              <SignaturePiecesEditorialSlot />

              {/* 2. NOUVELLE CAPSULE EXCLUSIVE : THE 38TH DYNASTY */}
              <The38thDynastySlot />

              {/* 3. Le Lookbook Diptyque Vogue (Paris Fashion Week & Riviera) */}
              <VogueEditorialDiptychSlot />

              {/* 4. L'Héritage Mythologique (Campagne Portola Drive) */}
              <AegisReliquaryCollectionPhotoSlot />

              {/* 5. La Gazette Perseus Magazine N° 01 (Double-page papier) */}
              <MagazineDoublePageEditorialSlot />

              {/* 6. Le Grand Catalogue Écrin (435 Pièces) */}
              <section className="w-full bg-white text-zinc-950 py-28 px-6 sm:px-12 text-center border-b border-zinc-200/80">
                <div className="max-w-4xl mx-auto space-y-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-[#C5A044] font-mont block">
                    LE GRAND CATALOGUE DE LA MAISON
                  </span>
                  <h3 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.14em] text-zinc-950 font-light">
                    459 Créations d&apos;Exception
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 font-light font-mont max-w-xl mx-auto leading-relaxed">
                    Bagues en or 24K, colliers sertis de diamants VVS1, haute horlogerie suisse, grillz sur-mesure et maroquinerie haute couture.
                  </p>
                  <div className="pt-4 flex justify-center">
                    <Link
                      href="/boutique"
                      className="inline-flex items-center gap-3 px-10 py-4 bg-zinc-950 text-white hover:bg-[#C5A044] text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 font-mont shadow-md"
                    >
                      Explorer Toute la Boutique <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* 7. Le Salon Privé VIP */}
              <VipCircleInvitationFormSlot />
            </main>

            <Footer />
          </motion.div>
        </LenisLuxurySmoothScroll>
      )}

    </div>
  );
}
