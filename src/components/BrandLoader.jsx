import { motion } from 'framer-motion';

const ease = [0.22, 0.61, 0.36, 1];
const curtain = [0.77, 0, 0.18, 1];

/**
 * Animated "sb." loading screen.
 * The letters rise in, the orange dot drops and bounces into place with a soft
 * glow, the wordmark spreads open, a thin line fills — then the whole screen
 * lifts away like a curtain to reveal the site. Respects reduced motion.
 */
export default function BrandLoader() {
  return (
    <motion.div
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.9, ease: curtain } }}
      className="fixed inset-0 z-[9999] flex items-center justify-center px-6 bg-background text-white"
      role="status"
      aria-live="polite"
      aria-label="Stills by Brooklyn is loading"
    >
      <div className="sb-grain pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true" />

      <div className="relative flex flex-col items-center" aria-hidden="true">
        <div className="flex items-end font-lato font-black text-[84px] sm:text-[104px] leading-[0.82] tracking-[-0.05em]">
          {['s', 'b'].map((ch, i) => (
            <span key={ch} className="inline-block overflow-hidden pb-[0.04em]">
              <motion.span
                className="inline-block"
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.75, ease, delay: 0.1 + i * 0.12 }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
          {/* The dot drops in, squashes on landing and glows */}
          <motion.span
            className="relative inline-block ml-[0.04em] mb-[0.08em] h-[0.2em] w-[0.2em] rounded-full bg-gold"
            initial={{ y: '-3.2em', opacity: 0, scaleX: 1, scaleY: 1 }}
            animate={{ y: ['-3.2em', '0em', '-0.35em', '0em'], opacity: [0, 1, 1, 1], scaleX: [1, 1.35, 0.95, 1], scaleY: [1, 0.7, 1.05, 1] }}
            transition={{ duration: 0.9, delay: 0.45, times: [0, 0.55, 0.78, 1], ease: 'easeOut' }}
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-gold"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 3.2], opacity: [0.55, 0] }}
              transition={{ duration: 1.1, delay: 0.95, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.4 }}
            />
          </motion.span>
        </div>

        <motion.span
          className="mt-6 font-lato text-[11px] sm:text-[12px] whitespace-nowrap"
          initial={{ opacity: 0, letterSpacing: '0.12em' }}
          animate={{ opacity: 1, letterSpacing: '0.5em' }}
          transition={{ duration: 1, ease, delay: 0.7 }}
        >
          STILLS BY BR<span className="text-gold">OO</span>KLYN
        </motion.span>

        <div className="mt-8 h-px w-40 sm:w-48 overflow-hidden bg-white/15">
          <motion.div
            className="h-full w-full bg-gold origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/** Small pulsing "sb." used while a page is loading. */
export function MiniLoader() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center" role="status" aria-label="Loading">
      <span className="font-lato font-black text-[44px] leading-none tracking-[-0.05em] text-white/90" aria-hidden="true">
        sb
        <motion.span
          className="inline-block ml-[0.04em] h-[0.2em] w-[0.2em] rounded-full bg-gold"
          animate={{ y: ['0em', '-0.45em', '0em'], scaleY: [1, 1.1, 0.8, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
    </div>
  );
}
