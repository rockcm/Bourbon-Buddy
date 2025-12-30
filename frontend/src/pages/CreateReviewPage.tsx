import { FormEvent, useMemo, useState } from 'react';
import { submitReview, uploadImages } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ReviewRequest } from '../types';

export function CreateReviewPage() {
  const { user } = useAuth();
  const [bottleId, setBottleId] = useState('');
  const [rating, setRating] = useState(4.2);
  const [notes, setNotes] = useState('Spiced caramel and orchard fruit with a warming finish.');
  const [tags, setTags] = useState('caramel, apple');
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const previews = useMemo(() => {
    if (!files) return [] as string[];
    return Array.from(files).map((file) => URL.createObjectURL(file));
  }, [files]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    setUploading(true);
    setStatus(null);

    try {
      let imageUrls: string[] = [];
      if (files?.length) {
        imageUrls = await uploadImages(files);
      }

      const payload: ReviewRequest = {
        userId: user.id,
        bottleId,
        rating,
        notes,
        visibility: 'public',
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        imageUrls,
        noseRating: null,
        palateRating: null,
        mouthfeelRating: null,
        valueRating: null
      };

      await submitReview(payload);
      setStatus('Review submitted! Refresh the feed to see it.');
    } catch (err) {
      setStatus(`Could not submit review: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <section>
      <h2 className="section-title">Create review</h2>
      <p className="section-subtitle">Post a note with tags, optional ratings, and attach multiple photos.</p>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Bottle ID or slug
          <input value={bottleId} onChange={(e) => setBottleId(e.target.value)} placeholder="0000-..." required />
          <small style={{ color: '#64748b' }}>Paste a bottle id from the catalog for now.</small>
        </label>
        <label>
          Rating
          <input type="number" min={0} max={5} step={0.1} value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} />
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
          Photos
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
          {previews.length > 0 && (
            <div className="preview-grid">
              {previews.map((url) => (
                <img key={url} src={url} alt="preview" className="preview-thumb" />
              ))}
            </div>
          )}
        </label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <button className="button" type="submit" disabled={uploading || !user}>
            {uploading ? 'Saving...' : 'Submit review'}
          </button>
          {status && <span>{status}</span>}
        </div>
      </form>
    </section>
  );
}
