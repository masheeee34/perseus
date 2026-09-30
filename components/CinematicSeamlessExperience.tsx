'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BoutiqueContent from './BoutiqueContent';
import Header from './Header';
import Footer from './Footer';

export default function CinematicSeamlessExperience() {
  const [isEntered, setIsEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  const SLIDES = [
    '/assets/imagerie/perseus_photo_064_1.png',
    '/assets/imagerie/perseus_photo_065_2.png',
    '/assets/imagerie/perseus_photo_027_PERSEUS_PORTOLA_DRIVE_LOS_SANT.png',
    '/assets/imagerie/perseus_photo_063_6.png',
  ];

  // Auto-advance fallback slides
  useEffect(() => {
    if (!videoFailed || isEntered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [videoFailed, isEntered]);

  // Seamless In-Place Dive-In Transition
  const triggerPlunge = () => {
    if (isEntering || isEntered) return;
    setIsEntering(true);

    // Smooth GPU animation without ANY page reload or URL jump
    setTimeout(() => {
      setIsEntered(true);
      setIsEntering(false);
    }, 1100);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FAF8F5] overflow-x-hidden select-none">
      
      {/* ─── 1. SEAMLESS IN-PLACE CINEMA PORTAL (OVERLAY) ────────── */}
      <AnimatePresence>
        {!isEntered && (
          <motion.div
            key="cinema-portal"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 2.2,
              filter: 'blur(20px) brightness(1.4)',
              transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] }
            }}
            onClick={triggerPlunge}
            className="fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-black cursor-pointer flex flex-col justify-between"
          >
            {/* Film Grain Overlay */}
            <div
              className="absolute inset-0 z-30 pointer-events-none opacity-[0.055] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '140px 140px',
              }}
            />

            {/* Letterbox Bars */}
            <motion.div
              animate={isEntering ? { y: '-100%' } : { y: '0%' }}
              transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
              className="absolute top-0 left-0 right-0 h-[10vh] bg-black z-20 pointer-events-none"
            />
            <motion.div
              animate={isEntering ? { y: '100%' } : { y: '0%' }}
              transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
              className="absolute bottom-0 left-0 right-0 h-[10vh] bg-black z-20 pointer-events-none"
            />

            {/* Background Video / Fallback Slide */}
            <motion.div
              animate={
                isEntering
                  ? { scale: 2.8, filter: 'blur(20px) brightness(1.5)' }
                  : { scale: 1, filter: 'blur(0px) brightness(1)' }
              }
              transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
              className="absolute inset-0 z-0 overflow-hidden"
            >
              {!videoFailed ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/assets/imagerie/perseus_photo_065_2.png"
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.38]"
                  onError={() => setVideoFailed(true)}
                >
                  <source src="/video/PERSEUS_2.mp4" type="video/mp4" />
                </video>
              ) : (
                <AnimatePresence mode="sync">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, ease: 'easeInOut' }}
                    className="absolute inset-0 z-0"
                  >
                    <img
                      src={SLIDES[currentSlide]}
                      alt=""
                      className="w-full h-full object-cover grayscale brightness-[0.38]"
                    />
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Vignettes */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/65 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35 pointer-events-none" />
            </motion.div>

            {/* Top Brand Header */}
            <header className="relative z-40 w-full px-8 sm:px-14 py-8 flex items-center justify-between pointer-events-none">
              <div className="text-[10px] font-serif uppercase tracking-[0.4em] text-white/40">
                Maison Fondée à Los Santos
              </div>
              <div className="text-[9px] font-mont uppercase tracking-[0.35em] text-[#C5A044]/80">
                Édition Privée
              </div>
            </header>

            {/* Center Content */}
            <motion.div
              animate={
                isEntering
                  ? { scale: 1.8, opacity: 0, filter: 'blur(12px)' }
                  : { scale: 1, opacity: 1, filter: 'blur(0px)' }
              }
              transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
              className="relative z-40 flex flex-col items-center justify-center text-center px-6 my-auto"
            >
              <span className="text-[9px] sm:text-[10px] tracking-[0.55em] uppercase text-white/50 font-light mb-10 block font-mont">
                Portola Drive · Los Santos
              </span>

              <h1
                className="font-serif text-[18vw] sm:text-[12vw] md:text-[10vw] uppercase text-white leading-none font-extralight drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                style={{ letterSpacing: '0.3em' }}
              >
                PERSEUS
              </h1>

              <div className="w-16 h-[1px] bg-[#C5A044] my-8 origin-center" />

              <p className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-white/60 font-light font-mont max-w-lg leading-relaxed">
                L&apos;or n&apos;est que le début.
              </p>

              <div className="mt-14">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerPlunge();
                  }}
                  className="group relative px-12 py-4 border border-white/60 hover:border-[#C5A044] bg-black/30 backdrop-blur-sm text-white hover:text-[#C5A044] text-[9px] sm:text-[10px] tracking-[0.5em] uppercase font-semibold font-mont transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10">
                    {isEntering ? 'Immersion...' : 'Entrer dans la Maison'}
                  </span>
                  <div className="absolute inset-0 bg-[#C5A044]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              </div>
            </motion.div>

            {/* Bottom Metadata */}
            <footer className="relative z-40 w-full px-8 sm:px-14 py-8 flex items-center justify-between text-white/30 text-[8px] font-mono tracking-[0.3em] pointer-events-none">
              <div>PERSEUS — 4K CINEMATIC IMMERSION</div>
              <div className="hidden sm:block">CLIQUEZ POUR ENTRER DIRECTEMENT</div>
              <div>PORTOLA DRIVE, LS</div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 2. LA MAISON & LE CATALOGUE (RÉVÉLÉ INSTANTANÉMENT) ───── */}
      <motion.div
        initial={false}
        animate={isEntered ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 0.98 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full flex flex-col"
      >
        <Header />
        <main className="min-h-screen pt-8">
          <BoutiqueContent />
        </main>
        <Footer />
      </motion.div>

    </div>
  );
}
