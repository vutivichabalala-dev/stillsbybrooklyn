import { useSeo } from '@/lib/seo';
import { corePages } from '@/content/corePages';
import { useState, useEffect, useCallback } from 'react';
import { Camera, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import PortfolioFilter from '../components/portfolio/PortfolioFilter';


const placeholderItems = [
  { id: 1, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/405f66474_DSC_4043.jpg', alt: 'Corporate portrait of a professional woman in a houndstooth blazer' },
  { id: 2, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/9a4a9a794_DSC_4045.jpg', alt: 'Corporate headshot of a professional woman with arms crossed' },
  { id: 3, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/34c2c0a6b_DSC_4046.jpg', alt: 'Professional corporate portrait against a grey background' },
  { id: 4, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/afcabb77e_DSC_4047.jpg', alt: 'Corporate portrait of a smiling professional woman' },
  { id: 5, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/7e598f7ce_DSC_4048.jpg', alt: 'Professional headshot of a woman in a blazer' },
  { id: 6, category: 'Corporate', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/47ae0dc0f_DSC_4110.jpg', alt: 'Corporate executive portrait of a man in a dark suit seated in a lounge' },
  { id: 7, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/41b4604fd_DSC_4111.jpg', alt: 'Smiling corporate executive in a suit' },
  { id: 8, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/768fc2296_DSC_4112.jpg', alt: 'Laughing corporate executive in a boardroom setting' },
  { id: 9, category: 'Corporate', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/b6065684a_DSC_4113.jpg', alt: 'Corporate portrait of a man in a navy suit with a tie' },
  { id: 10, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/dc6d72f24_DSC_4123.jpg', alt: 'Corporate executive portrait with eagle sculpture in background' },
  { id: 11, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/e574d7a44_DSC_4124.jpg', alt: 'Thoughtful corporate professional in a grey suit' },
  { id: 12, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/e5dfaf3c0_DSC_4125.jpg', alt: 'Corporate portrait of a man in a grey suit seated' },
  { id: 13, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/1f3139dc3_DSC_4126.jpg', alt: 'Professional executive portrait in a luxury interior' },
  { id: 14, category: 'Corporate', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/d0c463f82_DSC_4127.jpg', alt: 'Corporate portrait of a professional in a luxury space' },
  { id: 15, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/191144890_DSC_4132.jpg', alt: 'Corporate portrait of a woman standing near an eagle sculpture' },
  { id: 16, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/a71db76ec_DSC_4133.jpg', alt: 'Professional woman in a blazer and trousers in a luxury interior' },
  { id: 17, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/fd69eadf5_DSC_4134.jpg', alt: 'Corporate portrait of a smiling woman in a houndstooth blazer' },
  { id: 18, category: 'Corporate', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/53fd1db74_DSC_4135.jpg', alt: 'Elegant corporate portrait of a woman with an eagle sculpture' },
  // Weddings
  { id: 'w1', category: 'Weddings', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/6690fe0fb_DSC_5010.jpg', alt: 'Bridal portrait — bride smiling with playing card' },
  { id: 'w2', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/a76bd8a61_DSC_5009.jpg', alt: 'Bridal portrait — bride holding playing card' },
  { id: 'w3', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/04a50042b_DSC_5023.jpg', alt: 'Bridal portrait — bride reading vows in robe' },
  { id: 'w4', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/0bc25d936_DSC_5033.jpg', alt: 'Bridal portrait — close up writing vows' },
  { id: 'w5', category: 'Weddings', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/1d785af91_DSC_5034.jpg', alt: 'Bridal portrait — bride writing vows laughing' },
  { id: 'w6', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/d7cafb2a1_DSC_5027.jpg', alt: 'Bridal portrait — bride reading letter' },
  { id: 'w7', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/1154b3740_DSC_5060.jpg', alt: 'Bridal portrait — bride blowing a kiss' },
  { id: 'w8', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/23c7ac0b8_DSC_5061.jpg', alt: 'Bridal portrait — bride laughing' },
  { id: 'w9', category: 'Weddings', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/4ce78177c_DSC_5068.jpg', alt: 'Bridal portrait — bride smiling sideways' },
  { id: 'w10', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/55625f9db_DSC_5069.jpg', alt: 'Bridal portrait — bride laughing freely' },
  { id: 'w11', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/06f2d8a4d_DSC_5074.jpg', alt: 'Bridal portrait — bride smiling elegantly' },
  { id: 'w12', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/6328cf0e0_DSC_5075.jpg', alt: 'Bridal portrait — bride relaxed pose' },
  { id: 'w13', category: 'Weddings', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/a5a2523e3_DSC_5077.jpg', alt: 'Bridal portrait — bride with perfume bottle' },
  { id: 'w14', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/af76b26dc_DSC_5081.jpg', alt: 'Bridal portrait — bride putting on earring' },
  { id: 'w15', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/114e78664_DSC_5088.jpg', alt: 'Bridal portrait — bride in bathroom' },
  { id: 'w16', category: 'Weddings', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/beeb988be_DSC_5120.jpg', alt: 'Bridal portrait — bride holding shoes' },
  { id: 'w17', category: 'Weddings', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/cccedc2d2_DSC_5125.jpg', alt: 'Bridal portrait — bride holding hair' },
  // Portraits - Jubilee session
  { id: 19, category: 'Portraits', size: 'large', url: 'https://images.pixieset.com/224055201/7434a23374497b1b13cc0130da62472b-large.jpg', alt: 'Jubilee portrait session - natural light lifestyle photography' },
  { id: 20, category: 'Portraits', size: 'small', url: 'https://images.pixieset.com/224055201/ba20179241b13dc570b3d7c663e22bf5-large.jpg', alt: 'Jubilee portrait session - candid lifestyle moment' },
  { id: 21, category: 'Portraits', size: 'small', url: 'https://images.pixieset.com/224055201/fa1a43cc250efd88003bc5da98382de8-large.jpg', alt: 'Jubilee portrait session - expressive individual portrait' },
  { id: 22, category: 'Portraits', size: 'small', url: 'https://images.pixieset.com/224055201/2cf20d4a9d00d86934d0adb64a70c03f-large.jpg', alt: 'Jubilee portrait session - lifestyle portrait photography' },
  { id: 23, category: 'Portraits', size: 'large', url: 'https://images.pixieset.com/224055201/8b064709835a34b21aba22f4a48f292b-large.jpg', alt: 'Jubilee portrait session - dramatic natural light portrait' },
  { id: 24, category: 'Portraits', size: 'small', url: 'https://images.pixieset.com/224055201/e8913758e3894e34b8d1a0b20f196fc4-large.jpg', alt: 'Jubilee portrait session - intimate personal portrait' },
  // Graduations
  { id: 25, category: 'Graduations', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/922435be1_DSC_4228.jpg', alt: 'Graduation portrait' },
  { id: 26, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/c07e6f7ad_DSC_4229.jpg', alt: 'Graduation portrait' },
  { id: 27, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/9aaba3aa2_DSC_4233.jpg', alt: 'Graduation portrait' },
  { id: 28, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/be5ca11f3_DSC_4271.jpg', alt: 'Graduation portrait' },
  { id: 29, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/9adb2f002_DSC_4270.jpg', alt: 'Graduation portrait' },
  { id: 30, category: 'Graduations', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/e7626e7ee_DSC_4273.jpg', alt: 'Graduation portrait' },
  { id: 31, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/7e13b32ad_DSC_4283.jpg', alt: 'Graduation portrait' },
  { id: 32, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/3a9de990b_DSC_4282.jpg', alt: 'Graduation portrait' },
  { id: 33, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/5786089f1_DSC_4285.jpg', alt: 'Graduation portrait' },
  { id: 34, category: 'Graduations', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/a33532f67_DSC_4300.jpg', alt: 'Graduation portrait' },
  { id: 35, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/4280a2d77_DSC_4303.jpg', alt: 'Graduation portrait' },
  { id: 36, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/ac379ba61_DSC_4306.jpg', alt: 'Graduation portrait' },
  { id: 37, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/e8e6106de_DSC_4307.jpg', alt: 'Graduation portrait' },
  { id: 38, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/377e5a04f_DSC_4311.jpg', alt: 'Graduation portrait' },
  { id: 39, category: 'Graduations', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/02c4d961b_DSC_4323.jpg', alt: 'Graduation portrait' },
  { id: 40, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/0af8c4363_DSC_4326.jpg', alt: 'Graduation portrait' },
  { id: 41, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/762c48de9_DSC_4345.jpg', alt: 'Graduation portrait' },
  { id: 42, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/62b1b995f_DSC_4347.jpg', alt: 'Graduation portrait' },
  { id: 43, category: 'Graduations', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/7dbd77260_DSC_4354.jpg', alt: 'Graduation portrait' },
  { id: 44, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/b4612dbe0_DSC_4352.jpg', alt: 'Graduation portrait' },
  { id: 45, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/985c94caa_DSC_4359.jpg', alt: 'Graduation portrait' },
  { id: 46, category: 'Graduations', size: 'small', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/c92ad5d0d_DSC_4376.jpg', alt: 'Graduation portrait' },
  { id: 47, category: 'Graduations', size: 'large', url: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/3ec27dda8_DSC_4379.jpg', alt: 'Graduation portrait' },
  // Matric Dance
  { id: 'm1', category: 'Matric Dance', size: 'large', url: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/23c6f23d5_m1.jpg', alt: 'Matric dance couple portrait — white gown and black suit by the lake at golden hour' },
  { id: 'm2', category: 'Matric Dance', size: 'small', url: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/77706b7f6_m2.jpg', alt: 'Matric dance couple standing at sunset with lake backdrop' },
  { id: 'm3', category: 'Matric Dance', size: 'small', url: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/cc7fc8131_m3.jpg', alt: 'Matric dance couple sharing a quiet moment at dusk' },
  { id: 'm4', category: 'Matric Dance', size: 'large', url: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/f17a7f633_m4.jpg', alt: 'Matric dance portrait — beaded gown with lace-up corset back' },
  { id: 'm5', category: 'Matric Dance', size: 'small', url: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/422cb06bd_m5.jpg', alt: 'Matric dance couple pose with sunset flare' },
  { id: 'm6', category: 'Matric Dance', size: 'small', url: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/d7b28935b_m6.jpg', alt: 'Matric dance couple with red rose bouquet at golden hour' },
  { id: 'm7', category: 'Matric Dance', size: 'large', url: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/fb33a2eb4_m7.jpg', alt: 'Matric dance couple holding hands with red roses' },
  { id: 'm8', category: 'Matric Dance', size: 'small', url: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/ea0215502_m8.jpg', alt: 'Matric dance couple photographed from behind overlooking the lake at sunset' },
  { id: 'm9', category: 'Matric Dance', size: 'small', url: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/115657473_m9.jpg', alt: 'Matric dance portrait — beaded gown with two bouquets of red roses' },
];

export default function Portfolio() {
  useSeo(corePages.portfolio);

   const urlParams = new URLSearchParams(window.location.search);
   const CATEGORIES = ['All', 'Corporate', 'Portraits', 'Weddings', 'Graduations', 'Matric Dance'];
   const initialCat = urlParams.get('category');
   const initial = initialCat
     ? CATEGORIES.find(c => c.toLowerCase() === initialCat.toLowerCase()) || 'All'
     : 'All';

   const [active, setActive] = useState(initial);
   const [lightbox, setLightbox] = useState(null); // stores index into `filtered`

   const filtered = active === 'All'
    ? placeholderItems
    : placeholderItems.filter(i => i.category === active);

  const openLightbox = (index) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prev = useCallback(() => setLightbox(i => (i - 1 + filtered.length) % filtered.length), [filtered.length]);
  const next = useCallback(() => setLightbox(i => (i + 1) % filtered.length), [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, prev, next]);

  const currentItem = lightbox !== null ? filtered[lightbox] : null;

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-col items-center text-center"
        >
          <SectionHeading
            eyebrow="My Work"
            as="h1"
            title={corePages.portfolio.h1}
            subtitle="A curated collection of moments, emotions, and stories told through the lens."
            center
          />
        </motion.div>

        {/* Filter tabs */}
        <PortfolioFilter active={active} onChange={setActive} />

        {/* Gallery grid */}
        <motion.div layout className="columns-2 md:columns-3 gap-1 space-y-1">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.38, delay: Math.min(i * 0.035, 0.3), ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={() => item.url && openLightbox(i)}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden bg-zinc-900 mb-1"
              >
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.category}
                    className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-110"
                    style={{ aspectRatio: item.size === 'large' ? '2/3' : '3/4' }}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div
                    className="w-full bg-zinc-900 border border-white/5 flex items-center justify-center"
                    style={{ aspectRatio: item.size === 'large' ? '3/4' : '1/1' }}
                  >
                    <div className="flex flex-col items-center gap-2 text-white/20">
                      <Camera size={24} />
                      <span className="text-[10px] font-montserrat tracking-widest uppercase">{item.category}</span>
                    </div>
                  </div>
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500" />
                {/* Zoom icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn size={28} className="text-white drop-shadow-lg" />
                </div>
                {/* Category label */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                  <div className="h-[1px] w-8 bg-gold mb-2" />
                  <span className="text-white text-xs font-montserrat tracking-wider uppercase">{item.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-white/30 font-montserrat text-sm tracking-wider"
          >
            No photos in this category yet.
          </motion.div>
        )}

        {/* Portfolio CTA */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-white/40 text-sm font-montserrat font-light mb-6">Like what you see? Let's work together.</p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gold text-black text-xs font-montserrat font-black tracking-[0.2em] uppercase rounded-sm hover:bg-gold/90 transition-colors duration-200 shadow-[0_4px_20px_rgba(201,162,39,0.3)]"
            >
              Book a Session <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {currentItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 z-10 w-10 h-10 bg-white/10 border border-white/20 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-all duration-200 rounded-full"
            >
              <X size={18} />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-5 text-white/40 text-xs font-montserrat tracking-widest">
              {lightbox + 1} / {filtered.length}
            </div>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 md:left-8 z-10 w-11 h-11 bg-white/10 border border-white/15 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-all duration-200 rounded-full"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative flex items-center justify-center px-16 md:px-24 w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentItem.url}
                alt={currentItem.alt}
                className="max-w-full max-h-[88vh] object-contain shadow-2xl"
              />
              {/* Caption */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <div className="h-[1px] w-8 bg-gold" />
                <span className="text-white/50 text-[10px] font-montserrat tracking-[0.3em] uppercase mt-1">{currentItem.category}</span>
              </div>
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 md:right-8 z-10 w-11 h-11 bg-white/10 border border-white/15 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-all duration-200 rounded-full"
            >
              <ChevronRight size={22} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}