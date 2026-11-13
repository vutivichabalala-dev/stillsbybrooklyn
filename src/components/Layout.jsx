import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBookingBar from './MobileBookingBar';
import ScrollProgress from './ScrollProgress';
import { MiniLoader } from './BrandLoader';
import RouteCurtain from './RouteCurtain';
import CursorLabel from './CursorLabel';

const PageSpinner = MiniLoader;

export default function Layout() {
  const { pathname } = useLocation();

  // Start each page at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    // reducedMotion="user": every framer animation respects the visitor's OS setting
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <ScrollProgress />
        <Navbar />
        <main className="flex-1 relative z-10">
          <Suspense fallback={<PageSpinner />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <MobileBookingBar />
        <RouteCurtain />
        <CursorLabel />
      </div>
    </MotionConfig>
  );
}
