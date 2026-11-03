import { useState, useEffect } from 'react';
import { Heart, Edit3, CheckSquare, MessageCircle, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useRequireAdmin } from '@/lib/portalGuard';
import PortalNoIndex from '../../components/PortalNoIndex';

const FILTERS = ['All', 'Favorites', 'Requested Edits', 'Final Picks', 'Commented'];

const Badge = ({ show, icon: Icon, label, color }) => {
  if (!show) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-montserrat font-bold tracking-wider uppercase ${color}`}>
      <Icon size={9} /> {label}
    </span>
  );
};

export default function AdminSelections() {
  const { user, loading: authLoading } = useRequireAdmin();
  const [selections, setSelections] = useState([]);
  const [images, setImages] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [clients, setClients] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      base44.entities.ImageSelection.list('-updated_date', 500),
      base44.entities.GalleryImage.list('sort_order', 1000),
      base44.entities.Gallery.list('-updated_date', 200),
      base44.entities.User.list('-created_date', 200),
    ]).then(([sels, imgs, gals, users]) => {
      setSelections(sels);
      setImages(imgs);
      setGalleries(gals);
      setClients(users);
    }).finally(() => setDataLoading(false));
  }, [user]);

  if (authLoading || dataLoading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Enrich selections with related data
  const enriched = selections.map(sel => {
    const img = images.find(i => i.id === sel.image_id);
    const gallery = galleries.find(g => g.id === sel.gallery_id);
    const client = clients.find(c => c.id === sel.client_id);
    return { ...sel, img, gallery, client };
  }).filter(s => s.is_favorite || s.requested_edit || s.final_pick || s.client_comment);

  const filtered = enriched.filter(sel => {
    const matchFilter =
      filter === 'All' ||
      (filter === 'Favorites' && sel.is_favorite) ||
      (filter === 'Requested Edits' && sel.requested_edit) ||
      (filter === 'Final Picks' && sel.final_pick) ||
      (filter === 'Commented' && !!sel.client_comment);
    const clientName = sel.client?.full_name || sel.client?.email || '';
    const galleryTitle = sel.gallery?.title || '';
    const filename = sel.img?.filename || '';
    const matchSearch = clientName.toLowerCase().includes(search.toLowerCase()) ||
      galleryTitle.toLowerCase().includes(search.toLowerCase()) ||
      filename.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <PortalNoIndex />
      <div className="mb-8">
        <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-1">Studio Management</p>
        <h1 className="text-white text-2xl font-montserrat font-bold mb-1">Client Selections</h1>
        <p className="text-white/30 text-xs font-montserrat">{enriched.length} selected images across all galleries</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client, gallery, filename..."
            className="w-full bg-white border border-white/8 text-gray-900 text-xs font-montserrat pl-10 pr-4 py-3 placeholder:text-gray-400 focus:border-gold/40 focus:outline-none rounded-sm transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 text-[10px] font-montserrat font-semibold tracking-wider uppercase rounded-sm border transition-all ${
                filter === f ? 'bg-gold/15 border-gold/40 text-gold' : 'border-white/8 text-white/35 hover:border-white/20 hover:text-white/60'
              }`}>{f}</button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="flex gap-4 flex-wrap mb-8 pb-6 border-b border-white/6">
        {[
          { label: 'Favourites', count: enriched.filter(i => i.is_favorite).length, color: 'text-rose-400', icon: Heart },
          { label: 'Edit Requests', count: enriched.filter(i => i.requested_edit).length, color: 'text-blue-400', icon: Edit3 },
          { label: 'Final Picks', count: enriched.filter(i => i.final_pick).length, color: 'text-gold', icon: CheckSquare },
          { label: 'Commented', count: enriched.filter(i => i.client_comment).length, color: 'text-white/50', icon: MessageCircle },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-2 px-4 py-2 bg-white/3 border border-white/8 rounded-sm">
              <Icon size={12} className={stat.color} />
              <span className="text-white/60 text-xs font-montserrat">{stat.count} <span className="text-white/30">{stat.label}</span></span>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white/3 border border-white/8 rounded-sm overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/6">
          {[['Image',1],['Filename',2],['Client',2],['Gallery',2],['Tags',2],['Comment',3]].map(([h, span]) => (
            <div key={h} className={`text-white/25 text-[10px] font-montserrat tracking-[0.2em] uppercase col-span-${span}`}>{h}</div>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-white/5">
          {filtered.map((sel, i) => (
            <motion.div key={sel.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-white/2 transition-colors items-center">
              <div className="md:col-span-1">
                <div className="w-12 h-12 rounded-sm overflow-hidden bg-white/4">
                  {sel.img && <img src={sel.img.thumbnail_url || sel.img.image_url} alt={sel.img.filename} className="w-full h-full object-cover" loading="lazy" />}
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-white/60 text-xs font-montserrat truncate">{sel.img?.filename || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-white/80 text-xs font-montserrat font-semibold">{sel.client?.full_name || sel.client?.email || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-white/40 text-xs font-montserrat truncate">{sel.gallery?.title || '—'}</p>
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-1">
                <Badge show={sel.is_favorite} icon={Heart} label="Fav" color="bg-rose-500/15 text-rose-400 border border-rose-500/25" />
                <Badge show={sel.requested_edit} icon={Edit3} label="Edit" color="bg-blue-500/15 text-blue-400 border border-blue-500/25" />
                <Badge show={sel.final_pick} icon={CheckSquare} label="Final" color="bg-gold/15 text-gold border border-gold/25" />
              </div>
              <div className="md:col-span-3">
                {sel.client_comment ? (
                  <p className="text-white/35 text-[11px] font-montserrat font-light italic leading-relaxed line-clamp-2">"{sel.client_comment}"</p>
                ) : (
                  <span className="text-white/15 text-[10px] font-montserrat">—</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter size={24} className="text-white/15 mb-4" />
            <p className="text-white/25 text-sm font-montserrat">No selections match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}