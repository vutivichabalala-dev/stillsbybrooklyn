import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { BRAND } from '@/lib/brand';

const serviceLinks = [
  { label: 'Weddings', path: '/services/weddings' },
  { label: 'Portraits', path: '/services/portraits' },
  { label: 'Corporate', path: '/services/corporate' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the services dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const isServicesActive = isActive('/services') || serviceLinks.some((l) => isActive(l.path));

  const linkClass = (active) =>
    `text-[11px] font-montserrat font-medium uppercase tracking-[0.22em] transition-colors duration-200 ${
      active ? 'text-burgundy' : 'text-ink/65 hover:text-ink'
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ivory">
      <div
        className={`border-b border-ink/10 transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_6px_24px_-18px_rgba(20,18,16,0.55)]' : ''
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex h-16 items-center justify-between md:h-[76px]">
            {/* Logo — original artwork, tightly cropped, links home */}
            <Link
              to="/"
              aria-label="StillsbyBrooklyn Photography, back to home"
              className="flex shrink-0 items-center gap-2.5 sm:gap-3"
            >
              <img
                src={BRAND.monogram}
                alt=""
                aria-hidden="true"
                width="460"
                height="296"
                className="h-8 w-auto md:h-10"
              />
              <img
                src={BRAND.wordmark}
                alt={BRAND.alt}
                width="700"
                height="47"
                className="h-auto w-[120px] md:w-[150px]"
              />
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-6 lg:gap-8 md:flex" aria-label="Main">
              <Link to="/" className={linkClass(location.pathname === '/')}>
                Home
              </Link>
              <Link to="/portfolio" className={linkClass(isActive('/portfolio'))}>
                Portfolio
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setServicesOpen((v) => !v)}
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1 ${linkClass(isServicesActive)}`}
                >
                  Services
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {servicesOpen && (
                  <div className="absolute left-1/2 top-full mt-3 w-48 -translate-x-1/2 overflow-hidden rounded-sm border border-ink/10 bg-ivory shadow-[0_18px_40px_-24px_rgba(20,18,16,0.5)]">
                    <Link
                      to="/services"
                      className="block border-b border-ink/10 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-ink/45 transition-colors hover:text-burgundy"
                    >
                      All Services
                    </Link>
                    {serviceLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block px-5 py-3 text-xs tracking-wider transition-colors hover:text-burgundy ${
                          isActive(link.path) ? 'text-burgundy' : 'text-ink/70'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/about" className={linkClass(isActive('/about'))}>
                About
              </Link>
              <Link to="/contact" className={linkClass(isActive('/contact'))}>
                Contact
              </Link>

              <span className="h-4 w-px bg-ink/15" aria-hidden="true" />

              <Link
                to="/portal"
                className="text-[11px] font-montserrat uppercase tracking-[0.18em] text-ink/45 transition-colors hover:text-ink"
              >
                Portal
              </Link>
              <Link
                to="/booking"
                className="bg-burgundy px-5 py-2.5 text-[10px] font-montserrat font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-ink"
              >
                Book a Session
              </Link>
            </nav>

            {/* Mobile toggle */}
            <button
              className="p-2 text-ink md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-b border-ink/10 bg-ivory md:hidden">
          <div className="flex flex-col gap-1 px-6 py-5">
            {[
              { label: 'Home', path: '/' },
              { label: 'Portfolio', path: '/portfolio' },
              { label: 'Services', path: '/services' },
              { label: 'Weddings', path: '/services/weddings', indent: true },
              { label: 'Portraits', path: '/services/portraits', indent: true },
              { label: 'Corporate', path: '/services/corporate', indent: true },
              { label: 'About', path: '/about' },
              { label: 'Contact', path: '/contact' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 font-montserrat uppercase tracking-[0.18em] transition-colors ${
                  link.indent ? 'pl-4 text-[10px] text-ink/40' : 'text-xs'
                } ${isActive(link.path) ? 'text-burgundy' : 'text-ink/75'}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/portal"
              className="mt-3 border border-ink/15 py-3 text-center text-[10px] font-montserrat uppercase tracking-[0.18em] text-ink/60"
            >
              Client Portal
            </Link>
            <Link
              to="/booking"
              className="mt-2 bg-burgundy py-3 text-center text-[10px] font-montserrat font-semibold uppercase tracking-[0.18em] text-white"
            >
              Book a Session
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}