import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import BrandLoader from './components/BrandLoader';

// Loaded only for /portal routes, so the public website never downloads the
// Base44 login/session code.
function Gate() {
  const { isLoadingAuth, isLoadingPublicSettings } = useAuth();
  const [failsafe, setFailsafe] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFailsafe(true), 6000);
    return () => clearTimeout(t);
  }, []);
  if (!failsafe && (isLoadingAuth || isLoadingPublicSettings)) return <BrandLoader />;
  return <Outlet />;
}

export default function PortalGate() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
