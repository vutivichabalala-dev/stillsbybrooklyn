import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const ease = [0.77, 0, 0.18, 1];

/**
 * Page change transition: when you move to another page, the new page appears
 * under a dark panel with an orange leading edge that lifts away like a
 * curtain, with the sb. mark fading out on it.
 *
 * - Never plays on the first load, so pre-rendered content and Google's view
 *   of a page are untouched.
 * - Reveal-only (no cover-then-reveal), so it adds no wait before the new page.
 * - pointer-events: none, so it can never block a click.
 * - Skipped entirely for visitors who prefer reduced motion.
 */
export default function RouteCurtain() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const first = useRef(true);
  const [run, setRun] = useState(0);

  // Layout effect: the panel is in place before the browser paints the new page
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!reduce) setRun((n) => n + 1);
  }, [pathname, reduce]);

  return (
    <AnimatePresence>
      {run > 0 && (
        <motion.div
          key={run}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9990] bg-[#141213]"
          initial={{ y: '0%' }}
          animate={{ y: '-101%' }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          transition={{ duration: 0.85, ease, delay: 0.08 }}
          onAnimationComplete={() => setRun(0)}
        >
          <motion.span
            className="absolute inset-0 flex items-center justify-center font-cormorant text-[56px] leading-none text-white"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
          >
            sb<span className="text-gold">.</span>
          </motion.span>
          <span className="absolute inset-x-0 bottom-0 h-[3px] bg-gold" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
