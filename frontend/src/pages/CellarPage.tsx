import { useAuth } from '../context/AuthContext';

export function CellarPage() {
  const { user } = useAuth();
  return (
    <section>
      <h2 className="section-title">Your cellar</h2>
      <p className="section-subtitle">Track bottles you own and their status.</p>
      <div className="card">
        {user ? <p>Cellar management coming soon. Logged in as @{user.username}.</p> : <p>Sign in to view your cellar.</p>}
      </div>
    </section>
  );
}
