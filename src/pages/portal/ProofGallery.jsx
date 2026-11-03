import { useState } from 'react';
import { Heart, Edit3, CheckSquare, MessageCircle, ZoomIn, Filter, Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRequireAuth } from '@/lib/portalGuard';
import { useClientRecord, useClientGallery, useProofImages, useSelections } from '@/hooks/useGallery';
import ImageLightbox from '../../components/dashboard/ImageLightbox';
import PortalNoIndex from '../../components/PortalNoIndex';

const FILTERS = ['All', 'Favorites', 'Requested Edit', 'Final Picks', 'Commented'];

function ActionIcon({ icon: Icon, active, color, label, onClick }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={label}
      className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all duration-200 ${
        active
          ? `${color} border-current`
          : 'bg-black/60 border-white/20 text-white/60 hover:text-white hover:border-white/50'
      }`}
    >
      <Icon size={12} />
    </button>
  );
}

export default function ProofGallery() {
  const { user, loading: authLoading } = useRequireAuth('/portal');
  const { client, loading: clientLoading } = useClientRecord(user?.email);
  const { gallery, loading: galleryLoading } = useClientGallery(client?.id);
  const { images: rawImages, loading: imagesLoading } = useProofImages(gallery?.id);
  const { selections, upsertSelection, loading: selLoading } = useSelections(client?.id, gallery?.id);

  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const loading = authLoading || clientLoading || galleryLoading || imagesLoading || selLoading;

  const images = rawImages.map(img => {
    const sel = selections.find(s => s.image_id === img.id);
    return {
      ...img,
      src: img.image_url,
      favorite: sel?.is_favorite || false,
      editRequest: sel?.requested_edit || false,
      finalPick: sel?.final_pick || false,
      comment: sel?.client_comment || '',
      selectionId: sel?.id,
    };
  });

  const toggle = async (imgId, key) => {
    setSavingId(imgId);
    const img = images.find(i => i.id === imgId);
    if (!img) return;
    const fieldMap = { favorite: 'is_favorite', editRequest: 'requested_edit', finalPick: 'final_pick' };
    const dbKey = fieldMap[key];
    if (dbKey) await upsertSelection(imgId, { [dbKey]: !img[key] });
    setSavingId(null);
  };

  const updateComment = async (imgId, comment) => {
    await upsertSelection(imgId, { client_comment: comment });
  };

  const filtered = images.filter(img => {
    if (filter === 'Favorites') return img.favorite;
    if (filter === 'Requested Edit') return img.editRequest;
    if (filter === 'Final Picks') return img.finalPick;
    if (filter === 'Commented') return !!img.comment;
    return true;
  });

  const lightboxIndex = lightbox !== null ? filtered.findIndex(i => i.id === lightbox) : -1;

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!gallery) return (
    <div className="p-10 flex flex-col items-center justify-center text-center py-24">
      <Grid size={28} className="text-white/15 mb-4" />
      <p className="text-white/30 text-sm font-montserrat mb-1">No gallery assigned yet</p>
      <p className="text-white/15 text-xs font-montserrat">Your photographer will upload your proof images here.</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-10">
      <PortalNoIndex />
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-1">{gallery.title}</p>
          <h1 className="text-white text-2xl font-montserrat font-bold">Proof Gallery</h1>
          <p className="text-white/30 text-xs font-montserrat mt-1">{images.length} images · Select your favourites</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-8 pb-6 border-b border-white/6">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-[10px] font-montserrat font-semibold tracking-[0.15em] uppercase rounded-sm border transition-all duration-200 ${
              filter === f ? 'bg-gold/15 border-gold/40 text-gold' : 'border-white/8 text-white/35 hover:border-white/20 hover:text-white/60'
            }`}>
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1 text-white/25 text-[10px] font-montserrat">
          <Filter size={11} /><span>{filtered.length} shown</span>
        </div>
      </div>

      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Grid size={28} className="text-white/15 mb-4" />
          <p className="text-white/30 text-sm font-montserrat mb-1">No proof images yet</p>
          <p className="text-white/15 text-xs font-montserrat">Your photographer is preparing your gallery.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map((img) => (
          <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-square overflow-hidden rounded-sm cursor-pointer bg-white/4"
            onClick={() => setLightbox(img.id)}>
            <img src={img.thumbnail_url || img.image_url} alt={img.filename}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute top-2 left-2 flex gap-1">
              {img.favorite && <span className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center"><Heart size={9} fill="white" className="text-white" /></span>}
              {img.editRequest && <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><Edit3 size={9} className="text-white" /></span>}
              {img.finalPick && <span className="w-5 h-5 bg-gold rounded-full flex items-center justify-center"><CheckSquare size={9} className="text-black" /></span>}
              {img.comment && <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center"><MessageCircle size={9} className="text-white" /></span>}
            </div>
            {savingId === img.id && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
              <div className="flex gap-2">
                <ActionIcon icon={Heart} active={img.favorite} color="text-rose-400 bg-rose-500/30" label="Favorite" onClick={() => toggle(img.id, 'favorite')} />
                <ActionIcon icon={Edit3} active={img.editRequest} color="text-blue-400 bg-blue-500/30" label="Request Edit" onClick={() => toggle(img.id, 'editRequest')} />
                <ActionIcon icon={CheckSquare} active={img.finalPick} color="text-gold bg-gold/25" label="Final Pick" onClick={() => toggle(img.id, 'finalPick')} />
              </div>
              <button className="flex items-center gap-1.5 text-white/60 text-[10px] font-montserrat tracking-wider uppercase hover:text-white transition-colors">
                <ZoomIn size={11} /> View
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white/50 text-[9px] font-montserrat">{img.filename}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {images.some(i => i.favorite || i.finalPick || i.editRequest) && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
          <div className="bg-[#0d0d10]/95 backdrop-blur-xl border border-gold/30 rounded-sm px-8 py-4 flex items-center gap-6 shadow-2xl">
            <div className="flex items-center gap-4 text-xs font-montserrat">
              <span className="text-white/50">{images.filter(i => i.favorite).length} <span className="text-rose-400">Fav</span></span>
              <span className="text-white/50">{images.filter(i => i.finalPick).length} <span className="text-gold">Final</span></span>
              <span className="text-white/50">{images.filter(i => i.editRequest).length} <span className="text-blue-400">Edit</span></span>
            </div>
            <Link to="/portal/selections" className="px-6 py-2.5 bg-gold text-black text-[10px] font-montserrat font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-gold/90 transition-colors">
              Review Selections
            </Link>
          </div>
        </div>
      )}

      <AnimatePresence>
        {lightbox !== null && lightboxIndex >= 0 && (
          <ImageLightbox
            images={filtered}
            index={lightboxIndex}
            onClose={() => setLightbox(null)}
            onNavigate={(i) => setLightbox(filtered[i].id)}
            onToggle={(id, key) => toggle(id, key)}
            onComment={updateComment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}