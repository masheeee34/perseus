'use client';

import React from 'react';
import { motion } from 'framer-motion';

const MARQUEE_ITEMS = [
  'OR PUR 24K',
  'DIAMANTS VVS1',
  'ATELIERS PORTOLA DRIVE',
  'PIÈCES SIGNÉES RAELYN MAY',
  'HAUTE HORLOGERIE SUISSE',
  'GRAVURE & SUR-MESURE',
  'MAROQUINERIE COUSUE MAIN',
  'LE CERCLE CONFIDENTIEL'
];

export default function PrestigeMarqueeSlot() {
  return (
    <div className="w-full bg-[#FAF8F5] border-y border-ink/10 py-5 overflow-hidden select-none">
      <div className="flex w-max">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
          className="flex items-center gap-10 whitespace-nowrap"
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-10">
              <span className="text-[11px] font-bold tracking-[0.35em] uppercase text-ink/75 font-mont">
                {item}
              </span>
              <span className="text-[#C5A044] text-[10px]">✦</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
