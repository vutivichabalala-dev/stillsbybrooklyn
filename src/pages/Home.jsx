import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useSeo } from '@/lib/seo';
import { corePages } from '@/content/corePages';
import { locationNav } from '@/content/seoPages';
import BackToTop from '../components/BackToTop';
import WhatsAppButton from '../components/WhatsAppButton';

const ease = [0.22, 0.61, 0.36, 1];
const M = 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/';
const F = 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/';
const P = 'https://images.pixieset.com/224055201/';

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

// Pixieset serves several sizes; give the browser the choice so phones get small
// files and big/retina screens get the sharp 1600px version.
const px = (id) => ({
  src: `${P}${id}-xxlarge.jpg`,
  srcSet: `${P}${id}-large.jpg 640w, ${P}${id}-xlarge.jpg 1024w, ${P}${id}-xxlarge.jpg 1600w`,
});

// Hero uses only full-resolution originals (1600–1800px). The Base44-hosted
// wedding/corporate/graduation copies are only 681px wide, too soft full-screen.
const heroSlides = [
  { src: `${F}23c6f23d5_m1.jpg`, alt: 'Matric dance couple by the lake at golden hour', label: 'Matric Dance', pos: '50% 40%' },
  { ...px('8b064709835a34b21aba22f4a48f292b'), alt: 'Portrait in dramatic natural light', label: 'Portraits', pos: '50% 30%' },
  { src: `${F}422cb06bd_m5.jpg`, alt: 'Matric dance couple with sunset flare', label: 'Matric Dance', pos: '50% 40%' },
  { ...px('7434a23374497b1b13cc0130da62472b'), alt: 'Natural light lifestyle portrait', label: 'Portraits', pos: '50% 30%' },
  { src: `${F}fb33a2eb4_m7.jpg`, alt: 'Matric dance couple holding hands with red roses', label: 'Matric Dance', pos: '50% 45%' },
  { ...px('2cf20d4a9d00d86934d0adb64a70c03f'), alt: 'Lifestyle portrait', label: 'Portraits', pos: '50% 30%' },
];

const work = [
  { src: `${M}1d785af91_DSC_5034.jpg`, alt: 'Bride laughing while writing her vows', cat: 'Weddings' },
  { src: `${F}f17a7f633_m4.jpg`, alt: 'Matric dance portrait, beaded gown with corset back', cat: 'Matric Dance' },
  { src: `${M}d0c463f82_DSC_4127.jpg`, alt: 'Corporate portrait in a luxury interior', cat: 'Corporate' },
  { src: `${M}922435be1_DSC_4228.jpg`, alt: 'Graduation portrait', cat: 'Graduations' },
  { ...px('fa1a43cc250efd88003bc5da98382de8'), alt: 'Expressive individual portrait', cat: 'Portraits' },
  { src: `${F}ea0215502_m8.jpg`, alt: 'Matric dance couple overlooking the lake at sunset', cat: 'Matric Dance', wide: true },
  { ...px('ba20179241b13dc570b3d7c663e22bf5'), alt: 'Candid lifestyle portrait', cat: 'Portraits', wide: true },
  { src: `${M}a5a2523e3_DSC_5077.jpg`, alt: 'Bride with perfume bottle', cat: 'Weddings' },
  { src: `${M}b6065684a_DSC_4113.jpg`, alt: 'Corporate portrait of a man in a navy suit', cat: 'Corporate' },
  { src: `${M}7dbd77260_DSC_4354.jpg`, alt: 'Graduation portrait outdoors', cat: 'Graduations' },
  { src: `${M}55625f9db_DSC_5069.jpg`, alt: 'Bride laughing freely', cat: 'Weddings' },
  { src: `${M}53fd1db74_DSC_4135.jpg`, alt: 'Corporate portrait with eagle sculpture', cat: 'Corporate' },
];
const filters = ['All', 'Weddings', 'Portraits', 'Corporate', 'Graduations', 'Matric Dance'];


/* ------------------------------------------------------------------ */
/* Hero — crossfading slideshow with slow zoom and a masked headline   */
/* ------------------------------------------------------------------ */

const SLIDE_MS = 6500;

function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const go = useCallback((i) => setIndex((i + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => go(index + 1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  // Pause when the tab is hidden; warm the next image so changes never flash
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);
  useEffect(() => {
    const img = new Image();
    img.src = heroSlides[(index + 1) % heroSlides.length].src;
  }, [index]);

  const slide = heroSlides[index];
  const lines = [
    { text: 'PEOPLE.', cls: '' },
    { text: 'MOMENTS.', cls: '' },
    { text: 'Culture.', cls: 'italic text-gold' },
  ];

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] max-h-[960px] overflow-hidden bg-background" aria-label="Featured photography">
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: imgY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease }}
          >
            <motion.img
              src={slide.src}
              srcSet={slide.srcSet}
              sizes="100vw"
              alt={slide.alt}
              className="h-full w-full object-cover"
              style={{ objectPosition: slide.pos }}
              initial={{ scale: 1.07 }}
              animate={{ scale: 1 }}
              transition={{ duration: SLIDE_MS / 1000 + 2, ease: 'linear' }}
              fetchpriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
              draggable="false"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Shading for legibility, as in the design */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,19,0.55)_0%,rgba(20,18,19,0)_28%,rgba(20,18,19,0)_50%,rgba(20,18,19,0.9)_100%)]" />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 pb-14 flex flex-wrap items-end justify-between gap-7">
          <div className="flex flex-col gap-[18px]">
            <motion.span
              aria-hidden="true"
              className="block h-[2px] w-14 bg-gold origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
            />
            <h1 className="sr-only">{corePages.home.h1}</h1>
            <p aria-hidden="true" className="m-0 font-cormorant font-medium text-white leading-[0.92] tracking-[0.02em] text-[clamp(56px,8.5vw,132px)]">
              {lines.map((l, i) => (
                <span key={l.text} className="block overflow-hidden pb-[0.05em]">
                  <motion.span
                    className={`block ${l.cls}`}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.1, ease, delay: 0.35 + i * 0.14 }}
                  >
                    {l.text}
                  </motion.span>
                </span>
              ))}
            </p>
          </div>

          <motion.div
            className="flex flex-col items-end gap-4 text-right"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 1 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <p className="m-0 font-lato text-[13px] leading-[2] tracking-[0.24em] uppercase text-[#E2DCD4]">
              Gauteng &amp; National<br />Photography
            </p>
            <div className="flex gap-1.5" role="tablist" aria-label="Choose photo">
              {heroSlides.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show photo ${i + 1}: ${s.label}`}
                  onClick={() => go(i)}
                  className="group relative h-6 w-7"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/25 group-hover:bg-white/50 transition-colors" />
                  {i === index && (
                    <motion.span
                      key={`fill-${index}-${paused}`}
                      className="absolute left-0 top-1/2 h-px -translate-y-1/2 w-full bg-gold origin-left"
                      initial={{ scaleX: paused ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div aria-hidden="true" className="absolute left-1/2 bottom-5 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
        <span className="h-10 w-px overflow-hidden bg-white/15"><span className="sb-scroll-cue block h-full w-full bg-white/80" /></span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Selected work — filterable grid with layout animation               */
/* ------------------------------------------------------------------ */

function Tile({ item, ratio, tall = false, caption = true, delay = 0 }) {
  return (
    <motion.figure
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease, delay }}
      className={`group m-0 ${tall ? 'sm:row-span-2' : ''}`}
    >
      <div className={`relative overflow-hidden bg-white/[0.04] ${tall ? 'h-full min-h-[460px] sm:min-h-[560px]' : ''}`}>
        <img
          src={item.src}
          srcSet={item.srcSet}
          sizes={tall ? '(min-width: 640px) 33vw, 100vw' : ratio === 'aspect-[16/9]' ? '(min-width: 640px) 50vw, 100vw' : '(min-width: 640px) 33vw, 100vw'}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          className={`block w-full object-cover transition-transform duration-[1.4s] group-hover:scale-[1.05] ${tall ? 'absolute inset-0 h-full' : ratio}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)' }}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 font-lato text-[11px] tracking-[0.24em] uppercase text-[#B9B2AA] transition-colors group-hover:text-white">
          {item.cat}
        </figcaption>
      )}
    </motion.figure>
  );
}

function SelectedWork() {
  const [filter, setFilter] = useState('All');
  const byCat = (c) => work.filter((w) => w.cat === c);
  // "All" uses the template's arrangement: one tall photo, four 3:2 tiles, then two wide 16:9 tiles
  const tall = byCat('Weddings')[0];
  const four = [byCat('Matric Dance')[0], byCat('Corporate')[0], byCat('Graduations')[0], byCat('Portraits')[0]];
  const wide = work.filter((w) => w.wide);
  const filtered = filter === 'All' ? [] : byCat(filter);

  return (
    <section id="work" className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 pt-[72px] pb-[120px] scroll-mt-20">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-11">
        <motion.h2
          className="m-0 text-[40px] leading-none tracking-[0.06em] text-white uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease }}
        >
          Selected work
        </motion.h2>
        <div className="flex flex-wrap gap-x-7 gap-y-2.5" role="tablist" aria-label="Filter work by category">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`relative pb-1 font-lato text-[12px] tracking-[0.22em] uppercase transition-colors ${filter === f ? 'text-gold' : 'text-[#B9B2AA] hover:text-white'}`}
            >
              {f}
              {filter === f && (
                <motion.span layoutId="work-filter-line" className="absolute inset-x-0 -bottom-px h-px bg-gold" transition={{ duration: 0.45, ease }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {filter === 'All' ? (
          <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              <Tile item={tall} tall caption={false} />
              {four.map((w, i) => <Tile key={w.src} item={w} ratio="aspect-[3/2]" delay={0.08 * (i + 1)} />)}
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 mt-4">
              {wide.map((w, i) => <Tile key={w.src} item={w} ratio="aspect-[16/9]" delay={0.1 * i} />)}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={filter}
            className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {filtered.map((w, i) => <Tile key={w.src} item={w} ratio="aspect-[3/2]" delay={0.07 * i} />)}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 flex justify-center">
        <Link to="/portfolio" className="sb-link-draw pb-1 font-lato text-[12px] tracking-[0.26em] uppercase text-white hover:text-gold transition-colors">
          View the full portfolio
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Statement band — words light up as it scrolls into view             */
/* ------------------------------------------------------------------ */

function Statement() {
  const words = 'Weddings, portraits, corporate, graduations and matric dance — photographed with a quiet, honest eye.'.split(' ');
  return (
    <section className="bg-[#6A2230] text-white">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 py-[112px] flex flex-col items-center text-center gap-[22px]">
        <p className="m-0 font-lato text-[12px] tracking-[0.32em] uppercase text-[#F1D9DD]">Beautiful moments &nbsp;|&nbsp; Timeless memories</p>
        <motion.p
          className="m-0 font-cormorant text-[clamp(32px,4vw,56px)] leading-[1.15] max-w-[940px]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-120px' }}
          variants={{ show: { transition: { staggerChildren: 0.045 } } }}
        >
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              className="inline-block mr-[0.25em]"
              variants={{ hidden: { opacity: 0.15, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
            >
              {w}
            </motion.span>
          ))}
        </motion.p>
        <Link to="/about" className="font-lato text-[12px] tracking-[0.26em] uppercase border-b border-white pb-1 hover:text-[#F1D9DD] hover:border-[#F1D9DD] transition-colors">
          About Brooklyn
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About Johannesburg (SEO copy, kept from the original page)          */
/* ------------------------------------------------------------------ */

function LocalSeo() {
  return (
    <section className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 py-24 md:py-28">
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
        <div>
          <p className="font-lato text-[11px] tracking-[0.3em] uppercase text-gold mb-5">Photographer in Johannesburg</p>
          <h2 className="text-[34px] md:text-[44px] leading-[1.05] text-white">Professional photography across Johannesburg &amp; Gauteng</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-8 font-lato text-[15px] leading-[1.8] text-white/65">
          <p>
            Stills by Brooklyn is a professional photographer based in Midrand, Johannesburg, offering photography to individuals, families and businesses across Gauteng — from sharp corporate headshots to intimate portraits and full wedding coverage.
          </p>
          <p>
            Serving Johannesburg, Sandton, Midrand, Rosebank, Randburg and Pretoria, and travelling nationwide for weddings and traditional ceremonies. Every project gets the same care for light, composition and editing.
          </p>
          <div className="sm:col-span-2">
            <h3 className="text-[26px] text-white mb-4">Areas we cover</h3>
            <div className="flex flex-wrap gap-2">
              {locationNav.map((l) => (
                <Link key={l.path} to={l.path} className="border border-white/15 px-4 py-2.5 font-lato text-[11px] tracking-[0.18em] uppercase text-white/70 hover:border-gold hover:text-gold transition-colors">
                  Photographer in {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useSeo(corePages.home);
  return (
    <div className="relative bg-background">
      <BackToTop />
      <WhatsAppButton />
      <Hero />
      <SelectedWork />
      <Statement />
      <LocalSeo />
    </div>
  );
}
