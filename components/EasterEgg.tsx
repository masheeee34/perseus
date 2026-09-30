'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle, Share } from 'lucide-react';

export default function EasterEgg() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Secret code to trigger: "poney"
    let keys = '';
    const secret = 'poney';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keys when typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      
      keys += e.key.toLowerCase();
      if (keys.length > secret.length) {
        keys = keys.slice(-secret.length);
      }
      if (keys === secret) {
        setShow(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Expose a global method to open it (so we can trigger it from Footer)
  useEffect(() => {
    (window as any).triggerWerenoiEgg = () => setShow(true);
    return () => {
      delete (window as any).triggerWerenoiEgg;
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-[9999] flex flex-col text-white font-mont"
          style={{ 
            background: 'linear-gradient(135deg, #6c4e31 0%, #121212 80%)',
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 lg:px-12 bg-black/20 backdrop-blur-sm">
            <button onClick={() => setShow(false)} className="hover:scale-110 transition-transform">
              <X className="w-8 h-8 opacity-70 hover:opacity-100 transition-opacity" />
            </button>
            <span className="text-[10px] md:text-sm font-bold tracking-[0.3em] uppercase opacity-70">En lecture à partir de tes pensées</span>
            <button className="hover:scale-110 transition-transform">
              <Share className="w-5 h-5 opacity-70 hover:opacity-100" />
            </button>
          </div>

          {/* Lyrics Container */}
          <div className="flex-1 overflow-y-auto px-6 md:px-20 py-10 flex flex-col justify-center max-w-5xl mx-auto w-full">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="space-y-6 md:space-y-8 text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white/40"
             >
                <p className="hover:text-white transition-colors duration-300 transform origin-left hover:scale-[1.02]">
                  J&apos;dois m&apos;vider le cœur,
                </p>
                <p className="hover:text-white transition-colors duration-300 transform origin-left hover:scale-[1.02]">
                  j&apos;dois remplir la pocket.
                </p>
                <motion.p 
                  initial={{ scale: 0.95, opacity: 0.5, color: "rgba(255,255,255,0.4)" }}
                  animate={{ scale: 1, opacity: 1, color: "rgba(255,255,255,1)" }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="text-white drop-shadow-2xl py-4 transform origin-left cursor-pointer"
                >
                  J&apos;fumais le pollen en poney
                </motion.p>
                <p className="hover:text-white transition-colors duration-300 transform origin-left hover:scale-[1.02]">
                  J&apos;suis calibré dans la zone
                </p>
             </motion.div>
          </div>

          {/* Footer Player */}
          <div className="p-6 lg:px-12 flex justify-between items-center bg-black/40 backdrop-blur-md border-t border-white/5 pb-8 md:pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-zinc-800 rounded-md overflow-hidden relative shadow-2xl">
                {/* Simulated album cover placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-700 to-amber-900 opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/30">
                  WRN
                </div>
              </div>
              <div>
                <p className="font-bold text-lg hover:underline cursor-pointer">Poney</p>
                <p className="text-sm opacity-70 hover:underline cursor-pointer">Werenoi</p>
              </div>
            </div>
            <button className="hover:scale-110 transition-transform">
              <PlayCircle className="w-12 h-12 text-white/90 hover:text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
