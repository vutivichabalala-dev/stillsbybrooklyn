import { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import BrandLoader, { MiniLoader } from './components/BrandLoader';
import Home from './pages/Home';
import { useTrackVisit } from './hooks/useTrackVisit';
import { seoPages } from './content/seoPages';
import { redirects } from './content/corePages';

// Every page except Home loads on demand, so the first visit only downloads what it shows
const PortalGate = lazy(() => import('./PortalGate'));
const PageNotFound = lazy(() => import('./lib/PageNotFound'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Corporate = lazy(() => import('./pages/Corporate'));
const Portraits = lazy(() => import('./pages/Portraits'));
const Weddings = lazy(() => import('./pages/Weddings'));
const Booking = lazy(() => import('./pages/Booking'));
const SeoPage = lazy(() => import('./pages/SeoPage'));
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
  <div className="min-h-screen bg-background"><MiniLoader /></div>
);

// Redirect component for old URLs → new clean URLs
function RedirectTo({ to }) {
  return <Navigate to={to} replace />;
}

// Keep the branded loader on screen just long enough to read, never longer than needed
// Full logo animation on the first visit of a session; a quick flash afterwards.
const firstVisit = (() => {
  try {
    const seen = sessionStorage.getItem('sb-intro');
    sessionStorage.setItem('sb-intro', '1');
    return !seen;
  } catch { return true; }
})();
const LOADER_MIN_MS = firstVisit ? 1700 : 350;

const AuthenticatedApp = () => {
  useTrackVisit();
  const [minElapsed, setMinElapsed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), LOADER_MIN_MS);
    return () => clearTimeout(t);
  }, []);
  // The public site shows after a short brand moment and never waits on the network.
  const loading = !minElapsed;

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
              {/* Client Portal (auth code loads only here) */}
              <Route element={<PortalGate />}>
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
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <AuthenticatedApp />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App