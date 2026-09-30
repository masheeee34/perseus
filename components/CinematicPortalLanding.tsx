'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CinematicPortalLanding() {
  const router = useRouter();
  const [isEntering, setIsEntering] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  const SLIDES = [
    '/assets/imagerie/perseus_photo_064_1.png',
    '/assets/imagerie/perseus_photo_065_2.png',
    '/assets/imagerie/perseus_photo_027_PERSEUS_PORTOLA_DRIVE_LOS_SANT.png',
    '/assets/imagerie/perseus_photo_063_6.png',
  ];

  // Auto-advance fallback slides if video fails
  useEffect(() => {
    if (!videoFailed) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [videoFailed]);

  // Trigger the immersive dive-in plunge
  const handleEnter = () => {
    if (isEntering) return;
    setIsEntering(true);

    // Audio cue (optional subtle click) or delay for 1.2s smooth plunge into the boutique
    setTimeout(() => {
      router.push('/boutique');
    }, 1100);
  };

  return (
    <main
      onClick={handleEnter}
      className="relative w-screen h-screen overflow-hidden bg-black select-none cursor-pointer flex flex-col justify-between"
    >
      {/* ─── FILM GRAIN OVERLAY ──────────────────────────────────── */}
      <div
        className="absolute inset-0 z-30 pointer-events-none opacity-[0.055] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '140px 140px',
        }}
      />

      {/* ─── CINEMATIC LETTERBOX BARS (2.39:1 ratio) ─────────────── */}
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

      {/* ─── IMMERSIVE ZOOM/PLUNGE CANVAS ───────────────────────── */}
      <motion.div
        animate={
          isEntering
            ? {
                scale: 3.2,
                opacity: 0,
                filter: 'blur(24px) brightness(1.6)',
              }
            : {
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) brightness(1)',
              }
        }
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        {/* Video Canvas */}
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

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/65 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/35 pointer-events-none" />
      </motion.div>

      {/* ─── FLASH OVERLAY ON DIVE-IN ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isEntering ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeInOut' }}
        className="absolute inset-0 z-50 bg-black pointer-events-none"
      />

      {/* ─── FLOATING TOP HEADER (Minimalist Brand Mark) ───────── */}
      <header className="relative z-40 w-full px-8 sm:px-14 py-8 flex items-center justify-between pointer-events-none">
        <div className="text-[10px] font-serif uppercase tracking-[0.4em] text-white/40">
          Maison Fondée à Los Santos
        </div>
        <div className="text-[9px] font-mont uppercase tracking-[0.35em] text-[#C5A044]/80">
          Édition Privée
        </div>
      </header>

      {/* ─── CENTRAL CONTENT & DIVE-IN ANIMATION ────────────────── */}
      <motion.div
        animate={
          isEntering
            ? {
                scale: 2.2,
                opacity: 0,
                filter: 'blur(16px)',
              }
            : {
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
              }
        }
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        className="relative z-40 flex flex-col items-center justify-center text-center px-6 my-auto"
      >
        {/* Micro-label */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-[9px] sm:text-[10px] tracking-[0.55em] uppercase text-white/50 font-light mb-10 block font-mont"
        >
          Portola Drive · Los Santos
        </motion.span>

        {/* Monumental Centered PERSEUS Monogram */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.45em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ delay: 0.5, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[18vw] sm:text-[12vw] md:text-[10vw] uppercase text-white leading-none font-extralight drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
          style={{ letterSpacing: '0.3em' }}
        >
          PERSEUS
        </motion.h1>

        {/* Fine gold line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.2, ease: 'easeOut' }}
          className="w-16 h-[1px] bg-[#C5A044] my-8 origin-center"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-white/60 font-light font-mont max-w-lg leading-relaxed"
        >
          L&apos;or n&apos;est que le début.
        </motion.p>

        {/* Dive-In Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-14"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            disabled={isEntering}
            className="group relative px-12 py-4 border border-white/60 hover:border-[#C5A044] bg-black/30 backdrop-blur-sm text-white hover:text-[#C5A044] text-[9px] sm:text-[10px] tracking-[0.5em] uppercase font-semibold font-mont transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10">
              {isEntering ? 'Immersion en cours...' : 'Entrer dans la Maison'}
            </span>
            <div className="absolute inset-0 bg-[#C5A044]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
        </motion.div>
      </motion.div>

      {/* ─── FOOTER METADATA ────────────────────────────────────── */}
      <footer className="relative z-40 w-full px-8 sm:px-14 py-8 flex items-center justify-between text-white/30 text-[8px] font-mono tracking-[0.3em] pointer-events-none">
        <div>PERSEUS — 4K CINEMATIC IMMERSION</div>
        <div className="hidden sm:block">CLIQUEZ POUR PLONGER DANS L&apos;UNIVERS</div>
        <div>PORTOLA DRIVE, LS</div>
      </footer>
    </main>
  );
}
