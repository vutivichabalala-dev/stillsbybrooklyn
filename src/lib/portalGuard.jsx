import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

// Hook to require any authenticated user for portal pages
export function useRequireAuth(redirectTo = '/portal') {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then((u) => {
      if (!u) {
        navigate(redirectTo);
      } else {
        setUser(u);
      }
    }).catch(() => {
      navigate(redirectTo);
    }).finally(() => setLoading(false));
  }, []);

  return { user, loading };
}

// Hook to require admin role
export function useRequireAdmin(redirectTo = '/portal/admin/login') {
  const { user, loading } = useRequireAuth(redirectTo);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && user.role !== 'admin') {
      navigate('/portal/dashboard');
    }
  }, [user, loading]);

  return { user, loading };
}