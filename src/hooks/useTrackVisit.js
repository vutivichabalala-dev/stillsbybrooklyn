import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export function useTrackVisit() {
  const location = useLocation();

  useEffect(() => {
    const referrer = document.referrer || 'direct';
    const screen_width = window.innerWidth;

    base44.functions.invoke('trackVisit', {
      page: location.pathname,
      referrer,
      screen_width,
    }).catch(() => {}); // silent — never break the UI
  }, [location.pathname]);
}