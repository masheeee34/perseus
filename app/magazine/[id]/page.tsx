'use client';

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, BookOpen, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import MotionSection from '../../../components/MotionSection';

interface ArticleData {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorRole: string;
  paragraphs: string[];
  quote?: string;
  quoteAuthor?: string;
}

const ARTICLES_DATABASE: Record<string, ArticleData> = {
  'art-1': {
    id: 'art-1',
    title: "L'Art du Grillz : Au-delà du Sourire",
    subtitle: "Quand l'orfèvrerie de précision et l'or 24 carats transforment le sourire en chef-d'œuvre sculptural.",
    category: 'Savoir-Faire',
    date: '31 Mars 2026',
    readTime: '6 min',
    image: '/assets/menyoo/Sidebaneer.png',
    author: 'Jean-Marc de Perseus',
    authorRole: 'Maître Orfèvre en Chef',
    paragraphs: [
      "Dans l'histoire contemporaine du luxe, peu de pièces incarnent avec autant de force la fusion entre l'affirmation de soi et la haute joaillerie que le grillz. Loin d'être un simple ornement ostentatoire, chaque création Perseus commence par une empreinte numérique micrométrique afin d'épouser avec une exactitude absolue la morphologie de son acquéreur.",
      "Nos maîtres joailliers façonnent chaque alvéole à la main dans de l'or 24 carats massif. L'alliage exclusif développé au sein de nos ateliers secrets garantit une résistance exceptionnelle et une brillance miroir inaltérable au fil des années.",
      "Le sertissage des pierres – qu'il s'agisse de diamants VVS1 taillés brillant ou d'émeraudes colombiennes – répond aux mêmes standards drastiques que nos plus prestigieuses parures royales. Chaque griffe est arrondie pour offrir un confort absolu et une fluidité tactile sans équivalent.",
      "Porter une pièce dentaire Perseus, c'est sceller son appartenance à une élite qui ne négocie ni avec l'audace, ni avec l'excellence."
    ],
    quote: "Le grillz n'est pas un bijou que l'on porte, c'est une armure d'or qui sublime chaque parole prononcée.",
    quoteAuthor: "Atelier Perseus, Portola Drive"
  },
  'art-2': {
    id: 'art-2',
    title: "L'Héritage de l'Horlogerie Perseus",
    subtitle: "L'art de sculpter l'éternité : voyage au cœur des complications et des mouvements mécaniques d'exception.",
    category: 'Horlogerie',
    date: '28 Mars 2026',
    readTime: '8 min',
    image: '/assets/menyoo/seri2.png',
    author: 'Alexandre V.',
    authorRole: 'Directeur Horlogerie & Complications',
    paragraphs: [
      "Le temps ne s'achète pas, mais il peut être sublimé. Chez Perseus, concevoir un garde-temps relève d'une quête quasi philosophique. Entre l'extrême complexité des balanciers tourbillons et le raffinement des boîtiers taillés dans le titane et le platine, chaque seconde devient une pulsation artistique.",
      "Nos maîtres horlogers consacrent jusqu'à neuf mois à l'assemblage et au réglage méticuleux d'une seule montre Kronos ou Tempus. Chaque composant, des ponts anglés à la main aux vis bleuies à la flamme, fait l'objet d'un polissage manuel invisible à l'œil nu mais vibrant sous la loupe d'un expert.",
      "La lunette pavée de saphirs multicolores et de diamants purs transforme l'instrument de mesure en joyau céleste. Portée par les visionnaires de notre époque, la montre Perseus affirme le statut de celui qui domine son temps plutôt que de le subir."
    ],
    quote: "Nous ne fabriquons pas des instruments pour mesurer les heures, nous capturons les moments de triomphe.",
    quoteAuthor: "Maison Perseus Horlogerie"
  },
  'art-3': {
    id: 'art-3',
    title: "Maroquinerie : Le Choix de l'Excellence",
    subtitle: "Coutures sellier, peausseries rares et fermoirs en or massif : l'accessoire réinventé.",
    category: 'Maroquinerie',
    date: '25 Mars 2026',
    readTime: '5 min',
    image: '/assets/menyoo/1perseus.png',
    author: 'Camille L.',
    authorRole: 'Responsable Cuirs & Matières Rares',
    paragraphs: [
      "Dans nos ateliers de maroquinerie d'art, chaque pièce de cuir raconte une histoire de rigueur et de passion. Nous sélectionnons uniquement les parties les plus nobles des cuirs pleine fleur et des peausseries exotiques issues de filières responsables et certifiées.",
      "La découpe manuelle, le travail des tranches teintées et polies à la cire d'abeille, ainsi que la mythique couture au point sellier confèrent à nos sacs et pochettes une longévité proverbiale.",
      "Sublimée par des fermoirs et cadenas moulés en or 18 carats gravés de l'armoirie Perseus, notre maroquinerie allie la souplesse voluptueuse du toucher à une tenue architecturale irréprochable."
    ],
    quote: "Le cuir véritable est une matière vivante qui s'embellit des victoires de son propriétaire.",
    quoteAuthor: "Atelier Cuir Perseus"
  }
};

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const article = ARTICLES_DATABASE[id];

  if (!article) {
    return notFound();
  }

  const otherArticles = Object.values(ARTICLES_DATABASE).filter(a => a.id !== id);

  return (
    <div className="min-h-screen bg-black text-white pt-36 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20">
        
        {/* Back Link */}
        <div className="mb-12">
          <Link
            href="/magazine"
            className="inline-flex items-center gap-3 text-white/40 hover:text-gold transition-colors text-[10px] font-bold tracking-[0.25em] uppercase group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform" />
            Retour au Magazine
          </Link>
        </div>

        {/* Header */}
        <header className="mb-16">
          <MotionSection delay={0.1}>
            <div className="flex items-center gap-4 mb-6">
              <span className="badge-gold">{article.category}</span>
              <div className="flex items-center gap-4 text-white/40 text-[10px] font-bold tracking-widest uppercase font-mont">
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-gold" /> {article.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-gold" /> {article.readTime}</span>
              </div>
            </div>
            <h1 className="font-playfair text-4xl md:text-6xl xl:text-7xl font-bold uppercase tracking-tight text-white leading-tight mb-8">
              {article.title}
            </h1>
            <p className="text-white/60 font-mont text-sm md:text-base tracking-widest leading-relaxed max-w-3xl">
              {article.subtitle}
            </p>
          </MotionSection>
        </header>

        {/* Hero Image */}
        <MotionSection delay={0.2} className="mb-20">
          <div className="relative aspect-[16/9] max-h-[600px] w-full overflow-hidden bg-dark-100 border border-white/5 shadow-2xl">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover grayscale-[0.2]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </MotionSection>

        {/* Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 mb-32">
          
          {/* Main Article Body */}
          <main className="lg:col-span-8 space-y-8">
            {article.paragraphs.map((p, index) => (
              <p
                key={index}
                className={`text-white/70 font-mont leading-relaxed tracking-wide ${
                  index === 0
                    ? 'text-lg md:text-xl font-light text-white/90 first-letter:float-left first-letter:text-5xl first-letter:font-playfair first-letter:text-gold first-letter:mr-3 first-letter:leading-none'
                    : 'text-sm md:text-base'
                }`}
              >
                {p}
              </p>
            ))}

            {article.quote && (
              <blockquote className="my-12 p-8 md:p-12 border-l-2 border-gold bg-dark-100/40 backdrop-blur-sm relative">
                <p className="font-script text-2xl md:text-4xl text-gold/90 mb-4 leading-relaxed">
                  &ldquo;{article.quote}&rdquo;
                </p>
                {article.quoteAuthor && (
                  <cite className="block text-[9px] uppercase tracking-[0.3em] text-white/40 not-italic font-bold font-mont">
                    — {article.quoteAuthor}
                  </cite>
                )}
              </blockquote>
            )}

            <div className="pt-10 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/boutique"
                className="ghost-btn inline-flex"
              >
                Découvrir la boutique
              </Link>
            </div>
          </main>

          {/* Author & Info Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="bg-dark-100/60 border border-white/5 p-8 backdrop-blur-md">
              <p className="text-[9px] uppercase tracking-[0.4em] text-gold font-bold mb-4">Auteur de l&apos;Édition</p>
              <h3 className="font-playfair text-xl font-bold uppercase tracking-wider text-white mb-2">{article.author}</h3>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-mont mb-6">{article.authorRole}</p>
              <div className="w-12 h-px bg-gold/40 mb-6" />
              <p className="text-white/50 text-xs font-mont leading-relaxed">
                Rédigé dans le cadre des Chroniques Perseus pour célébrer l&apos;artisanat d&apos;exception et le style de vie influent.
              </p>
            </div>

            <div className="bg-dark-100/60 border border-white/5 p-8">
              <BookOpen className="w-6 h-6 text-gold mb-4" />
              <h4 className="font-playfair text-lg font-bold uppercase tracking-wider text-white mb-2">Conciergerie Privée</h4>
              <p className="text-white/40 text-xs font-mont leading-relaxed mb-6">
                Vous souhaitez privatiser une pièce mentionnée dans cet article ? Nos conseillers sont joignables 24/7.
              </p>
              <Link
                href="/faq"
                className="text-gold hover:text-white text-[10px] font-bold uppercase tracking-[0.25em] transition inline-flex items-center gap-2"
              >
                Contacter le service <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        <section className="border-t border-white/10 pt-20">
          <div className="mb-12">
            <p className="section-label mb-3">Poursuivre la lecture</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold uppercase tracking-widest text-white">
              Éditions Similaires
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {otherArticles.map((item) => (
              <Link
                key={item.id}
                href={`/magazine/${item.id}`}
                className="group bg-dark-100/30 border border-white/5 p-6 hover:border-gold/30 transition-all flex gap-6 items-center"
              >
                <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden bg-black">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] uppercase tracking-widest text-gold font-bold">{item.category}</span>
                  <h3 className="font-playfair text-lg text-white uppercase tracking-wider group-hover:text-gold transition-colors truncate mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-xs line-clamp-2">{item.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
