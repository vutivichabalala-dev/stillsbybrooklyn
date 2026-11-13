import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { serviceNav, locationNav, seoPages } from '@/content/seoPages';

const blogNav = seoPages.filter((p) => p.kind === 'blog').map((p) => ({ label: p.navLabel, path: p.path }));
const ease = [0.22, 0.61, 0.36, 1];

function LinkRow({ heading, links }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
      <span className="font-lato text-[11px] tracking-[0.24em] uppercase text-white/40 w-full sm:w-24 shrink-0">{heading}</span>
      {links.map((l) => (
        <Link key={l.path} to={l.path} className="sb-link-draw font-lato text-[13px] text-[#B9B2AA] hover:text-white transition-colors">
          {l.label}
        </Link>
      ))}
    </div>
  );
}

// Matches the Gallery (evening edition) design: one big invitation, then a quiet bottom line.
export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 bg-background">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 pt-[120px] pb-28 md:pb-12">
        <p className="m-0 mb-[18px] font-lato text-[12px] tracking-[0.3em] uppercase text-[#B9B2AA]">Have a date in mind?</p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease }}
        >
          <Link
            to="/booking"
            className="group inline-block font-cormorant italic font-normal text-white leading-none tracking-[0.02em] text-[clamp(48px,7.5vw,112px)]"
          >
            <span className="sb-underline">Let's create together</span>{' '}
            <span className="inline-block not-italic text-gold transition-transform duration-500 group-hover:translate-x-3">→</span>
          </Link>
        </motion.div>

        <div className="mt-24 flex flex-col gap-4">
          <LinkRow heading="Services" links={serviceNav} />
          <LinkRow heading="Areas" links={locationNav} />
          {blogNav.length > 0 && <LinkRow heading="Journal" links={blogNav} />}
        </div>

        <div className="mt-10 border-t border-[#332E30] pt-7 flex flex-wrap justify-between gap-5 font-lato text-[12px] tracking-[0.18em] uppercase text-[#B9B2AA]">
          <span>© {new Date().getFullYear()} Stills by Brooklyn · Midrand</span>
          <span className="flex flex-wrap gap-x-7 gap-y-3">
            <a href="https://wa.me/27663492811" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp 066 349 2811</a>
            <a href="https://www.instagram.com/stillsbybrooklyn/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram <span className="normal-case">@stillsbybrooklyn</span></a>
            <a href="mailto:info@stillsbybrooklyn.co.za" className="normal-case hover:text-white transition-colors">info@stillsbybrooklyn.co.za</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
