type RatingProps = {
  rating?: number | null;
  valueRating?: number | null;
};

export function RatingBadges({ rating, valueRating }: RatingProps) {
  return (
    <div className="metrics">
      {rating != null && <span className="metric">⭐️ {rating.toFixed(1)}</span>}
      {valueRating != null && <span className="metric">💰 {valueRating.toFixed(1)} value</span>}
    </div>
  );
}
