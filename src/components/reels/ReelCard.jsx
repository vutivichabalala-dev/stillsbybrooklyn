import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Trash2, Star } from 'lucide-react';

export default function ReelCard({ reel, isAdmin, onDelete, index = 0 }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-play on hover
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered) {
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      v.pause();
      v.currentTime = 0;
      setPlaying(false);
      setProgress(0);
    }
  }, [hovered]);

  const togglePlay = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const handleScrub = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  };

  return (
    <motion.div
      style={{ '--delay': index }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative group rounded-xl overflow-hidden border border-white/8 bg-black shadow-2xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Video */}
      <div className="relative w-full" style={{ aspectRatio: '9/16' }}>
        {reel.thumbnail_url && !hovered && (
          <img
            src={reel.thumbnail_url}
            alt={reel.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <video
          ref={videoRef}
          src={reel.video_url}
          className="w-full h-full object-cover"
          muted={muted}
          loop
          playsInline
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          style={{ display: reel.thumbnail_url && !hovered ? 'none' : 'block' }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

        {/* Scan-line texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 3px)', backgroundSize: '100% 3px' }}
        />

        {/* Featured badge */}
        {reel.is_featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-gold/20 border border-gold/40 px-2 py-0.5 rounded-sm backdrop-blur-sm">
            <Star size={9} className="text-gold fill-gold" />
            <span className="text-gold text-[9px] font-montserrat tracking-widest uppercase">Featured</span>
          </div>
        )}

        {/* Category tag */}
        {reel.category && (
          <div className="absolute top-3 right-3 bg-black/50 border border-white/10 px-2 py-0.5 rounded-sm backdrop-blur-sm">
            <span className="text-white/60 text-[9px] font-montserrat tracking-widest uppercase">{reel.category}</span>
          </div>
        )}

        {/* Controls — visible on hover */}
        <div className={`absolute bottom-0 left-0 right-0 px-3 pb-3 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress bar */}
          <div
            className="w-full h-0.5 bg-white/20 rounded-full mb-2 cursor-pointer"
            onClick={handleScrub}
          >
            <div
              className="h-full bg-gold rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-sm transition-all">
              {playing ? <Pause size={12} className="text-white" /> : <Play size={12} className="text-white ml-0.5" />}
            </button>
            <button onClick={toggleMute} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-sm transition-all">
              {muted ? <VolumeX size={12} className="text-white" /> : <Volume2 size={12} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Play indicator when not hovered */}
        {!hovered && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-sm opacity-70">
              <Play size={18} className="text-white ml-1" />
            </div>
          </div>
        )}

        {/* Admin delete */}
        {isAdmin && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(reel.id); }}
            className="absolute top-3 right-3 w-7 h-7 rounded-sm bg-red-500/20 border border-red-500/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/40"
            style={{ top: reel.category ? '2.5rem' : '0.75rem' }}
          >
            <Trash2 size={11} className="text-red-400" />
          </button>
        )}
      </div>

      {/* Info bar */}
      <div className="px-3 py-2.5 bg-[#141213] border-t border-white/6">
        <p className="text-white text-xs font-montserrat font-semibold truncate">{reel.title}</p>
        {reel.description && (
          <p className="text-white/35 text-[10px] font-montserrat font-light mt-0.5 line-clamp-1">{reel.description}</p>
        )}
      </div>
    </motion.div>
  );
}