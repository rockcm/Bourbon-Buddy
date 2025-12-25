import { useEffect, useState } from 'react';
import { fetchBottles } from '../api';
import { Bottle } from '../types';

const fallbackBottles: Bottle[] = [
  {
    id: 'sample-1',
    name: 'Four Roses Small Batch',
    brand: 'Four Roses',
    category: 'Bourbon',
    abv: 45,
    averageRating: 4.3,
    reviewCount: 128
  },
  {
    id: 'sample-2',
    name: 'Redbreast 12',
    brand: 'Redbreast',
    category: 'Irish Whiskey',
    abv: 40,
    averageRating: 4.6,
    reviewCount: 242
  },
  {
    id: 'sample-3',
    name: 'Lagavulin 16',
    brand: 'Lagavulin',
    category: 'Scotch',
    abv: 43,
    averageRating: 4.7,
    reviewCount: 310
  }
];

export function BottleSearch() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bottles, setBottles] = useState<Bottle[]>(fallbackBottles);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const results = await fetchBottles(search, category || undefined);
      setBottles(results);
    } catch (err) {
      setError((err as Error).message);
      setBottles(fallbackBottles);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <h2 className="section-title">Bottle catalog</h2>
      <p className="section-subtitle">Search by name, brand, or filter by category.</p>
      <div className="input-row">
        <input
          placeholder="Search bottles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') load();
          }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="Bourbon">Bourbon</option>
          <option value="Rye">Rye</option>
          <option value="Scotch">Scotch</option>
          <option value="Irish Whiskey">Irish</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="button" onClick={load} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        {error && <span style={{ color: '#b91c1c' }}>Using sample data: {error}</span>}
      </div>
      <div className="cards-grid" style={{ marginTop: 14 }}>
        {bottles.length === 0 && <div className="empty-state">No bottles found.</div>}
        {bottles.map((bottle) => (
          <article className="card" key={bottle.id}>
            <h3>{bottle.name}</h3>
            <small>
              {bottle.brand} • {bottle.category}
            </small>
            {bottle.description && <p>{bottle.description.slice(0, 120)}...</p>}
            <div className="metrics">
              {bottle.averageRating != null && <span className="metric">⭐️ {bottle.averageRating.toFixed(1)}</span>}
              {bottle.reviewCount != null && <span className="metric">{bottle.reviewCount} reviews</span>}
              {bottle.abv && <span className="metric">{bottle.abv}% ABV</span>}
              {bottle.ageYears && <span className="metric">{bottle.ageYears} years</span>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
