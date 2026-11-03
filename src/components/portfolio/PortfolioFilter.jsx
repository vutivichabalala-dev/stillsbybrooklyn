import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Corporate', 'Portraits', 'Weddings', 'Graduations', 'Matric Dance'];

export default function PortfolioFilter({ active, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex items-center justify-center gap-2 mb-14 flex-wrap"
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className="relative px-7 py-2.5 text-xs font-montserrat font-medium tracking-[0.2em] uppercase transition-colors duration-200 overflow-hidden"
        >
          {/* Animated background pill */}
          {active === cat && (
            <motion.span
              layoutId="filter-pill"
              className="absolute inset-0 bg-gold"
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            />
          )}
          {/* Border layer for inactive */}
          {active !== cat && (
            <span className="absolute inset-0 border border-white/15 hover:border-gold/40 transition-colors duration-200" />
          )}
          <span
            className={`relative z-10 transition-colors duration-200 ${
              active === cat ? 'text-black' : 'text-white/50 hover:text-white'
            }`}
          >
            {cat}
          </span>
        </button>
      ))}
    </motion.div>
  );
}