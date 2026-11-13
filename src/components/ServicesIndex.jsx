import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import SplitReveal from './SplitReveal';

const ease = [0.22, 0.61, 0.36, 1];

/**
 * Editorial list of services. On a mouse, a photo of the hovered service floats
 * beside the cursor and crossfades as you move down the list. On touch (no hover),
 * each row shows its photo as a small inline thumbnail instead, so nothing is lost.
 */
export default function ServicesIndex({ services, eyebrow = 'What I shoot', title = 'Services' }) {
  const [active, setActive] = useState(null);
  const sectionRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const current = services.find((s) => s.path === active);

  return (
    <section
      ref={sectionRef}
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
      className="relative mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 py-24 md:py-32"
      aria-labelledby="services-index-title"
    >
      <div className="mb-12 md:mb-16 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-lato text-[11px] tracking-[0.3em] uppercase text-gold mb-5">{eyebrow}</p>
          <SplitReveal as="h2" id="services-index-title" text={title} className="m-0 text-[40px] leading-none tracking-[0.06em] text-white uppercase" />
        </div>
        <p className="m-0 max-w-sm font-lato text-[14px] leading-[1.8] text-white/55">
          Photography and film for the days that matter, in Johannesburg, Pretoria and anywhere in South Africa.
        </p>
      </div>

      <ul className="m-0 list-none p-0 border-t border-white/10">
        {services.map((s, i) => {
          const isActive = active === s.path;
          return (
            <motion.li
              key={s.path}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease, delay: Math.min(i, 6) * 0.05 }}
              className="border-b border-white/10"
            >
              <Link
                to={s.path}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(s.path)}
                onFocus={() => setActive(s.path)}
                onBlur={() => setActive(null)}
                className="group relative flex items-center gap-5 md:gap-10 py-6 md:py-8 outline-none"
              >
                <span className="w-8 shrink-0 font-lato text-[11px] tracking-[0.24em] text-white/35 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Touch devices: inline thumbnail, since there is no hover */}
                <span className="relative h-14 w-11 shrink-0 overflow-hidden bg-white/5 [@media(hover:hover)]:hidden">
                  <img src={s.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" style={{ objectPosition: s.pos || '50% 30%' }} />
                </span>

                <span className="flex-1 min-w-0">
                  <span
                    className={`block font-cormorant font-medium leading-[0.95] text-[clamp(30px,4.6vw,64px)] transition-colors duration-500 ${isActive ? 'text-gold' : 'text-white group-hover:text-gold'}`}
                  >
                    <motion.span
                      className="inline-block"
                      animate={{ x: isActive ? 16 : 0 }}
                      transition={{ duration: 0.6, ease }}
                    >
                      {s.label}
                    </motion.span>
                  </span>
                  <span className="mt-2 block font-lato text-[12px] md:text-[13px] tracking-[0.04em] text-white/50 max-w-xl">
                    {s.blurb}
                  </span>
                </span>

                <span className="hidden sm:inline-flex shrink-0 items-center gap-3 font-lato text-[11px] tracking-[0.26em] uppercase text-white/45 transition-colors duration-500 group-hover:text-gold">
                  <span className="hidden md:inline">{s.tag}</span>
                  <span className="text-gold text-xl leading-none transition-transform duration-500 group-hover:translate-x-2">→</span>
                </span>

                {/* Orange hairline draws in under the active row */}
                <span aria-hidden="true" className={`pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left bg-gold transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,.61,.36,1)] ${isActive ? 'scale-x-100' : 'scale-x-0'}`} />
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {/* Floating preview, mouse only */}
      <motion.div
        aria-hidden="true"
        style={{ x, y }}
        className="pointer-events-none absolute left-0 top-0 z-20 hidden [@media(hover:hover)]:block"
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2 h-[300px] w-[230px] lg:h-[360px] lg:w-[280px]">
          <AnimatePresence>
            {current && (
              <motion.img
                key={current.path}
                src={current.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
                style={{ objectPosition: current.pos || '50% 30%' }}
                initial={{ opacity: 0, scale: 0.9, rotate: -3, clipPath: 'inset(12% 0 12% 0)' }}
                animate={{ opacity: 1, scale: 1, rotate: 0, clipPath: 'inset(0% 0 0% 0)' }}
                exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.25 } }}
                transition={{ duration: 0.55, ease }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
