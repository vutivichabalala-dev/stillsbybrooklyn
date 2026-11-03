import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Plus, SlidersHorizontal, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ReelCard from '../components/reels/ReelCard';
import ReelUploadModal from '../components/reels/ReelUploadModal';

const CATEGORIES = ['All', 'Corporate', 'Portraits', 'Weddings', 'Graduations', 'Behind the Scenes', 'Other'];

function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent pointer-events-none"
      initial={{ top: '0%', opacity: 0 }}
      animate={{ top: ['0%', '100%'], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
    />
  );
}

function Particles() {
  const dots = [
    { w: 2, h: 2, l: 15, t: 20, dur: 5, delay: 0 },
    { w: 3, h: 3, l: 30, t: 60, dur: 6, delay: 1 },
    { w: 1, h: 1, l: 55, t: 35, dur: 4, delay: 2 },
    { w: 2, h: 2, l: 70, t: 75, dur: 7, delay: 0.5 },
    { w: 3, h: 3, l: 85, t: 15, dur: 5, delay: 1.5 },
    { w: 1, h: 1, l: 42, t: 85, dur: 6, delay: 3 },
    { w: 2, h: 2, l: 92, t: 50, dur: 4, delay: 2.5 },
    { w: 3, h: 3, l: 8,  t: 55, dur: 8, delay: 1 },
    { w: 2, h: 2, l: 60, t: 10, dur: 5, delay: 0.8 },
    { w: 1, h: 1, l: 78, t: 90, dur: 6, delay: 2 },
  ];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold/20"
          style={{ width: d.w, height: d.h, left: `${d.l}%`, top: `${d.t}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: d.dur, repeat: Infinity, delay: d.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showUpload, setShowUpload] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    document.title = 'Video Reels';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Watch cinematic video reels and behind-the-scenes footage from Stills by Brooklyn photography sessions across Johannesburg.');
    loadReels();
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const user = await base44.auth.me();
      setIsAdmin(user?.role === 'admin');
    } catch { /* public viewer */ }
  };

  const loadReels = async () => {
    setLoading(true);
    const data = await base44.entities.Reel.list('-created_date', 100);
    const sorted = [...data].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });
    setReels(sorted);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.Reel.delete(id);
    loadReels();
  };

  const filtered = filter === 'All' ? reels : reels.filter(r => r.category === filter);
  const hasReels = filtered.length > 0;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">

      {/* Hero */}
      <div className="relative pt-32 pb-16 px-6 overflow-hidden">
        <Particles />
        <ScanLine />

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="absolute top-16 left-1/4 w-96 h-32 bg-gold/8 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-24 right-1/4 w-64 h-24 bg-gold/5 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center w-14 h-14 border border-gold/40 rounded-xl mb-6 relative"
          >
            <div className="absolute inset-0 rounded-xl bg-gold/5 animate-pulse" />
            <Film size={22} className="text-gold relative z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="text-gold text-[10px] font-montserrat font-semibold tracking-[0.4em] uppercase block mb-3">
              Motion Portfolio
            </span>
            <h1 className="text-4xl md:text-6xl font-montserrat font-bold text-white mb-4 leading-tight">
              Reels &amp; <span className="text-gold">Video</span>
            </h1>
            <p className="text-white/40 text-sm font-montserrat font-light max-w-md mx-auto leading-relaxed">
              Cinematic moments captured in motion — behind the scenes, live sessions, and the stories between the frames.
            </p>
          </motion.div>

          {/* Admin upload button — only visible to admins */}
          {isAdmin && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setShowUpload(true)}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-gold/60 bg-gold/10 text-gold text-xs font-montserrat font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-gold hover:text-black transition-all duration-300"
            >
              <Plus size={13} />
              Post New Reel
            </motion.button>
          )}
        </div>
      </div>

      {/* Filter bar — only visible to admins when there are reels */}
      {(isAdmin || hasReels) && (
        <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-white/6">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <SlidersHorizontal size={13} className="text-white/25 flex-shrink-0 mr-1" />
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="relative flex-shrink-0 px-4 py-1.5 text-[10px] font-montserrat tracking-[0.2em] uppercase rounded-sm transition-all duration-200"
                style={{
                  color: filter === cat ? 'hsl(46,70%,55%)' : 'rgba(255,255,255,0.35)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: filter === cat ? 'hsla(46,70%,55%,0.5)' : 'rgba(255,255,255,0.08)',
                  background: filter === cat ? 'rgba(204,163,51,0.08)' : 'transparent',
                }}
              >
                {cat}
                {filter === cat && (
                  <motion.div
                    layoutId="filterUnderline"
                    className="absolute bottom-0 left-2 right-2 h-px bg-gold"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-white/4 animate-pulse" style={{ aspectRatio: '9/16' }} />
            ))}
          </div>
        ) : !hasReels && !isAdmin ? (
          /* Public coming soon */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center py-32 gap-6 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gold/10 blur-2xl rounded-full scale-150" />
              <div className="relative w-20 h-20 border border-gold/30 rounded-2xl flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <Clock size={30} className="text-gold opacity-80" />
              </div>
            </div>
            <div>
              <span className="text-gold text-[10px] font-montserrat font-semibold tracking-[0.4em] uppercase block mb-3">
                Coming Soon
              </span>
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-3">
                Video Portfolio
              </h2>
              <p className="text-white/35 text-sm font-montserrat font-light max-w-sm mx-auto leading-relaxed">
                Cinematic reels and behind-the-scenes footage are on their way. Check back soon.
              </p>
            </div>
            <div className="flex gap-2 mt-2">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gold/50"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        ) : !hasReels && isAdmin ? (
          /* Admin empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-4 text-white/25"
          >
            <Film size={40} />
            <p className="font-montserrat text-sm tracking-widest uppercase">No reels yet</p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-2 px-6 py-2.5 border border-gold/40 text-gold text-xs font-montserrat tracking-widest uppercase hover:bg-gold/10 transition-all rounded-sm"
            >
              Upload First Reel
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          >
            <AnimatePresence>
              {filtered.map((reel, i) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Upload modal — admin only */}
      {isAdmin && (
        <AnimatePresence>
          {showUpload && (
            <ReelUploadModal
              onClose={() => setShowUpload(false)}
              onSaved={loadReels}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}