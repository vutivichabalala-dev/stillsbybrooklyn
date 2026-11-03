import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Images, Heart, CheckSquare, Star,
  Settings, Users, FolderOpen, LogOut, Menu, ChevronRight, BarChart2
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

const clientNav = [
  { label: 'Dashboard', path: '/portal/dashboard', icon: LayoutDashboard },
  { label: 'Proof Gallery', path: '/portal/gallery', icon: Images },
  { label: 'My Selections', path: '/portal/selections', icon: Heart },
  { label: 'Final Gallery', path: '/portal/final', icon: Star },
];

const adminNav = [
  { label: 'Dashboard', path: '/portal/admin', icon: LayoutDashboard },
  { label: 'Galleries', path: '/portal/admin/galleries', icon: FolderOpen },
  { label: 'Clients', path: '/portal/admin/clients', icon: Users },
  { label: 'Selections', path: '/portal/admin/selections', icon: CheckSquare },
  { label: 'Analytics', path: '/portal/admin/analytics', icon: BarChart2 },
];

export default function DashboardLayout({ isAdmin = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const nav = isAdmin ? adminNav : clientNav;

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  const isActive = (path) => location.pathname === path;
  const displayName = currentUser?.full_name || currentUser?.email || (isAdmin ? 'Brooklyn' : 'Client');
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-[#131112] flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#171415] border-r border-white/6
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex lg:flex-col
      `}>
        {/* Logo */}
        <div className="px-8 py-8 border-b border-white/6">
          <Link to="/" className="flex flex-col leading-none">
            <span className="text-white font-montserrat text-xs font-light tracking-[0.3em] uppercase">
              STILLS BY <span className="font-bold">BROOKLYN</span>
            </span>
            <div className="h-[1.5px] w-full mt-1.5 bg-gold" />
          </Link>
          <p className="text-white/25 text-[10px] font-montserrat tracking-[0.2em] uppercase mt-3">
            {isAdmin ? 'Studio Portal' : 'Client Portal'}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-montserrat tracking-wider uppercase transition-all duration-200 group
                  ${active
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/4 border border-transparent'
                  }
                `}
              >
                <Icon size={14} className={active ? 'text-gold' : 'text-white/30 group-hover:text-white/60'} />
                {item.label}
                {active && <ChevronRight size={12} className="ml-auto text-gold/50" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-6 border-t border-white/6 flex flex-col gap-2">
          {isAdmin ? (
            <Link to="/portal/dashboard" className="flex items-center gap-3 px-4 py-3 text-xs font-montserrat tracking-wider uppercase text-white/30 hover:text-white/70 transition-colors">
              <Users size={14} /> Client View
            </Link>
          ) : (
            <Link to="/portal/admin" className="flex items-center gap-3 px-4 py-3 text-xs font-montserrat tracking-wider uppercase text-white/30 hover:text-white/70 transition-colors">
              <Settings size={14} /> Admin View
            </Link>
          )}
          <button onClick={() => base44.auth.logout('/')} className="flex items-center gap-3 px-4 py-3 text-xs font-montserrat tracking-wider uppercase text-white/25 hover:text-white/60 transition-colors w-full text-left">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#131112]/90 backdrop-blur-xl border-b border-white/6 px-6 lg:px-10 py-4 flex items-center justify-between">
          <button className="lg:hidden text-white/60 hover:text-white transition-colors" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white/80 text-xs font-montserrat font-semibold tracking-wider">{displayName}</p>
              <p className="text-white/30 text-[10px] font-montserrat tracking-wider uppercase">{isAdmin ? 'Photographer' : 'Client'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
              <span className="text-gold text-xs font-montserrat font-bold">{initials}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}