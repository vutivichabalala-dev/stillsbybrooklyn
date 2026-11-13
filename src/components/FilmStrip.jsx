import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

const ease = [0.22, 0.61, 0.36, 1];
// Horizontal travel per pixel scrolled (>1 = the strip moves faster than you scroll)
const SPEED = 1.25;

/**
 * Horizontal film strip. On desktop the section pins to the screen and
 * scrolling down slides the frames sideways, with a progress hairline beneath.
 * On phones, tablets and reduced-motion it is a normal swipeable row with
 * snap points, so nothing hijacks the scroll.
 */
export default function FilmStrip({ frames, eyebrow, title, intro, cta }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduce = useReducedMotion();
  const [pin, setPin] = useState(false);
  const [height, setHeight] = useState(null);

  // Pin only on large screens with a mouse/trackpad
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover)');
    const sync = () => setPin(mq.matches && !reduce);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, [reduce]);

  const distance = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const rawX = useTransform([scrollYProgress, distance], ([p, d]) => -p * d);
  const x = useSpring(rawX, { stiffness: 140, damping: 30, mass: 0.35 });

  // Section height = one screen + the strip's overflow, so the pin lasts exactly
  // as long as it takes to slide the last frame into view
  useLayoutEffect(() => {
    if (!pin) { setHeight(null); distance.set(0); return undefined; }
    const track = trackRef.current;
    if (!track) return undefined;
    const measure = () => {
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      distance.set(d);
      setHeight(window.innerHeight + d / SPEED);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [pin, distance]);

  const sizes = '(min-width: 1024px) 52vh, 72vw';

  const strip = (
    <motion.div
      ref={trackRef}
      style={pin ? { x } : undefined}
      className={
        pin
          ? 'flex w-max items-center gap-8 pl-[max(3rem,calc((100vw-1360px)/2+3rem))] pr-[12vw]'
          : 'flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory px-5 sm:px-8 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      }
    >
      {/* Intro card */}
      <div className={`flex shrink-0 flex-col justify-end ${pin ? 'h-[64vh] w-[min(380px,28vw)] pr-6' : 'w-[78vw] max-w-[340px] snap-start pr-2'}`}>
        <p className="font-lato text-[11px] tracking-[0.3em] uppercase text-gold mb-5">{eyebrow}</p>
        <h2 className="m-0 font-cormorant font-medium text-[clamp(40px,4.4vw,64px)] leading-[0.98] text-white">{title}</h2>
        <p className="mt-6 font-lato text-[14px] leading-[1.8] text-white/55">{intro}</p>
        {pin && (
          <p className="mt-8 flex items-center gap-3 font-lato text-[11px] tracking-[0.26em] uppercase text-white/40">
            Keep scrolling <span className="text-gold">→</span>
          </p>
        )}
      </div>

      {frames.map((f, i) => (
        <motion.figure
          key={f.src}
          className={`m-0 shrink-0 ${pin ? '' : 'snap-start'}`}
          initial={{ opacity: 0, y: pin ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease }}
        >
          <div
            className={`relative overflow-hidden bg-white/[0.04] ${pin ? 'h-[64vh]' : 'w-[72vw] max-w-[320px]'}`}
            style={{ aspectRatio: '4 / 5' }}
          >
            <img
              src={f.src}
              srcSet={f.srcSet}
              sizes={sizes}
              alt={f.alt}
              loading={i < 3 ? 'eager' : 'lazy'}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.04]"
              style={{ objectPosition: f.pos || '50% 30%' }}
            />
          </div>
          <figcaption className="mt-4 flex items-baseline gap-4">
            <span className="font-lato text-[11px] tracking-[0.24em] text-gold tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <span className="font-cormorant italic text-[20px] text-white/85">{f.caption}</span>
          </figcaption>
        </motion.figure>
      ))}

      {/* End card */}
      {cta && (
        <Link
          to={cta.to}
          className={`group flex shrink-0 flex-col justify-center border border-white/15 px-8 transition-colors duration-500 hover:border-gold ${pin ? 'h-[64vh] w-[min(340px,26vw)]' : 'w-[72vw] max-w-[320px] snap-start'}`}
          style={pin ? undefined : { aspectRatio: '4 / 5' }}
        >
          <span className="font-lato text-[11px] tracking-[0.3em] uppercase text-white/45">{cta.eyebrow}</span>
          <span className="mt-4 font-cormorant text-[34px] leading-[1.05] text-white transition-colors duration-500 group-hover:text-gold">{cta.label}</span>
          <span className="mt-6 text-2xl text-gold transition-transform duration-500 group-hover:translate-x-2">→</span>
        </Link>
      )}
    </motion.div>
  );

  if (!pin) {
    return (
      <section ref={sectionRef} className="relative py-20 md:py-28" aria-label={title}>
        {strip}
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative" style={{ height: height ?? '100svh' }} aria-label={title}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        {strip}
        <div className="absolute bottom-10 left-[max(3rem,calc((100vw-1360px)/2+3rem))] right-[max(3rem,calc((100vw-1360px)/2+3rem))] h-px bg-white/10">
          <motion.div className="h-full origin-left bg-gold" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}
