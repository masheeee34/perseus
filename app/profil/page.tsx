'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LogOut,
  ArrowRight,
  ShieldCheck,
  Check,
  Users
} from 'lucide-react';
import PerseusAPI from '../../lib/api';
import { useWishlist } from '../../lib/contexts/WishlistContext';

const GTAW_CLIENT_ID = '40';
const REDIRECT_URI = 'https://perseusshopp.duckdns.org/oauth/callback';
const GTAW_OAUTH_URL = `https://ucp-fr.gta.world/oauth/authorize?client_id=${GTAW_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<string[]>([]);
  const [activeCharacter, setActiveCharacter] = useState<string>('');
  const { wishlist } = useWishlist();

  const refreshProfile = async () => {
    if (!PerseusAPI.isLoggedIn()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const u = await PerseusAPI.getProfile();
      setUser(u);

      let charList: string[] = [];
      if (Array.isArray(u.characters) && u.characters.length > 0) {
        charList = u.characters;
      } else if (u.character_name) {
        charList = [u.character_name];
      } else if (u.name) {
        charList = [u.name];
      }

      const stored = typeof window !== 'undefined' ? localStorage.getItem('perseus_character') : null;
      const active = (stored && charList.map(c => c.toLowerCase()).includes(stored.toLowerCase()))
        ? stored
        : (u.character_name || charList[0] || u.name || '');

      setCharacters(charList);
      setActiveCharacter(active);
    } catch (err) {
      const localU = PerseusAPI.getUser();
      if (localU) {
        setUser(localU);
        let charList: string[] = [];
        if (Array.isArray((localU as any).characters) && (localU as any).characters.length > 0) {
          charList = (localU as any).characters;
        } else if ((localU as any).character_name) {
          charList = [(localU as any).character_name];
        } else if (localU.name) {
          charList = [localU.name];
        }

        const stored = typeof window !== 'undefined' ? localStorage.getItem('perseus_character') : null;
        const active = (stored && charList.map(c => c.toLowerCase()).includes(stored.toLowerCase()))
          ? stored
          : ((localU as any).character_name || charList[0] || localU.name || '');

        setCharacters(charList);
        setActiveCharacter(active);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const handleSelectCharacter = async (charName: string) => {
    const trimmed = charName.trim();
    if (!trimmed) return;

    setActiveCharacter(trimmed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('perseus_character', trimmed);
    }

    const updatedUser = {
      ...user,
      name: trimmed,
      character_name: trimmed,
    };
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('perseus_user', JSON.stringify(updatedUser));
    }

    try {
      await PerseusAPI.updateProfile({ name: trimmed, character_name: trimmed } as any);
    } catch (err) {
      console.warn('Could not update character on server', err);
    }
  };

  const handleLogout = () => {
    PerseusAPI.logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('perseus_character');
    }
    setUser(null);
    setActiveCharacter('');
    setCharacters([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 pt-40 pb-36 text-center">
        <div className="w-8 h-8 border-2 border-[#C5A044] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mont text-xs uppercase tracking-widest text-zinc-500 font-medium">
          Accès aux Salons Privés...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 pt-36 pb-36 px-6 sm:px-12 lg:px-20 font-mont">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* CAS 1 : UTILISATEUR CONNECTÉ */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 relative"
          >
            {/* Header Profil Épuré */}
            <div className="border-b border-zinc-200 pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mont uppercase tracking-[0.35em] text-[#C5A044] font-bold">
                    Salon Privé · Portola Drive
                  </span>
                  <span className="text-zinc-300">/</span>
                  <span className="text-[10px] font-mont uppercase tracking-[0.25em] text-zinc-500">
                    Compte GTA:World
                  </span>
                </div>
                
                {/* Nom du Personnage Actif */}
                <h1 className="font-serif text-4xl sm:text-6xl text-zinc-950 uppercase tracking-tight font-normal">
                  {activeCharacter || user.character_name || user.name || 'Personnage Inconnu'}
                </h1>
                
                <p className="font-mont text-xs text-zinc-400 font-light">
                  {user.email} · Los Santos
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-2.5">
                {user.ucp_username && (
                  <span className="text-xs font-mont font-medium px-3.5 py-1.5 rounded-full bg-zinc-200/60 text-zinc-700">
                    Compte UCP : <strong className="text-zinc-950 font-bold">{user.ucp_username}</strong>
                  </span>
                )}
                <div className="flex items-center gap-5 pt-1">
                  {characters.length > 1 && (
                    <Link
                      href="/select-character"
                      className="inline-flex items-center gap-1.5 text-xs font-mont uppercase tracking-[0.2em] font-semibold text-zinc-600 hover:text-[#C5A044] transition-colors border-b border-transparent hover:border-[#C5A044] pb-0.5"
                    >
                      <Users className="w-3.5 h-3.5 text-[#C5A044]" />
                      <span>Changer de personnage</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 text-xs font-mont uppercase tracking-[0.2em] font-medium text-zinc-400 hover:text-zinc-950 transition-colors border-b border-transparent hover:border-zinc-950 pb-0.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Section 1 : Privilèges & Rang Client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-2">
              <div className="space-y-4 border-l border-zinc-200 pl-6 sm:pl-8">
                <span className="font-mont text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-semibold block">
                  Statut &amp; Rang
                </span>
                <p className="font-serif text-2xl sm:text-3xl text-zinc-950 uppercase">
                  {user.vip_level ? `Rang ${user.vip_level}` : 'Client Privilège'}
                </p>
                <p className="font-serif italic text-zinc-600 text-sm sm:text-base leading-relaxed font-light">
                  Accès prioritaire aux nouvelles créations d&apos;atelier et invitations aux réceptions privées de la Maison.
                </p>
              </div>

              <div className="space-y-4 border-l border-zinc-200 pl-6 sm:pl-8">
                <span className="font-mont text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-semibold block">
                  Fidélité d&apos;Atelier
                </span>
                <p className="font-serif text-2xl sm:text-3xl text-zinc-950">
                  {user.loyalty_points || 1250} <span className="font-mont text-xs text-zinc-400 tracking-widest font-normal uppercase">Points de Prestige</span>
                </p>
                <p className="font-serif italic text-zinc-600 text-sm sm:text-base leading-relaxed font-light">
                  Cumulés sur vos commandes sécurisées Fleeca Bank et utilisables pour vos créations sur-mesure.
                </p>
              </div>
            </div>

            {/* Section 2 : Mes Acquisitions Récentes */}
            <div className="pt-8 border-t border-zinc-200 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mont text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-semibold block">
                    Historique des Commandes
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl uppercase text-zinc-950 mt-1">
                    Acquisitions Récentes
                  </h2>
                </div>

                <Link
                  href="/boutique"
                  className="font-mont text-xs uppercase tracking-wider text-[#C5A044] font-bold hover:underline"
                >
                  Boutique en ligne →
                </Link>
              </div>

              {user.orders && user.orders.length > 0 ? (
                <div className="space-y-4">
                  {user.orders.map((ord: any) => (
                    <div key={ord.id} className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xs">
                      <div>
                        <p className="font-mont text-xs uppercase tracking-wider font-bold text-zinc-950">Commande #{ord.id.slice(0, 8)}</p>
                        <p className="font-mont text-xs text-zinc-500 mt-1">{ord.address || 'Portola Drive, Los Santos'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-lg text-zinc-950 font-bold">${ord.total?.toLocaleString('en-US')}</p>
                        <span className="text-[10px] font-mont uppercase tracking-widest text-emerald-600 font-bold">{ord.status || 'Confirmée'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 border border-dashed border-zinc-300 rounded-2xl text-center space-y-4 px-6 bg-white/50">
                  <p className="font-serif italic text-zinc-600 text-base sm:text-lg max-w-md mx-auto">
                    Votre coffre d&apos;atelier est actuellement vide. Vos futures acquisitions sur Portola Drive seront répertoriées ici avec leur certificat d&apos;authenticité.
                  </p>
                  <Link
                    href="/boutique"
                    className="inline-flex items-center gap-2 font-mont text-xs uppercase tracking-[0.2em] font-bold text-zinc-950 hover:text-[#C5A044] transition-colors pt-2"
                  >
                    <span>Explorer les collections</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Section 3 : Pièces Sauvegardées */}
            <div className="pt-8 border-t border-zinc-200 space-y-8">
              <div>
                <span className="font-mont text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-semibold block">
                  Sélection Personnelle
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl uppercase text-zinc-950 mt-1">
                  Pièces Favorites ({wishlist.length})
                </h2>
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {wishlist.map((item) => (
                    <Link
                      key={item.id}
                      href={`/produit/${item.id}`}
                      className="group flex flex-col"
                    >
                      <div className="relative aspect-square w-full bg-white border border-zinc-200/80 rounded-2xl p-4 flex items-center justify-center overflow-hidden group-hover:border-zinc-400 transition-colors shadow-2xs">
                        <Image
                          src={item.imageUrl || '/placeholder.png'}
                          alt={item.name}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="font-serif text-sm text-zinc-900 mt-3 group-hover:text-[#C5A044] transition-colors line-clamp-1 uppercase">
                        {item.name}
                      </h3>
                      <span className="font-mont text-xs text-zinc-950 font-bold mt-1">
                        ${item.priceStr || item.price?.toLocaleString('en-US')}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="font-serif italic text-zinc-500 text-sm">
                  Aucune pièce sauvegardée pour le moment.
                </p>
              )}
            </div>

          </motion.div>
        ) : (
          /* CAS 2 : NON CONNECTÉ */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center space-y-10"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-14 h-14 relative opacity-80 mb-2">
                <Image
                  src="/assets/logo/perseus_official.png"
                  alt="Maison Perseus"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-mont text-[10px] uppercase tracking-[0.4em] text-[#C5A044] font-bold">
                Maison Perseus · Portola Drive
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl font-normal text-zinc-950 uppercase tracking-tight">
                Salon Privé
              </h1>
            </div>

            <div className="space-y-8 max-w-md mx-auto">
              <p className="font-serif italic text-zinc-600 text-lg leading-relaxed font-light">
                Connectez votre personnage GTA:World pour accéder à votre coffre d&apos;atelier et suivre vos privilèges VIP.
              </p>

              <div className="space-y-4">
                <a
                  href={GTAW_OAUTH_URL}
                  className="inline-flex items-center justify-center gap-3 w-full py-5 px-10 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont text-xs uppercase tracking-[0.28em] font-bold shadow-xl transition-all duration-300 rounded-xl"
                >
                  <span>Accéder via GTA:World UCP</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <p className="text-[10px] font-mont uppercase tracking-[0.25em] text-zinc-400 font-light pt-2">
                  Authentification Officielle Sécurisée · Aucun mot de passe requis
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
