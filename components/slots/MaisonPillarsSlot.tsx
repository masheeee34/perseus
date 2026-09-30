'use client';

import React from 'react';

const PILLARS = [
  {
    num: '01',
    title: 'Création Sur-Mesure',
    desc: 'Chaque pièce est façonnée individuellement selon vos désirs, sertie à la demande et gravée au laser dans le secret de nos ateliers.'
  },
  {
    num: '02',
    title: 'Matières d\'Exception',
    desc: 'Sélection rigoureuse des métaux les plus purs — or massif 18K/24K, platine, titane aéronautique et diamants naturels taillés VVS1.'
  },
  {
    num: '03',
    title: 'Le Cercle Privé',
    desc: 'Un accompagnement discret et confidentiel par notre conciergerie privée pour l\'acquisition de pièces d\'artisanat uniques.'
  }
];

export default function MaisonPillarsSlot() {
  return (
    <section className="w-full bg-[#FAF8F5] py-20 px-6 md:px-16 border-b border-ink/10 select-none">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {PILLARS.map((p) => (
            <div key={p.num} className="flex flex-col text-left space-y-4">
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C5A044]">
                {p.num} · {p.title}
              </span>
              <p className="text-xs text-ink/70 leading-relaxed font-light font-mont">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
