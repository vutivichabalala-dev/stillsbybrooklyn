import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FolderOpen, Clock, Edit3, Star, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useRequireAdmin } from '@/lib/portalGuard';
import PortalNoIndex from '../../components/PortalNoIndex';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
});

const STATUS_COLORS = {
  'Selections Received': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Awaiting Selections': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'In Editing': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Final Ready': 'text-green-400 bg-green-500/10 border-green-500/20',
  'Draft': 'text-white/30 bg-white/5 border-white/10',
  'Delivered': 'text-white/50 bg-white/5 border-white/15',
};

const ACTION_LABELS = {
  'Selections Received': 'Begin Editing',
  'Awaiting Selections': 'Send Reminder',
  'In Editing': 'Upload Finals',
  'Draft': 'Publish Gallery',
  'Final Ready': 'Mark Delivered',
  'Delivered': 'View Gallery',
};

export default function AdminDashboard() {
  const { user, loading: authLoading } = useRequireAdmin();
  const [portalData, setPortalData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    base44.functions.invoke('portalStats', {})
      .then(res => setPortalData(res.data))
      .finally(() => setDataLoading(false));
  }, [user]);

  if (authLoading || dataLoading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const d = portalData || {};

  const stats = [
    { label: 'Total Clients', value: d.total_clients || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Total Galleries', value: d.total_galleries || 0, icon: FolderOpen, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { label: 'Pending Selections', value: d.galleries_by_status?.awaiting_selections || 0, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { label: 'In Editing', value: d.galleries_by_status?.in_editing || 0, icon: Edit3, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { label: 'Finals Ready', value: d.galleries_by_status?.final_ready || 0, icon: Star, color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
  ];

  const recentSubmissions = (d.recent_submissions || []).slice(0, 5).map(sub => ({
    ...sub,
    galleryTitle: sub.gallery_title,
    clientName: sub.client_name,
  }));

  const pendingGalleries = (d.active_galleries || []).slice(0, 5);

  return (
    <div className="p-6 lg:p-10 max-w-7xl">
      <PortalNoIndex />
      <motion.div {...fade(0)} className="mb-10">
        <p className="text-gold/70 text-[10px] font-montserrat tracking-[0.3em] uppercase mb-2">Studio Overview</p>
        <h1 className="text-white text-3xl font-montserrat font-bold">Admin Dashboard</h1>
        <p className="text-white/30 text-sm font-montserrat font-light mt-1">Welcome back, {user?.full_name?.split(' ')[0] || 'Brooklyn'}.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} {...fade(i * 0.07)}
              className="bg-white/3 border border-white/8 rounded-sm p-5 transition-all hover:border-white/15">
              <div className={`w-9 h-9 rounded-full ${stat.bg} border flex items-center justify-center mb-4`}>
                <Icon size={15} className={stat.color} />
              </div>
              <p className="text-white text-2xl font-montserrat font-bold mb-1">{stat.value}</p>
              <p className="text-white/30 text-[10px] font-montserrat tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent submissions */}
        <motion.div {...fade(0.2)} className="lg:col-span-2 bg-white/3 border border-white/8 rounded-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-montserrat font-semibold text-sm tracking-wider">Recent Submissions</h2>
            <TrendingUp size={14} className="text-white/25" />
          </div>
          {recentSubmissions.length === 0 ? (
            <p className="text-white/20 text-xs font-montserrat py-8 text-center">No submissions yet</p>
          ) : (
            <div className="flex flex-col gap-0">
              {recentSubmissions.map((sub, i) => (
                <div key={sub.id} className={`flex items-start gap-4 py-4 ${i < recentSubmissions.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <div className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/80 text-xs font-montserrat font-semibold">{sub.clientName}</span>
                      <span className="text-white/30 text-xs font-montserrat">submitted selections</span>
                    </div>
                    <p className="text-white/25 text-[10px] font-montserrat mt-0.5">{sub.galleryTitle} · {sub.total_selected} images</p>
                  </div>
                  <span className="text-white/20 text-[10px] font-montserrat shrink-0">
                    {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }) : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick links */}
        <motion.div {...fade(0.3)} className="bg-white/3 border border-white/8 rounded-sm p-6">
          <h2 className="text-white font-montserrat font-semibold text-sm tracking-wider mb-6">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Create New Gallery', href: '/portal/admin/galleries', color: 'border-gold/30 text-gold hover:bg-gold/10' },
              { label: 'View All Galleries', href: '/portal/admin/galleries', color: 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/80' },
              { label: 'Review Selections', href: '/portal/admin/selections', color: 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/80' },
              { label: 'Manage Clients', href: '/portal/admin/clients', color: 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/80' },
            ].map(({ label, href, color }) => (
              <Link key={label} to={href}
                className={`flex items-center justify-between px-4 py-3.5 border rounded-sm text-xs font-montserrat font-semibold tracking-wider uppercase transition-all ${color}`}>
                {label} <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Pending */}
      {pendingGalleries.length > 0 && (
        <motion.div {...fade(0.35)} className="mt-4 bg-white/3 border border-white/8 rounded-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-montserrat font-semibold text-sm tracking-wider">Pending Actions</h2>
            <Link to="/portal/admin/galleries" className="text-gold/60 text-[10px] font-montserrat tracking-wider uppercase hover:text-gold transition-colors">View All</Link>
          </div>
          <div className="flex flex-col gap-0 divide-y divide-white/5">
            {pendingGalleries.map((gallery) => (
                <div key={gallery.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-white/80 text-sm font-montserrat font-semibold">{gallery.client_name || 'Unknown'}</p>
                    <p className="text-white/30 text-[10px] font-montserrat mt-0.5">{gallery.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-sm border text-[9px] font-montserrat font-bold tracking-wider uppercase ${STATUS_COLORS[gallery.gallery_status] || STATUS_COLORS['Draft']}`}>
                      {gallery.gallery_status}
                    </span>
                    <Link to={`/portal/admin/galleries/${gallery.id}`}
                      className="px-4 py-2 border border-white/15 text-white/50 text-[10px] font-montserrat uppercase tracking-wider rounded-sm hover:border-white/30 hover:text-white/80 transition-all">
                      {ACTION_LABELS[gallery.gallery_status] || 'View'}
                    </Link>
                  </div>
                </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}