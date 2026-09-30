'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../../lib/types';
import PerseusAPI from '../../../lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    id: '', name: '', file: '', cat: '', price: 0, priceStr: '', categoryAttr: 'cat-bagues', collection: '', ribbon: '', desc: '', tags: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await PerseusAPI.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bijou ?')) return;
    try {
      const token = localStorage.getItem('perseus_token');
      const res = await fetch(`/api/admin/products?id=${id}`, {
         method: 'DELETE',
         headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showStatus('success', 'Produit supprimé.');
      }
    } catch (err) {
      showStatus('error', 'Erreur lors de la suppression.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const token = localStorage.getItem('perseus_token');
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showStatus('success', editingProduct ? 'Produit mis à jour.' : 'Produit ajouté !');
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const err = await res.json();
        showStatus('error', err.error || 'Une erreur est survenue.');
      }
    } catch (err) {
      showStatus('error', 'Erreur de connexion.');
    } finally {
      setActionLoading(false);
    }
  };

  const showStatus = (type: 'success' | 'error', msg: string) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus(null), 3000);
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-playfair text-3xl font-bold tracking-[0.1em] text-white">Gestion du Catalogue</h1>
          <p className="text-white/30 text-xs uppercase tracking-[0.3em] mt-2">
            {products.length} bijoux répertoriés — <span className="text-gold">Admin Mode</span>
          </p>
        </div>
        
        <button 
          onClick={() => { setEditingProduct(null); setFormData({ id: '', name: '', file: '', cat: '', price: 0, priceStr: '', categoryAttr: 'cat-bagues', collection: '', ribbon: '', desc: '', tags: '' }); setIsModalOpen(true); }}
          className="flex items-center gap-3 bg-gold hover:bg-gold/80 text-white px-8 py-3.5 rounded-sm font-bold text-[11px] tracking-[0.2em] uppercase transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
        >
          <Plus className="w-4 h-4" /> Ajouter une pièce
        </button>
      </div>

      {/* Top Bar / Filters */}
      <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-sm flex items-center gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#050505] border border-white/5 rounded-sm py-2.5 pl-12 pr-4 text-xs text-white/70 placeholder:text-white/10 focus:border-gold/30 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-sm overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 w-20">ID</th>
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Produit</th>
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Catégorie</th>
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Prix</th>
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Tags</th>
              <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/30 text-right">Actions</th>
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
                <td colSpan={6} className="p-20 text-center text-white/20 text-xs uppercase tracking-widest">Aucun produit trouvé</td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="p-6 font-mono text-[10px] text-gold/60">{p.id}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#050505] border border-white/5 flex items-center justify-center p-1 overflow-hidden group-hover:border-gold/20 transition-colors">
                        <img src={`/assets/bijoux/trier/${p.file}`} alt="" className="w-full h-full object-contain drop-shadow-lg" />
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-widest text-white uppercase">{p.name}</p>
                        <p className="text-[9px] text-white/25 uppercase tracking-tighter mt-1">{p.collection || 'Collection Signature'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-sm border border-white/5">{p.cat}</span>
                  </td>
                  <td className="p-6 font-bold text-xs text-white/80">${p.priceStr || p.price.toLocaleString()}</td>
                  <td className="p-6">
                    <div className="flex flex-wrap gap-1">
                      {p.tags?.split(',').map(t => (
                        <span key={t} className="text-[8px] text-white/20 hover:text-gold/50 cursor-default uppercase tracking-tight">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button onClick={() => handleEdit(p)} className="p-2 text-white/30 hover:text-gold hover:bg-gold/5 rounded-sm transition-all"><Edit2 className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(p.id)} className="p-2 text-white/30 hover:text-red-500 hover:bg-red-500/5 rounded-sm transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tooltip Status */}
      <AnimatePresence>
        {status && (
          <div className={`fixed bottom-10 right-10 z-[100] flex items-center gap-3 px-6 py-4 rounded-sm shadow-2xl animate-in slide-in-from-bottom duration-500 ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-xs font-bold tracking-widest uppercase">{status.msg}</span>
          </div>
        )}
      </AnimatePresence>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-20">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-[#0A0A0A] border border-white/10 rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <Package className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-white uppercase tracking-[0.1em]">
                    {editingProduct ? 'Modifier la pièce' : 'Nouvelle création'}
                  </h3>
                  <p className="text-[9px] text-white/30 uppercase tracking-[0.3em]">Catalogue Haute Joaillerie — PERSEUS</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/20 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8 h-[70vh] overflow-y-auto custom-scrollbar">
              
              {/* Product Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">ID Unique (ex: ny_01)</label>
                    <input 
                      type="text" required disabled={!!editingProduct}
                      value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})}
                      className="w-full bg-[#050505] border border-white/5 rounded-sm p-3 text-xs text-white/80 focus:border-gold/40 outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Nom du bijou</label>
                    <input 
                      type="text" required
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#050505] border border-white/5 rounded-sm p-3 text-xs text-white/80 focus:border-gold/40 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Catégorie (Affichage)</label>
                    <input 
                      type="text" required placeholder="ex: Joaillerie - Colliers"
                      value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})}
                      className="w-full bg-[#050505] border border-white/5 rounded-sm p-3 text-xs text-white/80 focus:border-gold/40 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Filtre Boutique (Attribute)</label>
                    <select 
                      value={formData.categoryAttr} onChange={e => setFormData({...formData, categoryAttr: e.target.value})}
                      className="w-full bg-[#050505] border border-white/5 rounded-sm p-3 text-xs text-white/80 focus:border-gold/40 outline-none transition-all appearance-none"
                    >
                      <option value="cat-bagues">Bagues & Bracelets</option>
                      <option value="cat-colliers">Colliers & Pendentifs</option>
                      <option value="cat-montres">Montres</option>
                      <option value="v-sacs">Maroquinerie</option>
                      <option value="cat-grillz">Grillz</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Prix ($)</label>
                      <input 
                        type="number" required
                        value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                        className="w-full bg-[#050505] border border-white/5 rounded-sm p-3 text-xs text-white/80 focus:border-gold/40 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Prix Formatté</label>
                      <input 
                        type="text" placeholder="85,000"
                        value={formData.priceStr} onChange={e => setFormData({...formData, priceStr: e.target.value})}
                        className="w-full bg-[#050505] border border-white/5 rounded-sm p-3 text-xs text-white/80 focus:border-gold/40 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Fichier Image (Filename)</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        type="text" required placeholder="bijou.png"
                        value={formData.file} onChange={e => setFormData({...formData, file: e.target.value})}
                        className="w-full bg-[#050505] border border-white/10 rounded-sm p-3 pl-10 text-xs text-white/80 focus:border-gold/40 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Info */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Collection</label>
                    <input 
                      type="text" placeholder="New York 2026"
                      value={formData.collection} onChange={e => setFormData({...formData, collection: e.target.value})}
                      className="w-full bg-[#050505] border border-white/5 rounded-sm p-3 text-xs text-white/80 focus:border-gold/40 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Ruban / Badge (ex: VIP)</label>
                    <input 
                      type="text"
                      value={formData.ribbon} onChange={e => setFormData({...formData, ribbon: e.target.value})}
                      className="w-full bg-[#050505] border border-white/5 rounded-sm p-3 text-xs text-white/80 focus:border-gold/40 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Tags (séparés par virgule)</label>
                  <input 
                    type="text" placeholder="classic, gold, diamond"
                    value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})}
                    className="w-full bg-[#050505] border border-white/5 rounded-sm p-3 text-xs text-white/80 focus:border-gold/40 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Description Editoriale</label>
                  <textarea 
                    rows={4}
                    value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})}
                    className="w-full bg-[#050505] border border-white/5 rounded-sm p-4 text-xs text-white/60 focus:border-gold/40 outline-none transition-all resize-none"
                    placeholder="Écrivez une description luxueuse pour ce bijou..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t border-white/5 mt-8">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3.5 text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" disabled={actionLoading}
                  className="bg-white text-black hover:bg-gold hover:text-white px-10 py-3.5 rounded-sm font-bold text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl disabled:opacity-50"
                >
                  {actionLoading ? 'Traitement...' : editingProduct ? 'Confirmer les changements' : 'Lancer la création'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Style overrides for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #050505;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4AF3744;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D4AF37;
        }
      `}</style>
    </div>
  );
}
