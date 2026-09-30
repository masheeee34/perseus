'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Package,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats/daily');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
        <span className="text-[10px] text-white/20 uppercase tracking-widest">Calcul des performances...</span>
      </div>
    );
  }

  const statCards = [
    { label: 'Chiffre d\'affaires (24h)', value: `$${stats?.totalSales?.toLocaleString() || 0}`, icon: Wallet, color: 'text-green-500', trend: '+12.5%', isPos: true },
    { label: 'Commandes (24h)', value: stats?.orderCount || 0, icon: ShoppingBag, color: 'text-blue-500', trend: '+3', isPos: true },
    { label: 'Visiteurs Uniques', value: stats?.visitors || 0, icon: Users, color: 'text-purple-500', trend: '+18%', isPos: true },
    { label: 'Nouveaux VIP', value: stats?.newVips || 0, icon: Star, color: 'text-gold', trend: '+1', isPos: true },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      
      {/* Welcome Header */}
      <div>
        <h1 className="font-playfair text-4xl font-bold tracking-[0.1em] text-white">Vue d'ensemble</h1>
        <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mt-3">
          Statistiques de la Maison <span className="text-gold">Perseus</span> — Dernière mise à jour il y a quelques instants.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div 
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm group hover:border-gold/20 transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 bg-white/5 rounded-sm ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${card.isPos ? 'text-green-500' : 'text-red-500'}`}>
                {card.trend}
                {card.isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mb-1">{card.label}</p>
              <h3 className="text-3xl font-mont font-bold text-white tracking-tight">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity & Performance */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0A0A0A] border border-white/5 h-96 rounded-sm p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-gold" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Flux d'Activité</h3>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  <span className="text-[9px] text-white/40 uppercase font-bold">Ventes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="text-[9px] text-white/40 uppercase font-bold">Vues</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center border-t border-white/5">
                {/* Placeholder for chart */}
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-white/5 mx-auto mb-4" />
                  <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">Graphique en attente de données historiques</p>
                </div>
            </div>
          </div>
        </div>

        {/* Sidebar Mini-Stats */}
        <div className="space-y-6">
          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm">
             <div className="flex items-center gap-3 mb-8">
                <Package className="w-5 h-5 text-gold" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Pièce la plus vue (24h)</h3>
              </div>
              <div className="text-center py-6">
                 <p className="font-playfair text-2xl text-white mb-2 italic">{stats?.topProduct}</p>
                 <span className="text-[9px] bg-gold/10 text-gold px-3 py-1 rounded-full border border-gold/20 font-bold uppercase tracking-tighter">Bestseller du jour</span>
              </div>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-sm">
             <div className="flex items-center gap-3 mb-8">
                <ShoppingBag className="w-5 h-5 text-red-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Abandons Panier</h3>
              </div>
              <div className="flex items-baseline gap-2">
                 <p className="text-4xl font-bold text-white tracking-tighter">{stats?.abandonedCarts || 0}</p>
                 <span className="text-[9px] text-white/25 uppercase font-bold">Utilisateurs</span>
              </div>
              <p className="text-[9px] text-white/20 mt-4 leading-relaxed uppercase tracking-tighter">
                Action conseillée : Envoyer une relance par mail pour les clients identifiés.
              </p>
          </div>
        </div>
      </div>

    </div>
  );
}
