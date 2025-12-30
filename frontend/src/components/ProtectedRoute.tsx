import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading, setIntendedPath } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="card">Checking access...</div>;
  }

  if (!user) {
    setIntendedPath(location.pathname + location.search);
    return <Navigate to="/auth/login" replace state={{ from: location.pathname + location.search }} />;
  }

  return children;
}
