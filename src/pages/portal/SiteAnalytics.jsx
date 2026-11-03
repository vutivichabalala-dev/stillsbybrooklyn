import { useEffect, useState } from 'react';
import PortalNoIndex from '../../components/PortalNoIndex';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Globe, Monitor, TrendingUp, MapPin, Smartphone } from 'lucide-react';
import GlassCard from '@/components/GlassCard';

const GOLD = 'hsl(46,70%,55%)';
const COLORS = [GOLD, '#ffffff40', '#ffffff25', '#ffffff15', '#ffffff10'];

function StatCard({ icon: Icon, label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard className="p-6 flex items-center gap-4">
        <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-gold" />
        </div>
        <div>
          <p className="text-white/40 text-[10px] font-montserrat tracking-widest uppercase">{label}</p>
          <p className="text-white text-2xl font-montserrat font-black">{value}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function tally(visits, key) {
  const map = {};
  visits.forEach(v => {
    const k = v[key] || 'Unknown';
    map[k] = (map[k] || 0) + 1;
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
}

function last7Days(visits) {
  const days = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
    days[key] = 0;
  }
  visits.forEach(v => {
    const d = new Date(v.visited_at);
    const key = d.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' });
    if (key in days) days[key]++;
  });
  return Object.entries(days).map(([name, visits]) => ({ name, visits }));
}

export default function SiteAnalytics() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Site Analytics | Stills by Brooklyn';
    base44.entities.PageVisit.list('-visited_at', 1000)
      .then(data => { setVisits(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalVisits = visits.length;
  const uniquePages = new Set(visits.map(v => v.page)).size;
  const countries = tally(visits, 'country');
  const pages = tally(visits, 'page');
  const devices = tally(visits, 'device');
  const browsers = tally(visits, 'browser');
  const trend = last7Days(visits);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" style={{ borderColor: 'hsl(46 70% 55%)', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <PortalNoIndex />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-gold text-xs font-montserrat font-semibold tracking-[0.3em] uppercase">Admin</span>
        <h1 className="text-3xl font-montserrat font-bold text-white mt-1">Site Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Live visitor data from your website.</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Visits" value={totalVisits} delay={0} />
        <StatCard icon={TrendingUp} label="Pages Tracked" value={uniquePages} delay={0.05} />
        <StatCard icon={Globe} label="Countries" value={countries.length} delay={0.1} />
        <StatCard icon={Monitor} label="Devices" value={devices.length} delay={0.15} />
      </div>

      {/* 7-day trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-6">
          <h2 className="text-white/60 text-xs font-montserrat tracking-widest uppercase mb-6">Visits — Last 7 Days</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trend}>
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
              <Line type="monotone" dataKey="visits" stroke={GOLD} strokeWidth={2} dot={{ fill: GOLD, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </motion.div>

      {/* Pages + Countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <GlassCard className="p-6 h-full">
            <h2 className="text-white/60 text-xs font-montserrat tracking-widest uppercase mb-6 flex items-center gap-2">
              <TrendingUp size={12} className="text-gold" /> Top Pages
            </h2>
            <div className="space-y-3">
              {pages.slice(0, 8).map((p, i) => (
                <div key={p.name} className="flex items-center justify-between">
                  <span className="text-white/60 text-xs font-montserrat truncate max-w-[70%]">{p.name || '/'}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${(p.value / (pages[0]?.value || 1)) * 100}%` }} />
                    </div>
                    <span className="text-gold text-xs font-montserrat font-bold w-6 text-right">{p.value}</span>
                  </div>
                </div>
              ))}
              {pages.length === 0 && <p className="text-white/20 text-xs">No data yet.</p>}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6 h-full">
            <h2 className="text-white/60 text-xs font-montserrat tracking-widest uppercase mb-6 flex items-center gap-2">
              <MapPin size={12} className="text-gold" /> Top Countries
            </h2>
            <div className="space-y-3">
              {countries.slice(0, 8).map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <span className="text-white/60 text-xs font-montserrat">{c.name}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${(c.value / (countries[0]?.value || 1)) * 100}%` }} />
                    </div>
                    <span className="text-gold text-xs font-montserrat font-bold w-6 text-right">{c.value}</span>
                  </div>
                </div>
              ))}
              {countries.length === 0 && <p className="text-white/20 text-xs">No data yet.</p>}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Device + Browser pie charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Devices', data: devices, icon: Smartphone },
          { label: 'Browsers', data: browsers, icon: Globe },
        ].map(({ label, data, icon: Icon }, gi) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + gi * 0.05 }}>
            <GlassCard className="p-6">
              <h2 className="text-white/60 text-xs font-montserrat tracking-widest uppercase mb-6 flex items-center gap-2">
                <Icon size={12} className="text-gold" /> {label}
              </h2>
              <div className="flex items-center gap-6">
                <PieChart width={120} height={120}>
                  <Pie data={data} cx={55} cy={55} innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={3}>
                    {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
                <div className="space-y-2 flex-1">
                  {data.slice(0, 5).map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-white/60 text-xs font-montserrat capitalize">{d.name}</span>
                      </div>
                      <span className="text-gold text-xs font-montserrat font-bold">{d.value}</span>
                    </div>
                  ))}
                  {data.length === 0 && <p className="text-white/20 text-xs">No data yet.</p>}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Recent visits table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <GlassCard className="p-6">
          <h2 className="text-white/60 text-xs font-montserrat tracking-widest uppercase mb-6">Recent Visits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-montserrat">
              <thead>
                <tr className="border-b border-white/10">
                  {['Page', 'Country', 'City', 'Device', 'Browser', 'Time'].map(h => (
                    <th key={h} className="text-left text-white/30 tracking-widest uppercase pb-3 pr-4 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visits.slice(0, 20).map((v, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="py-2.5 pr-4 text-white/70">{v.page || '/'}</td>
                    <td className="py-2.5 pr-4 text-white/50">{v.country || '—'}</td>
                    <td className="py-2.5 pr-4 text-white/50">{v.city || '—'}</td>
                    <td className="py-2.5 pr-4 text-white/50 capitalize">{v.device || '—'}</td>
                    <td className="py-2.5 pr-4 text-white/50">{v.browser || '—'}</td>
                    <td className="py-2.5 text-white/30">{v.visited_at ? new Date(v.visited_at).toLocaleString('en-ZA', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
                  </tr>
                ))}
                {visits.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-white/20">No visits tracked yet. Visits will appear here once users browse your site.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}