import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthSplashPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/discover" replace />;
  }

  return (
    <section className="splash-hero">
      <div className="splash-copy">
        <p className="pill">Welcome</p>
        <h1>Sign in to explore Bourbon Buddy</h1>
        <p className="lead">
          Track bottles, browse reviews, and build your cellar. Choose how you want to start: log in if you already have an
          account, or sign up to create one.
        </p>
        <div className="cta-row">
          <Link className="button" to="/auth/login">
            Log in
          </Link>
          <Link className="button ghost" to="/auth/signup">
            Create an account
          </Link>
        </div>
        <div className="splash-grid">
          <div className="splash-card">
            <h3>Reviews feed</h3>
            <p>Read recent tasting notes from the community and save bottles you want to try.</p>
          </div>
          <div className="splash-card">
            <h3>Cellar tracking</h3>
            <p>Keep an organized list of everything on your shelf, with ratings and purchase history.</p>
          </div>
          <div className="splash-card">
            <h3>Discover picks</h3>
            <p>Browse trending pours, top-rated bottles, and best value bourbons without leaving the app.</p>
          </div>
        </div>
      </div>
      <div className="splash-pane">
        <div className="pane-card">
          <p className="pill muted">Quick steps</p>
          <ol className="step-list">
            <li>Log in or sign up.</li>
            <li>Start with Discover to see what the community loves.</li>
            <li>Save bottles to your cellar and share your own review.</li>
          </ol>
          <div className="divider" />
          <p className="muted">Protected areas include your cellar, settings, and new review form.</p>
        </div>
      </div>
    </section>
  );
}
