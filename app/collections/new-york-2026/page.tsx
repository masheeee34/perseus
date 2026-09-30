'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { PerseusCatalog } from '../../../lib/catalog';

export default function NewYork2026() {
  const collectionProducts = PerseusCatalog.filter(p => p.collection === 'New York 2026');

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      
      {/* ─── BACKGROUND TEXT ─── */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] z-0">
        <h1 className="text-[30vw] font-black tracking-tighter select-none">2026</h1>
      </div>

      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 w-full z-50 p-8 flex justify-between items-center mix-blend-difference">
        <Link href="/boutique" className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-bold opacity-50 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <div className="text-xl font-playfair font-bold tracking-[0.3em] uppercase">Perseus</div>
        <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all">
          <Play className="w-3 h-3 fill-current" />
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <header className="relative h-screen w-full flex flex-col justify-end p-8 md:p-20 z-10">
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           className="max-w-4xl"
        >
          <span className="text-gold text-xs font-bold uppercase tracking-[0.5em] mb-4 block">New York Series</span>
          <h1 className="font-playfair text-[12vw] md:text-[8vw] leading-[0.85] font-black uppercase mb-8">
            The New york <br />
            <span className="text-transparent border-text font-outline">2026</span>
          </h1>
          <p className="text-white/40 max-w-lg text-sm md:text-base font-mont leading-relaxed mb-10 tracking-wide">
            Une fusion entre l'architecture brutale de Manhattan et la délicatesse de l'or pur. 
            Découvrez une collection qui redéfinit le luxe urbain pour la nouvelle ère.
          </p>
        </motion.div>

        {/* Vertical Scroll Indicator */}
        <div className="absolute right-12 bottom-20 flex flex-col items-center gap-4">
          <span className="rotate-90 text-[9px] uppercase tracking-[0.3em] text-white/30 mb-8 font-bold">Scroll Down</span>
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-gold" />
        </div>
      </header>

      {/* ─── GRID COLLECTION ─── */}
      <section className="relative z-10 px-8 md:px-20 py-32 bg-white text-black">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-baseline border-b border-black/10 pb-12">
          <h2 className="font-playfair text-5xl md:text-7xl font-bold uppercase tracking-tight">Le Catalogue</h2>
          <p className="text-black/40 text-xs uppercase tracking-widest font-bold mt-4 md:mt-0">Exclusivement disponible chez Perseus</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-32 gap-x-12">
          {collectionProducts.map((p, i) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`flex flex-col ${i % 2 !== 0 ? 'md:mt-32' : ''}`}
            >
              <div className="relative aspect-[4/5] bg-[#f9f9f9] group overflow-hidden flex items-center justify-center p-12 mb-8">
                <Image 
                   src={`/assets/bijoux/trier/${p.file}`}
                   alt={p.name}
                   fill
                   className="object-contain p-12 transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="badge-gold">NY_2026</span>
                </div>
                <Link 
                  href={`/produit/${p.id}`}
                  className="absolute bottom-10 left-10 right-10 bg-black text-white p-5 text-center text-[10px] uppercase font-bold tracking-widest opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                >
                  Découvrir la pièce
                </Link>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gold">{p.cat}</p>
                <h3 className="font-playfair text-3xl font-bold uppercase">{p.name}</h3>
                <p className="text-black/40 text-sm font-mont mb-4">{p.desc}</p>
                <p className="text-xl font-bold tracking-tighter">${p.priceStr}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA FOOTER ─── */}
      <footer className="relative py-48 px-8 flex flex-col items-center justify-center text-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full translate-y-1/2" />
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="font-playfair text-6xl md:text-9xl font-bold uppercase mb-12 z-10"
        >
          Possédez <br /> L'exception.
        </motion.h2>
        <Link href="/boutique" className="z-10 bg-gold text-black font-bold uppercase tracking-[0.3em] text-xs px-16 py-6 hover:bg-white transition-all shadow-2xl">
            Toute la boutique
        </Link>
      </footer>

      <style jsx global>{`
        .border-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
        }
        .font-outline {
          color: transparent;
        }
        .font-playfair {
           font-family: var(--font-playfair), serif;
        }
        .font-mont {
           font-family: var(--font-mont), sans-serif;
        }
      `}</style>

    </div>
  );
}
