import { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const PortalAuthContext = createContext(null);

export function PortalAuthProvider({ children }) {
  const [portalUser, setPortalUser] = useState(null);
  const [portalLoading, setPortalLoading] = useState(true);

  useEffect(() => {
    // Check if there's a portal session in sessionStorage
    try {
      const stored = sessionStorage.getItem('portal_user');
      if (stored) setPortalUser(JSON.parse(stored));
    } catch {}
    setPortalLoading(false);
  }, []);

  const portalLogin = async (email, password) => {
    // Use base44 auth — the platform handles password validation
    // For the client portal we leverage the built-in User entity
    try {
      await base44.auth.redirectToLogin(); // this is a fallback — we handle via the platform auth
    } catch {}
  };

  const setPortalSession = (user) => {
    setPortalUser(user);
    sessionStorage.setItem('portal_user', JSON.stringify(user));
  };

  const clearPortalSession = () => {
    setPortalUser(null);
    sessionStorage.removeItem('portal_user');
  };

  return (
    <PortalAuthContext.Provider value={{ portalUser, setPortalSession, clearPortalSession, portalLoading }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  return useContext(PortalAuthContext);
}