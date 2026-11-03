import { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import BrandLoader from './components/BrandLoader';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Corporate from './pages/Corporate';
import Portraits from './pages/Portraits';
import Weddings from './pages/Weddings';
import Booking from './pages/Booking';
import { useTrackVisit } from './hooks/useTrackVisit';
import SeoPage from './pages/SeoPage';
import { seoPages } from './content/seoPages';
import { redirects } from './content/corePages';

// Heavier routes load in their own chunks so the public site stays instant
const Reels = lazy(() => import('./pages/Reels'));
const ClientLogin = lazy(() => import('./pages/portal/ClientLogin'));
const ClientDashboard = lazy(() => import('./pages/portal/ClientDashboard.jsx'));
const ProofGallery = lazy(() => import('./pages/portal/ProofGallery.jsx'));
const MySelections = lazy(() => import('./pages/portal/MySelections.jsx'));
const FinalGallery = lazy(() => import('./pages/portal/FinalGallery.jsx'));
const AdminDashboard = lazy(() => import('./pages/portal/AdminDashboard'));
const AdminGalleries = lazy(() => import('./pages/portal/AdminGalleries.jsx'));
const AdminSelections = lazy(() => import('./pages/portal/AdminSelections'));
const AdminClients = lazy(() => import('./pages/portal/AdminClients.jsx'));
const AdminGalleryDetail = lazy(() => import('./pages/portal/AdminGalleryDetail'));
const AdminLogin = lazy(() => import('./pages/portal/AdminLogin'));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const SiteAnalytics = lazy(() => import('./pages/portal/SiteAnalytics'));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-9 w-9 rounded-full border border-gold/25 border-t-gold animate-spin" />
  </div>
);

// Redirect component for old URLs → new clean URLs
function RedirectTo({ to }) {
  return <Navigate to={to} replace />;
}

// Keep the branded loader on screen just long enough to read, never longer than needed
const LOADER_MIN_MS = 600;
const LOADER_FAILSAFE_MS = 6000;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  useTrackVisit();

  const location = useLocation();
  const isPortalRoute = location.pathname.startsWith('/portal');

  const [minElapsed, setMinElapsed] = useState(false);
  const [failsafe, setFailsafe] = useState(false);

  useEffect(() => {
    const minTimer = setTimeout(() => setMinElapsed(true), LOADER_MIN_MS);
    const failsafeTimer = setTimeout(() => setFailsafe(true), LOADER_FAILSAFE_MS);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(failsafeTimer);
    };
  }, []);

  const loading = !failsafe && (isLoadingPublicSettings || isLoadingAuth || !minElapsed);

  if (authError && !isPortalRoute) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
      <AnimatePresence>{loading && <BrandLoader />}</AnimatePresence>
      {!loading && (
        <AnimatePresence mode="wait" initial={false}>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/services" element={<Services />} />
                {/* Keyword service pages */}
                <Route path="/wedding-photographer-johannesburg" element={<Weddings />} />
                <Route path="/corporate-headshots-johannesburg" element={<Corporate />} />
                <Route path="/photography-studio-johannesburg" element={<Portraits />} />
                {/* Content-driven service, location and blog pages */}
                {seoPages.map((page) => (
                  <Route key={page.path} path={page.path} element={<SeoPage page={page} />} />
                ))}
                {/* Old URLs → new keyword URLs (real 301s also live in vercel.json) */}
                {redirects.map((r) => (
                  <Route key={r.from} path={r.from} element={<RedirectTo to={r.to} />} />
                ))}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/reels" element={<Reels />} />
              </Route>
              {/* Client Portal */}
              <Route path="/portal" element={<ClientLogin />} />
              <Route element={<DashboardLayout isAdmin={false} />}>
                <Route path="/portal/dashboard" element={<ClientDashboard />} />
                <Route path="/portal/gallery" element={<ProofGallery />} />
                <Route path="/portal/selections" element={<MySelections />} />
                <Route path="/portal/final" element={<FinalGallery />} />
              </Route>
              {/* Admin Portal */}
              <Route path="/portal/admin/login" element={<AdminLogin />} />
              <Route element={<DashboardLayout isAdmin={true} />}>
                <Route path="/portal/admin" element={<AdminDashboard />} />
                <Route path="/portal/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/portal/admin/galleries" element={<AdminGalleries />} />
                <Route path="/portal/admin/galleries/:id" element={<AdminGalleryDetail />} />
                <Route path="/portal/admin/clients" element={<AdminClients />} />
                <Route path="/portal/admin/selections" element={<AdminSelections />} />
                <Route path="/portal/admin/analytics" element={<SiteAnalytics />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App