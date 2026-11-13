import { motion } from 'framer-motion';

const ease = [0.22, 0.61, 0.36, 1];

// Text that rises into view letter by letter (or word by word) when scrolled to.
// The full text stays in the DOM for screen readers and search engines.
export default function SplitReveal({ text, as: Tag = 'span', by = 'char', className = '', stagger = 0.03, delay = 0, ...rest }) {
  const MotionTag = motion[Tag] || motion.span;
  const parts = by === 'word' ? text.split(' ') : Array.from(text);
  return (
    <MotionTag
      {...rest}
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {parts.map((p, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.8, ease } } }}
          >
            {p === ' ' ? ' ' : p}
            {by === 'word' && i < parts.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
