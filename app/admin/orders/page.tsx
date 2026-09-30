'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Clock,
  User,
  MapPin,
  Mail,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (orderId: string, action: 'approve' | 'reject') => {
    setActionLoading(orderId);
    try {
      const token = localStorage.getItem('perseus_token');
      const res = await fetch('/api/admin/orders/approve', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, action })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Mettre à jour localement
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: action === 'approve' ? 'paid' : 'rejected' } : o
      ));
      setSelectedOrder(null);
      
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l’action');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem('perseus_token');
        const res = await fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filtered = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user_email?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'awaiting_payment': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'cancelled': 
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-white/5 text-white/50 border-white/5';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Réglée';
      case 'awaiting_payment': return 'En Attente';
      case 'cancelled': return 'Annulée';
      case 'rejected': return 'Refusée';
      default: return status;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header Area */}
      <div>
        <h1 className="font-playfair text-3xl font-bold tracking-[0.1em] text-white">Gestion des Commandes</h1>
        <p className="text-white/30 text-xs uppercase tracking-[0.3em] mt-2">
          {orders.length} acquisitions enregistrées — <span className="text-gold">Admin Mode</span>
        </p>
      </div>

      {/* Top Bar / Filters */}
      <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-sm flex items-center gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text" 
            placeholder="Rechercher par référence, nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#050505] border border-white/5 rounded-sm py-2.5 pl-12 pr-4 text-xs text-white/70 placeholder:text-white/10 focus:border-gold/30 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-sm overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 w-32">Référence</th>
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Client</th>
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Total</th>
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Statut</th>
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Date</th>
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 text-right">Détails</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">Synchronisation...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-20 text-center text-white/20 text-xs uppercase tracking-widest">Aucune commande trouvée</td>
              </tr>
            ) : (
              filtered.map(o => (
                <tr key={o.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="p-6 font-mono text-[10px] text-gold/60">{o.id}</td>
                  <td className="p-6">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-bold tracking-widest text-white uppercase">{o.user_name}</p>
                      <p className="text-[9px] text-white/25 uppercase tracking-tighter">{o.user_email}</p>
                    </div>
                  </td>
                  <td className="p-6 font-bold text-xs text-white/80">${Number(o.total || 0).toLocaleString()}</td>
                  <td className="p-6">
                    <span className={`text-[9px] px-2 py-1 rounded-sm border uppercase font-bold tracking-widest ${getStatusStyle(o.status)}`}>
                      {getStatusLabel(o.status)}
                    </span>
                  </td>
                  <td className="p-6 text-[10px] text-white/30 font-mont whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => setSelectedOrder(o)}
                      className="p-2 text-white/30 hover:text-gold hover:bg-gold/5 rounded-sm transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-20">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
             <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <ShoppingBag className="w-6 h-6 text-gold" />
                      <div>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-white">Commande {selectedOrder.id}</h2>
                        <p className="text-[9px] text-white/20 uppercase tracking-tighter">Acquisition Haute Joaillerie</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedOrder(null)}><MoreVertical className="w-5 h-5 text-white/20" /></button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                   
                   {/* Info Blocks */}
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 text-white/30">
                            <User className="w-3.5 h-3.5" />
                            <span className="text-[9px] uppercase font-bold tracking-widest">Client</span>
                         </div>
                         <div className="bg-[#050505] border border-white/5 p-4 rounded-sm">
                            <p className="text-xs font-bold text-white uppercase">{selectedOrder.user_name}</p>
                            <div className="flex items-center gap-2 mt-2 text-white/40">
                               <Mail className="w-3 h-3" />
                               <span className="text-[10px]">{selectedOrder.user_email}</span>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 text-white/30">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-[9px] uppercase font-bold tracking-widest">Adresse</span>
                         </div>
                         <div className="bg-[#050505] border border-white/5 p-4 rounded-sm">
                            <p className="text-[10px] text-white/60 leading-relaxed font-mont uppercase">{selectedOrder.address}</p>
                         </div>
                      </div>
                   </div>

                   {/* Items List */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-white/30">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span className="text-[9px] uppercase font-bold tracking-widest">Selection Perseus ({selectedOrder.items?.length || 0})</span>
                      </div>
                      <div className="bg-[#050505] border border-white/5 rounded-sm divide-y divide-white/5">
                         {selectedOrder.items?.map((item: any, idx: number) => (
                           <div key={idx} className="p-4 flex items-center justify-between group">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-black border border-white/5 p-1">
                                    <img src={`/assets/bijoux/trier/${item.file}`} className="w-full h-full object-contain" />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">{item.name}</p>
                                    <p className="text-[8px] text-white/20 uppercase mt-0.5">Quantité: {item.quantity}</p>
                                 </div>
                              </div>
                              <p className="text-xs font-bold text-gold/80">${item.price?.toLocaleString()}</p>
                           </div>
                         ))}
                         <div className="p-6 bg-white/[0.01] flex justify-between items-center">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Paiement Total</span>
                            <span className="text-xl font-mont font-bold text-white">${Number(selectedOrder.total || 0).toLocaleString()}</span>
                         </div>
                      </div>
                   </div>

                   {/* Timeline / Status */}
                   <div className="space-y-4">
                      <div className="flex items-center gap-2 text-white/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[9px] uppercase font-bold tracking-widest">Historique du Statut</span>
                      </div>
                      <div className="relative pl-6 border-l border-white/5 space-y-6 py-2">
                         <div className="relative">
                            <div className="absolute -left-[27px] top-1 w-3 h-3 bg-gold rounded-full border border-black shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
                            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Statut Actuel : {getStatusLabel(selectedOrder.status)}</p>
                            <p className="text-[9px] text-white/20 font-mont mt-1 italic">Dernière mise à jour : {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-[#050505] flex justify-end gap-4">
                   <button 
                     onClick={() => setSelectedOrder(null)}
                     className="px-8 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
                   >
                     Fermer
                   </button>
                   {selectedOrder.status === 'awaiting_payment' && (
                     <div className="flex gap-2">
                        <button 
                          disabled={actionLoading === selectedOrder.id}
                          onClick={() => handleAction(selectedOrder.id, 'reject')}
                          className="px-8 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold tracking-widest uppercase hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          {actionLoading === selectedOrder.id ? 'Traitement...' : 'Refuser'}
                        </button>
                        <button 
                          disabled={actionLoading === selectedOrder.id}
                          onClick={() => handleAction(selectedOrder.id, 'approve')}
                          className="px-8 py-3 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold tracking-widest uppercase hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          {actionLoading === selectedOrder.id ? 'Traitement...' : 'Approuver'}
                        </button>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
