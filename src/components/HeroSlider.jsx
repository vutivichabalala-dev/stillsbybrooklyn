import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const slides = [
  {
    id: 1,
    category: 'Corporate',
    headline: 'Brand Identity',
    subline: 'Elevated.',
    description: 'Professional imagery that defines your company\'s visual narrative.',
    href: '/services/corporate',
    image: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/47ae0dc0f_DSC_4110.jpg',
    objectPosition: 'center 20%',
    accent: '#D99AA5',
  },
  {
    id: 2,
    category: 'Corporate',
    headline: 'Executive',
    subline: 'Presence.',
    description: 'Headshots and team portraits that communicate authority and trust.',
    href: '/services/corporate',
    image: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/b6065684a_DSC_4113.jpg',
    objectPosition: 'center 25%',
    accent: '#D99AA5',
  },
  {
    id: 3,
    category: 'Corporate',
    headline: 'Professional',
    subline: 'Portrait.',
    description: 'Every frame crafted to reflect your unique personal brand.',
    href: '/services/corporate',
    image: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/405f66474_DSC_4043.jpg',
    objectPosition: 'center 20%',
    accent: '#D99AA5',
  },
  {
    id: 4,
    category: 'Portraits',
    headline: 'Human Stories',
    subline: 'Captured.',
    description: 'Intimate portraits that reveal the authentic spirit within every individual.',
    href: '/services/portraits',
    image: 'https://images.pixieset.com/224055201/7434a23374497b1b13cc0130da62472b-large.jpg',
    objectPosition: 'center 15%',
    accent: '#D99AA5',
  },
  {
    id: 5,
    category: 'Portraits',
    headline: 'Raw Emotion',
    subline: 'Framed.',
    description: 'Every portrait tells a story — yours, told with honesty and artistry.',
    href: '/services/portraits',
    image: 'https://images.pixieset.com/224055201/8b064709835a34b21aba22f4a48f292b-large.jpg',
    objectPosition: 'center 10%',
    accent: '#D99AA5',
  },
  {
    id: 6,
    category: 'Graduations',
    headline: 'Milestone',
    subline: 'Celebrated.',
    description: 'Marking your achievement with imagery as timeless as your accomplishment.',
    href: '/services',
    image: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/a33532f67_DSC_4300.jpg',
    objectPosition: 'center 15%',
    accent: '#D99AA5',
  },
  {
    id: 7,
    category: 'Graduations',
    headline: 'Your Success',
    subline: 'Immortalised.',
    description: 'Beautiful graduation portraits that capture the pride and joy of your big day.',
    href: '/services',
    image: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/762c48de9_DSC_4345.jpg',
    objectPosition: 'center 15%',
    accent: '#D99AA5',
  },
  {
    id: 8,
    category: 'Graduations',
    headline: 'Cap &',
    subline: 'Gown.',
    description: 'Cherish every moment of your graduation with stunning professional photography.',
    href: '/services',
    image: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/3ec27dda8_DSC_4379.jpg',
    objectPosition: 'center 20%',
    accent: '#D99AA5',
  },
  {
    id: 12,
    category: 'Matric Dance',
    headline: 'Matric',
    subline: 'Elegance.',
    description: 'Formal portraits that capture the glamour of your matric dance night.',
    href: '/portfolio?category=matric dance',
    image: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/23c6f23d5_m1.jpg',
    objectPosition: 'center 22%',
    accent: '#D99AA5',
  },
  {
    id: 13,
    category: 'Matric Dance',
    headline: 'Golden',
    subline: 'Hour.',
    description: 'Sunset light and lakeside backdrops for images that feel cinematic.',
    href: '/portfolio?category=matric dance',
    image: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/77706b7f6_m2.jpg',
    objectPosition: 'center 25%',
    accent: '#D99AA5',
  },
  {
    id: 14,
    category: 'Matric Dance',
    headline: 'Young',
    subline: 'Love.',
    description: 'Quiet, unposed moments between the two of you, beautifully preserved.',
    href: '/portfolio?category=matric dance',
    image: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/cc7fc8131_m3.jpg',
    objectPosition: 'center 22%',
    accent: '#D99AA5',
  },
  {
    id: 15,
    category: 'Matric Dance',
    headline: 'Formal',
    subline: 'Glow.',
    description: 'Every bead, every detail of the gown photographed with care.',
    href: '/portfolio?category=matric dance',
    image: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/f17a7f633_m4.jpg',
    objectPosition: 'center 20%',
    accent: '#D99AA5',
  },
  {
    id: 16,
    category: 'Matric Dance',
    headline: 'The Big',
    subline: 'Night.',
    description: 'Dressed up, together, and ready for the evening ahead.',
    href: '/portfolio?category=matric dance',
    image: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/422cb06bd_m5.jpg',
    objectPosition: 'center 25%',
    accent: '#D99AA5',
  },
  {
    id: 17,
    category: 'Matric Dance',
    headline: 'Roses &',
    subline: 'Ribbon.',
    description: 'The bouquet, the corsage, the little details that define the day.',
    href: '/portfolio?category=matric dance',
    image: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/d7b28935b_m6.jpg',
    objectPosition: 'center 22%',
    accent: '#D99AA5',
  },
  {
    id: 18,
    category: 'Matric Dance',
    headline: 'Proud',
    subline: 'Moment.',
    description: 'Beautiful portraits you will look back on for years to come.',
    href: '/portfolio?category=matric dance',
    image: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/fb33a2eb4_m7.jpg',
    objectPosition: 'center 25%',
    accent: '#D99AA5',
  },
  {
    id: 19,
    category: 'Matric Dance',
    headline: 'Sunset',
    subline: 'Silhouettes.',
    description: 'Dramatic, atmospheric frames against a Gauteng sunset.',
    href: '/portfolio?category=matric dance',
    image: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/ea0215502_m8.jpg',
    objectPosition: 'center 30%',
    accent: '#D99AA5',
  },
  {
    id: 20,
    category: 'Matric Dance',
    headline: 'Lasting',
    subline: 'Memories.',
    description: 'Fine-art editing that makes every frame gallery-worthy.',
    href: '/portfolio?category=matric dance',
    image: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/115657473_m9.jpg',
    objectPosition: 'center 20%',
    accent: '#D99AA5',
  },
  {
    id: 9,
    category: 'Weddings',
    headline: 'Timeless',
    subline: 'Love.',
    description: 'Every detail of your special day captured with elegance and emotion.',
    href: '/services/weddings',
    image: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/6690fe0fb_DSC_5010.jpg',
    objectPosition: 'center 20%',
    accent: '#D99AA5',
  },
  {
    id: 10,
    category: 'Weddings',
    headline: 'Bridal',
    subline: 'Magic.',
    description: 'Intimate and radiant moments from the morning preparations to the last dance.',
    href: '/services/weddings',
    image: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/1154b3740_DSC_5060.jpg',
    objectPosition: 'center 15%',
    accent: '#D99AA5',
  },
  {
    id: 11,
    category: 'Weddings',
    headline: 'Forever',
    subline: 'Begins.',
    description: 'Storytelling photography for the most beautiful chapter of your life.',
    href: '/services/weddings',
    image: 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/55625f9db_DSC_5069.jpg',
    objectPosition: 'center 20%',
    accent: '#D99AA5',
  },
];

// Tiny 5–9 KB thumbnails for the strip (full-size images only load as the active slide)
const THUMBS = {
  1: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/757d898cf_t_s1.jpg',
  2: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/4be52ea8d_t_s2.jpg',
  3: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/fc085d362_t_s3.jpg',
  4: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/3db1020b5_t_s4.jpg',
  5: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/9d8ec2eac_t_s5.jpg',
  6: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/999fb76d3_t_s6.jpg',
  7: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/eff314071_t_s7.jpg',
  8: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/15632960e_t_s8.jpg',
  9: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/edaddb8d2_t_s9.jpg',
  10: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/282f7ce04_t_s10.jpg',
  11: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/3c74884f0_t_s11.jpg',
  12: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/fa1eb2711_t_s12.jpg',
  13: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/32a78f90b_t_s13.jpg',
  14: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/69eda0443_t_s14.jpg',
  15: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/ced4ca254_t_s15.jpg',
  16: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/75002645b_t_s16.jpg',
  17: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/e84dfab50_t_s17.jpg',
  18: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/8aa05881d_t_s18.jpg',
  19: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/5683ee6b0_t_s19.jpg',
  20: 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/f458b05ed_t_s20.jpg',
};

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const thumbRefs = useRef([]);
  const stripRef = useRef(null);

  // Keep the active thumbnail centred in the thumbnail strip. Scroll only the
  // strip itself: scrollIntoView() would also scroll the page, yanking visitors
  // back up to the hero every time the slide auto-advances.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[current];
    if (!strip || !thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const left = strip.scrollLeft + (thumbRect.left - stripRect.left) - (stripRect.width - thumbRect.width) / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
  }, [current]);

  const DURATION = 6000;

  const goTo = useCallback((index, dir) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, -1);
  }, [current, goTo]);

  // One timer per slide instead of a 100ms state loop — no re-render churn
  useEffect(() => {
    const timer = setTimeout(next, DURATION);
    return () => clearTimeout(timer);
  }, [current, next]);

  // Warm the next slide's image so slide changes never flash
  useEffect(() => {
    const upcoming = slides[(current + 1) % slides.length];
    const img = new Image();
    img.src = upcoming.image;
  }, [current]);

  const slide = slides[current];

  const textVariants = {
    enter: { opacity: 0, y: 40, filter: 'blur(8px)' },
    center: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, filter: 'blur(4px)', transition: { duration: 0.4 } },
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#121011] h-[100svh] min-h-[560px]">

      {/* Background image layer */}
      <AnimatePresence custom={direction} mode="sync">
        <motion.div
          key={`bg-${slide.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          className="absolute inset-0 z-0"
        >
          <motion.img
            src={slide.image}
            alt={slide.category}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1, transition: { duration: 7, ease: 'easeOut' } }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: slide.objectPosition || 'center 20%' }}
            fetchPriority={current === 0 ? 'high' : 'auto'}
            loading={current === 0 ? 'eager' : 'lazy'}
          />
          {/* Multi-layer cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          <div className="absolute inset-0 bg-[#121011]/30" />
        </motion.div>
      </AnimatePresence>

      {/* Scanline texture overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)', backgroundSize: '100% 4px' }}
      />

      {/* Corner brackets */}
      {[['top-24 left-6', 'border-t border-l'], ['top-24 right-6', 'border-t border-r'], ['bottom-6 left-6', 'border-b border-l'], ['bottom-6 right-6', 'border-b border-r']].map(([pos, borders], i) => (
        <div key={i} className={`absolute ${pos} w-8 h-8 ${borders} border-white/20 z-10 pointer-events-none`} />
      ))}

      {/* Slide counter top-right */}
      <div className="absolute top-24 right-14 sm:top-28 sm:right-16 z-20 flex items-center gap-3">
        <span className="text-gold text-xs font-montserrat font-bold tracking-[0.3em]">
          {String(current + 1).padStart(2, '0')}
        </span>
        <div className="w-12 h-[1px] bg-white/20 overflow-hidden">
          <div
            key={current}
            className="h-full w-full bg-gold animate-progress"
            style={{ animationDuration: `${DURATION}ms` }}
          />
        </div>
        <span className="text-white/30 text-xs font-montserrat tracking-[0.3em]">
          {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 w-full">
          <div className="max-w-2xl">

            <h1 className="text-white/70 text-[11px] sm:text-xs font-montserrat font-semibold tracking-[0.35em] uppercase mb-5">
              Photographer &amp; Videographer in Johannesburg
            </h1>
            <AnimatePresence mode="wait">
              <motion.div key={`text-${slide.id}`} variants={textVariants} initial="enter" animate="center" exit="exit">

                {/* Category tag */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-8"
                >
                  <div className="w-6 h-[1px] bg-gold" />
                  <span className="text-gold text-[10px] font-montserrat font-semibold tracking-[0.5em] uppercase">
                    {slide.category}
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="text-[2.75rem] leading-[0.95] sm:text-6xl md:text-8xl font-montserrat font-black text-white tracking-tight mb-1"
                >
                  {slide.headline}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="text-[2.75rem] leading-[0.95] sm:text-6xl md:text-8xl font-montserrat font-black tracking-tight mb-6 sm:mb-8"
                  style={{ WebkitTextStroke: '1px rgba(217,154,165,0.6)', color: 'transparent' }}
                >
                  {slide.subline}
                </motion.p>

                {/* Separator */}
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="w-16 h-[1px] bg-gold mb-6"
                />

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/50 text-sm font-montserrat font-light leading-relaxed tracking-wider max-w-sm mb-10"
                >
                  {slide.description}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    to={slide.href}
                    className="px-8 sm:px-10 py-3.5 border border-gold/60 bg-gold/10 text-gold text-xs font-montserrat font-bold tracking-[0.2em] uppercase transition-colors duration-300 hover:bg-gold hover:text-black flex items-center gap-2 rounded-sm"
                  >
                    Explore <ArrowRight size={13} />
                  </Link>
                  <Link
                    to="/booking"
                    className="px-8 sm:px-10 py-3.5 border border-white/20 bg-white/5 text-white/70 text-xs font-montserrat font-bold tracking-[0.2em] uppercase transition-colors duration-300 hover:border-gold/50 hover:text-gold rounded-sm"
                  >
                    Book Now
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom: slide thumbnails + nav */}
      <div className="absolute bottom-24 md:bottom-8 left-0 right-0 z-20 px-5 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex items-end justify-between gap-3">

          {/* Thumbnail strip */}
          <div
            ref={stripRef}
            className="flex gap-2 items-center overflow-x-auto max-w-[62vw] sm:max-w-[58vw] lg:max-w-[68vw] pb-1 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {slides.map((s, i) => (
              <motion.button
                key={s.id}
                ref={(el) => (thumbRefs.current[i] = el)}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Show ${s.category} slide`}
                animate={{ opacity: i === current ? 1 : 0.55, scale: i === current ? 1 : 0.92 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="group relative overflow-hidden rounded-sm flex-shrink-0 w-16 h-11"
              >
                <img
                  src={THUMBS[s.id] || s.image}
                  alt=""
                  width="64"
                  height="44"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className={`absolute inset-0 transition-colors duration-300 ${i === current ? 'bg-black/0' : 'bg-black/50 group-hover:bg-black/20'}`} />
                {i === current && (
                  <div className="absolute inset-0 border border-gold" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Arrow nav */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-colors duration-200 bg-black/40"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/50 hover:border-gold hover:text-gold transition-colors duration-200 bg-black/40"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Vertical label */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3">
        <div className="w-[1px] h-12 bg-white/10" />
        <span
          className="text-white/20 text-[9px] font-montserrat tracking-[0.4em] uppercase"
          style={{ writingMode: 'vertical-rl' }}
        >
          Stills by Brooklyn
        </span>
        <div className="w-[1px] h-12 bg-white/10" />
      </div>
    </section>
  );
}