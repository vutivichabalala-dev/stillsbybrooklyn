import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Edit3, CheckSquare, MessageCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ImageLightbox({ images, index, onClose, onNavigate, onToggle, onComment }) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const img = images[index];
  if (!img) return null;

  const prev = () => index > 0 && onNavigate(index - 1);
  const next = () => index < images.length - 1 && onNavigate(index + 1);

  const handleKey = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/97 flex flex-col"
      onKeyDown={handleKey}
      tabIndex={0}
      autoFocus
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 shrink-0">
        <div>
          <p className="text-white/40 text-[10px] font-montserrat tracking-[0.2em] uppercase">{img.filename}</p>
          <p className="text-white/20 text-[10px] font-montserrat">{index + 1} of {images.length}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Actions */}
          <button
            onClick={() => onToggle(img.id, 'favorite')}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm border text-[10px] font-montserrat font-semibold tracking-wider uppercase transition-all ${
              img.favorite ? 'border-rose-500 text-rose-400 bg-rose-500/15' : 'border-white/10 text-white/40 hover:border-rose-400/50 hover:text-rose-300'
            }`}
          >
            <Heart size={11} fill={img.favorite ? 'currentColor' : 'none'} /> Favourite
          </button>
          <button
            onClick={() => onToggle(img.id, 'editRequest')}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-sm border text-[10px] font-montserrat font-semibold tracking-wider uppercase transition-all ${
              img.editRequest ? 'border-blue-500 text-blue-400 bg-blue-500/15' : 'border-white/10 text-white/40 hover:border-blue-400/50 hover:text-blue-300'
            }`}
          >
            <Edit3 size={11} /> Request Edit
          </button>
          <button
            onClick={() => onToggle(img.id, 'finalPick')}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-sm border text-[10px] font-montserrat font-semibold tracking-wider uppercase transition-all ${
              img.finalPick ? 'border-gold text-gold bg-gold/15' : 'border-white/10 text-white/40 hover:border-gold/50 hover:text-gold/70'
            }`}
          >
            <CheckSquare size={11} /> Final Pick
          </button>
          <button
            onClick={() => setCommentOpen(!commentOpen)}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-sm border text-[10px] font-montserrat font-semibold tracking-wider uppercase transition-all ${
              img.comment ? 'border-white/40 text-white/70 bg-white/10' : 'border-white/10 text-white/40 hover:border-white/30'
            }`}
          >
            <MessageCircle size={11} /> Comment
          </button>
          <button onClick={onClose} className="ml-2 w-8 h-8 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all rounded-sm">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <motion.img
          key={img.id}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          src={img.src}
          alt={img.filename}
          className="max-h-full max-w-full object-contain"
        />

        {/* Nav buttons */}
        <button
          onClick={prev}
          disabled={index === 0}
          className="absolute left-4 w-11 h-11 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all disabled:opacity-20 rounded-sm bg-black/40"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          disabled={index === images.length - 1}
          className="absolute right-4 w-11 h-11 flex items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all disabled:opacity-20 rounded-sm bg-black/40"
        >
          <ChevronRight size={18} />
        </button>

        {/* Status badges overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          {img.favorite && <span className="px-2 py-1 bg-rose-500/80 text-white text-[9px] font-montserrat tracking-wider uppercase rounded-sm flex items-center gap-1"><Heart size={9} fill="white" /> Favourite</span>}
          {img.editRequest && <span className="px-2 py-1 bg-blue-500/80 text-white text-[9px] font-montserrat tracking-wider uppercase rounded-sm flex items-center gap-1"><Edit3 size={9} /> Edit Requested</span>}
          {img.finalPick && <span className="px-2 py-1 bg-gold/80 text-black text-[9px] font-montserrat font-bold tracking-wider uppercase rounded-sm flex items-center gap-1"><CheckSquare size={9} /> Final Pick</span>}
        </div>
      </div>

      {/* Comment panel */}
      {commentOpen && (
        <div className="shrink-0 border-t border-white/6 px-6 py-5">
          {img.comment && (
            <div className="mb-3 px-4 py-3 bg-white/4 rounded-sm border border-white/8">
              <p className="text-white/50 text-[10px] font-montserrat tracking-wider uppercase mb-1">Your comment</p>
              <p className="text-white/70 text-sm font-montserrat font-light">{img.comment}</p>
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment or edit request note..."
              className="flex-1 bg-white border border-white/10 text-gray-900 text-sm font-montserrat px-4 py-3 placeholder:text-gray-400 focus:border-gold/40 focus:outline-none rounded-sm"
            />
            <button
              onClick={() => { if (onComment && comment.trim()) { onComment(img.id, comment); setCommentOpen(false); setComment(''); } }}
              className="px-5 py-3 bg-gold/15 border border-gold/40 text-gold text-[10px] font-montserrat font-bold tracking-wider uppercase rounded-sm hover:bg-gold hover:text-black transition-all flex items-center gap-2">
              <Send size={12} /> Save
            </button>
          </div>
        </div>
      )}

      {/* Bottom strip — mobile actions */}
      <div className="sm:hidden flex items-center justify-around px-6 py-4 border-t border-white/6 shrink-0">
        <button onClick={() => onToggle(img.id, 'favorite')} className={`flex flex-col items-center gap-1 text-[9px] font-montserrat uppercase tracking-wider ${img.favorite ? 'text-rose-400' : 'text-white/30'}`}>
          <Heart size={16} fill={img.favorite ? 'currentColor' : 'none'} /> Fav
        </button>
        <button onClick={() => onToggle(img.id, 'editRequest')} className={`flex flex-col items-center gap-1 text-[9px] font-montserrat uppercase tracking-wider ${img.editRequest ? 'text-blue-400' : 'text-white/30'}`}>
          <Edit3 size={16} /> Edit
        </button>
        <button onClick={() => onToggle(img.id, 'finalPick')} className={`flex flex-col items-center gap-1 text-[9px] font-montserrat uppercase tracking-wider ${img.finalPick ? 'text-gold' : 'text-white/30'}`}>
          <CheckSquare size={16} /> Final
        </button>
        <button onClick={() => setCommentOpen(!commentOpen)} className={`flex flex-col items-center gap-1 text-[9px] font-montserrat uppercase tracking-wider ${img.comment ? 'text-white/70' : 'text-white/30'}`}>
          <MessageCircle size={16} /> Note
        </button>
      </div>
    </motion.div>
  );
}