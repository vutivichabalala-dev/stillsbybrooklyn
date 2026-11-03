import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBookingBar from './MobileBookingBar';

const PageSpinner = () => (
  <div className="min-h-[70vh] flex items-center justify-center">
    <div className="h-9 w-9 rounded-full border border-gold/25 border-t-gold animate-spin" />
  </div>
);

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
        <Navbar />
        <main className="flex-1 relative z-10">
          <Suspense fallback={<PageSpinner />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <MobileBookingBar />
      </div>
    </MotionConfig>
  );
}
