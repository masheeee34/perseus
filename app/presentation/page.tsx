"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const STAGES = {
  INTRO: 0,
  HERO: 1,
  COLLECTION: 2,
  GALLERY: 3,
  OUTRO: 4,
};

export default function PresentationMode() {
  const [stage, setStage] = useState(STAGES.INTRO);

  useEffect(() => {
    // Apple-style automatic sequence timer
    const timeline = [
      { time: 3500, nextState: STAGES.HERO },
      { time: 8000, nextState: STAGES.COLLECTION },
      { time: 13000, nextState: STAGES.GALLERY },
      { time: 21000, nextState: STAGES.OUTRO }
    ];

    let timers: NodeJS.Timeout[] = [];
    timeline.forEach((step) => {
      timers.push(setTimeout(() => setStage(step.nextState), step.time));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mont text-white">
      
      {/* STAGE 0: INTRO */}
      <AnimatePresence>
        {stage === STAGES.INTRO && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-[#c9a84c] text-[10px] uppercase tracking-[0.5em] mb-4"
            >
              Présente
            </motion.div>
            <h1 className="font-playfair text-6xl md:text-8xl tracking-[0.2em] uppercase">
              Perseus
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 1: HERO */}
      <AnimatePresence>
        {stage >= STAGES.HERO && stage < STAGES.OUTRO && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-10"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 15, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              <Image
                src="/assets/refonte/Gemini_Generated_Image_oqqfjjoqqfjjoqqf (1).png"
                alt="Perseus Hero"
                fill
                className="object-cover object-bottom opacity-40 mix-blend-screen"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: COLLECTION TITLE */}
      <AnimatePresence>
        {stage === STAGES.COLLECTION && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, filter: "blur(5px)" }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-4"
          >
            <h2 className="text-4xl md:text-7xl font-playfair uppercase tracking-widest leading-tight">
              L'Aube de l'Excellence
            </h2>
            <div className="w-1 px h-24 bg-gradient-to-b from-white to-transparent mt-8 mx-auto" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 3: THE GALLERY (New York 2026) */}
      <AnimatePresence>
        {stage === STAGES.GALLERY && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30 px-10"
          >
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-[#c9a84c] text-sm uppercase tracking-[0.4em] mb-12"
            >
              Collection New York 2026
            </motion.h3>
            
            <div className="flex gap-16 items-center justify-center">
              {[
                { file: '1.png', name: 'Fifth Avenue', price: '$350,000' },
                { file: '5.png', name: 'Manhattan Nights', price: '$185,000' },
                { file: 'perseus1.png', name: 'Empire State', price: '$450,000' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + (i * 0.4), duration: 1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative w-[180px] h-[240px] md:w-[250px] md:h-[320px] mb-6">
                    <Image
                      src={`/assets/bijoux/trier/${item.file}`}
                      alt={item.name}
                      fill
                      className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                    />
                  </div>
                  <h4 className="font-playfair text-xl tracking-widest uppercase mb-2">{item.name}</h4>
                  <p className="text-white/50 text-xs tracking-widest font-bold">{item.price}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 4: OUTRO */}
      <AnimatePresence>
        {stage === STAGES.OUTRO && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 2 }}
              className="text-center"
            >
              <h2 className="font-playfair text-5xl md:text-7xl tracking-[0.2em] uppercase mb-8">
                L'Art du Luxe.
              </h2>
              <p className="text-[#c9a84c] text-[10px] md:text-xs uppercase tracking-[0.5em]">
                Disponible Maintenant
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
