import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import PortalNoIndex from '../../components/PortalNoIndex';

export default function AdminLogin() {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then((u) => {
      if (u && u.role === 'admin') {
        navigate('/portal/admin/dashboard');
      } else {
        setChecking(false);
      }
    }).catch(() => setChecking(false));
  }, []);

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#080809]">
        <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'hsl(46 70% 55%)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#080809] transition-colors duration-300">
      <PortalNoIndex />

      {/* Left visual panel */}
      <div className="hidden lg:block lg:w-[52%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555487505-8603a1a69755?w=1400&q=85"
          alt="Studio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Gold shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col justify-between p-14">
          <Link to="/" className="flex flex-col leading-none w-fit group">
            <span className="text-white font-montserrat text-sm font-light tracking-[0.35em] uppercase group-hover:tracking-[0.45em] transition-all duration-500">
              STILLS BY <span className="font-black">BROOKLYN</span>
            </span>
            <div className="h-[1.5px] w-full mt-1.5 bg-gold transition-all duration-500 group-hover:w-3/4" />
          </Link>

          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gold/80 text-[10px] font-montserrat tracking-[0.35em] uppercase mb-3"
            >
              Studio Access
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-white text-4xl xl:text-5xl font-montserrat font-black leading-tight mb-5 max-w-sm"
            >
              Welcome back,<br />Photographer.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/45 text-sm font-montserrat font-light leading-relaxed max-w-sm"
            >
              Manage your client galleries, review selections, and deliver stunning final edits — all from your studio portal.
            </motion.p>

            {/* Decorative stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-8 mt-10"
            >
              {[['Galleries', 'Managed'], ['Clients', 'Served'], ['Images', 'Delivered']].map(([num, label]) => (
                <div key={label}>
                  <p className="text-gold text-lg font-montserrat font-black">✦</p>
                  <p className="text-white/50 text-[10px] font-montserrat tracking-wider uppercase mt-1">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right form panel — light/dark adaptive */}
      <div className="flex-1 flex items-center justify-center px-6 py-14 bg-white dark:bg-[#0a0a0c] relative overflow-hidden transition-colors duration-300">

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold/8 dark:bg-gold/5 blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold/6 dark:bg-gold/4 blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="inline-flex flex-col items-center leading-none">
              <span className="text-gray-900 dark:text-white font-montserrat text-sm font-light tracking-[0.3em] uppercase">
                STILLS BY <span className="font-black">BROOKLYN</span>
              </span>
              <div className="h-[1.5px] w-full mt-1.5 bg-gold" />
            </Link>
          </div>

          {/* Camera icon badge */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.2 }}
            className="w-14 h-14 rounded-2xl bg-gold/10 dark:bg-gold/15 border border-gold/30 flex items-center justify-center mb-8 shadow-lg shadow-gold/10"
          >
            <Camera size={22} className="text-gold" />
          </motion.div>

          <p className="text-gold text-[10px] font-montserrat tracking-[0.35em] uppercase mb-2">Studio Portal</p>
          <h1 className="text-gray-900 dark:text-white text-3xl font-montserrat font-black mb-3 leading-tight">
            Photographer Login
          </h1>
          <p className="text-gray-500 dark:text-white/40 text-sm font-montserrat font-light leading-relaxed mb-10">
            Sign in with your studio account to access your dashboard and manage client galleries.
          </p>

          {/* Sign in card */}
          <div className="bg-gray-50 dark:bg-white/4 border border-gray-200 dark:border-white/8 rounded-xl p-6 mb-6">
            <p className="text-gray-400 dark:text-white/25 text-[10px] font-montserrat tracking-wider uppercase mb-4">Secure Authentication</p>
            <p className="text-gray-600 dark:text-white/50 text-xs font-montserrat font-light leading-relaxed mb-5">
              You'll be redirected to securely sign in with your registered photographer account.
            </p>
            <motion.button
              onClick={handleLogin}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-lg font-montserrat font-bold text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-all duration-300
                bg-gray-900 dark:bg-gold/10
                text-white dark:text-gold
                border border-gray-900 dark:border-gold/50
                hover:bg-gold hover:border-gold hover:text-black
                dark:hover:bg-gold dark:hover:text-black
                shadow-lg shadow-black/10 dark:shadow-gold/5"
            >
              Sign In to Studio Portal
              <ArrowRight size={13} />
            </motion.button>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-white/6 text-center">
            <Link
              to="/portal"
              className="text-gray-300 dark:text-white/20 text-[10px] font-montserrat tracking-[0.2em] uppercase hover:text-gold dark:hover:text-white/50 transition-colors duration-200"
            >
              ← Client Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}