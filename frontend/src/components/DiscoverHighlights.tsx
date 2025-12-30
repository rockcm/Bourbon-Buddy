import { useEffect, useState } from 'react';
import { fetchDiscover } from '../api/client';
import { RankedBottle } from '../types';

const fallback: RankedBottle[] = [
  { bottleId: 'sample-a', name: 'Bulleit Bourbon', brand: 'Bulleit', category: 'Bourbon', averageRating: 4.2, reviewCount: 210 },
  { bottleId: 'sample-b', name: 'High West Double Rye', brand: 'High West', category: 'Rye', averageRating: 4.1, reviewCount: 88 },
  { bottleId: 'sample-c', name: 'Ardbeg Uigeadail', brand: 'Ardbeg', category: 'Scotch', averageRating: 4.7, reviewCount: 193 }
];

function RankedList({ title, items }: { title: string; items: RankedBottle[] }) {
  return (
    <div className="card">
      <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
      {items.length === 0 && <div className="empty-state">No data yet.</div>}
      {items.map((item) => (
        <div key={item.bottleId} style={{ marginBottom: 8 }}>
          <strong>{item.name}</strong> <small>• {item.brand}</small>
          <div className="metrics">
            <span className="metric">⭐️ {item.averageRating.toFixed(1)}</span>
            <span className="metric">{item.reviewCount} reviews</span>
            <span className="metric">{item.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DiscoverHighlights() {
  const [trending, setTrending] = useState<RankedBottle[]>(fallback);
  const [topRated, setTopRated] = useState<RankedBottle[]>([]);
  const [bestValue, setBestValue] = useState<RankedBottle[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const data = await fetchDiscover();
        setTrending(data.trending);
        setTopRated(data.topRated);
        setBestValue(data.bestValue);
      } catch (err) {
        setError((err as Error).message);
        setTopRated([]);
        setBestValue([]);
      }
    }

    load();
  }, []);

  return (
    <section>
      <h2 className="section-title">Discover</h2>
      <p className="section-subtitle">Trending, top-rated, and best-value pours from the community.</p>
      {error && <div style={{ color: '#b91c1c', marginBottom: 12 }}>Using sample trending bottles: {error}</div>}
      <div className="cards-grid">
        <RankedList title="Trending this month" items={trending} />
        <RankedList title="Top rated" items={topRated} />
        <RankedList title="Best value" items={bestValue} />
      </div>
    </section>
  );
}
