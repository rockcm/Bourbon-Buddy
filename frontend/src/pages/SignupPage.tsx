import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function SignupPage() {
  const { signup, user } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await signup(username, email, password, displayName);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <section>
      <h2 className="section-title">Create an account</h2>
      <p className="section-subtitle">Sign up to save reviews and manage your cellar.</p>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Display name
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
        <button className="button" type="submit">
          Sign up
        </button>
      </form>
    </section>
  );
}
