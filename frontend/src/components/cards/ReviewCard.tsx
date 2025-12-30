import { ReviewResponse } from '../../types';
import { TagChips } from './TagChips';

export function ReviewCard({ review }: { review: ReviewResponse }) {
  return (
    <article className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>@{review.username}</h3>
        <span className="metric">⭐️ {review.rating.toFixed(1)}</span>
      </div>
      <p style={{ margin: '8px 0' }}>{review.notes}</p>
      <TagChips tags={review.tags} />
      {review.imageUrls?.length ? (
        <div className="preview-grid">
          {review.imageUrls.map((url) => (
            <img key={url} src={url} alt="review attachment" className="preview-thumb" />
          ))}
        </div>
      ) : null}
      {review.createdAt && <small style={{ color: '#64748b' }}>{new Date(review.createdAt).toLocaleString()}</small>}
    </article>
  );
}
