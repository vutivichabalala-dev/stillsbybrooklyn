import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { serviceNav, locationNav, seoPages } from '@/content/seoPages';
import Logo from './Logo';

const blogNav = seoPages.filter((p) => p.kind === 'blog').map((p) => ({ label: p.navLabel, path: p.path }));

function FooterLinks({ heading, links }) {
  return (
    <div>
      <h4 className="font-lato text-[11px] tracking-[0.28em] uppercase text-white/45 mb-5">{heading}</h4>
      <ul className="flex flex-col gap-2.5">
        {links.map((item) => (
          <li key={item.path}>
            <Link to={item.path} className="sb-link-draw font-lato text-[13px] text-white/70 hover:text-white transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.07] bg-background">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 pt-24 md:pt-32 pb-28 md:pb-12">
        {/* Big call to action (Gallery edition) */}
        <p className="font-lato text-[11px] tracking-[0.3em] uppercase text-white/50 mb-5">Have a date in mind?</p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <Link
            to="/booking"
            className="group inline-flex items-baseline gap-4 md:gap-6 font-cormorant italic text-white leading-[0.95] text-[clamp(46px,7.5vw,112px)] tracking-[0.01em]"
          >
            <span className="sb-underline">
              Let's create together
            </span>
            <span className="text-gold not-italic transition-transform duration-500 group-hover:translate-x-3">→</span>
          </Link>
        </motion.div>

        <div className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
          <div className="col-span-2 flex flex-col gap-5">
            <Link to="/" aria-label="Stills by Brooklyn — home" className="text-white w-fit"><Logo /></Link>
            <p className="font-lato text-[13px] leading-relaxed text-white/55 max-w-xs">
              People, moments, culture and events. Photographer &amp; videographer since 2018 — based in Midrand, working across Gauteng and South Africa.
            </p>
          </div>
          <FooterLinks
            heading="Explore"
            links={[
              { label: 'Portfolio', path: '/portfolio' },
              { label: 'Services', path: '/services' },
              { label: 'Reels', path: '/reels' },
              { label: 'About', path: '/about' },
              { label: 'Contact', path: '/contact' },
              { label: 'Book a session', path: '/booking' },
            ]}
          />
          <FooterLinks heading="Services" links={serviceNav} />
          <FooterLinks heading="Areas" links={locationNav.map((l) => ({ ...l, label: l.label }))} />
          {blogNav.length > 0 && <FooterLinks heading="Journal" links={blogNav} />}
        </div>

        <div className="mt-16 border-t border-white/10 pt-7 flex flex-col md:flex-row md:items-center justify-between gap-4 font-lato text-[11px] tracking-[0.18em] uppercase text-white/50">
          <span>© {new Date().getFullYear()} Stills by Brooklyn · Midrand</span>
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            <a href="https://wa.me/27677860702" target="_blank" rel="noopener noreferrer" className="sb-link-draw hover:text-white transition-colors">WhatsApp 067 786 0702</a>
            <a href="https://www.instagram.com/stillsbybrooklyn/" target="_blank" rel="noopener noreferrer" className="sb-link-draw hover:text-white transition-colors normal-case tracking-[0.12em]">Instagram @stillsbybrooklyn</a>
            <a href="mailto:info@stillsbybrooklyn.co.za" className="sb-link-draw hover:text-white transition-colors normal-case tracking-[0.12em]">info@stillsbybrooklyn.co.za</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
