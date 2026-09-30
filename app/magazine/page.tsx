'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, User, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const ARTICLES = [
  {
    id: 'art-1',
    num: '01',
    category: 'HAUTE JOAILLERIE',
    date: 'Été 2026',
    readTime: '6 min de lecture',
    author: 'Alexander Vance',
    title: "L'Art du Grillz & des Chaînes Cubaines : Le Nouveau Symbole de Puissance",
    lead: "Quand l'or massif 24 karats et le pavage diamants VVS1 deviennent l'armure d'apparat incontournable de l'élite de Rockford Hills.",
    image: '/assets/slider/1.jpg.png',
    isPortrait: false,
    paragraphs: [
      "Dans l'effervescence de Los Santos, le bijou a cessé d'être un simple ornement pour s'ériger en emblème souverain. De Portola Drive aux salons feutrés de Rockford Hills, la parure est désormais conçue comme une véritable armure statutaire.",
      "Les maîtres artisans de la Maison Perseus ont réinventé l'orfvrerie contemporaine : chaque maillon de chaîne cubaine est fondu à 1 064°C, poli à la main selon la technique ancestrale du poli miroir, et ajusté au micron près pour épouser parfaitement les mouvements du corps.",
      "« Le véritable pouvoir ne se proclame pas, il se contemple », confie la direction artistique de la Maison. Sertis de plusieurs centaines de diamants à la réfraction immaculée, nos grillz et parures sur-mesure capturent la lumière nocturne pour transformer chaque apparition en un moment d'anthologie."
    ],
    quote: "Le véritable luxe ne cherche pas à impressionner : il impose sa présence avec une autorité naturelle."
  },
  {
    id: 'art-2',
    num: '02',
    category: 'RIVIERA & BEACH CLUB',
    date: 'Été 2026',
    readTime: '5 min de lecture',
    author: 'Éléonore de Saint-Germain',
    title: "Perseus Beach Club : Le Nouvel Éden Privé de la Riviera de San Andreas",
    lead: "Transats d'acajou, brise du large, coupes de champagne millésimé et haute joaillerie balnéaire : immersion exclusive dans le club le plus sélect de la côte.",
    image: '/assets/menyoo/perseus_lifestyle_mirror.png',
    isPortrait: true,
    paragraphs: [
      "Nichée le long du littoral sauvage de Del Perro et Chumash, la nouvelle enclave estivale de la Maison Perseus réinvente l'art de vivre en bord de mer. Le Perseus Beach Club s'impose déjà comme le sanctuaire le plus prisé de l'élite, mêlant farniente haut de gamme, cabanes privées et musique feutrée.",
      "Avant de rejoindre le ponton au coucher du soleil, les préparatifs dans les suites côtières relèvent de la haute couture : tenues immaculées sculptées de clous dorés, parures étincelantes et lunettes d'or. Ici, la haute joaillerie quitte les salons feutrés pour capturer les reflets de l'océan et la lumière dorée du crépuscule.",
      "« Le Perseus Beach Club a été conçu pour prolonger l'expérience Portola Drive sous le soleil californien », souligne la direction. Réservé aux membres privilégiés et aux acquéreurs de pièces uniques, ce lieu confidentiel offre une escale hors du temps où chaque détail respire l'excellence."
    ],
    quote: "Le véritable luxe balnéaire ne se montre pas : il se vit face à l'horizon infini."
  },
  {
    id: 'art-3',
    num: '03',
    category: 'SAVOIR-FAIRE & GEMMOLOGIE',
    date: 'Été 2026',
    readTime: '5 min de lecture',
    author: 'Jean-Marc Belrose',
    title: "Le Secret des Diamants VVS1 : La Quête de la Pureté Absolue",
    lead: "De la sélection des pierres brutes aux ateliers secrets de Portola Drive : comment nos gemmologues traquent l'infiniment pur.",
    image: '/assets/menyoo/PERSEUS_PORTOLA_DRIVE_LOS_SANTOS_1.png',
    isPortrait: false,
    paragraphs: [
      "Moins de 0,05 % des diamants extraits dans le monde répondent aux critères drastiques imposés par le cahier des charges de la Maison Perseus. Une clarté VVS1 où aucune inclusion n'est décelable à l'œil nu, une symétrie chirurgicale et une brillance qui défie l'ombre.",
      "Dans notre atelier de Rockford Hills, chaque gemme est analysée au réfractomètre avant de recevoir la bénédiction de nos sertisseurs en chef. Les pierres sont montées à la loupe sous un éclairage calibré pour garantir une réflexion optimale de chaque facette.",
      "Un engagement sans compromis pour l'éternité qui garantit à chaque acquéreur une valeur patrimoniale inaltérable."
    ],
    quote: "La perfection n'est pas un détail, mais elle naît d'une infinité de détails maîtrisés."
  }
];

export default function MagazinePage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 antialiased pt-36 pb-36 px-4 sm:px-8 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif]">
      
      {/* ─── FEUILLE CENTRALE BLANCHE (ÉCRIN ÉDITORIAL) ─── */}
      <div className="max-w-4xl mx-auto bg-white border border-zinc-200/90 shadow-[0_15px_45px_rgba(0,0,0,0.03)] px-6 sm:px-14 lg:px-20 py-16 sm:py-24 space-y-24">
        
        {/* ─── MASTHEAD ÉDITORIAL ─── */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-between border-y border-zinc-900/80 py-2.5 text-[9px] sm:text-[11px] font-mont uppercase tracking-[0.25em] text-zinc-800 font-semibold">
            <span>ÉDITION N° 01 · ÉTÉ 2026</span>
            <span className="hidden sm:inline">LOS SANTOS · PORTOLA DRIVE</span>
            <span>CHRONIQUES OFFICIELLES</span>
          </div>

          <div className="py-4">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-zinc-950 uppercase leading-none">
              Perseus Magazine
            </h1>
            <p className="font-mont text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#C5A044] font-bold mt-3">
              Haute Joaillerie · Art de Vivre · Culture San Andreas
            </p>
          </div>

          <div className="w-16 h-px bg-[#C5A044] mx-auto pt-1" />
        </header>

        {/* ─── FLUX DES ARTICLES ─── */}
        <main className="space-y-32">
          {ARTICLES.map((art) => {
            if (art.isPortrait) {
              return (
                <article 
                  key={art.id} 
                  className="space-y-10 border-b border-zinc-200 pb-28 last:border-b-0 last:pb-0"
                >
                  {/* Meta Top */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-zinc-950 text-white text-[10px] font-mont font-bold uppercase tracking-widest">
                        ARTICLE {art.num}
                      </span>
                      <span className="font-mont text-xs uppercase tracking-wider text-[#C5A044] font-bold">
                        {art.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mont text-zinc-500">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {art.readTime}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {art.author}</span>
                    </div>
                  </div>

                  {/* Titre & Chapeau */}
                  <div className="space-y-6">
                    <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-950 uppercase leading-[1.08] tracking-tight">
                      {art.title}
                    </h2>
                    <p className="font-serif italic text-zinc-700 text-xl sm:text-2xl font-light leading-relaxed border-l-2 border-[#C5A044] pl-6 py-1">
                      « {art.lead} »
                    </p>
                  </div>

                  {/* Grille Portrait Verticale + Texte (Diptyque de Magazine) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Portrait Vertical Entier (Non Rogné) */}
                    <div className="md:col-span-5">
                      <div className="relative aspect-[9/16] w-full bg-zinc-950 overflow-hidden shadow-lg border border-zinc-200">
                        <Image
                          src={art.image}
                          alt={art.title}
                          fill
                          className="object-cover object-top hover:scale-102 transition-transform duration-700"
                        />
                      </div>
                      <span className="text-[10px] font-mont uppercase tracking-widest text-zinc-400 block mt-2 text-center">
                        Perseus Beach Club · Chumash Coast
                      </span>
                    </div>

                    {/* Texte à Côté du Portrait */}
                    <div className="md:col-span-7 space-y-6 font-mont text-base text-zinc-700 leading-relaxed">
                      {art.paragraphs.map((p, pIdx) => {
                        if (pIdx === 0) {
                          const firstLetter = p.charAt(0);
                          const restOfText = p.slice(1);
                          return (
                            <p key={pIdx} className="first-letter-container">
                              <span className="float-left font-serif text-6xl text-[#C5A044] font-normal leading-none pr-3 pt-1">
                                {firstLetter}
                              </span>
                              {restOfText}
                            </p>
                          );
                        }
                        return (
                          <p key={pIdx}>
                            {p}
                          </p>
                        );
                      })}
                    </div>

                  </div>

                  {/* Citation Encartée */}
                  <div className="bg-[#FAF8F5] border-y-2 border-[#C5A044] p-8 sm:p-10 text-center my-10 shadow-sm">
                    <p className="font-serif italic text-xl sm:text-2xl text-zinc-950 font-normal leading-snug">
                      « {art.quote} »
                    </p>
                    <span className="font-mont text-[10px] uppercase tracking-[0.3em] text-[#C5A044] font-bold mt-4 block">
                      Perseus Beach Club · San Andreas Riviera
                    </span>
                  </div>

                  {/* Footer de l'Article */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-100">
                    <span className="font-mont text-xs uppercase tracking-widest text-zinc-400">
                      Publié par la Rédaction Perseus
                    </span>
                    <Link
                      href="/boutique"
                      className="inline-flex items-center gap-2 text-xs font-mont uppercase tracking-[0.2em] font-bold text-zinc-950 hover:text-[#C5A044] transition-colors"
                    >
                      <span>Découvrir la sélection Summer 2026</span>
                      <ArrowRight className="w-4 h-4 text-[#C5A044]" />
                    </Link>
                  </div>

                </article>
              );
            }

            return (
              <article 
                key={art.id} 
                className="space-y-10 border-b border-zinc-200 pb-28 last:border-b-0 last:pb-0"
              >
                {/* Meta Top */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-zinc-950 text-white text-[10px] font-mont font-bold uppercase tracking-widest">
                      ARTICLE {art.num}
                    </span>
                    <span className="font-mont text-xs uppercase tracking-wider text-[#C5A044] font-bold">
                      {art.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mont text-zinc-500">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {art.readTime}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {art.author}</span>
                  </div>
                </div>

                {/* Titre & Chapeau */}
                <div className="space-y-6">
                  <h2 className="font-serif text-3xl sm:text-5xl font-light text-zinc-950 uppercase leading-[1.08] tracking-tight">
                    {art.title}
                  </h2>
                  <p className="font-serif italic text-zinc-700 text-xl sm:text-2xl font-light leading-relaxed border-l-2 border-[#C5A044] pl-6 py-1">
                    « {art.lead} »
                  </p>
                </div>

                {/* Grande Image Paysage */}
                <div className="relative aspect-[16/9] w-full bg-zinc-950 overflow-hidden shadow-sm">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    className="object-cover object-center hover:scale-103 transition-transform duration-1000"
                    priority={art.num === '01'}
                  />
                </div>

                {/* Corps du Texte */}
                <div className="space-y-6 font-mont text-base sm:text-lg text-zinc-700 leading-relaxed sm:leading-loose">
                  {art.paragraphs.map((p, pIdx) => {
                    if (pIdx === 0) {
                      const firstLetter = p.charAt(0);
                      const restOfText = p.slice(1);
                      return (
                        <p key={pIdx} className="first-letter-container">
                          <span className="float-left font-serif text-6xl sm:text-7xl text-[#C5A044] font-normal leading-none pr-3 pt-1">
                            {firstLetter}
                          </span>
                          {restOfText}
                        </p>
                      );
                    }
                    return (
                      <p key={pIdx}>
                        {p}
                      </p>
                    );
                  })}
                </div>

                {/* Citation Encartée */}
                <div className="bg-[#FAF8F5] border-y-2 border-[#C5A044] p-8 sm:p-10 text-center my-10 shadow-sm">
                  <p className="font-serif italic text-xl sm:text-2xl text-zinc-950 font-normal leading-snug">
                    « {art.quote} »
                  </p>
                  <span className="font-mont text-[10px] uppercase tracking-[0.3em] text-[#C5A044] font-bold mt-4 block">
                    Maison Perseus · Portola Drive
                  </span>
                </div>

                {/* Footer de l'Article */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-zinc-100">
                  <span className="font-mont text-xs uppercase tracking-widest text-zinc-400">
                    Publié par la Rédaction Perseus
                  </span>
                  <Link
                    href="/boutique"
                    className="inline-flex items-center gap-2 text-xs font-mont uppercase tracking-[0.2em] font-bold text-zinc-950 hover:text-[#C5A044] transition-colors"
                  >
                    <span>Découvrir les pièces associées</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A044]" />
                  </Link>
                </div>

              </article>
            );
          })}
        </main>

        {/* ─── ABONNEMENT PRESTIGE EN BAS DE FEUILLE (FOND CLAIR LUXE) ─── */}
        <section className="bg-[#FAF8F5] border border-zinc-200/90 text-zinc-950 p-10 sm:p-14 text-center space-y-6 shadow-sm">
          <BookOpen className="w-9 h-9 text-[#C5A044] mx-auto" />
          <span className="font-mont text-[10px] uppercase tracking-[0.4em] text-[#C5A044] font-bold block">
            Cercle des Lecteurs
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal uppercase tracking-tight text-zinc-950">
            Recevez la Prochaine Édition
          </h2>
          <p className="font-serif italic text-zinc-600 text-sm sm:text-base max-w-lg mx-auto font-light leading-relaxed">
            Inscrivez-vous pour recevoir directement les prochains articles et les accès prioritaires aux ventes privées.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Numéro GTAW / Contact"
              className="w-full bg-white border border-zinc-300 focus:border-[#C5A044] text-zinc-900 placeholder:text-zinc-400 text-xs px-5 py-4 outline-none font-mont uppercase"
            />
            <button className="w-full sm:w-auto px-8 py-4 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont text-xs uppercase tracking-widest font-bold transition-all shadow-sm flex-shrink-0 cursor-pointer">
              S&apos;abonner
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
