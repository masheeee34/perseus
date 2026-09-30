'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  Loader2, 
  User, 
  MapPin, 
  CreditCard, 
  Phone, 
  Lock, 
  UserCheck, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../lib/contexts/CartContext';
import PerseusAPI from '../../lib/api';

const GTAW_CLIENT_ID = '40';
const REDIRECT_URI = 'https://perseusshopp.duckdns.org/oauth/callback';
const GTAW_OAUTH_URL = `https://ucp-fr.gta.world/oauth/authorize?client_id=${GTAW_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;

const LOS_SANTOS_STREETS = [
  { street: 'Bay City Avenue', district: 'Del Perro' },
  { street: 'Portola Drive', district: 'Rockford Hills' },
  { street: 'Rockford Drive', district: 'Rockford Hills' },
  { street: 'South Rockford Drive', district: 'Rockford Hills' },
  { street: 'Eclipse Boulevard', district: 'West Vinewood' },
  { street: 'West Eclipse Boulevard', district: 'Richman' },
  { street: 'Vinewood Boulevard', district: 'Downtown Vinewood' },
  { street: 'Spanish Avenue', district: 'West Vinewood' },
  { street: 'Boulevard Del Perro', district: 'Del Perro' },
  { street: 'Marathon Avenue', district: 'Del Perro' },
  { street: 'Prosperity Street', district: 'Morningwood' },
  { street: 'Morningwood Boulevard', district: 'Morningwood' },
  { street: 'Cougar Avenue', district: 'Morningwood' },
  { street: 'San Andreas Avenue', district: 'Pillbox Hill' },
  { street: 'Vespucci Boulevard', district: 'Vespucci' },
  { street: 'Magellan Avenue', district: 'Vespucci Beach' },
  { street: 'Playa Vista', district: 'Vespucci Canals' },
  { street: 'Aguja Street', district: 'Vespucci Canals' },
  { street: 'Tug Street', district: 'Vespucci Canals' },
  { street: 'Milton Road', district: 'Vinewood Hills' },
  { street: 'South Mo Milton Drive', district: 'Vinewood Hills' },
  { street: 'Kimble Hill Drive', district: 'Vinewood Hills' },
  { street: 'Richman Street', district: 'Richman' },
  { street: 'Mad Wayne Thunder Drive', district: 'Rockford Hills' },
  { street: 'Dunstable Lane', district: 'Rockford Hills' },
  { street: 'Heritage Way', district: 'Rockford Hills' },
  { street: 'Caesar Place', district: 'Rockford Hills' },
  { street: 'Picture Perfect Way', district: 'Rockford Hills' },
  { street: 'Innocence Boulevard', district: 'Strawberry' },
  { street: 'Elgin Avenue', district: 'Pillbox Hill' },
  { street: 'Alta Street', district: 'Downtown' },
  { street: 'Power Street', district: 'Downtown' },
  { street: 'Meteor Street', district: 'Hawick' },
  { street: 'Hawick Avenue', district: 'Hawick' },
  { street: 'Clinton Avenue', district: 'Downtown Vinewood' },
  { street: 'Steele Way', district: 'Vinewood Hills' },
  { street: 'Normandy Drive', district: 'Richman' },
  { street: 'Palomino Avenue', district: 'Little Seoul' },
  { street: 'Calais Avenue', district: 'Little Seoul' },
  { street: 'Lindsay Circus', district: 'Little Seoul' },
  { street: 'Carson Avenue', district: 'Davis' },
  { street: 'Grove Street', district: 'Davis' },
  { street: 'Forum Drive', district: 'Chamberlain Hills' },
  { street: 'Mirror Park Boulevard', district: 'Mirror Park' },
  { street: 'Nikola Avenue', district: 'Mirror Park' },
  { street: 'El Rancho Boulevard', district: 'East Los Santos' }
];

export default function CheckoutPage() {
  const handleUcpLogin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('perseus_auth_redirect', '/checkout');
    }
    window.location.href = `${GTAW_OAUTH_URL}&state=${encodeURIComponent('/checkout')}`;
  };

  const { cart, clearCart } = useCart();

  const [characterName, setCharacterName] = useState('');
  const [characters, setCharacters] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const addressRef = useRef<HTMLDivElement>(null);

  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const initUser = async () => {
      if (PerseusAPI.isLoggedIn()) {
        try {
          const profile = await PerseusAPI.getProfile();
          setLoggedInUser(profile);
          let charList: string[] = [];
          if (Array.isArray(profile.characters) && profile.characters.length > 0) {
            charList = profile.characters;
          } else if (profile.character_name) {
            charList = [profile.character_name];
          } else if (profile.name) {
            charList = [profile.name];
          }
          setCharacters(charList);

          const stored = typeof window !== 'undefined' ? localStorage.getItem('perseus_character') : null;
          const active = (stored && charList.map(c => c.toLowerCase()).includes(stored.toLowerCase()))
            ? stored
            : (profile.character_name || charList[0] || profile.name || '');
          setCharacterName(active);
        } catch (e) {
          const u = PerseusAPI.getUser();
          if (u) {
            setLoggedInUser(u);
            let charList: string[] = [];
            if (Array.isArray((u as any).characters) && (u as any).characters.length > 0) {
              charList = (u as any).characters;
            } else if ((u as any).character_name) {
              charList = [(u as any).character_name];
            } else if (u.name) {
              charList = [u.name];
            }
            setCharacters(charList);
            const stored = typeof window !== 'undefined' ? localStorage.getItem('perseus_character') : null;
            const active = (stored && charList.map(c => c.toLowerCase()).includes(stored.toLowerCase()))
              ? stored
              : ((u as any).character_name || charList[0] || u.name || '');
            setCharacterName(active);
          }
        }
      }
    };
    initUser();
  }, []);

  const handleSelectCharacter = async (char: string) => {
    const trimmed = char.trim();
    if (!trimmed) return;
    setCharacterName(trimmed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('perseus_character', trimmed);
      if (loggedInUser) {
        const updated = { ...loggedInUser, character_name: trimmed, name: trimmed };
        setLoggedInUser(updated);
        localStorage.setItem('perseus_user', JSON.stringify(updated));
      }
    }
    try {
      await PerseusAPI.updateProfile({ name: trimmed, character_name: trimmed } as any);
    } catch (err) {
      console.warn('Could not update profile character', err);
    }
  };

  const handleAddressChange = (val: string) => {
    setAddress(val);
    if (!val || val.trim().length < 2) {
      setAddressSuggestions([]);
      setShowAddressDropdown(false);
      return;
    }

    const cleanInput = val.toLowerCase().trim();
    const numberMatch = val.match(/^(\d+)\s*(.*)/);
    const numPrefix = numberMatch ? numberMatch[1] + ' ' : '';
    const searchPart = numberMatch ? numberMatch[2].toLowerCase().trim() : cleanInput;

    const matches = LOS_SANTOS_STREETS.filter(s => 
      s.street.toLowerCase().includes(searchPart) || s.district.toLowerCase().includes(searchPart)
    ).slice(0, 5).map(s => `${numPrefix || '101 '}${s.street}, ${s.district}, Los Santos`);

    setAddressSuggestions(matches);
    setShowAddressDropdown(matches.length > 0);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (addressRef.current && !addressRef.current.contains(e.target as Node)) {
        setShowAddressDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'PERSEUS-EXCLUSIVE' || coupon.trim().toUpperCase() === 'VIP10') {
      setDiscount(Math.floor(subtotal * 0.1));
      setError('');
    } else if (coupon.trim()) {
      setError('Code privilège non valide ou expiré.');
    }
  };

  const handleProcessPayment = async () => {
    if (!loggedInUser) {
      setError('Veuillez vous connecter avec votre compte GTA:World UCP pour finaliser la commande.');
      return;
    }
    if (!characterName.trim()) {
      setError('Erreur d\'identification : aucun personnage lié à votre compte UCP.');
      return;
    }
    if (!phone.trim()) {
      setError('Veuillez renseigner votre numéro de téléphone in-game à Los Santos (Ex: 555-0192).');
      return;
    }
    if (!address.trim()) {
      setError('Veuillez renseigner votre adresse de livraison in-game à Los Santos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          characterName: characterName.trim(),
          discordEmail: loggedInUser?.email || `${characterName.trim().toLowerCase().replace(/\s+/g, '.')}@ucp.gta.world`,
          phone: phone.trim(),
          address: address.trim(),
          description: `Acquisition Perseus Joaillerie (${characterName.trim()})`,
          items: cart,
        }),
      });

      const data = await res.json();

      if (res.ok && data.payment_link) {
        clearCart();
        window.location.href = data.payment_link;
      } else {
        setError(data.error || 'Impossible de générer la passerelle de paiement bancaire.');
        setLoading(false);
      }
    } catch (err: any) {
      setError('Une erreur de communication est survenue avec les services financiers.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 pt-40 pb-36 px-6 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <p className="font-mont uppercase tracking-[0.3em] text-[#C5A044] text-xs font-semibold">Votre Écrin est Vide</p>
          <h1 className="font-serif text-4xl text-zinc-900 uppercase">Aucune pièce sélectionnée</h1>
          <p className="text-zinc-600 font-mont text-sm leading-relaxed">
            Parcourez nos collections pour sélectionner vos créations d&apos;exception.
          </p>
          <Link
            href="/boutique"
            className="inline-block px-10 py-4 bg-zinc-950 text-white font-mont text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#C5A044] transition-colors rounded-xl shadow-md"
          >
            Explorer le catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-zinc-900 antialiased pt-36 pb-36 px-4 sm:px-8 lg:px-16 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text',sans-serif]">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Titre */}
        <div className="flex items-center justify-between mb-10 border-b border-zinc-200/80 pb-6">
          <Link
            href="/panier"
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950 text-xs font-mont uppercase tracking-[0.25em] font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l&apos;écrin</span>
          </Link>

          <span className="font-mont text-xs uppercase tracking-[0.25em] text-[#C5A044] font-bold">
            Acquisition Sécurisée
          </span>
        </div>

        {/* GTA:World Roleplay Disclaimer Banner */}
        <div className="mb-10 p-5 bg-white border border-[#C5A044]/40 rounded-2xl shadow-sm flex items-start gap-4">
          <Info className="w-5 h-5 text-[#C5A044] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-mont text-xs uppercase tracking-[0.2em] text-[#9A7B2F] font-bold">
              (( Plateforme Roleplay GTA:World France ))
            </p>
            <p className="font-mont text-xs sm:text-sm text-zinc-700 leading-relaxed">
              Ce site web est une vitrine commerciale fictive pour l&apos;univers de jeu GTA:World. Toutes les transactions financières s&apos;effectuent exclusivement avec les dollars virtuels de votre compte bancaire en jeu (Fleeca Bank).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">

          {/* Formulaire Principal (Gauche) */}
          <div className="lg:col-span-7 space-y-10">

            {/* Identité & Coordonnées */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-7 sm:p-10 shadow-[0_2px_20px_rgba(0,0,0,0.02)] space-y-8">
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mont uppercase tracking-[0.3em] text-[#C5A044] font-bold">
                    Étape 01 · Identification UCP
                  </span>
                  <h2 className="font-serif text-3xl text-zinc-900 uppercase font-normal mt-1">
                    Coordonnées d&apos;acquisition
                  </h2>
                </div>

                {loggedInUser && (
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-mont uppercase tracking-wider font-semibold flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> {characterName || loggedInUser.name}
                  </span>
                )}
              </div>

              {/* Si NON connecté : Bloc d'obligation UCP */}
              {!loggedInUser ? (
                <div className="p-8 bg-[#FAF8F5] border-2 border-[#C5A044]/60 rounded-2xl text-center space-y-6">
                  <div className="w-14 h-14 bg-zinc-950 text-[#C5A044] rounded-2xl flex items-center justify-center mx-auto shadow-md">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div className="space-y-2 max-w-lg mx-auto">
                    <h3 className="font-serif text-2xl sm:text-3xl uppercase text-zinc-950 font-normal">
                      Connexion UCP Requise
                    </h3>
                    <p className="font-mont text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      Pour commander auprès de la Maison Perseus et autoriser le prélèvement bancaire Fleeca Bank in-game, vous devez être authentifié avec votre compte <strong>GTA:World UCP</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUcpLogin}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4.5 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont text-xs uppercase tracking-[0.25em] font-bold rounded-xl shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <span>Se connecter avec GTA:World UCP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] font-mont uppercase tracking-widest text-zinc-400">
                    Authentification sécurisée officielle GTA:World France
                  </p>
                </div>
              ) : (
                /* Si CONNECTÉ : Formulaire avec Nom/Prénom bloqué et saisie du téléphone et adresse */
                <div className="space-y-7">
                  
                  {/* Badge Compte Connecté */}
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                    <p className="font-mont text-xs text-emerald-900 leading-relaxed font-medium">
                      Compte UCP connecté : <strong>{characterName || loggedInUser.name}</strong>. Vos coordonnées bancaires Fleeca Bank sont synchronisées.
                    </p>
                  </div>

                  {/* Choix du Personnage GTA:World */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="font-mont text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-900 font-bold">
                        Personnage Acheteur (Fleeca Bank)
                      </label>
                      <span className="text-[10px] font-mont uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1 bg-zinc-200/70 px-2.5 py-1 rounded-md">
                        <Lock className="w-3 h-3 text-[#C5A044]" /> (( Synchronisé UCP ))
                      </span>
                    </div>

                    {characters.length > 1 ? (
                      <div className="space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {characters.map((char) => {
                            const isCurrent = char.toLowerCase() === (characterName || '').toLowerCase();
                            return (
                              <button
                                key={char}
                                type="button"
                                onClick={() => handleSelectCharacter(char)}
                                className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                  isCurrent
                                    ? 'bg-zinc-950 text-white border-zinc-950 shadow-md ring-2 ring-[#C5A044]/50'
                                    : 'bg-[#FAF8F5] text-zinc-900 border-zinc-200 hover:border-zinc-400 hover:bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-serif font-bold ${
                                    isCurrent ? 'bg-white/10 text-[#C5A044] border border-white/20' : 'bg-white text-zinc-800 border border-zinc-200'
                                  }`}>
                                    {char.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-serif text-sm font-semibold uppercase">{char}</p>
                                    <p className={`text-[10px] font-mont uppercase tracking-wider ${
                                      isCurrent ? 'text-[#C5A044]' : 'text-zinc-400'
                                    }`}>
                                      {isCurrent ? 'Profil actif' : 'Choisir ce profil'}
                                    </p>
                                  </div>
                                </div>
                                {isCurrent ? (
                                  <span className="px-2.5 py-1 rounded-full bg-[#C5A044]/20 text-[#C5A044] text-[10px] font-bold uppercase tracking-wider">
                                    Actif
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-white border border-zinc-200 text-zinc-600 text-[10px] font-semibold uppercase tracking-wider">
                                    Sélectionner
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-[11px] font-mont text-zinc-500 mt-1">
                          Sélectionnez le personnage avec lequel effectuer la commande et le débit bancaire Fleeca Bank.
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          value={characterName}
                          readOnly
                          disabled
                          className="w-full bg-zinc-100/90 border border-zinc-300 text-zinc-800 text-base px-5 py-4 rounded-xl font-mont font-semibold cursor-not-allowed shadow-inner"
                        />
                        <UserCheck className="w-5 h-5 text-emerald-600 absolute right-5 top-1/2 -translate-y-1/2" />
                      </div>
                    )}
                  </div>

                  {/* Numéro Los Santos & Adresse de Livraison (Obligatoires) */}
                  <div className="space-y-6">
                    
                    {/* Numéro in-game */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="font-mont text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-900 font-bold">
                          Numéro de Téléphone Los Santos *
                        </label>
                        <span className="text-[10px] font-mont uppercase text-[#C5A044] font-semibold tracking-wider">
                          (( Contact In-Game ))
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Ex: 555-0192 ou 849201"
                          required
                          className="w-full bg-[#FAF8F5] border border-zinc-300 focus:border-[#C5A044] focus:bg-white text-zinc-900 text-base px-5 py-4 rounded-xl outline-none transition-all font-mont shadow-inner font-medium placeholder:text-zinc-400"
                        />
                        <Phone className="w-5 h-5 text-zinc-400 absolute right-5 top-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-[11px] font-mont text-zinc-400 mt-1.5">
                        Numéro utilisé par notre coursier sécurisé pour vous contacter en jeu lors de la livraison.
                      </p>
                    </div>

                    {/* Adresse de Livraison */}
                    <div className="relative" ref={addressRef}>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="font-mont text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-900 font-bold">
                          Adresse de Livraison à Los Santos *
                        </label>
                        <span className="text-[10px] font-mont uppercase text-zinc-400 font-semibold tracking-wider">
                          Auto-complétion rues
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => handleAddressChange(e.target.value)}
                          onFocus={() => {
                            if (addressSuggestions.length > 0) setShowAddressDropdown(true);
                          }}
                          placeholder="Ex: 101 Portola Drive, Rockford Hills"
                          required
                          className="w-full bg-[#FAF8F5] border border-zinc-300 focus:border-[#C5A044] focus:bg-white text-zinc-900 text-base px-5 py-4 rounded-xl outline-none transition-all font-mont shadow-inner font-medium placeholder:text-zinc-400"
                        />
                        <MapPin className="w-5 h-5 text-zinc-400 absolute right-5 top-1/2 -translate-y-1/2" />
                      </div>

                      {/* Dropdown suggestions */}
                      {showAddressDropdown && addressSuggestions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-zinc-100">
                          {addressSuggestions.map((sug, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setAddress(sug);
                                setShowAddressDropdown(false);
                              }}
                              className="w-full text-left px-5 py-3 hover:bg-[#FAF8F5] text-xs font-mont text-zinc-800 transition-colors flex items-center gap-2.5"
                            >
                              <MapPin className="w-3.5 h-3.5 text-[#C5A044] flex-shrink-0" />
                              <span>{sug}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-[11px] font-mont text-zinc-400 mt-1.5">
                        Adresse de votre propriété, entreprise ou point de rendez-vous sécurisé in-game.
                      </p>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Méthode de Paiement Sécurisée (Étape 02 - Uniquement visible si connecté) */}
            {loggedInUser && (
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-7 sm:p-10 shadow-[0_2px_20px_rgba(0,0,0,0.02)] space-y-8">
                
                <div>
                  <span className="text-xs font-mont uppercase tracking-[0.3em] text-[#C5A044] font-bold">
                    Étape 02 · Règlement
                  </span>
                  <h2 className="font-serif text-3xl text-zinc-900 uppercase font-normal mt-1">
                    Passerelle Financière
                  </h2>
                </div>

                {/* Option Bancaire Unique */}
                <div className="p-6 rounded-2xl border-2 border-[#C5A044] bg-[#FAF8F5] shadow-sm flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <CreditCard className="w-6 h-6 text-[#C5A044]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mont text-sm sm:text-base font-bold uppercase tracking-wider text-zinc-950">
                        Paiement Bancaire Sécurisé (Fleeca Bank)
                      </span>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-mont font-bold uppercase tracking-wider rounded-md">
                        Instantané &amp; Sécurisé
                      </span>
                    </div>
                    <p className="text-sm font-mont text-zinc-600 mt-2 leading-relaxed">
                      Le montant de <strong>${total.toLocaleString('en-US')}</strong> sera prélevé de manière transparente et sécurisée sur votre compte bancaire Fleeca Bank in-game lors de la validation.
                    </p>
                  </div>
                </div>

                {/* Code Privilège */}
                <div>
                  <label className="block font-mont text-xs sm:text-sm uppercase tracking-[0.2em] text-zinc-900 font-bold mb-2.5">
                    Code Privilège / Réduction VIP
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Ex: VIP10"
                      className="flex-1 bg-[#FAF8F5] border border-zinc-300 focus:border-[#C5A044] text-zinc-900 text-sm px-5 py-3.5 rounded-xl outline-none font-mont uppercase shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-8 py-3.5 bg-zinc-900 hover:bg-[#C5A044] text-white font-mont text-xs uppercase tracking-[0.2em] font-bold rounded-xl transition-all shadow-sm"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>

                {/* Erreur éventuelle */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-mont font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Bouton de Validation */}
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={loading}
                  className="w-full py-5 bg-zinc-950 hover:bg-[#C5A044] text-white font-mont text-sm uppercase tracking-[0.25em] font-bold rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-[#C5A044]" />
                      <span>Traitement bancaire sécurisé...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#C5A044]" />
                      <span>Payer via Fleeca Bank (${total.toLocaleString('en-US')})</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-zinc-400 font-mont text-center uppercase tracking-widest">
                  En confirmant, vous acceptez les <Link href="/cgv" className="text-[#C5A044] underline hover:text-zinc-900 font-semibold">Conditions Générales de Vente GTA:World</Link>.
                </p>

              </div>
            )}

          </div>

          {/* Récapitulatif (Droite) */}
          <div className="lg:col-span-5">
            <div className="sticky top-36 bg-white border border-zinc-200/90 rounded-2xl p-7 sm:p-10 shadow-[0_2px_20px_rgba(0,0,0,0.02)] space-y-6">
              
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <h3 className="font-serif text-2xl uppercase tracking-wider text-zinc-900">
                  Votre Sélection
                </h3>
                <span className="font-mont text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                  {cart.length} création{cart.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Liste des Pièces */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-2 border-b border-zinc-50 last:border-none">
                    <div className="w-16 h-16 bg-[#FAF8F5] border border-zinc-200 rounded-xl relative overflow-hidden flex items-center justify-center flex-shrink-0 p-1">
                      <Image
                        src={`/assets/bijoux/trier/${item.file}`}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        unoptimized={true}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-base text-zinc-900 uppercase truncate font-normal">
                        {item.name}
                      </p>
                      <p className="font-mont text-xs uppercase tracking-wider text-[#C5A044] font-medium">
                        {item.cat} · Qté: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mont text-sm text-zinc-900 font-bold">
                      ${(item.price * item.quantity).toLocaleString('en-US')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calcul Total */}
              <div className="space-y-3 pt-4 border-t border-zinc-100 font-mont text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Sous-total</span>
                  <span className="font-semibold text-zinc-900">${subtotal.toLocaleString('en-US')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Remise Privilège (10%)</span>
                    <span>-${discount.toLocaleString('en-US')}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600">
                  <span>Livraison Sécurisée (Portola Drive)</span>
                  <span className="text-[#C5A044] uppercase font-bold text-xs">Offerte</span>
                </div>
                <div className="flex justify-between text-lg font-serif text-zinc-950 pt-4 border-t border-zinc-200 uppercase">
                  <span>Montant Total</span>
                  <span className="text-[#C5A044] font-mont text-xl font-bold">
                    ${total.toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-zinc-200/80 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C5A044] flex-shrink-0" />
                <p className="font-mont text-xs text-zinc-700 leading-relaxed uppercase tracking-wider font-medium">
                  Transactions certifiées par la passerelle bancaire Fleeca Bank V2.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
