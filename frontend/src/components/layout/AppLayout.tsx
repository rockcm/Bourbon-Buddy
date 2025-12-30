import { Link, NavLink, Outlet } from 'react-router-dom';
import { apiBaseUrl } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export function AppLayout() {
  const { user, logout } = useAuth();
  const navItems = [
    { to: '/discover', label: 'Discover' },
    { to: '/catalog', label: 'Catalog' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/cellar', label: 'Cellar', protected: true },
    user ? { to: `/profile/${user.username}`, label: 'Profile', protected: true } : null
  ].filter(Boolean) as { to: string; label: string; protected?: boolean }[];

  return (
    <div className="app-shell">
      <header>
        <div>
          <div className="badge">ALPHA</div>
          <h1 style={{ marginBottom: 4 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Bourbon Buddy
            </Link>
          </h1>
          <p style={{ margin: 0, color: '#475569' }}>A home for whiskey lovers: bottles, reviews, and cellars.</p>
          <small style={{ color: '#64748b' }}>API base: {apiBaseUrl}</small>
        </div>
        <nav className="top-nav">
          {navItems.map((item) => {
            if (item.protected && !user) return null;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                {item.label}
              </NavLink>
            );
          })}
          {user ? (
            <button className="button secondary" onClick={logout} style={{ marginLeft: 8 }}>
              Logout
            </button>
          ) : (
            <Link to="/auth/login" className="nav-link">
              Login
            </Link>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
