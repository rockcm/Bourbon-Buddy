export function TagChips({ tags }: { tags: string[] }) {
  if (!tags?.length) return null;
  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <span key={tag} className="tag">
          {tag}
        </span>
      ))}
    </div>
  );
}
