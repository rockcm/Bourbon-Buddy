import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBottle, fetchBottleReviews } from '../api/client';
import { RatingBadges } from '../components/cards/RatingBadges';
import { ReviewCard } from '../components/cards/ReviewCard';
import { BottleDetail, ReviewResponse } from '../types';

const fallbackBottle: BottleDetail = {
  id: 'sample-1',
  name: 'Four Roses Small Batch',
  brand: 'Four Roses',
  category: 'Bourbon',
  abv: 45,
  averageRating: 4.3,
  reviewCount: 128,
  description: 'Balanced and approachable bourbon with red fruit and vanilla.',
  notes: 'Sample bottle shown when the API is unreachable.'
};

export function BottleDetailPage() {
  const { id } = useParams();
  const [bottle, setBottle] = useState<BottleDetail | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await fetchBottle(id);
        setBottle(data);
        setReviews(await fetchBottleReviews(id));
      } catch (err) {
        setError((err as Error).message);
        setBottle(fallbackBottle);
      }
    }
    load();
  }, [id]);

  if (!bottle) return <div className="card">Loading bottle...</div>;

  return (
    <div className="page-grid">
      <section>
        <h2 className="section-title">{bottle.name}</h2>
        <p className="section-subtitle">
          {bottle.brand} • {bottle.category}
        </p>
        {error && <div style={{ color: '#b91c1c' }}>Using sample data: {error}</div>}
        <RatingBadges rating={bottle.averageRating ?? null} />
        {bottle.description && <p>{bottle.description}</p>}
        {bottle.notes && <p>{bottle.notes}</p>}
      </section>
      <section>
        <h3 className="section-title">Recent reviews</h3>
        {reviews.length === 0 && <div className="empty-state">No reviews yet.</div>}
        <div className="cards-grid">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>
    </div>
  );
}
