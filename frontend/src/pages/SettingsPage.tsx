import { useAuth } from '../context/AuthContext';

export function SettingsPage() {
  const { user } = useAuth();
  return (
    <section>
      <h2 className="section-title">Settings</h2>
      <p className="section-subtitle">Manage your account and preferences.</p>
      <div className="card">
        {user ? <p>Signed in as {user.displayName || user.username}. Profile editing coming soon.</p> : <p>Please log in.</p>}
      </div>
    </section>
  );
}
