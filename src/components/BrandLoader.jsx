import { motion } from 'framer-motion';
import { BRAND } from '@/lib/brand';

/**
 * Branded loading screen: ivory ground, original SB monogram fade + subtle scale,
 * wordmark underneath, burgundy progress line and a quiet caption.
 * Every stage is a CSS keyframe (see src/index.css) and respects reduced motion.
 */
export default function BrandLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-6"
      style={{ backgroundColor: BRAND.ivory }}
      role="status"
      aria-live="polite"
      aria-label="StillsbyBrooklyn Photography is loading"
    >
      <div className="sb-grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative flex flex-col items-center">
        <img
          src={BRAND.monogram}
          alt={BRAND.alt}
          width="460"
          height="296"
          decoding="async"
          className="sb-loader-mono h-16 w-auto sm:h-20"
        />

        <img
          src={BRAND.wordmark}
          alt=""
          aria-hidden="true"
          width="700"
          height="47"
          decoding="async"
          className="sb-loader-word mt-5 h-auto w-[160px] sm:w-[184px]"
        />

        <div
          className="sb-loader-track mt-8 h-[2px] w-40 overflow-hidden sm:w-48"
          style={{ backgroundColor: 'rgba(106,34,48,0.18)' }}
        >
          <div className="sb-loader-fill h-full w-full" style={{ backgroundColor: BRAND.burgundy }} />
        </div>

        <p
          className="sb-loader-caption mt-5 font-montserrat text-[9px] font-medium uppercase tracking-[0.42em]"
          style={{ color: 'rgba(106,34,48,0.85)' }}
        >
          Preparing your experience
        </p>
      </div>
    </motion.div>
  );
}