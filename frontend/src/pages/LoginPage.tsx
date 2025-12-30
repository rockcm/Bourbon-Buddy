import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, user, intendedPath } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={intendedPath || '/discover'} replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await login(usernameOrEmail, password);
      const redirectTo = (location.state as { from?: string })?.from || intendedPath || '/discover';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section className="auth-card">
      <p className="pill">Welcome back</p>
      <h2 className="section-title">Log in</h2>
      <p className="section-subtitle">Access your reviews, cellar, and personalized picks.</p>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Username or email
          <input value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div className="error-text">{error}</div>}
        <button className="button" type="submit">
          Continue
        </button>
      </form>
      <p className="muted">
        New here? <Link className="inline-link" to="/auth/signup">Create an account</Link>
      </p>
    </section>
  );
}
