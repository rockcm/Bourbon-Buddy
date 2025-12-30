import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function AuthLayout() {
  const { user } = useAuth();

  return (
    <div className="auth-shell">
      <header className="auth-header">
        <Link to="/" className="logo-mark">
          Bourbon Buddy
        </Link>
        {user ? <div className="pill">Signed in</div> : <div className="pill muted">Start here</div>}
      </header>
      <main className="auth-main">
        <Outlet />
      </main>
      <footer className="auth-footer">
        <p>Discover bourbons, share reviews, and keep your cellar organized.</p>
      </footer>
    </div>
  );
}
