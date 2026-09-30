'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Camera, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const MENYOO_GALLERY = [
  { name: "Aphrodite Collection", file: "1perseus.png", desc: "Campagne de la Saint-Valentin 2024", tag: "CAMPAGNE" },
  { name: "Wedding Season", file: "rebecca79.png", desc: "Une élégance intemporelle pour le plus beau jour de votre vie.", tag: "LOOKBOOK" },
  { name: "Portola Drive", file: "PERSEUS_PORTOLA_DRIVE_LOS_SANTOS_1.png", desc: "Le cœur de notre Maison à Los Santos.", tag: "BOUTIQUE" },
  { name: "Black & Red Series", file: "1e.png", desc: "L'audace du contraste.", tag: "EDITORIAL" },
  { name: "Aliaa Portrait", file: "aliaa2.png", desc: "La grâce sous les projecteurs.", tag: "MANNEQUIN" },
  { name: "Ashlyn Noir", file: "ashlyn2.png", desc: "La définition de la sophistication.", tag: "EDITORIAL" },
  { name: "Seri Bloom", file: "seri2.png", desc: "La délicatesse fleurie.", tag: "LOOKBOOK" },
  { name: "Rebecca Series", file: "rebecca78bis.png", desc: "L'icône Perseus.", tag: "COUTURE" },
];

export default function LosSantosPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-gold selection:text-black">
      
      {/* ─── HERO HERO HERO ─── */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        {/* Background Image Parallax */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/menyoo/PERSEUS_PORTOLA_DRIVE_LOS_SANTOS_1.png" 
            alt="Perseus LS" 
            fill 
            className="object-cover opacity-40 scale-110 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-12 h-px bg-gold/50" />
            <span className="text-gold text-[10px] font-black uppercase tracking-[0.6em]">LOS SANTOS ACADEMY</span>
            <span className="w-12 h-px bg-gold/50" />
          </div>
          <h1 className="font-playfair text-[10vw] md:text-[7vw] font-black uppercase leading-none tracking-tighter mb-8">
            PORTOLA <br /> 
            <span className="text-gold italic font-playfair font-medium lowercase">Drive</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto font-mont text-xs md:text-sm uppercase tracking-[0.3em] leading-relaxed">
            L'excellence Perseus s'étend au-delà des frontières. <br />
            Revivez nos campagnes les plus iconiques du cœur de San Andreas.
          </p>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-30">
           <MapPin className="w-5 h-5 text-gold" />
           <span className="text-[8px] uppercase tracking-widest font-bold">Rockford Hills</span>
        </div>
      </section>

      {/* ─── EDITORIAL GALLERY ─── */}
      <section className="py-48 px-6 lg:px-20 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Item 1: Wide - Big Splash */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden bg-dark-100 border border-white/5"
          >
            <Image 
              src="/assets/menyoo/1perseus.png" 
              alt="Valentine Gallery" 
              width={1000} 
              height={1400} 
              className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-12">
               <span className="text-gold text-[10px] font-black uppercase tracking-widest mb-4">CAMPAGNE OFFICIELLE</span>
               <h2 className="font-playfair text-5xl font-bold uppercase mb-4 tracking-tighter">APHRODITE</h2>
               <p className="text-white/50 text-sm max-w-md font-mont tracking-wide leading-relaxed">
                 La collection capsule qui a marqué l'histoire de Portola Drive en 2024. Une ode à la passion.
               </p>
            </div>
          </motion.div>

          {/* Grid of smaller items */}
          {MENYOO_GALLERY.filter((_, i) => i !== 0).map((item, idx) => (
            <motion.div
              key={item.file}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative aspect-[3/4] overflow-hidden bg-dark-100 border border-white/5"
            >
              <Image 
                src={`/assets/menyoo/${item.file}`} 
                alt={item.name} 
                fill 
                className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center text-center p-6">
                 <Camera className="w-10 h-10 text-gold/30 mb-6" />
                 <span className="text-gold text-[8px] font-black uppercase tracking-[0.4em] mb-4">{item.tag}</span>
                 <h3 className="font-playfair text-2xl font-bold uppercase mb-2 tracking-widest">{item.name}</h3>
                 <p className="text-white/40 text-[9px] uppercase tracking-widest leading-loose">{item.desc}</p>
              </div>
            </motion.div>
          ))}

        </div>
      </section>

      {/* ─── FULL WIDTH BREAK ─── */}
      <section className="relative h-[80vh] w-full flex items-center justify-center p-8 overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-20">
           <Image src="/assets/menyoo/Sidebaneer.png" alt="Banner" fill className="object-cover grayscale" />
        </div>
        <div className="relative z-10 text-center max-w-4xl">
           <QuoteIcon className="w-16 h-16 mx-auto mb-12 opacity-10 text-gold" />
           <h2 className="font-playfair text-4xl md:text-7xl font-black uppercase leading-tight tracking-tighter mb-16">
              "Le style est une armure pour survivre à la réalité du quotidien."
           </h2>
           <div className="flex items-center justify-center gap-10">
              <span className="w-12 h-px bg-white/10" />
              <p className="font-script text-4xl -rotate-2 text-gold">Direction de la Maison</p>
              <span className="w-12 h-px bg-white/10" />
           </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <footer className="py-48 px-6 text-center">
         <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           className="space-y-12"
         >
           <h2 className="font-playfair text-5xl md:text-8xl font-black uppercase tracking-tighter">REJOINDRE <br /> L'ÉLITE</h2>
           <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href="/boutique" className="bg-white text-black font-black uppercase text-[10px] tracking-[0.5em] px-16 py-6 hover:bg-gold hover:text-white transition-all shadow-2xl">
                 Boutique en ligne
              </Link>
              <Link href="/faq" className="border border-white/20 text-white font-black uppercase text-[10px] tracking-[0.5em] px-16 py-6 hover:border-gold hover:text-gold transition-all">
                 Conciergerie 24/7
              </Link>
           </div>
         </motion.div>
      </footer>

    </div>
  );
}

function QuoteIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H13.017C12.4647 13 12.017 12.5523 12.017 12V9C12.017 6.79086 13.8079 5 16.017 5H19.017C21.2261 5 23.017 6.79086 23.017 9V15C23.017 17.2091 21.2261 19 19.017 19H16.017C15.4647 19 14.917 19.4477 14.917 20V21H14.017ZM2.01693 21L2.01693 18C2.01693 16.8954 2.91236 16 4.01693 16H7.01693C7.56921 16 8.01693 15.5523 8.01693 15V9C8.01693 8.44772 7.56921 8 7.01693 8H4.01693C3.46465 8 3.01693 8.44772 3.01693 9V12C3.01693 12.5523 2.56921 13 2.01693 13H1.01693C0.46465 13 0.0169325 12.5523 0.0169325 12V9C0.0169325 6.79086 1.80779 5 4.01693 5H7.01693C9.22607 5 11.0169 6.79086 11.0169 9V15C11.0169 17.2091 9.22607 19 7.01693 19H4.01693C3.46465 19 3.01693 19.4477 3.01693 20V21H2.01693Z" />
    </svg>
  );
}
