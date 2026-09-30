'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function VogueEditorialDiptychSlot() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Subtle luxury parallax offset
  const imgY1 = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const imgY2 = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);

  return (
    <section 
      ref={containerRef}
      className="w-full bg-[#FAF8F5] text-zinc-950 py-28 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-zinc-200/80 select-none overflow-hidden"
    >
      <div className="max-w-[1450px] mx-auto space-y-16">
        
        {/* En-tête Revue de Mode with smooth scroll reveal */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-900/60 pb-6 gap-6"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-mont uppercase tracking-[0.45em] text-[#C5A044] font-bold block">
              LOOKBOOK &amp; ÉGÉRIES · ÉDITION 2026
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.14em] text-zinc-950 font-light">
              L&apos;Allure Portola Drive
            </h2>
          </div>
          <Link
            href="/lookbook"
            className="inline-flex items-center gap-2 text-[10px] font-mont uppercase tracking-[0.3em] font-bold text-zinc-900 hover:text-[#C5A044] transition-colors border-b-2 border-zinc-900 hover:border-[#C5A044] pb-1 font-mont"
          >
            Découvrir le Lookbook Complet <ArrowRight className="w-3.5 h-3.5 text-[#C5A044]" />
          </Link>
        </motion.div>

        {/* Diptyque 2 Cadres Effet Magazine d'Art with Parallax */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Cadre 1: Égérie Riviera (Rebecca 82 - 4K) */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-white p-4 sm:p-6 border border-zinc-200/90 shadow-[0_20px_45px_rgba(0,0,0,0.04)] relative group flex flex-col justify-between"
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/12] lg:aspect-[4/5] w-full overflow-hidden border border-zinc-100 bg-[#FAF8F5]">
              <motion.div style={{ y: imgY1 }} className="absolute -inset-y-8 inset-x-0 w-full h-[115%]">
                <Image
                  src="/assets/imagerie/perseus_photo_025_rebecca82.png"
                  alt="Égérie Perseus Riviera"
                  fill
                  className="object-cover object-top group-hover:scale-103 transition-transform duration-1000"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </motion.div>
            </div>
            
            {/* Légende Magazine */}
            <div className="pt-4 flex items-center justify-between text-[9px] font-mont uppercase tracking-[0.3em] text-zinc-500 border-t border-zinc-100 mt-4 relative z-10 bg-white">
              <span>FIG. 01 — RIVIERA HAUTE JOAILLERIE</span>
              <span>PORTOLA DRIVE · LOS SANTOS</span>
            </div>
          </motion.div>

          {/* Cadre 2: Shooting Paris Fashion Week (Ashlyn 2) */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-white p-4 sm:p-6 border border-zinc-200/90 shadow-[0_20px_45px_rgba(0,0,0,0.04)] relative group flex flex-col justify-between"
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/12] lg:aspect-[4/5] w-full overflow-hidden border border-zinc-100 bg-[#FAF8F5]">
              <motion.div style={{ y: imgY2 }} className="absolute -inset-y-12 inset-x-0 w-full h-[125%]">
                <Image
                  src="/assets/imagerie/perseus_photo_022_ashlyn2.png"
                  alt="Shooting Paris Fashion Week Perseus"
                  fill
                  className="object-cover object-top group-hover:scale-103 transition-transform duration-1000"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </motion.div>
            </div>
            
            {/* Légende Magazine */}
            <div className="pt-4 flex items-center justify-between text-[9px] font-mont uppercase tracking-[0.3em] text-zinc-500 border-t border-zinc-100 mt-4 relative z-10 bg-white">
              <span>FIG. 02 — PARIS FASHION WEEK</span>
              <span>MAROQUINERIE &amp; BAGUES</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
