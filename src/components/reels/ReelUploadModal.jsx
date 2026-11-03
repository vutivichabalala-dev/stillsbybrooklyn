import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Film, Loader2, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = ['Corporate', 'Portraits', 'Weddings', 'Graduations', 'Behind the Scenes', 'Other'];

export default function ReelUploadModal({ onClose, onSaved }) {
  const [step, setStep] = useState('form'); // 'form' | 'uploading' | 'done'
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({ title: '', description: '', category: 'Corporate', is_featured: false });
  const videoInputRef = useRef(null);
  const thumbInputRef = useRef(null);

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleThumbSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!videoFile || !form.title) return;
    setStep('uploading');

    // Simulate progress ticks while uploading
    const tick = setInterval(() => setUploadProgress(p => Math.min(p + 8, 90)), 400);

    const { file_url: video_url } = await base44.integrations.Core.UploadFile({ file: videoFile });

    let thumbnail_url = '';
    if (thumbFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: thumbFile });
      thumbnail_url = file_url;
    }

    clearInterval(tick);
    setUploadProgress(100);

    await base44.entities.Reel.create({ ...form, video_url, thumbnail_url });

    setStep('done');
    setTimeout(() => { onSaved(); onClose(); }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="relative w-full max-w-lg bg-[#141213] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-gold/40 flex items-center justify-center rounded-sm">
              <Film size={14} className="text-gold" />
            </div>
            <span className="text-white font-montserrat font-semibold text-sm tracking-widest uppercase">Upload Reel</span>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          {step === 'form' && (
            <>
              {/* Video drop zone */}
              <div
                onClick={() => videoInputRef.current?.click()}
                className="relative border border-dashed border-white/15 rounded-xl overflow-hidden cursor-pointer hover:border-gold/40 transition-colors"
                style={{ minHeight: 160 }}
              >
                {previewUrl ? (
                  <video src={previewUrl} className="w-full rounded-xl object-cover" style={{ maxHeight: 180 }} controls={false} muted playsInline />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-white/30">
                    <Upload size={28} />
                    <span className="text-xs font-montserrat tracking-widest uppercase">Click to select video</span>
                    <span className="text-[10px] font-montserrat text-white/20">MP4 · MOV · WebM · 4K — up to 10 GB</span>
                  </div>
                )}
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
              </div>

              {/* Thumbnail */}
              <div
                onClick={() => thumbInputRef.current?.click()}
                className="flex items-center gap-4 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-gold/30 transition-colors"
              >
                {thumbPreview
                  ? <img src={thumbPreview} alt="thumb" className="w-14 h-10 object-cover rounded-md" />
                  : <div className="w-14 h-10 bg-white/5 rounded-md flex items-center justify-center"><Upload size={12} className="text-white/30" /></div>}
                <span className="text-white/40 text-xs font-montserrat tracking-wider">
                  {thumbPreview ? 'Change thumbnail' : 'Add thumbnail (optional)'}
                </span>
                <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbSelect} />
              </div>

              {/* Title */}
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Reel title *"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-montserrat placeholder:text-white/25 focus:outline-none focus:border-gold/50 transition-colors"
              />

              {/* Description */}
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Caption / description"
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm font-montserrat placeholder:text-white/25 focus:outline-none focus:border-gold/50 transition-colors resize-none"
              />

              {/* Category + Featured */}
              <div className="flex gap-3 items-center">
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-xs font-montserrat focus:outline-none focus:border-gold/50 transition-colors"
                  style={{ colorScheme: 'dark' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                    className="accent-yellow-500 w-4 h-4"
                  />
                  <span className="text-white/50 text-xs font-montserrat tracking-wider">Featured</span>
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!videoFile || !form.title}
                className="w-full py-3.5 border border-gold/60 bg-gold/10 text-gold text-xs font-montserrat font-bold tracking-[0.2em] uppercase rounded-lg hover:bg-gold hover:text-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Publish Reel
              </button>
            </>
          )}

          {step === 'uploading' && (
            <div className="flex flex-col items-center gap-6 py-10">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                  <circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke="hsl(46,70%,55%)" strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - uploadProgress / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={22} className="text-gold animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-montserrat font-semibold tracking-widest uppercase mb-1">Uploading…</p>
                <p className="text-white/30 text-xs font-montserrat">{uploadProgress}% complete</p>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="flex flex-col items-center gap-4 py-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 14 }}>
                <CheckCircle2 size={48} className="text-gold" />
              </motion.div>
              <p className="text-white text-sm font-montserrat font-semibold tracking-widest uppercase">Reel Published!</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}