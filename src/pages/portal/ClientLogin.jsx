import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import PortalNoIndex from '../../components/PortalNoIndex';

const slides = [
  { src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1400&q=85', caption: 'Your memories, beautifully preserved.' },
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=85', caption: 'Every moment, perfectly captured.' },
  { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1400&q=85', caption: 'Timeless portraits, lasting impressions.' },
];

export default function ClientLogin() {
  const [checking, setChecking] = useState(true);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then((u) => {
      if (u) {
        if (u.role === 'admin') {
          navigate('/portal/admin/dashboard');
        } else {
          navigate('/portal/dashboard');
        }
      } else {
        setChecking(false);
      }
    }).catch(() => setChecking(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'hsl(46 70% 55%)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      <PortalNoIndex />

      {/* Left — animated slideshow */}
      <div className="hidden lg:block lg:w-[52%] relative overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.img
            key={slide}
            src={slides[slide].src}
            alt="studio"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

        <div className="relative z-10 h-full flex flex-col justify-between p-14">
          <Link to="/" className="flex flex-col leading-none w-fit group">
            <span className="text-white font-montserrat text-sm font-light tracking-[0.35em] uppercase group-hover:tracking-[0.45em] transition-all duration-500">
              STILLS BY <span className="font-black">BROOKLYN</span>
            </span>
            <div className="h-[1.5px] w-full mt-1.5 bg-gold transition-all duration-500 group-hover:w-3/4" />
          </Link>
          <div>
            <motion.p
              key={`label-${slide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gold/80 text-[10px] font-montserrat tracking-[0.35em] uppercase mb-3"
            >
              Private Client Portal
            </motion.p>
            <AnimatePresence mode="wait">
              <motion.h2
                key={`caption-${slide}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6 }}
                className="text-white text-4xl xl:text-5xl font-montserrat font-black leading-tight mb-5 max-w-md"
              >
                {slides[slide].caption}
              </motion.h2>
            </AnimatePresence>
            <p className="text-white/45 text-sm font-montserrat font-light leading-relaxed max-w-sm">
              Access your private gallery, review your images, and submit your edit selections — all in one elegant space.
            </p>
            <div className="flex gap-2 mt-8">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)}
                  className={`rounded-full transition-all duration-400 ${i === slide ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right — sign in panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-14 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gold/6 blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-gold/5 blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="inline-flex flex-col items-center leading-none group">
              <span className="text-gray-900 font-montserrat text-sm font-light tracking-[0.3em] uppercase">
                STILLS BY <span className="font-black">BROOKLYN</span>
              </span>
              <div className="h-[1.5px] w-full mt-1.5 bg-gold" />
            </Link>
          </div>

          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.15 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center mb-8 shadow-xl shadow-gold/10"
          >
            <Camera size={22} className="text-gold" />
          </motion.div>

          <p className="text-gold text-[10px] font-montserrat tracking-[0.35em] uppercase mb-2">Welcome Back</p>
          <h1 className="text-gray-900 text-3xl font-montserrat font-black mb-2 leading-tight">Client Portal</h1>
          <p className="text-gray-400 text-sm font-montserrat font-light leading-relaxed mb-10">
            Sign in to access your private gallery and selections.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
            <p className="text-gray-400 text-[10px] font-montserrat tracking-wider uppercase mb-4">Secure Authentication</p>
            <p className="text-gray-500 text-xs font-montserrat font-light leading-relaxed mb-5">
              Sign in using the same email address your gallery invitation was sent to.
            </p>
            <motion.button
              onClick={handleLogin}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-lg font-montserrat font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all duration-300
                bg-gray-900 text-white border border-gray-900
                hover:bg-gold hover:border-gold hover:text-black
                shadow-lg shadow-black/10"
            >
              Access My Gallery
              <ArrowRight size={13} />
            </motion.button>
          </div>

          <p className="text-gray-300 text-[11px] font-montserrat text-center leading-relaxed">
            Don't have access? Contact{' '}
            <a href="mailto:info@stillsbybrooklyn.co.za" className="text-gold/80 hover:text-gold transition-colors font-medium">
              info@stillsbybrooklyn.co.za
            </a>
          </p>

          <div className="mt-8 pt-7 border-t border-gray-100 text-center">
            <Link to="/portal/admin/login"
              className="text-gray-300 text-[10px] font-montserrat tracking-[0.2em] uppercase hover:text-gold transition-colors duration-200">
              Photographer Login →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}