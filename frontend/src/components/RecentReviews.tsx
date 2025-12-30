import { useEffect, useState } from 'react';
import { fetchRecentReviews } from '../api/client';
import { ReviewResponse } from '../types';
import { ReviewCard } from './cards/ReviewCard';

const fallback: ReviewResponse[] = [
  {
    id: 'r1',
    username: 'whiskey_gazer',
    rating: 4.5,
    notes: 'Honey, vanilla, and citrus peel with a dry oak finish.',
    createdAt: new Date().toISOString(),
    tags: ['vanilla', 'citrus', 'oak'],
    imageUrls: []
  },
  {
    id: 'r2',
    username: 'peated_dreams',
    rating: 4.8,
    notes: 'Sea spray, smoked malt, and dark chocolate. A fireplace in a glass.',
    createdAt: new Date().toISOString(),
    tags: ['peat', 'smoke'],
    imageUrls: []
  }
];

export function RecentReviews() {
  const [reviews, setReviews] = useState<ReviewResponse[]>(fallback);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const data = await fetchRecentReviews();
        setReviews(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    load();
  }, []);

  return (
    <section>
      <h2 className="section-title">Recent reviews</h2>
      <p className="section-subtitle">See what the community is tasting right now.</p>
      {error && <div style={{ color: '#b91c1c' }}>Using sample reviews: {error}</div>}
      <div className="cards-grid">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}
