import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Edit3, CheckSquare, MessageCircle, Send, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useRequireAuth } from '@/lib/portalGuard';
import { useClientRecord, useClientGallery, useProofImages, useSelections } from '@/hooks/useGallery';
import PortalNoIndex from '../../components/PortalNoIndex';

const TABS = ['All Selected', 'Favorites', 'Requested Edit', 'Final Picks', 'Commented'];

const Badge = ({ icon: Icon, label, color }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[9px] font-montserrat font-bold tracking-wider uppercase ${color}`}>
    <Icon size={9} /> {label}
  </span>
);

function SubmitModal({ count, onClose, onConfirm, submitting }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#171415] border border-white/10 rounded-sm p-10 text-center">
        <div className="w-12 h-12 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center mx-auto mb-6">
          <Send size={18} className="text-gold" />
        </div>
        <h3 className="text-white text-xl font-montserrat font-bold mb-3">Submit Selections</h3>
        <p className="text-white/40 text-sm font-montserrat font-light leading-relaxed mb-2">
          You are about to submit <strong className="text-white/70">{count} selected images</strong> to the photographer for editing.
        </p>
        <p className="text-white/25 text-xs font-montserrat mb-8">Selections will be locked after submission.</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={submitting}
            className="flex-1 py-3 border border-white/10 text-white/40 text-xs font-montserrat uppercase tracking-wider rounded-sm hover:border-white/30 hover:text-white/70 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={submitting}
            className="flex-1 py-3 bg-gold/15 border border-gold/50 text-gold text-xs font-montserrat font-bold uppercase tracking-wider rounded-sm hover:bg-gold hover:text-black transition-all disabled:opacity-50">
            {submitting ? 'Submitting...' : 'Submit Now'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SuccessState() {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full border border-gold bg-gold/10 flex items-center justify-center mb-6">
        <Check size={24} className="text-gold" />
      </div>
      <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-3">Submission Successful</p>
      <h2 className="text-white text-2xl font-montserrat font-bold mb-3">Your selections have been submitted.</h2>
      <p className="text-white/40 text-sm font-montserrat font-light leading-relaxed max-w-sm mb-8">
        Brooklyn will review your selections and begin editing. Your final gallery will be ready soon.
      </p>
      <Link to="/portal/dashboard" className="inline-flex items-center gap-2 px-8 py-3 border border-white/15 text-white/60 text-xs font-montserrat uppercase tracking-wider rounded-sm hover:border-white/40 hover:text-white transition-all">
        Back to Dashboard <ArrowRight size={12} />
      </Link>
    </motion.div>
  );
}

export default function MySelections() {
  const { user, loading: authLoading } = useRequireAuth('/portal');
  const { client, loading: clientLoading } = useClientRecord(user?.email);
  const { gallery, loading: galleryLoading } = useClientGallery(client?.id);
  const { images: proofImages } = useProofImages(gallery?.id);
  const { selections, loading: selLoading } = useSelections(client?.id, gallery?.id);

  const [tab, setTab] = useState('All Selected');
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loading = authLoading || clientLoading || galleryLoading || selLoading;

  const enriched = selections.map(sel => {
    const img = proofImages.find(i => i.id === sel.image_id);
    return { ...sel, src: img?.thumbnail_url || img?.image_url || '', filename: img?.filename || 'Unknown' };
  });

  const filtered = enriched.filter(sel => {
    if (tab === 'Favorites') return sel.is_favorite;
    if (tab === 'Requested Edit') return sel.requested_edit;
    if (tab === 'Final Picks') return sel.final_pick;
    if (tab === 'Commented') return !!sel.client_comment;
    return true;
  });

  const handleSubmit = async () => {
    setSubmitting(true);
    const now = new Date().toISOString();
    for (const sel of selections) {
      await base44.entities.ImageSelection.update(sel.id, { submitted: true, submitted_at: now });
    }
    await base44.entities.GallerySubmission.create({
      gallery_id: gallery.id,
      client_id: client.id,
      total_selected: selections.length,
      total_favorites: selections.filter(s => s.is_favorite).length,
      total_requested_edits: selections.filter(s => s.requested_edit).length,
      total_final_picks: selections.filter(s => s.final_pick).length,
      submission_status: 'submitted',
      submitted_at: now,
    });
    await base44.entities.Gallery.update(gallery.id, {
      gallery_status: 'Selections Received',
      selections_submitted_at: now,
      selections_locked: true,
    });
    await base44.functions.invoke('portalNotify', {
      type: 'selections_submitted',
      data: { galleryId: gallery.id },
    });
    setSubmitting(false);
    setShowModal(false);
    setSubmitted(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (submitted) return <div className="p-6 lg:p-10"><SuccessState /></div>;

  const isLocked = gallery?.selections_locked && selections.some(s => s.submitted);

  return (
    <div className="p-6 lg:p-10">
      <PortalNoIndex />
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-1">{gallery?.title || 'My Gallery'}</p>
          <h1 className="text-white text-2xl font-montserrat font-bold">My Selections</h1>
          <p className="text-white/30 text-xs font-montserrat mt-1">{selections.length} images selected</p>
        </div>
        {!isLocked && selections.length > 0 && (
          <button onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-7 py-3 bg-gold/10 border border-gold/50 text-gold text-xs font-montserrat font-bold tracking-[0.15em] uppercase rounded-sm hover:bg-gold hover:text-black transition-all">
            Submit Selections <Send size={12} />
          </button>
        )}
        {isLocked && (
          <span className="px-4 py-2 border border-green-500/30 text-green-400 text-[10px] font-montserrat font-bold tracking-wider uppercase rounded-sm bg-green-500/10">
            ✓ Submitted
          </span>
        )}
      </div>

      <div className="flex gap-2 flex-wrap mb-8 pb-6 border-b border-white/6">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-[10px] font-montserrat font-semibold tracking-[0.15em] uppercase rounded-sm border transition-all duration-200 ${
              tab === t ? 'bg-gold/15 border-gold/40 text-gold' : 'border-white/8 text-white/35 hover:border-white/20 hover:text-white/60'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart size={24} className="text-white/15 mb-4" />
          <p className="text-white/30 text-sm font-montserrat">No selections in this category</p>
          <p className="text-white/15 text-xs font-montserrat mt-1">Go to the proof gallery to select images.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((sel) => (
              <motion.div key={sel.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white/3 border border-white/8 rounded-sm overflow-hidden hover:border-white/15 transition-all group">
                <div className="aspect-[4/3] overflow-hidden relative">
                  {sel.src && <img src={sel.src} alt={sel.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-4">
                  <p className="text-white/40 text-[10px] font-montserrat mb-3">{sel.filename}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {sel.is_favorite && <Badge icon={Heart} label="Favourite" color="bg-rose-500/20 text-rose-400 border border-rose-500/30" />}
                    {sel.requested_edit && <Badge icon={Edit3} label="Edit Requested" color="bg-blue-500/20 text-blue-400 border border-blue-500/30" />}
                    {sel.final_pick && <Badge icon={CheckSquare} label="Final Pick" color="bg-gold/20 text-gold border border-gold/30" />}
                  </div>
                  {sel.client_comment && (
                    <div className="flex items-start gap-2 pt-3 border-t border-white/6">
                      <MessageCircle size={11} className="text-white/25 mt-0.5 shrink-0" />
                      <p className="text-white/40 text-[11px] font-montserrat font-light leading-relaxed italic">"{sel.client_comment}"</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <SubmitModal
            count={selections.length}
            submitting={submitting}
            onClose={() => setShowModal(false)}
            onConfirm={handleSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}