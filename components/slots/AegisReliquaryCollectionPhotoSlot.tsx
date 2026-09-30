'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AegisReliquaryCollectionPhotoSlot() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section 
      ref={containerRef}
      className="w-full bg-[#FAF8F5] text-zinc-950 py-28 sm:py-36 px-6 sm:px-12 lg:px-20 border-b border-zinc-200/80 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Campaign Visual with Parallax */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative group overflow-hidden bg-white border border-zinc-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.03)] p-3"
          >
            <div className="relative aspect-[4/5] sm:aspect-[16/11] w-full overflow-hidden">
              <motion.div style={{ y: imgY }} className="absolute -inset-y-10 inset-x-0 w-full h-[120%]">
                <Image
                  src="/assets/imagerie/perseus_photo_020_1perseus.png"
                  alt="Campagne Officielle Perseus Portola Drive"
                  fill
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </motion.div>
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[9px] uppercase tracking-[0.35em] text-white font-mont font-medium drop-shadow-md z-10">
              <span>CAMPAGNE OFFICIELLE</span>
              <span>PORTOLA DRIVE · ROCKFORD HILLS</span>
            </div>
          </motion.div>

          {/* Right: Editorial Storytelling */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center text-left space-y-6"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C5A044] font-mont block">
                HAUTE CRÉATION &amp; ORFÈVRERIE
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.14em] text-zinc-950 font-light leading-tight">
                L&apos;Héritage Mythologique
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 font-light font-mont leading-relaxed">
              Inspirée des trésors antiques et façonnée selon les techniques les plus exigeantes de la haute joaillerie contemporaine. Chaque pièce en or massif 24K et diamants VVS1 est numérotée et scellée dans nos ateliers confidentiels de Portola Drive.
            </p>

            <div className="pt-4">
              <Link
                href="/boutique"
                className="inline-flex items-center gap-3 px-8 py-3.5 border-2 border-zinc-950 text-zinc-950 hover:bg-zinc-950 hover:text-white text-[9px] uppercase tracking-[0.35em] font-bold transition-all duration-300 font-mont"
              >
                Explorer la Collection <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
