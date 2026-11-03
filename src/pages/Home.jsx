import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useSeo } from '@/lib/seo';
import { corePages } from '@/content/corePages';
import { locationNav } from '@/content/seoPages';
import BackToTop from '../components/BackToTop';
import WhatsAppButton from '../components/WhatsAppButton';
import SplitReveal from '../components/SplitReveal';

const ease = [0.22, 0.61, 0.36, 1];
const M = 'https://media.base44.com/images/public/69cfd090f016bb0f1b452639/';
const F = 'https://base44.app/api/apps/69cfd090f016bb0f1b452639/files/mp/public/69cfd090f016bb0f1b452639/';
const P = 'https://images.pixieset.com/224055201/';

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

// Pixieset serves several sizes; give the browser the choice so phones get small
// files and big/retina screens get the sharp 1600px version.
const pxc = (collection, id) => {
  const b = `https://images.pixieset.com/${collection}/${id}`;
  return { src: `${b}-xxlarge.jpg`, srcSet: `${b}-large.jpg 640w, ${b}-xlarge.jpg 1024w, ${b}-xxlarge.jpg 1600w` };
};
const px = (id) => pxc('224055201', id);
// Musa weds Kuhlula — stillsbybrooklyn2.pixieset.com (part 1 and part 2)
const w1 = (id) => pxc('308694411', id);
const w2 = (id) => pxc('941414611', id);

// Photos stored with the site (public/images/home), in three sizes each
const local = (name, widths) => ({
  src: `/images/home/${name}-${widths[widths.length - 1]}.jpg`,
  srcSet: widths.map((w) => `/images/home/${name}-${w}.jpg ${w}w`).join(', '),
});

// Hero uses only full-resolution originals (1600–1800px). The Base44-hosted
// wedding/corporate/graduation copies are only 681px wide, too soft full-screen.
const heroSlides = [
  { ...local('portrait-sportscar', [800, 1400, 2400]), alt: 'Portrait of a young man in a suit seated in a blue sports car', label: 'Portraits', pos: '50% 40%' },
  { ...w2('22e3962a0016a59371959df425b02d38'), alt: 'Bride and groom sharing a kiss at their wedding', label: 'Weddings', pos: '50% 30%' },
  { ...px('4c7e470f347219005082063e353df3c6'), alt: 'Portrait in a green dress with butterflies in her hair', label: 'Portraits', pos: '50% 48%' },
  { ...w1('dee9e86bd1d00cf1ab65492d079d2dc1'), alt: 'Bride in her gown and veil on the wedding morning', label: 'Weddings', pos: '50% 22%' },
  { ...local('matric-couple-black', [640, 1100, 1714]), alt: 'Matric dance couple at golden hour, she in a black off-shoulder gown', label: 'Matric Dance', pos: '50% 10%' },
  { ...w2('2f5d85a0b309ebc1cb0f87ff728c5c8d'), alt: 'Bride and groom posing together at the ceremony', label: 'Weddings', pos: '50% 8%' },
  { ...px('8b064709835a34b21aba22f4a48f292b'), alt: 'Portrait in dramatic natural light', label: 'Portraits', pos: '50% 43%' },
  { ...w1('11bc9e3fd04edffa0e480016316e2456'), alt: 'Bride putting on her earrings', label: 'Weddings', pos: '50% 24%' },
  { ...local('matric-black-gown', [640, 1100, 1714]), alt: 'Matric dance portrait in a beaded black gown, seated', label: 'Matric Dance', pos: '50% 21%' },
  { ...px('edc40b2fae11499f30bcac47d2d9a565'), alt: 'Backlit portrait in the park at golden hour', label: 'Portraits', pos: '50% 37%' },
];

const work = [
  { ...w2('ef10b35cf9800c88aa5d8356d84a570f'), alt: 'Bride in her full wedding gown', cat: 'Weddings' },
  { src: `${F}f17a7f633_m4.jpg`, alt: 'Matric dance portrait, beaded gown with corset back', cat: 'Matric Dance' },
  { src: `${M}d0c463f82_DSC_4127.jpg`, alt: 'Corporate portrait in a luxury interior', cat: 'Corporate' },
  { src: `${M}922435be1_DSC_4228.jpg`, alt: 'Graduation portrait', cat: 'Graduations' },
  { ...px('fa1a43cc250efd88003bc5da98382de8'), alt: 'Expressive individual portrait', cat: 'Portraits' },
  { ...local('portrait-sportscar', [800, 1400, 2400]), alt: 'Portrait of a young man in a suit seated in a blue sports car', cat: 'Portraits', ratio: '2576 / 1714' },
  { src: `${F}ea0215502_m8.jpg`, alt: 'Matric dance couple overlooking the lake at sunset', cat: 'Matric Dance' },
  { ...local('matric-couple-black', [640, 1100, 1714]), alt: 'Matric dance couple at golden hour, she in a black off-shoulder gown', cat: 'Matric Dance', ratio: '1714 / 2576' },
  { ...local('matric-black-gown', [640, 1100, 1714]), alt: 'Matric dance portrait in a beaded black gown, seated', cat: 'Matric Dance', ratio: '1714 / 2576' },
  { ...px('ba20179241b13dc570b3d7c663e22bf5'), alt: 'Candid lifestyle portrait', cat: 'Portraits' },
  { ...px('fde31b87e7a08b619d812341fa6ee77d'), alt: 'Seated portrait in a green dress', cat: 'Portraits' },
  { ...px('fc208e0a9a611c89ddb44428f0816e80'), alt: 'Full-length portrait in a green dress on the lawn', cat: 'Portraits' },
  { ...px('c9a5b988d05edf52676ed4195442e3f9'), alt: 'Thoughtful portrait with butterflies in her hair', cat: 'Portraits' },
  { ...px('edc40b2fae11499f30bcac47d2d9a565'), alt: 'Backlit portrait in the park at golden hour', cat: 'Portraits' },
  { ...w2('5be27fdc4bf37b0e4e76c80714385d2b'), alt: 'Bride and groom walking together', cat: 'Weddings' },
  { ...w1('d416537229004fc4ae8c488a62b7f93a'), alt: 'Bride under her veil', cat: 'Weddings', ratio: '1600 / 2450' },
  { ...w1('cb9e044827d97b4540114584471caf95'), alt: 'Groom adjusting his bow tie', cat: 'Weddings', ratio: '1600 / 2820' },
  { ...w1('ac6e9df0f74c8dbc38e4dbc4b8bc8bd9'), alt: 'Bride in her robe on the wedding morning', cat: 'Weddings' },
  { ...w2('762b97c477d265fb8214dec56617e560'), alt: 'Bride and groom outdoors on their wedding day', cat: 'Weddings' },
  { src: `${M}b6065684a_DSC_4113.jpg`, alt: 'Corporate portrait of a man in a navy suit', cat: 'Corporate' },
  { src: `${M}7dbd77260_DSC_4354.jpg`, alt: 'Graduation portrait outdoors', cat: 'Graduations' },
  { src: `${M}53fd1db74_DSC_4135.jpg`, alt: 'Corporate portrait with eagle sculpture', cat: 'Corporate' },
];
const filters = ['All', 'Weddings', 'Portraits', 'Corporate', 'Graduations', 'Matric Dance'];


/* ------------------------------------------------------------------ */
/* Hero — full-screen slideshow with a wipe transition and masked headline */
/* ------------------------------------------------------------------ */

const SLIDE_MS = 6500;
const WIPE_S = 1.25;
const wipeEase = [0.77, 0, 0.18, 1];

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
          {/* Each new photo wipes in from the right over the previous one, led by a thin
              orange line; no zoom, so the photo always shows exactly as framed. */}
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ clipPath: 'inset(0 0 0 100%)' }}
            animate={{ clipPath: 'inset(0 0 0 0%)' }}
            exit={{ opacity: 0, transition: { delay: WIPE_S, duration: 0.25 } }}
            transition={{ duration: WIPE_S, ease: wipeEase }}
          >
            <motion.img
              src={slide.src}
              srcSet={slide.srcSet}
              sizes="100vw"
              alt={slide.alt}
              className="h-full w-full object-cover"
              style={{ objectPosition: slide.pos }}
              initial={{ x: '6%' }}
              animate={{ x: '0%' }}
              transition={{ duration: WIPE_S, ease: wipeEase }}
              fetchpriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
              draggable="false"
            />
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 w-[3px] bg-gold"
              initial={{ left: '100%', opacity: 1 }}
              animate={{ left: '0%', opacity: 0 }}
              transition={{ left: { duration: WIPE_S, ease: wipeEase }, opacity: { duration: 0.3, delay: WIPE_S - 0.15 } }}
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

// "All" mixes the categories so every column has variety
function mixCategories(items, take = 12) {
  const order = ['Weddings', 'Portraits', 'Matric Dance', 'Corporate', 'Weddings', 'Graduations', 'Portraits', 'Matric Dance', 'Weddings', 'Corporate', 'Portraits', 'Graduations', 'Weddings', 'Matric Dance', 'Portraits'];
  const pools = {};
  items.forEach((it) => { (pools[it.cat] = pools[it.cat] || []).push(it); });
  const out = [];
  for (const cat of order) {
    const next = pools[cat]?.shift();
    if (next) out.push(next);
    if (out.length === take) break;
  }
  return out;
}

function useColumns() {
  const get = () => (typeof window === 'undefined' || window.innerWidth >= 1024 ? 3 : 2);
  const [cols, setCols] = useState(get);
  useEffect(() => {
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => setCols(get()), 120); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, []);
  return cols;
}

// One photo, shown whole at its natural shape. It reveals with a lifting curtain,
// tilts gently towards the mouse, and shows its category on hover.
function Tile({ item, delay = 0, sizes }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 160, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 160, damping: 18 });
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  };
  const reset = () => { rx.set(0); ry.set(0); };

  return (
    <motion.figure
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className="group m-0 [perspective:1000px]"
    >
      <motion.div onPointerMove={onMove} onPointerLeave={reset} style={{ rotateX, rotateY }} className="relative">
        <motion.div
          variants={{ hidden: { clipPath: 'inset(100% 0% 0% 0%)' }, show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, ease: [0.77, 0, 0.18, 1], delay } } }}
          className="relative overflow-hidden bg-white/[0.04]"
          style={{ aspectRatio: item.ratio || '2 / 3' }}
        >
          <motion.img
            src={item.src}
            srcSet={item.srcSet}
            sizes={sizes}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            variants={{ hidden: { scale: 1.08, opacity: 0.4 }, show: { scale: 1, opacity: 1, transition: { duration: 1.4, ease, delay } } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Hover: soft shade, category label slides up, orange frame draws in */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-5 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="font-lato text-[11px] tracking-[0.26em] uppercase text-white">{item.cat}</span>
            <span className="text-gold text-xl leading-none">→</span>
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-transparent transition-all duration-500 group-hover:ring-gold/70" />
        </motion.div>
      </motion.div>
      <motion.figcaption
        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: delay + 0.5 } } }}
        className="mt-3 font-lato text-[11px] tracking-[0.24em] uppercase text-[#B9B2AA]"
      >
        {item.cat}
      </motion.figcaption>
    </motion.figure>
  );
}

// Masonry: photos keep their real proportions, so nothing is cropped. On wide
// screens the middle column drifts at a different speed while you scroll.
function Masonry({ items, keyName }) {
  const cols = useColumns();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yMid = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const ySide = useTransform(scrollYProgress, [0, 1], [-16, 16]);
  const columns = Array.from({ length: cols }, () => []);
  items.forEach((it, i) => columns[i % cols].push({ it, i }));
  const sizes = cols === 3 ? '(min-width: 1360px) 420px, 31vw' : '48vw';

  return (
    <div ref={ref} className="flex gap-3 md:gap-5 items-start">
      {columns.map((col, c) => (
        <motion.div
          key={`${keyName}-${cols}-${c}`}
          style={{ y: cols === 3 ? (c === 1 ? yMid : ySide) : 0 }}
          className={`flex-1 min-w-0 flex flex-col gap-5 md:gap-7 ${cols === 3 && c === 1 ? 'pt-14' : ''}`}
        >
          {col.map(({ it, i }) => (
            <Tile key={it.src} item={it} sizes={sizes} delay={(i % cols) * 0.09} />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function SelectedWork() {
  const [filter, setFilter] = useState('All');
  const items = filter === 'All' ? mixCategories(work, 12) : work.filter((w) => w.cat === filter);

  return (
    <section id="work" className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 pt-[72px] pb-[140px] scroll-mt-20">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <SplitReveal as="h2" text="Selected work" className="m-0 text-[40px] leading-none tracking-[0.06em] text-white uppercase" />
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
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease }}
        >
          <Masonry items={items} keyName={filter} />
        </motion.div>
      </AnimatePresence>

      <div className="mt-16 flex justify-center">
        <Link to="/portfolio" className="group inline-flex items-center gap-3 font-lato text-[12px] tracking-[0.26em] uppercase text-white hover:text-gold transition-colors">
          <span className="sb-link-draw pb-1">View the full portfolio</span>
          <span className="text-gold transition-transform duration-500 group-hover:translate-x-2">→</span>
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
    <motion.section
      className="bg-[#9E4317] text-white"
      initial={{ clipPath: 'inset(6% 5% 6% 5%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 1.2, ease: [0.77, 0, 0.18, 1] }}
    >
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 py-[112px] flex flex-col items-center text-center gap-[22px]">
        <p className="m-0 font-lato text-[12px] tracking-[0.32em] uppercase text-[#F8D9C3]">Beautiful moments &nbsp;|&nbsp; Timeless memories</p>
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
        <Link to="/about" className="font-lato text-[12px] tracking-[0.26em] uppercase border-b border-white pb-1 hover:text-[#F8D9C3] hover:border-[#F8D9C3] transition-colors">
          About Brooklyn
        </Link>
      </div>
    </motion.section>
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
          <SplitReveal as="h2" by="word" stagger={0.06} text="Professional photography across Johannesburg & Gauteng" className="text-[34px] md:text-[44px] leading-[1.05] text-white" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease }} className="grid sm:grid-cols-2 gap-8 font-lato text-[15px] leading-[1.8] text-white/65">
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
        </motion.div>
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
