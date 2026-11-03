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

const heroSlides = [
  { src: `${M}6690fe0fb_DSC_5010.jpg`, alt: 'Bride smiling during her wedding morning', label: 'Weddings', pos: '50% 30%' },
  { src: `${F}23c6f23d5_m1.jpg`, alt: 'Matric dance couple by the lake at golden hour', label: 'Matric Dance', pos: '50% 45%' },
  { src: `${M}47ae0dc0f_DSC_4110.jpg`, alt: 'Corporate executive portrait in a lounge', label: 'Corporate', pos: '50% 35%' },
  { src: `${M}a33532f67_DSC_4300.jpg`, alt: 'Graduation portrait in cap and gown', label: 'Graduations', pos: '50% 30%' },
  { src: `${P}8b064709835a34b21aba22f4a48f292b-large.jpg`, alt: 'Portrait in dramatic natural light', label: 'Portraits', pos: '50% 35%' },
  { src: `${M}4ce78177c_DSC_5068.jpg`, alt: 'Bridal portrait, bride smiling sideways', label: 'Weddings', pos: '50% 30%' },
];

const work = [
  { src: `${M}1d785af91_DSC_5034.jpg`, alt: 'Bride laughing while writing her vows', cat: 'Weddings' },
  { src: `${F}f17a7f633_m4.jpg`, alt: 'Matric dance portrait, beaded gown with corset back', cat: 'Matric Dance' },
  { src: `${M}d0c463f82_DSC_4127.jpg`, alt: 'Corporate portrait in a luxury interior', cat: 'Corporate' },
  { src: `${P}7434a23374497b1b13cc0130da62472b-large.jpg`, alt: 'Natural light lifestyle portrait', cat: 'Portraits' },
  { src: `${M}922435be1_DSC_4228.jpg`, alt: 'Graduation portrait', cat: 'Graduations' },
  { src: `${M}a5a2523e3_DSC_5077.jpg`, alt: 'Bride with perfume bottle', cat: 'Weddings' },
  { src: `${M}b6065684a_DSC_4113.jpg`, alt: 'Corporate portrait of a man in a navy suit', cat: 'Corporate' },
  { src: `${F}fb33a2eb4_m7.jpg`, alt: 'Matric dance couple holding hands with red roses', cat: 'Matric Dance' },
  { src: `${P}fa1a43cc250efd88003bc5da98382de8-large.jpg`, alt: 'Expressive individual portrait', cat: 'Portraits' },
  { src: `${M}7dbd77260_DSC_4354.jpg`, alt: 'Graduation portrait outdoors', cat: 'Graduations' },
  { src: `${M}55625f9db_DSC_5069.jpg`, alt: 'Bride laughing freely', cat: 'Weddings' },
  { src: `${M}53fd1db74_DSC_4135.jpg`, alt: 'Corporate portrait with eagle sculpture', cat: 'Corporate' },
];
const filters = ['All', 'Weddings', 'Portraits', 'Corporate', 'Graduations', 'Matric Dance'];

const services = [
  { no: '01', name: 'Weddings', line: 'Getting ready through to first dance — white and traditional.', href: '/wedding-photographer-johannesburg', img: `${M}cccedc2d2_DSC_5125.jpg` },
  { no: '02', name: 'Portraits', line: 'Personal, family and studio sessions that tell your story.', href: '/photography-studio-johannesburg', img: `${P}e8913758e3894e34b8d1a0b20f196fc4-large.jpg` },
  { no: '03', name: 'Corporate', line: 'Headshots, teams, brand imagery and company events.', href: '/corporate-headshots-johannesburg', img: `${M}1f3139dc3_DSC_4126.jpg` },
  { no: '04', name: 'Graduations', line: 'Your milestone, beautifully kept.', href: '/graduation-photoshoot-johannesburg', img: `${M}e7626e7ee_DSC_4273.jpg` },
  { no: '05', name: 'Matric Dance', line: 'The style and pride of the big night, at golden hour.', href: '/matric-dance-photographer', img: `${F}d7b28935b_m6.jpg` },
];

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
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-background" aria-label="Featured photography">
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
              alt={slide.alt}
              className="h-full w-full object-cover"
              style={{ objectPosition: slide.pos }}
              initial={{ scale: 1.14 }}
              animate={{ scale: 1.02 }}
              transition={{ duration: SLIDE_MS / 1000 + 2, ease: 'linear' }}
              fetchpriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
              draggable="false"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Shading for legibility, as in the design */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,19,0.55)_0%,rgba(20,18,19,0)_28%,rgba(20,18,19,0)_48%,rgba(20,18,19,0.92)_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(20,18,19,0.55),transparent_60%)]" />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 pb-16 md:pb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div className="flex flex-col gap-5">
            <motion.span
              aria-hidden="true"
              className="block h-[2px] w-14 bg-gold origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
            />
            <motion.h1
              className="font-lato text-[11px] sm:text-xs tracking-[0.34em] uppercase text-white/80"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.35 }}
            >
              {corePages.home.h1}
            </motion.h1>
            <p className="font-cormorant font-medium text-white leading-[0.92] tracking-[0.02em] text-[clamp(58px,8.6vw,136px)]">
              {lines.map((l, i) => (
                <span key={l.text} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className={`block ${l.cls}`}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.1, ease, delay: 0.45 + i * 0.14 }}
                  >
                    {l.text}
                  </motion.span>
                </span>
              ))}
            </p>
            <motion.div
              className="flex flex-wrap gap-3 pt-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 1.05 }}
            >
              <Link to="/booking" className="group relative overflow-hidden bg-white px-7 py-4 font-lato text-[11px] font-bold tracking-[0.26em] uppercase text-black">
                <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-500 group-hover:translate-y-0" style={{ transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)' }} />
                <span className="relative">Book a session</span>
              </Link>
              <a href="#work" className="border border-white/35 px-7 py-4 font-lato text-[11px] tracking-[0.26em] uppercase text-white hover:border-white transition-colors">
                View work
              </a>
            </motion.div>
          </div>

          {/* Slide counter + controls */}
          <motion.div
            className="flex flex-col gap-4 md:items-end md:text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <p className="font-lato text-[11px] leading-[2] tracking-[0.26em] uppercase text-white/75 hidden md:block">
              Gauteng &amp; National<br />Photography
            </p>
            <div className="flex items-baseline gap-3 font-lato text-[11px] tracking-[0.26em] uppercase text-white/75">
              <span className="text-white tabular-nums">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-white/40">/ {String(heroSlides.length).padStart(2, '0')}</span>
              <span className="relative ml-2 inline-block h-4 min-w-[120px] overflow-hidden text-left md:text-right">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={slide.label + index}
                    className="absolute inset-0 text-gold"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.45, ease }}
                  >
                    {slide.label}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
            <div className="flex gap-2" role="tablist" aria-label="Choose slide">
              {heroSlides.map((s, i) => (
                <button
                  key={s.src}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show slide ${i + 1}: ${s.label}`}
                  onClick={() => go(i)}
                  className="group relative h-11 w-8 sm:w-10"
                >
                  <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-white/25 group-hover:bg-white/45 transition-colors" />
                  {i === index && (
                    <motion.span
                      key={`fill-${index}-${paused}`}
                      className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 w-full bg-white origin-left"
                      initial={{ scaleX: paused ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: 'linear' }}
                    />
                  )}
                  {i < index && <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-white/70" />}
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

function SelectedWork() {
  const [filter, setFilter] = useState('All');
  const items = filter === 'All' ? work.slice(0, 9) : work.filter((w) => w.cat === filter);

  return (
    <section id="work" className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 pt-24 md:pt-32 pb-24 md:pb-32 scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
        <motion.h2
          className="text-[34px] sm:text-[40px] md:text-[48px] leading-none tracking-[0.06em] text-white uppercase"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
        >
          Selected work
        </motion.h2>
        <div className="flex flex-wrap gap-x-7 gap-y-3" role="tablist" aria-label="Filter work by category">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`relative pb-2 min-h-[32px] font-lato text-[11px] tracking-[0.24em] uppercase transition-colors ${filter === f ? 'text-gold' : 'text-white/60 hover:text-white'}`}
            >
              {f}
              {filter === f && (
                <motion.span layoutId="work-filter-line" className="absolute inset-x-0 bottom-0 h-px bg-gold" transition={{ duration: 0.45, ease }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((w, i) => {
            const feature = i === 0;
            return (
              <motion.figure
                layout
                key={w.src}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.55, ease }}
                className={`group relative m-0 overflow-hidden bg-white/[0.04] ${feature ? 'col-span-2 md:col-span-1 md:row-span-2' : ''}`}
              >
                <motion.div
                  className="h-full w-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, ease, delay: (i % 3) * 0.08 }}
                >
                  <img
                    src={w.src}
                    alt={w.alt}
                    loading="lazy"
                    decoding="async"
                    className={`w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.06] ${feature ? 'h-full min-h-[420px] aspect-[4/5] md:aspect-auto' : 'aspect-[4/5]'}`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)' }}
                  />
                </motion.div>
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-5 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
                  <span className="font-lato text-[10px] md:text-[11px] tracking-[0.26em] uppercase text-white">{w.cat}</span>
                  <span className="text-gold text-lg leading-none">→</span>
                </figcaption>
              </motion.figure>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <div className="mt-12 flex justify-center">
        <Link to="/portfolio" className="sb-link-draw pb-1 font-lato text-[11px] tracking-[0.28em] uppercase text-white hover:text-gold transition-colors">
          View the full portfolio →
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
    <section className="bg-ivory text-ink">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 py-24 md:py-32 flex flex-col items-center text-center gap-8">
        <p className="font-lato text-[11px] tracking-[0.32em] uppercase text-ink/60">Beautiful moments &nbsp;|&nbsp; Timeless memories</p>
        <motion.p
          className="font-cormorant text-[clamp(32px,4.2vw,58px)] leading-[1.15] max-w-[980px]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-120px' }}
          variants={{ show: { transition: { staggerChildren: 0.045 } } }}
        >
          {words.map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              className="inline-block mr-[0.25em]"
              variants={{ hidden: { opacity: 0.12, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
            >
              {w}
            </motion.span>
          ))}
        </motion.p>
        <Link to="/about" className="sb-link-draw pb-1 font-lato text-[11px] tracking-[0.28em] uppercase text-ink hover:opacity-70 transition-opacity">
          About Brooklyn
        </Link>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services — editorial list with a hover preview                      */
/* ------------------------------------------------------------------ */

function Services() {
  const [hover, setHover] = useState(null);
  return (
    <section className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 py-24 md:py-32">
      <div className="flex items-end gap-6 mb-10 md:mb-14">
        <h2 className="text-[34px] sm:text-[40px] md:text-[48px] leading-none tracking-[0.06em] uppercase text-white sm:whitespace-nowrap">What I photograph</h2>
        <span className="flex-1 h-px bg-white/10 mb-3 hidden sm:block" />
      </div>
      <div className="relative grid md:grid-cols-[1fr_380px] gap-12 items-start">
        <ul className="border-t border-white/10" onMouseLeave={() => setHover(null)}>
          {services.map((s, i) => (
            <motion.li
              key={s.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease, delay: i * 0.06 }}
              className="border-b border-white/10"
            >
              <Link
                to={s.href}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                className="group flex items-center gap-5 md:gap-8 py-6 md:py-7"
              >
                <span className="font-lato text-[11px] tracking-[0.2em] text-white/45 w-8 shrink-0">{s.no}</span>
                <span className="flex-1 min-w-0">
                  <span className={`block font-cormorant text-[30px] md:text-[44px] leading-none tracking-[0.02em] transition-all duration-500 group-hover:translate-x-2 ${hover === i ? 'text-gold italic' : 'text-white'}`}>
                    {s.name}
                  </span>
                  <span className="mt-2 block font-lato text-[13px] text-white/55">{s.line}</span>
                </span>
                <span className="text-gold text-xl transition-transform duration-500 group-hover:translate-x-1 opacity-60 group-hover:opacity-100">→</span>
              </Link>
            </motion.li>
          ))}
        </ul>
        <div className="hidden md:block sticky top-28 aspect-[4/5] overflow-hidden bg-white/[0.04]">
          <AnimatePresence mode="sync">
            <motion.img
              key={hover ?? 0}
              src={services[hover ?? 0].img}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease }}
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee                                                             */
/* ------------------------------------------------------------------ */

function Marquee() {
  const items = ['Weddings', 'Portraits', 'Corporate', 'Graduations', 'Matric Dance', 'Events', 'Traditional Ceremonies'];
  const row = [...items, ...items];
  return (
    <div className="sb-marquee border-y border-white/10 overflow-hidden py-6 md:py-8 select-none" aria-hidden="true">
      <div className="sb-marquee-track flex w-max">
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center">
            {row.map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center font-cormorant italic text-[34px] md:text-[52px] leading-none text-white/85 px-6 md:px-10">
                {t}
                <span className="ml-12 md:ml-20 inline-block h-2 w-2 rounded-full bg-gold not-italic" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
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
      <Services />
      <Marquee />
      <LocalSeo />
    </div>
  );
}
