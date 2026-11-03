import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.55, ease: 'easeOut', delay },
});

const linkClass = 'text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold transition-colors';

// Renders inline [text](/path) links and **bold** inside a string
export function RichText({ text }) {
  const parts = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1]) {
      const href = m[2];
      parts.push(
        href.startsWith('/') ? (
          <Link key={i++} to={href} className={linkClass}>{m[1]}</Link>
        ) : (
          <a key={i++} href={href} className={linkClass} target="_blank" rel="noopener noreferrer">{m[1]}</a>
        )
      );
    } else {
      parts.push(<strong key={i++} className="text-white/80 font-semibold">{m[3]}</strong>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return <>{parts}</>;
}

function Block({ block }) {
  if (typeof block === 'string') {
    return <p><RichText text={block} /></p>;
  }
  const items = block.ul || block.ol;
  const Tag = block.ol ? 'ol' : 'ul';
  return (
    <Tag className={`flex flex-col gap-2 pl-5 ${block.ol ? 'list-decimal' : 'list-disc'} marker:text-gold`}>
      {items.map((item, i) => (
        <li key={i}><RichText text={item} /></li>
      ))}
    </Tag>
  );
}

/** Keyword sections (H2 + copy) and an FAQ list, styled for the dark site theme. */
export default function SeoContent({ sections = [], faqs = [] }) {
  return (
    <section className="px-6 lg:px-10 max-w-3xl mx-auto pb-12 relative z-10">
      <div className="flex flex-col gap-14">
        {sections.map((s, i) => (
          <motion.div key={s.h2} {...fadeUp(Math.min(i, 3) * 0.04)}>
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-5 leading-tight">{s.h2}</h2>
            <div className="flex flex-col gap-4 text-white/55 text-sm md:text-[15px] font-montserrat font-light leading-relaxed">
              {s.body.map((b, j) => <Block key={j} block={b} />)}
            </div>
          </motion.div>
        ))}

        {faqs.length > 0 && (
          <motion.div {...fadeUp(0)}>
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-6 leading-tight">Frequently asked questions</h2>
            <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-white font-montserrat font-semibold text-sm md:text-base">
                    <h3 className="font-semibold">{f.q}</h3>
                    <ChevronDown size={16} className="shrink-0 text-gold transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-white/55 text-sm font-montserrat font-light leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
