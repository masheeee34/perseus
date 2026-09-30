'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Image
          src="/asset/1.png"
          alt="Perseus Loading"
          width={150}
          height={60}
          className="h-12 w-auto object-contain brightness-0 invert sepia(1) hue-rotate(-50deg) saturate(5) opacity-80"
          unoptimized
        />
      </motion.div>
      <motion.p
        className="mt-6 text-[10px] font-mont tracking-[0.4em] uppercase text-gold"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        Chargement...
      </motion.p>
    </div>
  );
}
