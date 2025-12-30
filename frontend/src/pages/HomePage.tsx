import { Link } from 'react-router-dom';
import { DiscoverHighlights } from '../components/DiscoverHighlights';
import { RecentReviews } from '../components/RecentReviews';
import { BottleSearch } from '../components/BottleSearch';

function Hero() {
  return (
    <div className="banner">
      <h2>Welcome to Bourbon Buddy</h2>
      <p>Track bottles, trade tasting notes, and discover what the community is pouring.</p>
      <div className="hero-actions">
        <Link className="button" to="/discover">
          Discover
        </Link>
        <Link className="button secondary" to="/catalog">
          Browse catalog
        </Link>
      </div>
    </div>
  );
}

export function HomePage() {
  return (
    <div>
      <Hero />
      <DiscoverHighlights />
      <BottleSearch />
      <RecentReviews />
    </div>
  );
}
