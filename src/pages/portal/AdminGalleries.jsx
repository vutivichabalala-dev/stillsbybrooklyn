import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Trash2, X, UserPlus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useRequireAdmin } from '@/lib/portalGuard';
import PortalNoIndex from '../../components/PortalNoIndex';

const STATUS_COLORS = {
  'Awaiting Selections': 'text-blue-400 bg-blue-500/10 border-blue-500/25',
  'Selections Received': 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  'In Editing': 'text-orange-400 bg-orange-500/10 border-orange-500/25',
  'Final Ready': 'text-green-400 bg-green-500/10 border-green-500/25',
  'Draft': 'text-white/30 bg-white/5 border-white/10',
  'Delivered': 'text-white/50 bg-white/5 border-white/15',
};

function NewClientInline({ onCreated, onCancel }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email) { setError('Name and email are required.'); return; }
    setSaving(true);
    const client = await base44.entities.Client.create({ ...form, invite_status: 'not_invited' });
    onCreated(client);
    setSaving(false);
  };

  return (
    <div className="mt-3 p-4 bg-white/4 border border-gold/20 rounded-sm">
      <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.2em] uppercase mb-3">New Client Details</p>
      {error && <p className="text-red-400 text-[11px] font-montserrat mb-3">{error}</p>}
      <form onSubmit={handleCreate} className="flex flex-col gap-3">
        {[
          { field: 'full_name', label: 'Full Name *', placeholder: 'Client full name', type: 'text' },
          { field: 'email', label: 'Email *', placeholder: 'client@email.com', type: 'email' },
          { field: 'phone', label: 'Phone (optional)', placeholder: '+27 XX XXX XXXX', type: 'tel' },
        ].map(({ field, label, placeholder, type }) => (
          <div key={field} className="flex flex-col gap-1">
            <label className="text-white/30 text-[9px] font-montserrat tracking-[0.2em] uppercase">{label}</label>
            <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
              placeholder={placeholder}
              className="bg-white border border-white/10 text-gray-900 text-sm font-montserrat px-3 py-2.5 placeholder:text-gray-400 focus:border-gold/40 focus:outline-none rounded-sm" />
          </div>
        ))}
        <div className="flex gap-2 mt-1">
          <button type="button" onClick={onCancel}
            className="flex-1 py-2 border border-white/10 text-white/40 text-[10px] font-montserrat uppercase tracking-wider rounded-sm hover:border-white/25 transition-all">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 py-2 bg-gold/15 border border-gold/50 text-gold text-[10px] font-montserrat font-bold uppercase tracking-wider rounded-sm hover:bg-gold hover:text-black transition-all disabled:opacity-50">
            {saving ? 'Creating...' : 'Create Client'}
          </button>
        </div>
      </form>
    </div>
  );
}

function NewGalleryModal({ clients, onClose, onCreated, onClientCreated }) {
  const [form, setForm] = useState({ title: '', shoot_type: 'Weddings', client_id: '', event_date: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [clientMode, setClientMode] = useState('existing'); // 'existing' | 'new'
  const [allClients, setAllClients] = useState(clients);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    if (!form.client_id) { alert('Please select or create a client first.'); return; }
    setSaving(true);
    const gallery = await base44.entities.Gallery.create({ ...form, gallery_status: 'Draft' });
    onCreated(gallery);
    setSaving(false);
  };

  const handleNewClientCreated = (client) => {
    setAllClients(prev => [client, ...prev]);
    setForm(prev => ({ ...prev, client_id: client.id }));
    setClientMode('existing');
    onClientCreated(client);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-[#171415] border border-white/10 rounded-sm p-8 my-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-montserrat font-bold text-base">New Gallery</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={16} /></button>
        </div>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/35 text-[10px] font-montserrat tracking-[0.2em] uppercase">Gallery Title *</label>
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Spring Wedding"
              className="bg-white border border-white/10 text-gray-900 text-sm font-montserrat px-4 py-3 placeholder:text-gray-400 focus:border-gold/40 focus:outline-none rounded-sm" />
          </div>

          {/* Client selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/35 text-[10px] font-montserrat tracking-[0.2em] uppercase">Client *</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setClientMode('existing')}
                className={`flex-1 py-2 text-[10px] font-montserrat font-semibold uppercase tracking-wider rounded-sm border transition-all ${
                  clientMode === 'existing' ? 'bg-white/10 border-white/25 text-white/80' : 'border-white/8 text-white/30 hover:border-white/20'
                }`}>
                Select Existing
              </button>
              <button type="button" onClick={() => setClientMode('new')}
                className={`flex-1 py-2 text-[10px] font-montserrat font-semibold uppercase tracking-wider rounded-sm border transition-all flex items-center justify-center gap-1.5 ${
                  clientMode === 'new' ? 'bg-gold/15 border-gold/40 text-gold' : 'border-white/8 text-white/30 hover:border-white/20'
                }`}>
                <UserPlus size={11} /> Add New Client
              </button>
            </div>

            {clientMode === 'existing' && (
              <select required value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}
                className="bg-white border border-white/10 text-gray-900 text-sm font-montserrat px-4 py-3 focus:border-gold/40 focus:outline-none rounded-sm">
                <option value="">Select client...</option>
                {allClients.map(c => <option key={c.id} value={c.id}>{c.full_name || c.email}</option>)}
              </select>
            )}

            {clientMode === 'new' && (
              <NewClientInline
                onCreated={handleNewClientCreated}
                onCancel={() => setClientMode('existing')}
              />
            )}

            {form.client_id && clientMode === 'existing' && (
              <p className="text-green-400/70 text-[10px] font-montserrat">
                ✓ {allClients.find(c => c.id === form.client_id)?.full_name} selected
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-white/35 text-[10px] font-montserrat tracking-[0.2em] uppercase">Shoot Type</label>
              <select value={form.shoot_type} onChange={e => setForm({ ...form, shoot_type: e.target.value })}
                className="bg-white border border-white/10 text-gray-900 text-sm font-montserrat px-4 py-3 focus:border-gold/40 focus:outline-none rounded-sm">
                {['Weddings', 'Corporate', 'Portraits', 'Graduations', 'Other'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-white/35 text-[10px] font-montserrat tracking-[0.2em] uppercase">Event Date</label>
              <input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })}
                className="bg-white border border-white/10 text-gray-900 text-sm font-montserrat px-4 py-3 focus:border-gold/40 focus:outline-none rounded-sm" />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-white/10 text-white/40 text-xs font-montserrat uppercase tracking-wider rounded-sm hover:border-white/30 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving || !form.title || !form.client_id}
              className="flex-1 py-3 bg-gold/15 border border-gold/50 text-gold text-xs font-montserrat font-bold uppercase tracking-wider rounded-sm hover:bg-gold hover:text-black transition-all disabled:opacity-40">
              {saving ? 'Creating...' : 'Create Gallery'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function AdminGalleries() {
  const { user, loading: authLoading } = useRequireAdmin();
  const [galleries, setGalleries] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      base44.entities.Gallery.list('-updated_date', 200),
      base44.entities.Client.list('-created_date', 200),
    ]).then(([gals, cls]) => {
      setGalleries(gals);
      setClients(cls);
    }).finally(() => setDataLoading(false));
  }, [user]);

  if (authLoading || dataLoading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statuses = ['All', ...Object.keys(STATUS_COLORS)];
  const filtered = galleries.filter(g => {
    const client = clients.find(c => c.id === g.client_id);
    const matchSearch = g.title?.toLowerCase().includes(search.toLowerCase()) ||
      client?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      client?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || g.gallery_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id) => {
    await base44.entities.Gallery.delete(id);
    setGalleries(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <PortalNoIndex />
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-1">Studio Management</p>
          <h1 className="text-white text-2xl font-montserrat font-bold">Galleries</h1>
          <p className="text-white/30 text-xs font-montserrat mt-1">{galleries.length} galleries</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold/10 border border-gold/50 text-gold text-xs font-montserrat font-bold tracking-[0.15em] uppercase rounded-sm hover:bg-gold hover:text-black transition-all">
          <Plus size={14} /> New Gallery
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client or gallery..."
            className="w-full bg-white border border-white/8 text-gray-900 text-xs font-montserrat pl-10 pr-4 py-3 placeholder:text-gray-400 focus:border-gold/40 focus:outline-none rounded-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-[10px] font-montserrat font-semibold tracking-wider uppercase rounded-sm border transition-all ${
                statusFilter === s ? 'bg-gold/15 border-gold/40 text-gold' : 'border-white/8 text-white/35 hover:border-white/20 hover:text-white/60'
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Plus size={24} className="text-white/15 mb-4" />
          <p className="text-white/30 text-sm font-montserrat">No galleries yet</p>
          <p className="text-white/15 text-xs font-montserrat mt-1">Create your first gallery to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((gallery, i) => {
            const client = clients.find(c => c.id === gallery.client_id);
            return (
              <motion.div key={gallery.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white/3 border border-white/8 rounded-sm overflow-hidden group hover:border-white/15 transition-all">
                <div className="relative h-40 bg-white/4 overflow-hidden">
                  {gallery.cover_image ? (
                    <img src={gallery.cover_image} alt={gallery.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/15 text-xs font-montserrat tracking-widest uppercase">No Cover</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-sm border text-[9px] font-montserrat font-bold tracking-wider uppercase ${STATUS_COLORS[gallery.gallery_status] || STATUS_COLORS['Draft']}`}>
                      {gallery.gallery_status}
                    </span>
                  </div>
                  {!client && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded-sm border text-[9px] font-montserrat font-bold tracking-wider uppercase bg-red-500/20 border-red-500/40 text-red-400">
                        No Client
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-white/30 text-[10px] font-montserrat tracking-wider mb-1">
                    {client ? `${client.full_name} · ${client.email}` : '⚠ No client assigned'}
                  </p>
                  <h3 className="text-white font-montserrat font-semibold text-sm mb-1">{gallery.title}</h3>
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-white/25 text-[10px] font-montserrat">{gallery.shoot_type}</span>
                    {gallery.event_date && <>
                      <span className="text-white/15">·</span>
                      <span className="text-white/25 text-[10px] font-montserrat">{new Date(gallery.event_date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </>}
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/6">
                    <Link to={`/portal/admin/galleries/${gallery.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-white/10 text-white/50 text-[10px] font-montserrat uppercase tracking-wider rounded-sm hover:border-white/25 hover:text-white/80 transition-all">
                      <Eye size={11} /> Manage
                    </Link>
                    <button onClick={() => handleDelete(gallery.id)}
                      className="w-9 h-9 flex items-center justify-center border border-white/6 text-white/20 rounded-sm hover:border-red-500/30 hover:text-red-400 transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <NewGalleryModal
            clients={clients}
            onClose={() => setShowModal(false)}
            onClientCreated={(client) => setClients(prev => [client, ...prev])}
            onCreated={(gallery) => { setGalleries(prev => [gallery, ...prev]); setShowModal(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}