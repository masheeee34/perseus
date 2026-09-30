'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Gem, Sparkles, ShoppingBag, MapPin, Search, X, 
  ChevronRight, ChevronLeft, Plus, Minus, Trash2, Check, 
  Clock, ShieldCheck, ArrowRight, Heart, Share2,
  Menu, SlidersHorizontal, ArrowUpDown, Award, Crown,
  User as UserIcon, LogOut, CheckCircle2, Edit3, UserCheck, Users
} from 'lucide-react';
import { useCart } from '../../lib/contexts/CartContext';
import { PerseusCatalog } from '../../lib/catalog';
import { Product } from '../../lib/types';
import PerseusAPI from '../../lib/api';

// Editorial campaign data (Haute Joaillerie Pure)
const HERO_CAMPAIGN = {
  title: 'COLLECTION JOAILLERIE',
  subtitle: 'ÉDITION 2026',
  headline: 'HAUTE JOAILLERIE',
  description: 'Créations d’exception en or 18 carats et diamants certifiés.',
  image: '/assets/campaign/perseus_fall_2026_duo.png',
  ctaText: 'DÉCOUVRIR'
};

// Circular categories (style Versace / joaillerie)
const CIRCULAR_CATEGORIES = [
  { id: 'cat-bagues', label: 'Bagues', img: '/assets/bijoux/trier/EZQLEW1.png', fallbackIcon: Gem },
  { id: 'cat-colliers', label: 'Colliers', img: '/assets/bijoux/trier/kzIvu6w.png', fallbackIcon: Sparkles },
  { id: 'cat-montres', label: 'Montres', img: '/assets/bijoux/trier/c0UpA45.png', fallbackIcon: Clock },
  { id: 'cat-bracelets', label: 'Bracelets', img: '/assets/bijoux/trier/94O9KYF.png', fallbackIcon: Crown },
  { id: 'cat-grillz', label: 'Sur-Mesure', img: '/assets/bijoux/trier/mtQuK6Z.png', fallbackIcon: ShieldCheck },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'Toutes les créations' },
  { id: 'cat-bagues', label: 'Bagues' },
  { id: 'cat-colliers', label: 'Colliers & Pendentifs' },
  { id: 'cat-montres', label: 'Haute Horlogerie' },
  { id: 'cat-bracelets', label: 'Bracelets' },
  { id: 'cat-grillz', label: 'Créations sur-mesure' },
];

// Métaux précieux certifiés
const METALS = {
  or_jaune: {
    id: 'or_jaune',
    name: 'Or Jaune 18 carats',
    subtitle: 'Alliage d’or 750‰ jaune finition polie miroir',
    colorHex: '#D4AF37',
  },
  or_blanc: {
    id: 'or_blanc',
    name: 'Or Blanc 18 carats',
    subtitle: 'Or blanc 750‰ rhodié, éclat pur et brillant',
    colorHex: '#E5E7EB',
  },
  or_rose: {
    id: 'or_rose',
    name: 'Or Rose 18 carats',
    subtitle: 'Alliage d’or 750‰ rosé aux reflets chauds',
    colorHex: '#E8A598',
  }
};

type MetalKey = keyof typeof METALS;

const SIZES = [
  { id: 'S', label: 'S · 50-52 mm' },
  { id: 'M', label: 'M · 54-56 mm' },
  { id: 'L', label: 'L · 58-60 mm' },
  { id: 'custom', label: 'Sur-Mesure' },
];

function getProductImg(product: Product): string {
  if (product.file) {
    return `/assets/bijoux/trier/${product.file}`;
  }
  if (product.imageUrl) {
    if (product.imageUrl.includes('perseusshop.duckdns.org')) {
      return product.imageUrl.replace('https://perseusshopp.duckdns.org', '');
    }
    return product.imageUrl;
  }
  return '/placeholder.png';
}

function isPlaceholderName(name?: string | null): boolean {
  if (!name) return true;
  const s = name.trim().toLowerCase();
  return (
    s === '' ||
    s.startsWith('gtaw-') ||
    s.includes('@') ||
    s === 'membre gta:world' ||
    s === 'personnage non défini' ||
    s === 'client' ||
    s === 'in-game'
  );
}

export default function PerseusFiveMApp() {
  const { cart, addToCart, removeFromCart, decreaseQuantity, cartCount } = useCart();

  // Screen routing: 'home' | 'shop' | 'product' | 'favorites' | 'cart' | 'account'
  const [currentScreen, setCurrentScreen] = useState<'home' | 'shop' | 'product' | 'favorites' | 'cart' | 'account'>('home');
  const [previousScreen, setPreviousScreen] = useState<'home' | 'shop' | 'favorites' | 'account'>('home');
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'shop' | 'favorites' | 'cart' | 'account'>('home');

  // User Profile / GTA:World UCP Session & Multi-Characters
  const [user, setUser] = useState<any>(null);
  const [activeCharacter, setActiveCharacter] = useState<string>('');
  const [characters, setCharacters] = useState<string[]>([]);
  const [showCharModal, setShowCharModal] = useState(false);
  const [isEditingChar, setIsEditingChar] = useState(false);
  const [charInput, setCharInput] = useState('');

  // Product detail (Screen 3)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<MetalKey>('or_jaune');
  const [selectedSize, setSelectedSize] = useState<string>('M');

  // Shop state (Screen 2)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Drawer menu ☰
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  // Feedback helpers
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Refresh user state from PerseusAPI / localStorage
  const refreshUser = () => {
    try {
      let currentUser = PerseusAPI.getUser();
      if (!currentUser) {
        const raw = localStorage.getItem('perseus_user');
        if (raw) currentUser = JSON.parse(raw);
      }
      
      if (currentUser) {
        setUser(currentUser);

        // Extract characters list cleanly, ignoring placeholders
        let charList: string[] = [];
        if (Array.isArray((currentUser as any).characters) && (currentUser as any).characters.length > 0) {
          charList = (currentUser as any).characters.filter((c: string) => !isPlaceholderName(c));
        } else if ((currentUser as any).character_name && !isPlaceholderName((currentUser as any).character_name)) {
          charList = [(currentUser as any).character_name];
        } else if (currentUser.name && !isPlaceholderName(currentUser.name)) {
          charList = [currentUser.name];
        }

        const storedChar = localStorage.getItem('perseus_character');
        const active = (!isPlaceholderName(storedChar) ? storedChar : '') || 
                       (!isPlaceholderName((currentUser as any).character_name) ? (currentUser as any).character_name : '') || 
                       charList[0] || '';

        setCharacters(charList);
        setActiveCharacter(active);
      } else {
        setUser(null);
        setActiveCharacter('');
        setCharacters([]);
      }
    } catch {
      setUser(null);
    }
  };

  // Load favorites, user & read URL params on mount
  useEffect(() => {
    refreshUser();

    try {
      const stored = localStorage.getItem('perseus_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load favorites', e);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const screenParam = params.get('screen') as 'home' | 'shop' | 'product' | 'favorites' | 'cart' | 'account' | null;
      const prodIdParam = params.get('id');
      const catParam = params.get('cat');

      if (catParam) {
        setSelectedCategory(catParam);
      }

      if (screenParam === 'product' && prodIdParam) {
        const found = PerseusCatalog.find(p => p.id === prodIdParam);
        if (found) {
          setSelectedProduct(found);
          setCurrentScreen('product');
          return;
        }
      }

      if (screenParam && ['home', 'shop', 'favorites', 'cart', 'account'].includes(screenParam)) {
        setCurrentScreen(screenParam);
        setActiveBottomTab(screenParam);
      }
    }
  }, []);

  const toggleFavorite = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      let updated: string[];
      if (prev.includes(productId)) {
        updated = prev.filter(id => id !== productId);
        showToast('Pièce retirée de vos favoris');
      } else {
        updated = [...prev, productId];
        showToast('Pièce ajoutée à vos favoris');
      }
      try {
        localStorage.setItem('perseus_favorites', JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save favorites', err);
      }
      return updated;
    });
  };

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => {
      setActiveToast(null);
    }, 2400);
  };

  const openProductDetail = (product: Product) => {
    if (currentScreen !== 'product') {
      setPreviousScreen(currentScreen === 'cart' ? 'shop' : currentScreen);
    }
    setSelectedProduct(product);
    setCurrentScreen('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setCurrentScreen(previousScreen);
  };

  const handleTabChange = (tab: 'home' | 'shop' | 'favorites' | 'cart' | 'account') => {
    setActiveBottomTab(tab);
    setSelectedProduct(null);
    setCurrentScreen(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUcpLogin = () => {
    try {
      localStorage.setItem('perseus_auth_redirect', '/app?screen=account');
      localStorage.setItem('perseus_client_mode', 'mobile');
    } catch {}
    const redirectUri = 'https://perseusshopp.duckdns.org/oauth/callback';
    const oauthUrl = `https://ucp-fr.gta.world/oauth/authorize?client_id=40&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${encodeURIComponent('/app?screen=account')}`;
    window.location.href = oauthUrl;
  };

  const handleLogout = () => {
    PerseusAPI.logout();
    setUser(null);
    setActiveCharacter('');
    setCharacters([]);
    localStorage.removeItem('perseus_character');
    showToast('Déconnexion réussie');
  };

  const selectCharacter = async (charName: string) => {
    const trimmed = charName.trim();
    if (!trimmed || isPlaceholderName(trimmed)) return;

    setActiveCharacter(trimmed);
    localStorage.setItem('perseus_character', trimmed);

    const updatedChars = Array.from(new Set([...characters, trimmed])).filter(c => !isPlaceholderName(c));
    setCharacters(updatedChars);
    setIsEditingChar(false);
    setCharInput('');

    if (user) {
      const updatedUser = {
        ...user,
        name: trimmed,
        character_name: trimmed,
        characters: updatedChars
      };
      setUser(updatedUser);
      localStorage.setItem('perseus_user', JSON.stringify(updatedUser));

      try {
        await PerseusAPI.updateProfile({ name: trimmed, character_name: trimmed, characters: updatedChars } as any);
      } catch (err) {
        console.warn('Profile sync warning:', err);
      }
    }

    showToast(`Personnage actif : ${trimmed}`);
  };

  const filteredProducts = useMemo(() => {
    let list = PerseusCatalog.filter(p => {
      const matchCat = selectedCategory === 'all' || p.categoryAttr === selectedCategory;
      const matchSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  const favoriteProducts = useMemo(() => {
    return PerseusCatalog.filter(p => favorites.includes(p.id));
  }, [favorites]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  // Main UI Content in Authentic High-Fashion White Theme
  const AppContent = (
    <div className="w-full flex-1 flex flex-col relative bg-white text-[#111111] min-h-screen">
      
      {/* ─── TOAST NOTIFICATION ─── */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#111111] text-white rounded-full shadow-2xl flex items-center gap-2 text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span>{activeToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── LATERAL DRAWER MENU (☰ BURGER) ─── */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-[300px] max-w-[85vw] h-full bg-white flex flex-col z-10 shadow-2xl border-r border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src="/icon.png" alt="Perseus" className="w-9 h-9 rounded-full object-contain bg-black shadow-xs shrink-0 p-1" />
                  <div>
                    <h3 className="font-serif text-base tracking-[0.25em] text-[#111111] font-bold">PERSEUS</h3>
                    <p className="text-[9px] text-[#B8861E] uppercase tracking-widest font-semibold">Haute Joaillerie</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:text-black flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* User Account / Profile Widget in Drawer */}
                <div className="p-3.5 rounded-2xl bg-[#F8F8F9] space-y-2 text-left">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#B8861E] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Connecté UCP
                        </span>
                        <h4 className="text-xs font-bold text-[#111111] truncate uppercase">
                          {user.character_name || user.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => { handleTabChange('account'); setIsDrawerOpen(false); }}
                        className="px-2.5 py-1 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider shrink-0"
                      >
                        Mon Profil
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-500 leading-tight">
                        Connectez-vous pour retrouver vos commandes et vos privilèges.
                      </p>
                      <button
                        onClick={() => { handleUcpLogin(); setIsDrawerOpen(false); }}
                        className="w-full py-2 px-3 rounded-full bg-[#111111] hover:bg-[#B8861E] text-white text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Connexion GTA:World UCP</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold block px-2 pb-1">
                    Navigation
                  </span>
                  
                  <button
                    onClick={() => { handleTabChange('home'); setIsDrawerOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-left text-xs font-semibold text-gray-800 transition-colors"
                  >
                    <Home className="w-4 h-4 text-gray-500" />
                    <span>Accueil</span>
                  </button>

                  <button
                    onClick={() => { setSelectedCategory('all'); handleTabChange('shop'); setIsDrawerOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-left text-xs font-semibold text-gray-800 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-gray-500" />
                    <span>Tout le Catalogue ({PerseusCatalog.length})</span>
                  </button>

                  <button
                    onClick={() => { handleTabChange('favorites'); setIsDrawerOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-left text-xs font-semibold text-gray-800 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span>Mes Favoris ({favorites.length})</span>
                  </button>

                  <button
                    onClick={() => { handleTabChange('cart'); setIsDrawerOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-left text-xs font-semibold text-gray-800 transition-colors"
                  >
                    <Gem className="w-4 h-4 text-gray-500" />
                    <span>Mon Panier ({cartCount})</span>
                  </button>

                  <button
                    onClick={() => { handleTabChange('account'); setIsDrawerOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-left text-xs font-semibold text-gray-800 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <span>Espace Client Privilège</span>
                  </button>
                </div>

                <div className="space-y-1 pt-3 border-t border-gray-100">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-semibold block px-2 pb-1">
                    Catégories
                  </span>
                  {CIRCULAR_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        handleTabChange('shop');
                        setIsDrawerOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 text-left text-xs text-gray-700 font-medium transition-colors"
                    >
                      <span>{cat.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F8F9] space-y-1 mt-3 text-left">
                  <div className="flex items-center gap-2 text-[#111111]">
                    <MapPin className="w-4 h-4 text-[#B8861E]" />
                    <span className="font-serif text-xs font-bold">Salons Portola Drive</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    Rockford Hills, Los Santos. Réception privée tous les soirs sur rendez-vous.
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 text-center">
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium">
                  Maison Fondée en 2020
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── EXPANDABLE SEARCH BAR ─── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sticky top-14 z-25 border-b border-gray-100 bg-white px-4 py-3 overflow-hidden shadow-sm"
          >
            <div className="max-w-xl mx-auto relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une bague, collier, montre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#F5F5F7] border-0 rounded-full pl-10 pr-9 py-2 text-xs text-[#111111] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ─── SCREEN 1: ACCUEIL (HOME) ─────────────────────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {currentScreen === 'home' && (
        <div className="flex-1 flex flex-col pb-24 md:pb-12 bg-white">
          
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Menu principal"
              className="w-9 h-9 flex items-center justify-center text-[#111111] hover:opacity-70 transition-opacity"
            >
              <Menu className="w-5 h-5 stroke-[1.75]" />
            </button>

            <div className="flex items-center gap-2">
              <img src="/icon.png" alt="Perseus" className="w-6 h-6 rounded-full object-contain bg-black shrink-0 p-0.5 shadow-xs" />
              <span className="font-serif text-lg tracking-[0.25em] text-[#111111] font-bold">
                PERSEUS
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Rechercher"
                className="w-8 h-8 flex items-center justify-center text-[#111111] hover:opacity-70 transition-opacity"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              <button
                onClick={() => handleTabChange('account')}
                aria-label="Espace Client"
                className="w-8 h-8 flex items-center justify-center text-[#111111] hover:opacity-70 transition-opacity relative"
              >
                <UserIcon className="w-5 h-5 stroke-[1.75]" />
                {user && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>

              <button
                onClick={() => handleTabChange('cart')}
                aria-label="Panier"
                className="w-8 h-8 flex items-center justify-center text-[#111111] hover:opacity-70 transition-opacity relative"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-1 w-4 h-4 rounded-full bg-[#B8861E] text-white text-[9px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </header>

          <div className="p-4 space-y-7 max-w-4xl mx-auto w-full">
            
            {/* 1. Hero Campaign Card */}
            <div className="relative w-full rounded-3xl overflow-hidden bg-[#F4F4F6] p-5 sm:p-7 flex flex-col justify-between min-h-[260px] sm:min-h-[300px]">
              <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[50%] overflow-hidden pointer-events-none">
                <Image
                  src={HERO_CAMPAIGN.image}
                  alt="Perseus Campagne"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#F4F4F6] via-[#F4F4F6]/60 to-transparent" />
              </div>

              <div className="relative z-10 max-w-[62%] sm:max-w-[55%] space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8861E] block">
                  {HERO_CAMPAIGN.title}
                </span>
                
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] leading-tight tracking-tight">
                  {HERO_CAMPAIGN.headline}
                </h1>

                <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                  {HERO_CAMPAIGN.subtitle}
                </p>

                <p className="text-[11px] text-gray-600 font-normal leading-relaxed hidden sm:block">
                  {HERO_CAMPAIGN.description}
                </p>

                <div className="pt-3">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      handleTabChange('shop');
                    }}
                    className="px-5 py-2.5 bg-[#111111] hover:bg-[#B8861E] text-white text-[11px] font-semibold tracking-wider uppercase rounded-full transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <span>{HERO_CAMPAIGN.ctaText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-1.5 pt-4">
                <span className="w-2 h-2 rounded-full bg-[#111111]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              </div>
            </div>

            {/* 2. CATÉGORIES (5 Icônes circulaires sans cadre lourd) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#111111]">
                  CATÉGORIES
                </h2>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    handleTabChange('shop');
                  }}
                  className="text-[11px] font-semibold text-gray-400 hover:text-black uppercase tracking-wider transition-colors"
                >
                  TOUT VOIR
                </button>
              </div>

              <div className="flex items-start justify-between gap-2 overflow-x-auto no-scrollbar py-1">
                {CIRCULAR_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      handleTabChange('shop');
                    }}
                    className="flex flex-col items-center gap-2 shrink-0 group focus:outline-none active:scale-95 transition-transform"
                    style={{ minWidth: '62px' }}
                  >
                    <div className="w-14 h-14 rounded-full bg-[#F6F6F8] group-hover:bg-[#ECECEE] flex items-center justify-center transition-colors overflow-hidden p-2.5">
                      <Image
                        src={cat.img}
                        alt={cat.label}
                        width={38}
                        height={38}
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-medium tracking-wide text-gray-700 uppercase group-hover:text-black transition-colors text-center">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. SÉLECTION DU MOMENT */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#111111]">
                  SÉLECTION DU MOMENT
                </h2>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    handleTabChange('shop');
                  }}
                  className="text-[11px] font-semibold text-gray-400 hover:text-black uppercase tracking-wider transition-colors"
                >
                  TOUT VOIR ({PerseusCatalog.length})
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {PerseusCatalog.slice(0, 8).map((product) => {
                  const isFav = favorites.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => openProductDetail(product)}
                      className="flex flex-col justify-between group cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      <div className="relative aspect-square w-full bg-[#F5F5F7] rounded-2xl p-4 flex items-center justify-center overflow-hidden">
                        <Image
                          src={getProductImg(product)}
                          alt={product.name}
                          width={180}
                          height={180}
                          className="object-contain max-h-full group-hover:scale-105 transition-transform duration-300"
                        />

                        <button
                          onClick={(e) => toggleFavorite(product.id, e)}
                          aria-label="Ajouter aux favoris"
                          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-[#B8861E] text-[#B8861E]' : 'stroke-[1.5]'}`} />
                        </button>
                      </div>

                      <div className="pt-2.5 pb-1 flex flex-col gap-0.5">
                        <h3 className="text-xs font-semibold text-[#111111] uppercase tracking-wide line-clamp-1 group-hover:underline">
                          {product.name}
                        </h3>
                        <span className="text-xs font-bold text-[#111111]">
                          ${product.priceStr || product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Atelier Portola Reception Banner */}
            <div className="rounded-3xl bg-[#F5F5F7] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#B8861E] font-bold">
                  SALONS PRIVÉS
                </span>
                <h3 className="font-serif text-base font-bold text-[#111111]">
                  Atelier Portola Drive · Los Santos
                </h3>
                <p className="text-[11px] text-gray-600 font-normal leading-relaxed">
                  Présentation privée de chaque création sur rendez-vous exclusif.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  handleTabChange('shop');
                }}
                className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B8861E] transition-colors shrink-0"
              >
                Découvrir la Collection
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ─── SCREEN 2: SHOP / CATALOGUE ───────────────────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {currentScreen === 'shop' && (
        <div className="flex-1 flex flex-col pb-24 md:pb-12 bg-white">
          
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => handleTabChange('home')}
              aria-label="Retour"
              className="w-9 h-9 flex items-center justify-center text-[#111111] hover:opacity-70 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>

            <div className="flex flex-col items-center">
              <h2 className="text-sm font-bold tracking-[0.2em] text-[#111111] uppercase">
                {selectedCategory === 'all' 
                  ? 'COLLECTIONS' 
                  : CATEGORY_TABS.find(c => c.id === selectedCategory)?.label || 'CATALOGUE'}
              </h2>
              <span className="text-[9px] text-gray-400 font-medium">
                {filteredProducts.length} créations
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Rechercher"
                className="w-8 h-8 flex items-center justify-center text-[#111111] hover:opacity-70"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              <button
                onClick={() => handleTabChange('cart')}
                aria-label="Panier"
                className="w-8 h-8 flex items-center justify-center text-[#111111] hover:opacity-70 relative"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                <span className="absolute -top-0.5 -right-1 w-4 h-4 rounded-full bg-[#B8861E] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </header>

          <div className="p-4 space-y-4 max-w-5xl mx-auto w-full">
            
            {/* Toolbar sans bordures rigides */}
            <div className="grid grid-cols-2 gap-2.5 py-1 border-b border-gray-100 pb-3">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#F5F5F7] text-xs font-semibold text-gray-800 hover:bg-gray-200 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>FILTRER</span>
                {selectedCategory !== 'all' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8861E]" />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#F5F5F7] text-xs font-semibold text-gray-800 hover:bg-gray-200 transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>TRIER PAR ⌵</span>
                </button>

                {isSortDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl p-2 z-30 space-y-1 border border-gray-100">
                    <button
                      onClick={() => { setSortBy('featured'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${sortBy === 'featured' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Sélection Perseus
                    </button>
                    <button
                      onClick={() => { setSortBy('price-asc'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${sortBy === 'price-asc' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Prix croissant ($ ➔ $$$)
                    </button>
                    <button
                      onClick={() => { setSortBy('price-desc'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${sortBy === 'price-desc' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Prix décroissant ($$$ ➔ $)
                    </button>
                    <button
                      onClick={() => { setSortBy('name'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${sortBy === 'name' ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Nom (A - Z)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Category Pills épurées */}
            <div className="overflow-x-auto no-scrollbar flex gap-2 pb-1">
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all ${
                    selectedCategory === cat.id 
                      ? 'bg-[#111111] text-white font-semibold' 
                      : 'bg-[#F5F5F7] text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 2-Column Luxury Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {filteredProducts.map((product) => {
                const isFav = favorites.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => openProductDetail(product)}
                    className="flex flex-col justify-between group cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <div className="relative aspect-square w-full bg-[#F5F5F7] rounded-2xl p-4 flex items-center justify-center overflow-hidden">
                      <Image
                        src={getProductImg(product)}
                        alt={product.name}
                        width={180}
                        height={180}
                        className="object-contain max-h-full group-hover:scale-105 transition-transform duration-300"
                      />

                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        aria-label="Ajouter aux favoris"
                        className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors z-10"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-[#B8861E] text-[#B8861E]' : 'stroke-[1.5]'}`} />
                      </button>
                    </div>

                    <div className="pt-2.5 pb-1 flex flex-col gap-0.5">
                      <h3 className="text-xs font-semibold text-[#111111] uppercase tracking-wide line-clamp-1 group-hover:underline">
                        {product.name}
                      </h3>
                      <span className="text-xs font-bold text-[#111111]">
                        ${product.priceStr || product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center space-y-3">
                <Gem className="w-10 h-10 mx-auto text-gray-300" />
                <h3 className="text-sm font-bold text-gray-700">Aucune création trouvée</h3>
                <p className="text-xs text-gray-400">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="px-5 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase"
                >
                  Réinitialiser
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ─── SCREEN 3: PRODUCT DETAIL PAGE ─────────────────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {currentScreen === 'product' && selectedProduct && (
        <div className="flex-1 flex flex-col pb-24 md:pb-12 bg-white">
          
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between">
            <button
              onClick={closeProductDetail}
              aria-label="Retour"
              className="w-9 h-9 flex items-center justify-center text-[#111111] hover:opacity-70"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>

            <div className="flex items-center gap-1.5">
              <img src="/icon.png" alt="Perseus" className="w-5 h-5 rounded-full object-contain bg-black shrink-0 p-0.5" />
              <span className="font-serif text-base tracking-[0.25em] text-[#111111] font-bold">
                PERSEUS
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(selectedProduct.id)}
                aria-label="Favoris"
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500"
              >
                <Heart className={`w-5 h-5 ${favorites.includes(selectedProduct.id) ? 'fill-[#B8861E] text-[#B8861E]' : 'stroke-[1.75]'}`} />
              </button>

              <button
                onClick={() => handleTabChange('cart')}
                aria-label="Panier"
                className="w-8 h-8 flex items-center justify-center text-[#111111] hover:opacity-70 relative"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                <span className="absolute -top-0.5 -right-1 w-4 h-4 rounded-full bg-[#B8861E] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </header>

          <div className="p-4 space-y-6 max-w-xl mx-auto w-full">
            
            {/* 1. Large Jewelry Canvas sans bordure moche */}
            <div className="relative aspect-square w-full rounded-3xl bg-[#F8F8F9] p-6 flex items-center justify-center overflow-hidden">
              <Image
                src={getProductImg(selectedProduct)}
                alt={selectedProduct.name}
                width={340}
                height={340}
                priority
                className="object-contain max-h-[85%] max-w-[85%]"
              />

              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Lien copié dans le presse-papiers');
                  }
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-black"
                title="Partager"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#111111]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              </div>
            </div>

            {/* 2. Nom, Prix & Certifications authentiques */}
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8861E]">
                {selectedProduct.cat}
              </span>

              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#111111]">
                {selectedProduct.name}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#111111]">
                  ${selectedProduct.priceStr || selectedProduct.price.toLocaleString()}
                </span>
              </div>

              {/* Badges de prestige */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Certifié Or 18K
                </span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Diamants VVS · Fait Main
                </span>
              </div>

              <p className="text-xs text-gray-600 font-normal leading-relaxed pt-1">
                {selectedProduct.desc || 'Création d’exception façonnée en or 18 carats selon le savoir-faire de la Maison Perseus.'}
              </p>
            </div>

            {/* 3. MÉTAL PRÉCIEUX */}
            <div className="space-y-2.5 pt-3 border-t border-gray-100 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  MÉTAL :
                </span>
                <span className="text-xs font-semibold text-[#B8861E]">
                  {METALS[selectedMetal].name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {(Object.keys(METALS) as MetalKey[]).map((key) => {
                  const m = METALS[key];
                  const isSelected = selectedMetal === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedMetal(key)}
                      className={`w-9 h-9 rounded-full p-0.5 transition-all flex items-center justify-center ${
                        isSelected 
                          ? 'ring-2 ring-black ring-offset-2 ring-offset-white' 
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={m.name}
                    >
                      <div 
                        className="w-full h-full rounded-full border border-black/10 shadow-inner"
                        style={{ backgroundColor: m.colorHex }}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400">
                {METALS[selectedMetal].subtitle}
              </p>
            </div>

            {/* 4. TAILLE */}
            <div className="space-y-2.5 pt-3 border-t border-gray-100 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                  TAILLE :
                </span>
                <span className="text-xs font-semibold text-gray-600">
                  {SIZES.find(s => s.id === selectedSize)?.label}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((size) => {
                  const isSelected = selectedSize === size.id;
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`py-2.5 px-1 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${
                        isSelected 
                          ? 'bg-[#111111] text-white shadow-xs' 
                          : 'bg-[#F5F5F7] text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {size.id === 'custom' ? 'Sur-Mesure' : size.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Actions d'achat & Réservation */}
            <div className="space-y-2.5 pt-4">
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  showToast(`${selectedProduct.name} ajouté à votre panier`);
                }}
                className="w-full py-4 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2]" />
                <span>AJOUTER AU PANIER</span>
              </button>

              <button
                onClick={() => {
                  if (user) {
                    showToast(`Demande de réservation enregistrée pour ${user.character_name || user.name}`);
                  } else {
                    handleTabChange('account');
                    showToast('Veuillez vous connecter avec votre compte UCP');
                  }
                }}
                className="w-full py-3.5 rounded-full bg-white hover:bg-gray-50 border border-gray-300 text-[#111111] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#B8861E]" />
                <span>RÉSERVER EN SALON PRIVÉ</span>
              </button>
            </div>

            {/* 6. Garanties Joaillères */}
            <div className="grid grid-cols-2 gap-3 pt-3 text-left">
              <div className="p-4 rounded-2xl bg-[#F8F8F9] space-y-1">
                <Award className="w-4 h-4 text-[#B8861E]" />
                <h4 className="text-xs font-bold text-gray-900">Poinçon d'État</h4>
                <p className="text-[10px] text-gray-500">Certificat gemmologique officiel Perseus inclus.</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F8F9] space-y-1">
                <Sparkles className="w-4 h-4 text-[#B8861E]" />
                <h4 className="text-xs font-bold text-gray-900">Écrin d’Acajou</h4>
                <p className="text-[10px] text-gray-500">Coffret en bois précieux et certificat numéroté.</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ─── SCREEN 4: FAVORITES (COUPS DE CŒUR) ──────────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {currentScreen === 'favorites' && (
        <div className="flex-1 flex flex-col pb-24 md:pb-12 bg-white">
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => handleTabChange('home')}
              aria-label="Retour"
              className="w-9 h-9 flex items-center justify-center text-[#111111]"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>

            <h2 className="text-sm font-bold tracking-[0.2em] text-[#111111] uppercase">
              MES FAVORIS ({favoriteProducts.length})
            </h2>

            <button
              onClick={() => handleTabChange('cart')}
              aria-label="Panier"
              className="w-9 h-9 flex items-center justify-center text-[#111111] relative"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute -top-0.5 -right-1 w-4 h-4 rounded-full bg-[#B8861E] text-white text-[9px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </header>

          <div className="p-4 space-y-4 max-w-4xl mx-auto w-full">
            {favoriteProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Heart className="w-12 h-12 mx-auto text-gray-300 stroke-[1.5]" />
                <h3 className="text-sm font-bold text-gray-800">Votre liste d'envies est vide</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Enregistrez vos créations coup de cœur en appuyant sur le cœur.
                </p>
                <button
                  onClick={() => handleTabChange('shop')}
                  className="px-6 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase"
                >
                  Découvrir le Catalogue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {favoriteProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => openProductDetail(product)}
                    className="flex flex-col justify-between group cursor-pointer"
                  >
                    <div className="relative aspect-square w-full bg-[#F5F5F7] rounded-2xl p-4 flex items-center justify-center overflow-hidden">
                      <Image
                        src={getProductImg(product)}
                        alt={product.name}
                        width={180}
                        height={180}
                        className="object-contain max-h-full"
                      />
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        aria-label="Retirer des favoris"
                        className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center text-[#B8861E] z-10"
                      >
                        <Heart className="w-4 h-4 fill-[#B8861E]" />
                      </button>
                    </div>

                    <div className="pt-2.5 pb-1 flex flex-col gap-0.5">
                      <h3 className="text-xs font-semibold text-[#111111] uppercase tracking-wide line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-[#111111]">
                          ${product.priceStr || product.price.toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                            showToast(`${product.name} ajouté au panier`);
                          }}
                          className="px-3 py-1.5 rounded-full bg-[#111111] text-white text-[10px] font-bold"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ─── SCREEN 5: CART / PANIER DE COMMANDE ───────────────────────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {currentScreen === 'cart' && (
        <div className="flex-1 flex flex-col pb-24 md:pb-12 bg-white">
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => handleTabChange('home')}
              aria-label="Retour"
              className="w-9 h-9 flex items-center justify-center text-[#111111]"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>

            <h2 className="text-sm font-bold tracking-[0.2em] text-[#111111] uppercase">
              VOTRE PANIER ({cartCount})
            </h2>

            <div className="w-9 h-9" />
          </header>

          <div className="p-4 space-y-5 max-w-xl mx-auto w-full">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 stroke-[1.5]" />
                <h3 className="text-sm font-bold text-gray-800">Votre panier est vide</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Sélectionnez vos créations pour préparer votre commande ou réservation.
                </p>
                <button
                  onClick={() => handleTabChange('shop')}
                  className="px-6 py-2.5 rounded-full bg-[#111111] text-white text-xs font-semibold uppercase"
                >
                  Parcourir les Collections
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#F8F8F9] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="relative w-16 h-16 bg-white rounded-xl p-1.5 shrink-0 flex items-center justify-center shadow-xs">
                        <Image
                          src={getProductImg(item)}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="object-contain max-h-full"
                        />
                      </div>

                      <div className="min-w-0 flex-1 text-left">
                        <span className="text-[9px] text-[#B8861E] uppercase font-bold tracking-wider block">
                          {item.cat}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 truncate uppercase">{item.name}</h4>
                        <span className="text-xs font-extrabold text-[#111111]">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1 shadow-xs">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="text-gray-500 hover:text-black p-0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[11px] font-bold text-gray-900 px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="text-gray-500 hover:text-black p-0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-3xl bg-[#F8F8F9] space-y-4 text-left">
                  <div className="flex items-baseline justify-between border-b border-gray-200/60 pb-3">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Total Commande</span>
                    <span className="text-2xl font-extrabold text-[#111111]">
                      ${cartTotal.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full py-4 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                  >
                    <span>Finaliser la Commande</span>
                    <ArrowRight className="w-4 h-4 stroke-[2]" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ─── SCREEN 6: ACCOUNT / ESPACE CLIENT GTA:WORLD UCP ─────────── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {currentScreen === 'account' && (
        <div className="flex-1 flex flex-col pb-24 md:pb-12 bg-white">
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => handleTabChange('home')}
              aria-label="Retour"
              className="w-9 h-9 flex items-center justify-center text-[#111111]"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2]" />
            </button>

            <h2 className="text-sm font-bold tracking-[0.2em] text-[#111111] uppercase">
              ESPACE CLIENT
            </h2>

            <div className="w-9 h-9" />
          </header>

          <div className="p-4 space-y-6 max-w-xl mx-auto w-full">
                        {user ? (
              /* CONNECTED STATE — STYLE CRUSH CHOISISSEZ VOTRE PROFIL */
              <div className="space-y-6">
                
                {/* CARTE PROFIL CLIENT ACTIF ÉPURÉE */}
                <div className="p-6 rounded-3xl bg-[#151515] border border-white/10 space-y-5 text-white shadow-xl">
                  
                  {/* Avatar & Nom du Personnage Actif */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-black border-2 border-[#D4AF37] flex items-center justify-center text-2xl font-serif font-bold text-[#D4AF37] shadow-lg flex-shrink-0">
                      {(activeCharacter || user.name || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mont uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                          Client Privilège
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="text-[9px] font-mont uppercase tracking-wider text-white/50">
                          GTA:World
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white tracking-wide uppercase">
                        {activeCharacter || user.character_name || user.name || 'Membre'}
                      </h3>
                      {user.ucp_username && (
                        <p className="text-[11px] font-mont text-white/40">
                          Compte UCP : <strong className="text-white/80">{user.ucp_username}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Statut & Points du personnage actif */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-left">
                    <div className="p-3.5 bg-white/[0.03] rounded-2xl border border-white/5">
                      <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold block mb-0.5">
                        Salon Privilège
                      </span>
                      <span className="text-xs font-bold text-white uppercase">
                        Portola Drive
                      </span>
                    </div>
                    <div className="p-3.5 bg-white/[0.03] rounded-2xl border border-white/5">
                      <span className="text-[9px] uppercase tracking-wider text-white/40 font-bold block mb-0.5">
                        Points Privilège
                      </span>
                      <span className="text-xs font-extrabold text-[#D4AF37]">
                        {(user.loyalty_points ?? 1250).toLocaleString()} pts
                      </span>
                    </div>
                  </div>

                  {/* Actions : Changer de personnage (si >1) & Se déconnecter */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    {characters.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => setShowCharModal(true)}
                        className="text-xs font-mont text-[#D4AF37] hover:text-white transition-colors underline underline-offset-4 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Changer de personnage ({characters.length})</span>
                      </button>
                    ) : <div />}

                    <button
                      onClick={handleLogout}
                      className="text-xs text-white/40 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>

                {/* Acces rapides Boutique & Favoris */}
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleTabChange('favorites')}
                    className="w-full p-4 rounded-2xl bg-[#F8F8F9] hover:bg-[#F2F2F4] flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-[#B8861E]" />
                      <span className="text-xs font-semibold text-gray-900">Mes Favoris</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500">{favorites.length}</span>
                  </button>

                  <button
                    onClick={() => handleTabChange('cart')}
                    className="w-full p-4 rounded-2xl bg-[#F8F8F9] hover:bg-[#F2F2F4] flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 text-[#B8861E]" />
                      <span className="text-xs font-semibold text-gray-900">Mon Panier</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500">{cartCount}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* GUEST / NOT CONNECTED STATE */
              <div className="py-8 space-y-6 text-center">
                <div className="w-20 h-20 rounded-full bg-black mx-auto flex items-center justify-center p-3.5 shadow-lg">
                  <img src="/icon.png" alt="Perseus" className="w-full h-full object-contain" />
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8861E] block">
                    Maison Perseus · Portola Drive
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#111111] uppercase tracking-wide">
                    Salon Privé
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    Connectez-vous via votre compte GTA:World UCP pour synchroniser vos commandes et réservations d'atelier.
                  </p>
                </div>

                {/* UCP OAuth Action Button */}
                <div className="space-y-3 pt-2 max-w-sm mx-auto">
                  <button
                    onClick={handleUcpLogin}
                    className="w-full py-4 px-6 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-md flex items-center justify-center gap-3 active:scale-98"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Connexion GTA:World UCP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Info Privilèges */}
                <div className="grid grid-cols-2 gap-3 pt-6 text-left">
                  <div className="p-4 rounded-2xl bg-[#F8F8F9] space-y-1">
                    <Sparkles className="w-4 h-4 text-[#B8861E]" />
                    <h4 className="text-xs font-bold text-gray-900">Réservation en Salon</h4>
                    <p className="text-[10px] text-gray-500">Prise de rendez-vous immédiate sous votre personnage.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8F8F9] space-y-1">
                    <Crown className="w-4 h-4 text-[#B8861E]" />
                    <h4 className="text-xs font-bold text-gray-900">Suivi d'Atelier</h4>
                    <p className="text-[10px] text-gray-500">Commandes sur-mesure et pièces uniques.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── FILTER MODAL ─── */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl z-10 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#B8861E]" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#111111]">Filtrer les Créations</h3>
                </div>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 hover:text-black flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">
                  Univers Joaillier
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORY_TABS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`p-3.5 rounded-2xl text-xs font-semibold text-left transition-all ${
                        selectedCategory === c.id 
                          ? 'bg-[#111111] text-white' 
                          : 'bg-[#F5F5F7] text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                  className="flex-1 py-3 rounded-full bg-gray-100 text-gray-700 text-xs font-bold uppercase"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 py-3 rounded-full bg-[#111111] text-white text-xs font-bold uppercase"
                >
                  Appliquer ({filteredProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── FIXED BOTTOM NAVIGATION BAR (5 TABS AVEC COMPTE UCP) ─── */}
      <nav className="fixed bottom-0 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-[404px] z-30 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 py-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-sm">
        {/* Tab 1: HOME */}
        <button
          onClick={() => handleTabChange('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-colors ${
            activeBottomTab === 'home' && currentScreen !== 'product' ? 'text-[#B8861E]' : 'text-gray-400 hover:text-black'
          }`}
        >
          <Home className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[9px] font-bold tracking-wider uppercase">ACCUEIL</span>
        </button>

        {/* Tab 2: SHOP */}
        <button
          onClick={() => handleTabChange('shop')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 transition-colors ${
            activeBottomTab === 'shop' && currentScreen !== 'product' ? 'text-[#B8861E]' : 'text-gray-400 hover:text-black'
          }`}
        >
          <Gem className="w-5 h-5 stroke-[1.75]" />
          <span className="text-[9px] font-bold tracking-wider uppercase">SHOP</span>
        </button>

        {/* Tab 3: FAVORITES */}
        <button
          onClick={() => handleTabChange('favorites')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 transition-colors ${
            activeBottomTab === 'favorites' && currentScreen !== 'product' ? 'text-[#B8861E]' : 'text-gray-400 hover:text-black'
          }`}
        >
          <Heart className={`w-5 h-5 stroke-[1.75] ${favorites.length > 0 ? 'text-[#B8861E]' : ''}`} />
          {favorites.length > 0 && (
            <span className="absolute top-0 right-1.5 w-3.5 h-3.5 rounded-full bg-[#B8861E] text-white text-[8px] font-bold flex items-center justify-center">
              {favorites.length}
            </span>
          )}
          <span className="text-[9px] font-bold tracking-wider uppercase">FAVORIS</span>
        </button>

        {/* Tab 4: BAG (PANIER) */}
        <button
          onClick={() => handleTabChange('cart')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 transition-colors ${
            activeBottomTab === 'cart' && currentScreen !== 'product' ? 'text-[#B8861E]' : 'text-gray-400 hover:text-black'
          }`}
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-1.5 w-3.5 h-3.5 rounded-full bg-[#B8861E] text-white text-[8px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[9px] font-bold tracking-wider uppercase">PANIER</span>
        </button>

        {/* Tab 5: ACCOUNT (COMPTE UCP) */}
        <button
          onClick={() => handleTabChange('account')}
          className={`relative flex flex-col items-center gap-1 py-1 px-2.5 transition-colors ${
            activeBottomTab === 'account' && currentScreen !== 'product' ? 'text-[#B8861E]' : 'text-gray-400 hover:text-black'
          }`}
        >
          <UserIcon className="w-5 h-5 stroke-[1.75]" />
          {user && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-emerald-500" />
          )}
          <span className="text-[9px] font-bold tracking-wider uppercase">COMPTE</span>
        </button>
      </nav>

    </div>
  );

  return (
    <div className="w-full flex-1 flex flex-col bg-white text-[#111111] font-sans selection:bg-[#B8861E]/20 relative">
      <main className="w-full flex-1 flex flex-col relative overflow-x-hidden pt-[env(safe-area-inset-top,0px)]">
        {AppContent}
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    
      {/* ─── MODALE NATIVE MOBILE : CHANGEMENT DE PERSONNAGE IN-APP ─── */}
      {showCharModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-sm bg-[#161618] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-serif text-base uppercase text-white font-bold">Changer de profil</h3>
                <p className="text-[10px] text-white/40 font-mont">Sélectionnez le personnage actif :</p>
              </div>
              <button
                onClick={() => setShowCharModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {characters.map((char) => {
                const isCurrent = char.toLowerCase() === (activeCharacter || '').toLowerCase();
                return (
                  <button
                    key={char}
                    type="button"
                    onClick={() => {
                      selectCharacter(char);
                      setShowCharModal(false);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-white/15 border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]/50'
                        : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-serif font-bold ${
                        isCurrent ? 'bg-[#D4AF37] text-black' : 'bg-white/10 text-white'
                      }`}>
                        {char.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-serif text-sm font-semibold uppercase text-white">{char}</p>
                        <p className={`text-[9px] font-mont uppercase tracking-wider ${
                          isCurrent ? 'text-[#D4AF37]' : 'text-white/40'
                        }`}>
                          {isCurrent ? 'Profil actif' : 'Personnage lié'}
                        </p>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-bold uppercase">
                        Actif
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/80 hover:bg-white hover:text-black text-[10px] font-semibold uppercase transition-colors">
                        Choisir
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
