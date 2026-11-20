import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Volume2, VolumeX, Play, Pause, ArrowDown } from 'lucide-react';

/*
  Full-screen reel hero for /reels, in the same language as the Home hero:
  - phones: the vertical reel fills the whole screen
  - larger screens: a blurred, moving copy of the reel fills the screen and the
    sharp reel sits in a tall frame on the right, so nothing is cropped
  - autoplays muted and loops; with several reels it moves to the next one when
    a reel ends, using the Home hero's orange-line wipe
  - pauses when scrolled away or the tab is hidden; respects reduced motion
*/

const ease = [0.22, 0.61, 0.36, 1];
const wipeEase = [0.77, 0, 0.18, 1];
const WIPE_S = 1.2;

function useIsDesktop() {
  const q = '(min-width: 768px)';
  const [is, setIs] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setIs(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return is;
}

export default function ReelsHero({ reels, h1, onWatchAll }) {
  const list = reels.filter((r) => r.video_url).slice(0, 5);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();

  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const bgRef = useRef(null);
  const inView = useRef(true);
  const userPaused = useRef(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const reel = list[index] || list[0];
  const src = reel ? (reel.hero_url || reel.video_url) : null;
  const multi = list.length > 1;

  // Callback refs: during a wipe the outgoing video unmounts last, and must not clear the ref
  const setVideo = useCallback((n) => { if (n) videoRef.current = n; }, []);
  const setBg = useCallback((n) => { if (n) bgRef.current = n; }, []);

  const go = useCallback((i) => {
    videoRef.current?.pause();
    setProgress(0);
    setIndex((i + list.length) % list.length);
  }, [list.length]);

  // Keep the play state in step with what we want (visible, tab shown, not paused by the user)
  const sync = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const shouldPlay = !userPaused.current && inView.current && !document.hidden;
    if (shouldPlay) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      bgRef.current?.play().catch(() => {});
    } else {
      v.pause();
      bgRef.current?.pause();
      setPlaying(false);
    }
  }, []);

  // Reduced motion: wait for a tap instead of autoplaying
  useEffect(() => { if (reduceMotion) userPaused.current = true; }, [reduceMotion]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => { inView.current = e.intersectionRatio > 0.2; sync(); }, { threshold: [0, 0.2, 0.5] });
    io.observe(el);
    const onVis = () => sync();
    document.addEventListener('visibilitychange', onVis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, [sync]);

  // New reel: start it from the top (keeping the sound choice)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    v.currentTime = 0;
    sync();
  }, [index, src]);

  const onTime = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress(v.currentTime / v.duration);
    // keep the blurred backdrop roughly in step
    const b = bgRef.current;
    if (b && Math.abs(b.currentTime - v.currentTime) > 0.4) b.currentTime = v.currentTime;
  };

  const togglePlay = () => {
    userPaused.current = playing;
    sync();
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) { userPaused.current = false; sync(); }
  };

  if (!reel) return null;

  const lines = [
    { text: 'STORIES', cls: '' },
    { text: 'IN', cls: '' },
    { text: 'Motion.', cls: 'italic text-gold' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] max-h-[1000px] overflow-hidden bg-background"
      aria-label="Featured reel"
    >
      {/* Blurred moving backdrop (larger screens) */}
      {isDesktop && (
        <motion.div className="absolute inset-0 will-change-transform" style={{ y: mediaY }} aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.video
              key={`bg-${index}`}
              ref={setBg}
              src={src}
              poster={reel.thumbnail_url}
              muted
              playsInline
              loop={!multi}
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover scale-125 blur-[60px] brightness-[0.45] saturate-[1.3]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,transparent_0%,rgba(20,18,19,0.55)_70%)]" />
        </motion.div>
      )}

      {/* The reel itself: full-bleed on phones, a tall frame on larger screens */}
      <div className="absolute inset-0 md:inset-auto md:right-[7vw] lg:right-[10vw] md:top-[calc(50%+44px)] md:-translate-y-1/2 md:h-[calc(100%-200px)] md:aspect-[9/16]">
        <motion.div
          className="relative h-full w-full overflow-hidden md:rounded-[26px] md:ring-1 md:ring-white/15 md:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)]"
          style={isDesktop ? undefined : { y: mediaY }}
          initial={isDesktop ? { clipPath: 'inset(100% 0 0 0 round 26px)', scale: 0.94 } : { opacity: 0 }}
          animate={isDesktop ? { clipPath: 'inset(0% 0 0 0 round 26px)', scale: 1 } : { opacity: 1 }}
          transition={{ duration: 1.3, ease: wipeEase, delay: 0.15 }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ clipPath: 'inset(0 0 0 100%)' }}
              animate={{ clipPath: 'inset(0 0 0 0%)' }}
              exit={{ opacity: 0, transition: { delay: WIPE_S, duration: 0.25 } }}
              transition={{ duration: WIPE_S, ease: wipeEase }}
            >
              <video
                ref={setVideo}
                src={src}
                poster={reel.thumbnail_url}
                muted={muted}
                playsInline
                autoPlay={!reduceMotion}
                loop={!multi}
                preload="auto"
                onTimeUpdate={onTime}
                onEnded={() => multi && go(index + 1)}
                onClick={togglePlay}
                className="h-full w-full object-cover cursor-pointer"
                aria-label={reel.title}
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

          {/* Big play button when paused */}
          <AnimatePresence>
            {!playing && (
              <motion.button
                type="button"
                onClick={togglePlay}
                aria-label="Play reel"
                className="absolute inset-0 m-auto h-20 w-20 rounded-full border border-white/40 bg-black/30 backdrop-blur-md flex items-center justify-center text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.35, ease }}
              >
                <Play size={26} className="ml-1" fill="currentColor" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Playback progress along the frame's bottom edge (larger screens) */}
          <div aria-hidden="true" className="hidden md:block absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
            <div className="h-full bg-gold origin-left" style={{ transform: `scaleX(${progress})` }} />
          </div>
        </motion.div>
      </div>

      {/* Shading for legibility */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,18,19,0.55)_0%,rgba(20,18,19,0)_22%,rgba(20,18,19,0.25)_52%,rgba(20,18,19,0.97)_80%)] md:bg-[linear-gradient(90deg,rgba(20,18,19,0.75)_0%,rgba(20,18,19,0.2)_55%,rgba(20,18,19,0)_100%)]" />

      {/* Headline and controls */}
      <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute inset-x-0 bottom-0 md:inset-y-0 pointer-events-none">
        <div className="mx-auto h-full max-w-[1360px] px-5 sm:px-8 lg:px-12 pb-28 md:pb-0 md:pt-24 flex flex-col justify-end md:justify-center">
          <div className="md:max-w-[52%] flex flex-col gap-4 md:gap-5 pointer-events-auto">
            <motion.span
              aria-hidden="true"
              className="block h-[2px] w-14 bg-gold origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.2 }}
            />
            <motion.span
              className="font-lato text-[11px] tracking-[0.4em] uppercase text-gold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Motion Portfolio
            </motion.span>
            <h1 className="sr-only">{h1}</h1>
            <p aria-hidden="true" className="m-0 font-cormorant font-medium text-white leading-[0.92] tracking-[0.02em] text-[clamp(40px,8vw,124px)]">
              {lines.map((l, i) => (
                <span key={l.text} className="inline-block md:block overflow-hidden pb-[0.05em] mr-[0.22em] md:mr-0">
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

            {/* Now playing */}
            <div className="min-h-[52px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={reel.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6, ease, delay: 0.9 }}
                >
                  <p className="m-0 font-lato text-[11px] tracking-[0.3em] uppercase text-white/50">Now playing</p>
                  <p className="m-0 mt-1 font-montserrat text-white text-base md:text-lg">{reel.title}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 1.1 }}
            >
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={!muted}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-white/25 bg-white/5 backdrop-blur-md text-white text-[11px] font-lato tracking-[0.22em] uppercase hover:border-gold hover:text-gold transition-colors"
              >
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                {muted ? 'Sound on' : 'Sound off'}
              </button>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? 'Pause reel' : 'Play reel'}
                className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-white/25 bg-white/5 backdrop-blur-md text-white hover:border-gold hover:text-gold transition-colors"
              >
                {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={onWatchAll}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-gold text-black text-[11px] font-lato font-bold tracking-[0.22em] uppercase hover:bg-white transition-colors"
              >
                All reels <ArrowDown size={14} />
              </button>
              <Link to="/booking" className="sb-link-draw ml-1 py-1 font-lato text-[11px] uppercase tracking-[0.24em] text-white/80 hover:text-gold transition-colors">
                Book video
              </Link>
            </motion.div>

            {/* Reel picker when there is more than one */}
            {multi && (
              <div className="flex gap-1.5" role="tablist" aria-label="Choose reel">
                {list.map((r, i) => (
                  <button
                    key={r.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Play reel ${i + 1}: ${r.title}`}
                    onClick={() => go(i)}
                    className="group relative h-6 w-8"
                  >
                    <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/25 group-hover:bg-white/50 transition-colors" />
                    {i === index && (
                      <span className="absolute left-0 top-1/2 h-px -translate-y-1/2 w-full bg-gold origin-left" style={{ transform: `translateY(-50%) scaleX(${progress})` }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Playback progress across the bottom (phones) */}
      <div aria-hidden="true" className="md:hidden absolute inset-x-0 bottom-0 h-[2px] bg-white/10">
        <div className="h-full bg-gold origin-left" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* Scroll cue */}
      <div aria-hidden="true" className="absolute left-1/2 bottom-5 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
        <span className="h-10 w-px overflow-hidden bg-white/15"><span className="sb-scroll-cue block h-full w-full bg-white/80" /></span>
      </div>
    </section>
  );
}
