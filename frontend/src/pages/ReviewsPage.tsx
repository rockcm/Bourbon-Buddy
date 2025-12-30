import { Link } from 'react-router-dom';
import { RecentReviews } from '../components/RecentReviews';
import { useAuth } from '../context/AuthContext';

export function ReviewsPage() {
  const { user } = useAuth();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="section-title">Reviews feed</h2>
          <p className="section-subtitle">See what the community is tasting right now.</p>
        </div>
        <Link className="button" to={user ? '/reviews/new' : '/auth/login'}>
          Post a review
        </Link>
      </div>
      <RecentReviews />
    </div>
  );
}
