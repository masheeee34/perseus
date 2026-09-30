'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Copy, Check, ChevronDown } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useCart } from '../../../lib/contexts/CartContext';
import { Product } from '../../../lib/types';

interface CollectionPiece {
  id: string;
  name: string;
  category: string;
  materials: string;
  price: number;
  priceStr: string;
  description: string;
  atelierNote: string;
  image: string;
  gtawCmd: string;
}

interface SilhouetteLook {
  id: string;
  number: string;
  gender: 'homme' | 'femme';
  style: 'casual' | 'chic' | 'sport';
  title: string;
  subtitle: string;
  season: string;
  packPrice: number;
  packPriceStr: string;
  regularPrice: number;
  regularPriceStr: string;
  modelImage: string;
  modelIsPhotoshoot: boolean;
  editorialQuote: string;
  pieces: CollectionPiece[];
}

const FALL_COLLECTION_LOOKS: SilhouetteLook[] = [
  {
    id: 'femme_casual',
    number: '01',
    gender: 'femme',
    style: 'casual',
    title: "L'Ensemble Hestia",
    subtitle: "Veste cropped surpiquée d'or, minijupe velours carmin & bottes stiletto",
    season: "Automne 2026",
    packPrice: 80000,
    packPriceStr: "80,000",
    regularPrice: 87000,
    regularPriceStr: "87,000",
    modelImage: "/assets/campaign/perseus_fall_2026_femme.png",
    modelIsPhotoshoot: true,
    editorialQuote: "Une silhouette sculptée dans le contraste : la rigueur de la gabardine surpiquée d'or répond à la sensualité du velours carmin.",
    pieces: [
      {
        id: "fall_fc_01",
        name: "Veste Cropped Hestia",
        category: "Prêt-à-Porter",
        materials: "Gabardine de coton lourd noir, surpiqûres sellier fil d'or 24K, boutons Medusa gravés",
        price: 24000,
        priceStr: "24,000",
        description: "Veste courte en gabardine noire dense et surpiqûres dorées.",
        atelierNote: "Confectionnée à la main à Rockford Hills.",
        image: "/assets/fall2026/femme_casual/veste_cropped_hestia.png",
        gtawCmd: "/creerobjet goods 24000 1 Perseus Veste Hestia | Veste cropped gabardine noire surpiqûres dorées"
      },
      {
        id: "fall_fc_02",
        name: "Minijupe Velours Cora",
        category: "Prêt-à-Porter",
        materials: "Velours côtelé carmin rubis, rivets d'or 18 carats",
        price: 15000,
        priceStr: "15,000",
        description: "Jupe trapèze en velours côtelé carmin profond.",
        atelierNote: "Teinture naturelle toscane.",
        image: "/assets/fall2026/femme_casual/minijupe_velours_cora.png",
        gtawCmd: "/creerobjet goods 15000 1 Perseus Jupe Cora | Minijupe trapèze velours côtelé rouge carmin"
      },
      {
        id: "fall_fc_03",
        name: "Bottes Stiletto Phèdre",
        category: "Souliers",
        materials: "Cuir nappa noir d'ébène, talon architectural liseré or",
        price: 32000,
        priceStr: "32,000",
        description: "Bottes montantes en cuir souple avec talon liseré or.",
        atelierNote: "Montage Blake italien.",
        image: "/assets/fall2026/femme_casual/bottes_stiletto_phedre.png",
        gtawCmd: "/creerobjet goods 32000 1 Perseus Bottes Phedre | Bottes hautes cuir noir stiletto liseré or"
      },
      {
        id: "fall_fc_04",
        name: "Ceinture Cabochons Rubicon",
        category: "Maroquinerie",
        materials: "Cuir carmin toscan, boucle bicolore or et platine",
        price: 16000,
        priceStr: "16,000",
        description: "Ceinture large carmin avec boucle or et platine.",
        atelierNote: "Argent massif plaqué or fin 24K.",
        image: "/assets/fall2026/femme_casual/ceinture_cabochons_rubicon.png",
        gtawCmd: "/creerobjet goods 16000 1 Perseus Ceinture Rubicon | Ceinture cuir carmin boucle bicolore or platine"
      }
    ]
  },
  {
    id: 'homme_chic',
    number: '02',
    gender: 'homme',
    style: 'chic',
    title: "L'Ensemble Apollon",
    subtitle: "Chemise twill de soie baroque, pantalon ébène & richelieus bijou",
    season: "Automne 2026",
    packPrice: 95000,
    packPriceStr: "95,000",
    regularPrice: 99000,
    regularPriceStr: "99,000",
    modelImage: "/assets/campaign/perseus_fall_2026_homme.png",
    modelIsPhotoshoot: true,
    editorialQuote: "Le triomphe de la Renaissance sur Portola Drive. Une fresque mythologique portée à même la peau sous le ciel de Los Santos.",
    pieces: [
      {
        id: "fall_hc_01",
        name: "Chemise Soie Apollon",
        category: "Prêt-à-Porter",
        materials: "Twill de soie pure italienne, imprimé antique noir et blanc",
        price: 28000,
        priceStr: "28,000",
        description: "Chemise fluide à col cubain en soie italienne imprimée damier antique.",
        atelierNote: "Sérigraphie traditionnelle de Côme.",
        image: "/assets/fall2026/homme_chic/chemise_soie_apollon.png",
        gtawCmd: "/creerobjet goods 28000 1 Perseus Chemise Apollon | Chemise soie col cubain imprimé antique baroque"
      },
      {
        id: "fall_hc_02",
        name: "Pantalon Tailleur Titan",
        category: "Prêt-à-Porter",
        materials: "Gabardine de laine peignée noire, coupe fuselée italienne",
        price: 18000,
        priceStr: "18,000",
        description: "Pantalon tailleur fuselé en gabardine noire dense.",
        atelierNote: "Tombé net sans pli superflu.",
        image: "/assets/fall2026/homme_chic/pantalon_tailleur_titan.png",
        gtawCmd: "/creerobjet goods 18000 1 Perseus Pantalon Titan | Pantalon tailleur gabardine noire fuselé"
      },
      {
        id: "fall_hc_03",
        name: "Richelieus Talon Bijou Orphée",
        category: "Souliers",
        materials: "Cuir verni noir glacé miroir, talon serti d'or et cabochons onyx",
        price: 35000,
        priceStr: "35,000",
        description: "Richelieus en cuir verni glacé avec talon joaillier doré et onyx.",
        atelierNote: "Cousu trépointe Goodyear.",
        image: "/assets/fall2026/homme_chic/richelieus_apparat_orphee.png",
        gtawCmd: "/creerobjet goods 35000 1 Perseus Richelieus Orphee | Souliers cuir verni noir talon bijou doré onyx"
      },
      {
        id: "fall_hc_04",
        name: "Ceinture Boucle Soleil Sol Invictus",
        category: "Maroquinerie",
        materials: "Cuir pleine fleur noir, imposante boucle soleil or et onyx",
        price: 20000,
        priceStr: "20,000",
        description: "Ceinture cuir avec boucle rayonnante en argent et onyx.",
        atelierNote: "Onyx naturel taille cabochon.",
        image: "/assets/fall2026/homme_chic/ceinture_boucle_soleil_onyx.png",
        gtawCmd: "/creerobjet goods 20000 1 Perseus Ceinture Sol Invictus | Ceinture cuir noir boucle soleil argent onyx"
      }
    ]
  },
  {
    id: 'femme_chic',
    number: '03',
    gender: 'femme',
    style: 'chic',
    title: "L'Ensemble Athénaïs",
    subtitle: "Combinaison bustier bicolore, sac seau lin & escarpins slingback",
    season: "Automne 2026",
    packPrice: 110000,
    packPriceStr: "110,000",
    regularPrice: 120000,
    regularPriceStr: "120,000",
    modelImage: "/assets/campaign/perseus_fall_2026_duo.png",
    modelIsPhotoshoot: true,
    editorialQuote: "La perfection de la ligne. Une silhouette de soirée inspirée des déesses de l'Olympe réinterprétées pour les réceptions privées.",
    pieces: [
      {
        id: "fall_fch_01",
        name: "Combinaison Bustier Athénaïs",
        category: "Haute Couture",
        materials: "Crêpe de soie noir et bustier satin blanc ivoire, bretelles médaillons or",
        price: 38000,
        priceStr: "38,000",
        description: "Combinaison smoking avec corset bustier satin ivoire et bretelles bijou.",
        atelierNote: "Armatures corset sur-mesure.",
        image: "/assets/fall2026/femme_chic/combinaison_bustier_athenais.png",
        gtawCmd: "/creerobjet goods 38000 1 Perseus Combinaison Athenais | Combinaison bustier bicolore noir ivoire bretelles or"
      },
      {
        id: "fall_fch_02",
        name: "Sac Seau Amalthée",
        category: "Maroquinerie",
        materials: "Toile de lin écru tramée, cuir noir, chaîne gourmette dorée",
        price: 42000,
        priceStr: "42,000",
        description: "Sac seau iconique en lin tramé et cuir lisse avec chaîne dorée.",
        atelierNote: "Fermeture par chaîne joaillière dorée.",
        image: "/assets/fall2026/femme_chic/sac_seau_amalthee.png",
        gtawCmd: "/creerobjet goods 42000 1 Perseus Sac Amalthee | Sac seau toile lin écru cuir noir chaîne dorée"
      },
      {
        id: "fall_fch_03",
        name: "Escarpins Slingback Théia",
        category: "Souliers",
        materials: "Cuir nappa blanc craie souple, mors équestre doré Medusa",
        price: 26000,
        priceStr: "26,000",
        description: "Escarpins pointus à bride arrière en cuir blanc et mors doré.",
        atelierNote: "Kitten heel 65mm moderne.",
        image: "/assets/fall2026/femme_chic/escarpins_slingback_theia.png",
        gtawCmd: "/creerobjet goods 26000 1 Perseus Escarpins Theia | Escarpins slingback pointus cuir blanc mors doré"
      },
      {
        id: "fall_fch_04",
        name: "Carré de Soie Mnémosyne",
        category: "Soierie",
        materials: "100% twill de soie 90x90 cm, roulotté main, damier et sculptures antiques",
        price: 14000,
        priceStr: "14,000",
        description: "Foulard 90x90 en twill de soie pure, damier géométrique et sculptures antiques.",
        atelierNote: "Édition limitée 50 exemplaires.",
        image: "/assets/fall2026/femme_chic/carre_soie_mnemosyne.png",
        gtawCmd: "/creerobjet goods 14000 1 Perseus Soie Mnemosyne | Carré de soie 90x90 damier baroque statues antiques"
      }
    ]
  },
  {
    id: 'casual_homme',
    number: '04',
    gender: 'homme',
    style: 'casual',
    title: "L'Ensemble Némée",
    subtitle: "Polo piqué brodé or, denim selvedge délavé & montre squelette",
    season: "Automne 2026",
    packPrice: 125000,
    packPriceStr: "125,000",
    regularPrice: 133000,
    regularPriceStr: "133,000",
    modelImage: "/assets/fall2026/casual_homme/polo_medusa_nemee.png",
    modelIsPhotoshoot: false,
    editorialQuote: "L'art de vivre méditerranéen dans sa version la plus opulente : le blanc pur illuminé par l'or 24 carats et la mécanique suisse émeraude.",
    pieces: [
      {
        id: "fall_ch_01",
        name: "Polo Médusa Némée",
        category: "Prêt-à-Porter",
        materials: "Piqué de coton d'Égypte blanc, médaillon brodé fil d'or 24K",
        price: 12000,
        priceStr: "12,000",
        description: "Polo blanc en piqué de coton avec médaillon brodé fil d'or.",
        atelierNote: "Boutons en nacre blanche.",
        image: "/assets/fall2026/casual_homme/polo_medusa_nemee.png",
        gtawCmd: "/creerobjet goods 12000 1 Perseus Polo Nemee | Polo piqué blanc pur broderie méduse fil d'or"
      },
      {
        id: "fall_ch_02",
        name: "Denim Selvedge Aeson",
        category: "Prêt-à-Porter",
        materials: "Denim selvedge 14oz italien, délavage azur vintage",
        price: 14000,
        priceStr: "14,000",
        description: "Jean droit selvedge délavé vintage aux finitions rivetées dorées.",
        atelierNote: "Tissé sur métiers traditionnels italiens.",
        image: "/assets/fall2026/casual_homme/denim_vintage_aeson.png",
        gtawCmd: "/creerobjet goods 14000 1 Perseus Jean Aeson | Denim italien coupe droite délavé boutons or"
      },
      {
        id: "fall_ch_03",
        name: "Sneakers Relief Caelum",
        category: "Souliers",
        materials: "Cuir de veau blanc grainé motif clé grecque, œillets médaillons or",
        price: 22000,
        priceStr: "22,000",
        description: "Baskets blanches en cuir grainé relief géométrique et œillets dorés.",
        atelierNote: "Semelle amortissante sculptée.",
        image: "/assets/fall2026/casual_homme/sneakers_cuir_caelum.png",
        gtawCmd: "/creerobjet goods 22000 1 Perseus Sneakers Caelum | Sneakers cuir blanc gaufré clé grecque médaillons or"
      },
      {
        id: "fall_ch_04",
        name: "Montre Squelette Émeraude Royale",
        category: "Horlogerie",
        materials: "Boîtier bicolore or et acier 316L, cadran squelette vert émeraude guilloché",
        price: 85000,
        priceStr: "85,000",
        description: "Garde-temps automatique squelette bicolore à rehaut vert émeraude.",
        atelierNote: "Mouvement manufacture suisse 72h de réserve.",
        image: "/assets/fall2026/casual_homme/montre_squelette_emeraude.png",
        gtawCmd: "/creerobjet goods 85000 1 Perseus Montre Emeraude | Montre squelette bicolore or acier cadran vert émeraude"
      }
    ]
  },
  {
    id: 'femme_sport',
    number: '05',
    gender: 'femme',
    style: 'sport',
    title: "L'Ensemble Atalante",
    subtitle: "Sweat court col V marine, short en tricot saphir & lunettes masque",
    season: "Automne 2026",
    packPrice: 55000,
    packPriceStr: "55,000",
    regularPrice: 61000,
    regularPriceStr: "61,000",
    modelImage: "/assets/fall2026/femme_sport/sweat_cropped_atalante.png",
    modelIsPhotoshoot: false,
    editorialQuote: "L'énergie athlétique sublimée par les codes de la haute couture. Du court de tennis privé de Richman aux promenades en bord de mer.",
    pieces: [
      {
        id: "fall_fs_01",
        name: "Sweat Cropped Col V Atalante",
        category: "Prêt-à-Porter",
        materials: "Molleton doux blanc crème, encolure en V bleu marine, bouton or gravé",
        price: 16000,
        priceStr: "16,000",
        description: "Sweat court oversize blanc crème à col V marine et bouton d'or.",
        atelierNote: "Coupe oversize élégante.",
        image: "/assets/fall2026/femme_sport/sweat_cropped_atalante.png",
        gtawCmd: "/creerobjet goods 16000 1 Perseus Sweat Atalante | Sweat cropped blanc col V bord-côte marine bouton or"
      },
      {
        id: "fall_fs_02",
        name: "Short Tricot Nausicaa",
        category: "Prêt-à-Porter",
        materials: "Tricot dense maille fine bleu saphir, taille haute liseré contrasté blanc",
        price: 12000,
        priceStr: "12,000",
        description: "Short taille haute en maille tricotée dense bleu marine et liseré blanc.",
        atelierNote: "Tricotage zéro frottement galbant.",
        image: "/assets/fall2026/femme_sport/short_tricot_nausicaa.png",
        gtawCmd: "/creerobjet goods 12000 1 Perseus Short Nausicaa | Short tricot maille texturée marine liseré blanc"
      },
      {
        id: "fall_fs_03",
        name: "Baskets Rétro Suède Olympia",
        category: "Souliers",
        materials: "Cuir blanc nappa, empiècements suède gris, semelle clé grecque",
        price: 18000,
        priceStr: "18,000",
        description: "Baskets légères cuir blanc et suède gris clair.",
        atelierNote: "Doublure microfibre ultra-confort.",
        image: "/assets/fall2026/femme_sport/baskets_retro_olympia.png",
        gtawCmd: "/creerobjet goods 18000 1 Perseus Sneakers Olympia | Baskets rétro cuir blanc et suède gris perle semelle grecque"
      },
      {
        id: "fall_fs_04",
        name: "Lunettes Masque Éos",
        category: "Accessoires",
        materials: "Mono-verre dégradé fumé UV400, monture aérodynamique noire, armoiries argent",
        price: 15000,
        priceStr: "15,000",
        description: "Lunettes de soleil masque mono-verre teinté noir dégradé.",
        atelierNote: "Protection totale UV400 catégorie 3.",
        image: "/assets/fall2026/femme_sport/lunettes_masque_eos.png",
        gtawCmd: "/creerobjet goods 15000 1 Perseus Lunettes Eos | Lunettes masque futuristes mono-verre fumé dégradé"
      }
    ]
  },
  {
    id: 'sport_homme',
    number: '06',
    gender: 'homme',
    style: 'sport',
    title: "L'Ensemble Bellator Sport",
    subtitle: "Hoodie molleton lourd cordons d'or, jogging à bandes & sneakers cage 3D",
    season: "Automne 2026",
    packPrice: 70000,
    packPriceStr: "70,000",
    regularPrice: 76000,
    regularPriceStr: "76,000",
    modelImage: "/assets/fall2026/sport_homme/hoodie_oversize_bellator.png",
    modelIsPhotoshoot: false,
    editorialQuote: "L'allure souveraine du gladiateur moderne. Noir carbone profond, bande écarlate et cage 3D aux motifs ancestraux.",
    pieces: [
      {
        id: "fall_sh_01",
        name: "Hoodie Oversize Bellator",
        category: "Prêt-à-Porter",
        materials: "Molleton lourd 480gsm noir minéral, cordons de serrage à embouts d'or ciselé",
        price: 18000,
        priceStr: "18,000",
        description: "Sweat à capuche oversize en coton lourd noir minéral et cordons d'or ciselé.",
        atelierNote: "Coton peigné dense déperlant.",
        image: "/assets/fall2026/sport_homme/hoodie_oversize_bellator.png",
        gtawCmd: "/creerobjet goods 18000 1 Perseus Hoodie Bellator | Hoodie oversize noir lourd cordons bijou or"
      },
      {
        id: "fall_sh_02",
        name: "Jogging Bandes Impériales Taras",
        category: "Prêt-à-Porter",
        materials: "Maille technique noire, bandes latérales rouge écarlate et liseré argent",
        price: 14000,
        priceStr: "14,000",
        description: "Pantalon de survêtement technique noir à bandes bicolores rouge et argent.",
        atelierNote: "Poches zippées invisibles.",
        image: "/assets/fall2026/sport_homme/jogging_satine_taras.png",
        gtawCmd: "/creerobjet goods 14000 1 Perseus Jogging Taras | Pantalon survêtement noir bandes rouge écarlate liseré argent"
      },
      {
        id: "fall_sh_03",
        name: "Sneakers Sculptées Cerbère",
        category: "Souliers",
        materials: "Mesh noir alvéolé, cage sculptée 3D clé grecque, inserts dorés",
        price: 28000,
        priceStr: "28,000",
        description: "Baskets techniques architecturales en mesh noir et cage sculptée 3D aux détails or.",
        atelierNote: "Semelle géométrique signature.",
        image: "/assets/fall2026/sport_homme/sneakers_sculptees_cerbere.png",
        gtawCmd: "/creerobjet goods 28000 1 Perseus Sneakers Cerbere | Baskets running sculptées noires mesh cage 3D or"
      },
      {
        id: "fall_sh_04",
        name: "Lunettes Biggie Perseus",
        category: "Accessoires",
        materials: "Acétate noir épais poli main, branches ajourées plaquées or 24K",
        price: 16000,
        priceStr: "16,000",
        description: "Lunettes de soleil rectangulaires en acétate noir épais et branches dorées ajourées.",
        atelierNote: "Branches massives plaquées or 24K.",
        image: "/assets/fall2026/sport_homme/lunettes_biggie_perseus.png",
        gtawCmd: "/creerobjet goods 16000 1 Perseus Lunettes Biggie | Lunettes soleil rectangulaires acétate noir branches or"
      }
    ]
  }
];

export default function FallCollectionPage() {
  const { addToCart, cartCount } = useCart();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  // ─── VERROUILLAGE COMING SOON POUR GARDER LA COLLECTION SECRÈTE ───
  const IS_COMING_SOON = true;

  if (IS_COMING_SOON) {
    return (
      <div className="relative w-full min-h-screen bg-[#0C0B0A] text-white flex flex-col justify-between select-none overflow-hidden">
        {/* Header Officiel Perseus */}
        <div className="sticky top-0 z-50 w-full h-20 bg-[#0C0B0A]/90 backdrop-blur-md border-b border-white/10">
          <Header theme="dark" />
        </div>

        {/* Background Artwork avec ambiance feutrée */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/campaign/perseus_fall_2026_background.png"
            alt="Perseus Fall Collection 2026"
            fill
            priority
            unoptimized
            quality={100}
            className="object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/70 to-[#0C0B0A]/85" />
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#C5A044]/15 rounded-full blur-[130px]" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#C5A044]/15 rounded-full blur-[130px]" />
        </div>

        {/* Écran Central Coming Soon */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center space-y-6 my-auto pt-16 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-[#C5A044]/50 bg-[#C5A044]/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A044] animate-pulse" />
              <span className="text-[9px] font-mont uppercase tracking-[0.4em] text-[#C5A044] font-bold">
                COMING SOON &middot; LANCEMENT PROCHAIN
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl uppercase tracking-[0.15em] text-white font-normal leading-tight">
              Fall Collection
            </h1>

            <p className="font-serif italic text-base sm:text-lg text-zinc-300">
              &ldquo;L&apos;Art du Style &middot; Automne 2026&rdquo;
            </p>

            <p className="font-mont text-xs text-zinc-400 font-light max-w-lg mx-auto leading-relaxed pt-2">
              L’accès au vestiaire d’atelier et aux six silhouettes de la collection est temporairement verrouillé.
              Dévoilement officiel très prochainement sur Portola Drive, Rockford Hills.
            </p>

            <div className="pt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-zinc-950 hover:bg-[#C5A044] transition-all duration-300 text-[10px] font-mont uppercase tracking-[0.25em] font-bold shadow-2xl cursor-pointer"
              >
                <ArrowLeft size={13} />
                <span>Retour à la Maison</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Footer discret */}
        <div className="relative z-10 w-full text-center pb-8 border-t border-white/10 pt-6">
          <p className="text-[9px] font-mont uppercase tracking-[0.3em] text-zinc-500">
            Maison Perseus &middot; Portola Drive &middot; Los Santos
          </p>
        </div>
      </div>
    );
  }

  const handleCopyCmd = (piece: CollectionPiece, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(piece.gtawCmd);
    setCopiedId(piece.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddPieceToCart = (piece: CollectionPiece, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const product: Product = {
      id: piece.id,
      file: piece.image.split('/').pop() || '',
      name: piece.name,
      cat: piece.category,
      price: piece.price,
      priceStr: piece.priceStr,
      size: 'Sur-Mesure',
      categoryAttr: 'fall-2026',
      collection: 'Fall Collection 2026',
      desc: piece.description,
    };
    addToCart(product);
    setAddedId(piece.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const handleAddPackToCart = (look: SilhouetteLook) => {
    look.pieces.forEach((piece) => {
      const product: Product = {
        id: piece.id,
        file: piece.image.split('/').pop() || '',
        name: `${piece.name} (${look.title})`,
        cat: piece.category,
        price: Math.round(piece.price * (look.packPrice / look.regularPrice)),
        priceStr: piece.priceStr,
        size: 'Sur-Mesure',
        categoryAttr: 'fall-2026',
        collection: 'Fall Collection 2026',
        desc: piece.description,
      };
      addToCart(product);
    });
    setAddedId(look.id);
    setTimeout(() => setAddedId(null), 2200);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#FAF8F5] text-zinc-950 select-none overflow-x-hidden selection:bg-[#C5A044] selection:text-white">
      
      {/* ─── 1. HEADER OFFICIEL SUR BANDEAU BLANC ÉPURÉ (IMPECCABLE, NET, AUCUNE COLLISION) ─── */}
      <div className="sticky top-0 z-50 w-full h-20 bg-[#FAF8F5] border-b border-zinc-200/80 shadow-xs">
        <Header theme="light" />
      </div>

      {/* ─── BOUTON FLOTTANT D'ACCÈS PERMANENT À L'ÉCRIN (PANIER) ─── */}
      <Link
        href="/panier"
        className="fixed bottom-8 right-8 z-50 bg-zinc-950/95 hover:bg-[#C5A044] text-white hover:text-black border border-zinc-800 hover:border-[#C5A044] backdrop-blur-md px-5 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.25)] transition-all duration-300 flex items-center gap-3 group cursor-pointer"
        title="Accéder à Mon Écrin"
      >
        <ShoppingBag className="w-4 h-4 text-[#C5A044] group-hover:text-black transition-colors" />
        <span className="font-mont text-[10px] uppercase tracking-[0.25em] font-bold">
          Mon Écrin
        </span>
        {cartCount > 0 && (
          <span className="bg-[#C5A044] group-hover:bg-black text-black group-hover:text-[#C5A044] font-mont text-[10px] font-bold px-2 py-0.5 rounded-full">
            {cartCount}
          </span>
        )}
      </Link>

      <section className="relative w-full aspect-[16/9] max-h-[82vh] min-h-[520px] bg-zinc-950 overflow-hidden">
        <Image
          src="/assets/campaign/perseus_fall_2026_background.png"
          alt="Perseus Fall Collection 2026"
          fill
          priority
          unoptimized
          quality={100}
          className="object-cover object-center"
        />
        {/* Dégradé discret au ras du bas sans empiéter sur le texte */}
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-b from-transparent to-[#FAF8F5]" />
      </section>

      {/* ─── 3. EN-TÊTE ÉDITORIAL DANS L'ESPACE BLANC ÉPURÉ HAUTE COUTURE ─── */}
      <section className="relative z-10 max-w-[1450px] mx-auto px-6 sm:px-12 lg:px-20 pt-4 pb-14 border-b border-zinc-200/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mont uppercase tracking-[0.45em] text-[#C5A044] font-bold block">
              DÉFILÉ AUTOMNE 2026 · PORTOLA DRIVE
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl uppercase tracking-[0.12em] text-zinc-950 font-normal">
              Six Silhouettes d&apos;Exception
            </h1>
            <p className="font-mont text-xs sm:text-sm text-zinc-600 font-light max-w-xl leading-relaxed">
              Faites défiler le défilé à la molette pour explorer chaque silhouette et son vestiaire d’atelier haute couture.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] font-mont uppercase tracking-[0.25em] font-semibold text-zinc-600 hover:text-[#C5A044] transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Retour à la Maison</span>
            </Link>
            <div className="flex items-center gap-2 text-[10px] font-mont uppercase tracking-[0.3em] text-[#C5A044]">
              <span>Défiler vers les silhouettes</span>
              <ChevronDown size={14} className="animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. LE DÉFILÉ DES SILHOUETTES EN ALTERNANCE GAUCHE / DROITE AU FIL DU SCROLL ─── */}
      <main className="relative z-10 max-w-[1450px] mx-auto px-6 sm:px-12 lg:px-20 py-20 space-y-36">
        {FALL_COLLECTION_LOOKS.map((look, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <motion.section
              key={look.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-zinc-200/80 pb-32 last:border-b-0"
            >
              {/* En-Tête de la Silhouette */}
              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3 mb-12">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-serif font-bold text-[#C5A044]">
                    SILHOUETTE 0{idx + 1}
                  </span>
                  <span className="text-zinc-300">·</span>
                  <span className="text-[10px] font-mont uppercase tracking-[0.25em] text-zinc-500 font-semibold">
                    {look.gender} · {look.style}
                  </span>
                </div>
                <span className="text-[10px] font-mont uppercase tracking-widest text-[#C5A044] font-bold">
                  Pack Complet : ${look.packPriceStr}
                </span>
              </div>

              {/* Contenu Alterné GAUCHE / DROITE */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                
                {/* ─── COLONNE A : MANNEQUIN / SILHOUETTE ENTIÈRE ─── */}
                <div className={`lg:col-span-5 space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-white border border-zinc-200/80 shadow-[0_15px_45px_rgba(0,0,0,0.06)] group">
                    <Image
                      src={look.modelImage}
                      alt={look.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className={`transition-transform duration-700 ease-out group-hover:scale-103 ${
                        look.modelIsPhotoshoot ? 'object-cover object-top' : 'object-contain p-10'
                      }`}
                      priority={idx < 2}
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-baseline justify-between">
                      <h2 className="font-serif text-3xl sm:text-4xl text-zinc-950 font-normal">
                        {look.title}
                      </h2>
                      <span className="font-mont text-sm font-bold text-[#C5A044]">
                        ${look.packPriceStr}
                      </span>
                    </div>

                    <p className="font-mont text-xs text-zinc-600 font-light leading-relaxed">
                      {look.subtitle}
                    </p>

                    <p className="font-serif italic text-xs text-zinc-700 border-l-2 border-[#C5A044] pl-3 py-1">
                      &ldquo;{look.editorialQuote}&rdquo;
                    </p>

                    <button
                      onClick={() => handleAddPackToCart(look)}
                      className={`w-full py-4 px-6 text-[10px] font-mont uppercase tracking-[0.25em] font-bold transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer mt-4 shadow-md ${
                        addedId === look.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-950 text-white hover:bg-[#C5A044] hover:text-black'
                      }`}
                    >
                      <ShoppingBag size={14} />
                      <span>{addedId === look.id ? 'Silhouette Ajoutée' : 'Acquérir la Silhouette Complète'}</span>
                    </button>
                  </div>
                </div>

                {/* ─── COLONNE B : LES 4 PIÈCES DU VESTIAIRE D'ATELIER ─── */}
                <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="border-b border-zinc-200/80 pb-2.5 flex items-baseline justify-between">
                    <span className="text-[10px] font-mont uppercase tracking-[0.3em] text-[#C5A044] font-bold">
                      Vestiaire d&apos;Atelier · 4 Créations
                    </span>
                    <span className="text-[9px] font-mont text-zinc-500 uppercase tracking-widest">
                      Commandes GTA:W
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-8 sm:gap-10">
                    {look.pieces.map((piece) => {
                      const isCopied = copiedId === piece.id;
                      const isAdded = addedId === piece.id;

                      return (
                        <div key={piece.id} className="group flex flex-col justify-between">
                          {/* Photo Studio qui flotte avec élégance sur blanc */}
                          <div className="relative aspect-square w-full flex items-center justify-center p-6 bg-white border border-zinc-200/60 hover:border-[#C5A044]/60 transition-all duration-500 shadow-[0_6px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(197,160,68,0.18)]">
                            <Image
                              src={piece.image}
                              alt={piece.name}
                              width={320}
                              height={320}
                              className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.10)] group-hover:scale-106 transition-transform duration-700 ease-out"
                              unoptimized
                            />

                            {/* Copie discrète de commande GTA:W dans le coin */}
                            <button
                              onClick={(e) => handleCopyCmd(piece, e)}
                              className="absolute top-2.5 right-2.5 p-1.5 bg-zinc-100 hover:bg-zinc-950 hover:text-white border border-zinc-200/80 text-zinc-600 transition-colors text-[8px] font-mono flex items-center gap-1 cursor-pointer shadow-xs"
                              title="Copier la commande GTA:W"
                            >
                              {isCopied ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                              <span className="hidden sm:inline font-mont uppercase tracking-widest">{isCopied ? 'Copié' : 'GTA:W'}</span>
                            </button>

                            {/* Bouton d'ajout au survol */}
                            <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={(e) => handleAddPieceToCart(piece, e)}
                                className={`w-full py-2.5 text-[8px] font-mont uppercase tracking-[0.25em] font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                                  isAdded ? 'bg-emerald-600 text-white' : 'bg-zinc-950 text-white hover:bg-[#C5A044] hover:text-black'
                                }`}
                              >
                                <ShoppingBag size={11} />
                                <span>{isAdded ? 'Ajouté' : 'Ajouter à l’Écrin'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Titre & Prix minimaliste */}
                          <div className="pt-3.5 space-y-1">
                            <h4 className="font-serif text-sm sm:text-base text-zinc-900 group-hover:text-[#C5A044] transition-colors leading-snug font-normal">
                              {piece.name}
                            </h4>
                            <p className="font-mont text-xs font-semibold text-[#C5A044] tracking-wider">
                              ${piece.priceStr}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.section>
          );
        })}
      </main>

      {/* Footer Perseus */}
      <Footer />

    </div>
  );
}
