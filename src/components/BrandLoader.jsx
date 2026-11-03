import { motion } from 'framer-motion';

/**
 * Branded loading screen in the Gallery (evening) style: ink ground, the
 * "sb." monogram, spaced wordmark and a thin rose progress line.
 * Stages are CSS keyframes (src/index.css) and respect reduced motion.
 */
export default function BrandLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-6 bg-background text-white"
      role="status"
      aria-live="polite"
      aria-label="Stills by Brooklyn is loading"
    >
      <div className="sb-grain pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true" />
      <div className="relative flex flex-col items-center">
        <span className="sb-loader-mono font-lato font-black text-[72px] sm:text-[88px] leading-none tracking-[-0.05em]">
          sb<span className="text-gold">.</span>
        </span>
        <span className="sb-loader-word mt-5 font-lato text-[11px] tracking-[0.5em] pl-[0.5em]">
          STILLS BY BR<span className="text-gold">OO</span>KLYN
        </span>
        <div className="sb-loader-track mt-8 h-px w-40 overflow-hidden bg-white/15 sm:w-48">
          <div className="sb-loader-fill h-full w-full bg-gold" />
        </div>
      </div>
    </motion.div>
  );
}
