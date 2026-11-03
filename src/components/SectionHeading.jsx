import { motion } from 'framer-motion';

const ease = [0.22, 0.61, 0.36, 1];

export default function SectionHeading({ eyebrow, title, subtitle, center = false, as: Heading = 'h2' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease }}
      className={`flex flex-col gap-4 ${center ? 'items-center text-center' : 'items-start'}`}
    >
      {eyebrow && (
        <span className="text-gold font-lato text-[11px] tracking-[0.3em] uppercase">{eyebrow}</span>
      )}
      <Heading className="font-cormorant font-medium text-[34px] md:text-[46px] leading-[1.05] tracking-[0.02em] text-foreground">
        {title}
      </Heading>
      <span aria-hidden="true" className="block h-[2px] w-12 bg-gold" />
      {subtitle && (
        <p className="text-foreground/65 font-lato text-[15px] leading-relaxed max-w-lg">{subtitle}</p>
      )}
    </motion.div>
  );
}
