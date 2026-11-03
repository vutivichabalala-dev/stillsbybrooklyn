import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { serviceNav } from '@/content/seoPages';
import Logo from './Logo';

const mainLinks = [
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Services', path: '/services', dropdown: true },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const ease = [0.22, 0.61, 0.36, 1];

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const lastY = useRef(0);

  // Solid after a little scroll; slide away when scrolling down, back when scrolling up.
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        setHidden(y > 320 && y > lastY.current + 4);
        if (y < lastY.current - 4 || y <= 320) setHidden(false);
        lastY.current = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setServicesOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') { setServicesOpen(false); setMenuOpen(false); }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => { setMenuOpen(false); setServicesOpen(false); }, [location.pathname]);

  // Lock page scroll behind the mobile menu
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const servicesActive = isActive('/services') || serviceNav.some((l) => isActive(l.path));
  const transparent = isHome && !scrolled && !menuOpen;

  const linkCls = 'sb-link-draw inline-flex items-center py-1 font-lato text-[12px] uppercase tracking-[0.24em] text-white/85 hover:text-white transition-colors';

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500 ${
        hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
      } ${transparent ? 'bg-transparent border-transparent' : 'bg-background/85 backdrop-blur-md border-white/[0.06]'} border-b`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.22,0.61,0.36,1)' }}
    >
      {transparent && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -bottom-16 bg-gradient-to-b from-black/55 to-transparent" />
      )}
      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        <div className={`flex items-center justify-between transition-[height] duration-500 ${scrolled ? 'h-[72px]' : 'h-[112px]'}`}>
          <Link to="/" aria-label="Stills by Brooklyn — home" className="text-white">
            <Logo compact={scrolled} />
          </Link>

          <nav className="hidden md:flex items-center gap-9" aria-label="Main">
            {mainLinks.map((link) =>
              link.dropdown ? (
                <div key={link.path} className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setServicesOpen((v) => !v)}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                    aria-current={servicesActive ? 'page' : undefined}
                    className={`${linkCls} gap-1.5`}
                  >
                    Services
                    <ChevronDown size={11} className={`transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25, ease }}
                        className="absolute left-1/2 top-full mt-5 w-64 -translate-x-1/2 max-h-[70vh] overflow-y-auto border border-white/10 bg-background/95 backdrop-blur-md py-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
                      >
                        <Link to="/services" className="block px-6 py-3 font-lato text-[10px] uppercase tracking-[0.26em] text-gold hover:text-white transition-colors">
                          All services
                        </Link>
                        <div className="mx-6 my-1 h-px bg-white/10" />
                        {serviceNav.map((s) => (
                          <Link
                            key={s.path}
                            to={s.path}
                            className={`block px-6 py-2.5 font-lato text-[13px] transition-colors hover:text-white hover:pl-7 duration-300 ${isActive(s.path) ? 'text-white' : 'text-white/60'}`}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={link.path} to={link.path} className={linkCls} aria-current={isActive(link.path) ? 'page' : undefined}>
                  {link.label}
                </Link>
              )
            )}
            <Link to="/booking" className="sb-link-draw inline-flex items-center py-1 font-lato text-[12px] uppercase tracking-[0.24em] text-gold hover:text-white transition-colors">
              Book
            </Link>
          </nav>

          <button
            type="button"
            className="md:hidden relative h-11 w-11 -mr-2 flex items-center justify-center text-white"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`absolute h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? 'rotate-45' : '-translate-y-[5px]'}`} />
            <span className={`absolute h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? '-rotate-45' : 'translate-y-[5px]'}`} />
          </button>
        </div>
      </div>

    </header>
      {/* Mobile: full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-x-0 top-0 z-[45] bottom-0 bg-background overflow-y-auto"
          >
            <motion.nav
              aria-label="Mobile"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
              className="flex flex-col px-6 pt-[128px] pb-32"
            >
              {[{ label: 'Home', path: '/' }, ...mainLinks].map((l) => (
                <motion.div key={l.path} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>
                  <Link
                    to={l.path}
                    className={`block border-b border-white/10 py-4 font-cormorant text-[34px] leading-none tracking-[0.02em] ${isActive(l.path) && (l.path !== '/' || isHome) ? 'text-gold' : 'text-white'}`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5 } } }} className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3">
                {serviceNav.map((s) => (
                  <Link key={s.path} to={s.path} className="font-lato text-[13px] text-white/60 py-1">{s.label}</Link>
                ))}
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }} className="mt-10 flex flex-col gap-3">
                <Link to="/booking" className="bg-gold py-4 text-center font-lato text-[11px] font-bold uppercase tracking-[0.26em] text-black">Book a session</Link>
                <Link to="/portal" className="border border-white/15 py-4 text-center font-lato text-[11px] uppercase tracking-[0.26em] text-white/70">Client portal</Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
