import { FormEvent, useState } from 'react';
import { submitReview } from '../api';
import { ReviewRequest } from '../types';

const defaultUser = '00000000-0000-0000-0000-000000000001';
const defaultBottle = '00000000-0000-0000-0000-000000000002';

export function ReviewForm() {
  const [rating, setRating] = useState(4.5);
  const [notes, setNotes] = useState('Spiced caramel and orchard fruit with a warming finish.');
  const [tags, setTags] = useState('caramel, apple');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const payload: ReviewRequest = {
      userId: defaultUser,
      bottleId: defaultBottle,
      rating,
      notes,
      visibility: 'public',
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      imageUrls: imageUrl ? [imageUrl] : []
    };

    try {
      await submitReview(payload);
      setStatus('Review submitted! Refresh the feed to see it.');
    } catch (err) {
      setStatus(`Could not submit review: ${(err as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2 className="section-title">Quick review</h2>
      <p className="section-subtitle">Post a note with tags and an optional image URL.</p>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label>
          Rating
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
          />
        </label>
        <label>
          Tasting notes
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <label>
          Tags (comma separated)
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="vanilla, spice, cherry" />
        </label>
        <label>
          Image URL (optional)
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Submit review'}
          </button>
          {status && <span>{status}</span>}
        </div>
      </form>
    </section>
  );
}
