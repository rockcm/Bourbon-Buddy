import { apiBaseUrl } from './api';
import { BottleSearch } from './components/BottleSearch';
import { DiscoverHighlights } from './components/DiscoverHighlights';
import { RecentReviews } from './components/RecentReviews';
import { ReviewForm } from './components/ReviewForm';

function Hero() {
  return (
    <div className="banner">
      <h2>Welcome to Bourbon Buddy</h2>
      <p>Track bottles, trade tasting notes, and discover what the community is pouring.</p>
      <div className="hero-actions">
        <span className="button secondary">API base: {apiBaseUrl}</span>
        <span className="button">Try a search below</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <header>
        <div>
          <div className="badge">ALPHA</div>
          <h1>Bourbon Buddy</h1>
          <p style={{ margin: 0, color: '#475569' }}>A home for whiskey lovers: bottles, reviews, and cellars.</p>
        </div>
      </header>
      <Hero />
      <DiscoverHighlights />
      <BottleSearch />
      <RecentReviews />
      <ReviewForm />
    </div>
  );
}
