import { Bottle } from '../../types';

export function BottleCard({ bottle }: { bottle: Bottle }) {
  return (
    <article className="card">
      <h3 style={{ margin: 0 }}>{bottle.name}</h3>
      <small>
        {bottle.brand} • {bottle.category}
      </small>
      {bottle.description && <p>{bottle.description.slice(0, 120)}...</p>}
      <div className="metrics">
        {bottle.averageRating != null && <span className="metric">⭐️ {bottle.averageRating.toFixed(1)}</span>}
        {bottle.reviewCount != null && <span className="metric">{bottle.reviewCount} reviews</span>}
        {bottle.abv && <span className="metric">{bottle.abv}% ABV</span>}
        {bottle.ageYears && <span className="metric">{bottle.ageYears} yrs</span>}
      </div>
    </article>
  );
}
