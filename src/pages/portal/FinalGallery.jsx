import { useState } from 'react';
import { Download, ZoomIn, Star, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRequireAuth } from '@/lib/portalGuard';
import { useClientRecord, useClientGallery, useFinalImages } from '@/hooks/useGallery';
import PortalNoIndex from '../../components/PortalNoIndex';

export default function FinalGallery() {
  const { user, loading: authLoading } = useRequireAuth('/portal');
  const { client, loading: clientLoading } = useClientRecord(user?.email);
  const { gallery, loading: galleryLoading } = useClientGallery(client?.id);
  const { images, loading: imagesLoading } = useFinalImages(gallery?.id);
  const [hovered, setHovered] = useState(null);

  const loading = authLoading || clientLoading || galleryLoading || imagesLoading;

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isReady = gallery && ['Final Ready', 'Delivered'].includes(gallery.gallery_status);

  if (!isReady) return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-1">{gallery?.title || 'Your Gallery'}</p>
        <h1 className="text-white text-2xl font-montserrat font-bold">Final Edited Gallery</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-5">
          <Lock size={20} className="text-white/20" />
        </div>
        <p className="text-white/30 text-sm font-montserrat mb-1">Final gallery not yet available</p>
        <p className="text-white/15 text-xs font-montserrat max-w-xs leading-relaxed">
          {gallery?.gallery_status === 'In Editing'
            ? "Your images are currently being edited. You'll receive an email when they're ready."
            : gallery?.gallery_status === 'Selections Received' || gallery?.gallery_status === 'Awaiting Selections'
            ? 'Editing will begin after your selections are reviewed.'
            : 'Your final gallery will appear here once it\'s ready.'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-10">
      <PortalNoIndex />
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-1">{gallery.title} · Final Delivery</p>
          <h1 className="text-white text-2xl font-montserrat font-bold mb-1">Final Edited Gallery</h1>
          <p className="text-white/30 text-xs font-montserrat">{images.length} images · Full resolution</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-8 px-5 py-4 bg-gold/5 border border-gold/15 rounded-sm">
        <Star size={14} className="text-gold shrink-0" />
        <p className="text-white/50 text-xs font-montserrat font-light leading-relaxed">
          Your final edited images are delivered at full resolution. Each image has been carefully retouched and colour-graded.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Star size={24} className="text-white/15 mb-4" />
          <p className="text-white/30 text-sm font-montserrat">Final images are being prepared</p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {images.map((img, i) => (
            <motion.div key={img.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="break-inside-avoid relative group rounded-sm overflow-hidden bg-white/4 cursor-pointer"
              onMouseEnter={() => setHovered(img.id)}
              onMouseLeave={() => setHovered(null)}>
              <img src={img.image_url} alt={img.filename}
                className={`w-full object-cover transition-transform duration-700 ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'} ${hovered === img.id ? 'scale-105' : 'scale-100'}`}
                loading="lazy" />
              <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${hovered === img.id ? 'opacity-100' : 'opacity-0'}`}>
                <a href={img.image_url} download={img.filename} target="_blank" rel="noreferrer"
                  className="w-9 h-9 flex items-center justify-center border border-white/30 text-white rounded-sm hover:bg-white/10 transition-all">
                  <Download size={15} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-16 text-center">
          <div className="inline-block border border-white/8 rounded-sm px-10 py-8">
            <p className="text-white/30 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-3">Full Gallery</p>
            <h3 className="text-white text-lg font-montserrat font-bold mb-2">Download All Images</h3>
            <p className="text-white/30 text-xs font-montserrat font-light mb-6">High-resolution JPEG · {images.length} images</p>
            <button className="inline-flex items-center gap-3 px-10 py-4 bg-gold/10 border border-gold/40 text-gold text-xs font-montserrat font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-gold hover:text-black transition-all">
              <Download size={14} /> Download Full Gallery
            </button>
          </div>
        </div>
      )}
    </div>
  );
}