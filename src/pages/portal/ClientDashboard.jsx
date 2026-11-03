import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Images, Heart, Star, Clock, CheckCircle, ArrowRight, Calendar, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useRequireAuth } from '@/lib/portalGuard';
import PortalNoIndex from '../../components/PortalNoIndex';
import { useClientRecord, useClientGallery, useSelections } from '@/hooks/useGallery';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
});

const STATUS_STEPS = {
  'Draft':                  [false, false, false, false, false],
  'Awaiting Selections':    [true,  true,  false, false, false],
  'Selections Received':    [true,  true,  true,  false, false],
  'In Editing':             [true,  true,  true,  true,  false],
  'Final Ready':            [true,  true,  true,  true,  true],
  'Delivered':              [true,  true,  true,  true,  true],
};

const STEP_LABELS = ['Shoot Completed', 'Proofs Uploaded', 'Selections Submitted', 'Editing in Progress', 'Final Gallery Ready'];

export default function ClientDashboard() {
  const { user, loading: authLoading } = useRequireAuth('/portal');
  const { client, loading: clientLoading } = useClientRecord(user?.email);
  const { gallery, loading: galleryLoading } = useClientGallery(client?.id);
  const { selections, loading: selLoading } = useSelections(client?.id, gallery?.id);

  const loading = authLoading || clientLoading || galleryLoading;

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statusDone = STATUS_STEPS[gallery?.gallery_status] || STATUS_STEPS['Draft'];
  const selectionCount = selections.length;
  const finalLocked = !gallery || !['Final Ready', 'Delivered'].includes(gallery.gallery_status);

  const actions = [
    {
      label: 'Proof Gallery',
      desc: 'Browse and select your favourite images from the shoot.',
      icon: Images,
      href: '/portal/gallery',
      count: gallery ? 'View images' : 'No gallery yet',
      cta: 'View Proofs',
      locked: !gallery,
    },
    {
      label: 'My Selections',
      desc: 'Review the images you have favourited and marked for editing.',
      icon: Heart,
      href: '/portal/selections',
      count: selectionCount > 0 ? `${selectionCount} selected` : 'None yet',
      cta: 'View Selections',
      locked: !gallery,
    },
    {
      label: 'Final Gallery',
      desc: 'Your beautifully edited final images, ready for download.',
      icon: Star,
      href: '/portal/final',
      count: finalLocked ? 'Coming soon' : 'Ready to view',
      cta: 'View Finals',
      locked: finalLocked,
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <PortalNoIndex />
      {/* Welcome */}
      <motion.div {...fade(0)} className="mb-10">
        <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-2">Welcome back</p>
        <h1 className="text-white text-3xl font-montserrat font-bold mb-1">{user?.full_name || 'Client'}</h1>
        <p className="text-white/40 text-sm font-montserrat font-light">
          {gallery ? 'Your private gallery is ready to be explored.' : 'Your gallery will be available here once it has been prepared.'}
        </p>
      </motion.div>

      {/* No gallery state */}
      {!gallery && (
        <motion.div {...fade(0.1)} className="mb-8 flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-sm text-center">
          <Camera size={28} className="text-white/15 mb-4" />
          <p className="text-white/30 text-sm font-montserrat mb-1">No gallery assigned yet</p>
          <p className="text-white/15 text-xs font-montserrat">Your photographer will set up your gallery and notify you when it's ready.</p>
        </motion.div>
      )}

      {/* Hero cover */}
      {gallery && (
        <motion.div {...fade(0.1)} className="relative rounded-sm overflow-hidden mb-8 h-64 lg:h-80">
          <img
            src={gallery.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80'}
            alt="Gallery cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <p className="text-gold/80 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-1">Your Gallery</p>
            <h2 className="text-white text-2xl font-montserrat font-bold mb-2">{gallery.title}</h2>
            <div className="flex items-center gap-6 flex-wrap">
              {gallery.shoot_type && (
                <div className="flex items-center gap-2 text-white/50 text-xs font-montserrat">
                  <Camera size={12} /> {gallery.shoot_type}
                </div>
              )}
              {gallery.event_date && (
                <div className="flex items-center gap-2 text-white/50 text-xs font-montserrat">
                  <Calendar size={12} /> {new Date(gallery.event_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress */}
      {gallery && (
        <motion.div {...fade(0.15)} className="mb-8 bg-white/3 border border-white/8 rounded-sm p-6">
          <p className="text-white/40 text-[10px] font-montserrat tracking-[0.25em] uppercase mb-5">Gallery Progress</p>
          <div className="flex items-center gap-0">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1 min-w-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                    statusDone[i] ? 'bg-gold border-gold' : 'border-white/15 bg-transparent'
                  }`}>
                    {statusDone[i]
                      ? <CheckCircle size={13} className="text-black" />
                      : <Clock size={11} className="text-white/25" />
                    }
                  </div>
                  <p className={`text-[9px] font-montserrat tracking-wider text-center mt-2 leading-tight hidden sm:block ${
                    statusDone[i] ? 'text-gold/80' : 'text-white/25'
                  }`}>{label}</p>
                </div>
                {i < STEP_LABELS.length - 1 && (
                  <div className={`h-[1px] flex-1 mx-1 ${statusDone[i] && statusDone[i + 1] ? 'bg-gold/50' : 'bg-white/8'}`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div key={action.label} {...fade(0.2 + i * 0.08)}>
              <Link
                to={action.locked ? '#' : action.href}
                className={`block bg-white/3 border rounded-sm p-7 transition-all duration-300 group ${
                  action.locked ? 'border-white/6 opacity-50 cursor-not-allowed' : 'border-white/8 hover:border-gold/30 hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <span className="text-white/25 text-[10px] font-montserrat tracking-wider">{action.count}</span>
                </div>
                <h3 className="text-white font-montserrat font-semibold text-sm tracking-wider mb-2">{action.label}</h3>
                <p className="text-white/35 text-xs font-montserrat font-light leading-relaxed mb-6">{action.desc}</p>
                <div className={`flex items-center gap-2 text-[10px] font-montserrat font-bold tracking-[0.15em] uppercase transition-colors ${
                  action.locked ? 'text-white/20' : 'text-gold/60 group-hover:text-gold'
                }`}>
                  {action.cta} <ArrowRight size={11} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}