import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import GlassCard from './GlassCard';

export default function Footer() {
  return (
    <footer className="relative z-10 px-4 pb-28 md:pb-4 pt-0">
      <GlassCard className="max-w-7xl mx-auto rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none rounded-2xl" />

        <div className="relative px-8 lg:px-12 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Logo + tagline */}
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-white font-montserrat text-sm font-light tracking-[0.3em] uppercase">
                  STILLS BY <span className="font-bold">BROOKLYN</span>
                </span>
                <div className="h-[1.5px] w-full mt-1 bg-gold" />
              </div>
              <p className="text-white/50 text-xs font-montserrat font-light tracking-wider leading-relaxed">
                Capturing moments that last forever. Corporate, portrait &amp; wedding photography across South Africa.
              </p>
              <div className="flex gap-4 mt-2">
                <a href="https://www.instagram.com/stillsbybrooklyn/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-gold transition-colors duration-200"><Instagram size={15} /></a>
                <a href="#" className="text-white/40 hover:text-gold transition-colors duration-200"><Twitter size={15} /></a>
                <a href="#" className="text-white/40 hover:text-gold transition-colors duration-200"><Facebook size={15} /></a>
                <a href="#" className="text-white/40 hover:text-gold transition-colors duration-200"><Linkedin size={15} /></a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-gold text-xs font-montserrat font-semibold tracking-[0.25em] uppercase mb-6">Navigation</h4>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Portfolio', path: '/portfolio' },
                  { label: 'About', path: '/about' },
                  { label: 'Contact', path: '/contact' }
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-white/50 text-xs font-montserrat tracking-wider hover:text-gold transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-gold text-xs font-montserrat font-semibold tracking-[0.25em] uppercase mb-6">Get In Touch</h4>
              <div className="flex flex-col gap-3 text-white/50 text-xs font-montserrat tracking-wider">
                <a href="mailto:info@stillsbybrooklyn.co.za" className="hover:text-gold transition-colors duration-200">info@stillsbybrooklyn.co.za</a>
                <span>067 786 0702</span>
                <span>Midrand, South Africa</span>
                <span className="text-white/35">Available Nationwide</span>
                <span className="text-white/30 mt-1">Crafted with passion in South Africa</span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-xs font-montserrat tracking-wider">
              © 2026 Stills By Brooklyn. All rights reserved.
            </p>
          </div>
        </div>
      </GlassCard>
    </footer>
  );
}