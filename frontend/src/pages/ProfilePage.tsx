import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserProfile } from '../api/client';
import { UserProfile } from '../types';

const fallbackProfile: UserProfile = {
  id: 'sample-user',
  username: 'whiskey_gazer',
  email: 'demo@example.com',
  displayName: 'Whiskey Gazer',
  bio: 'Lover of single malts and craft bourbon.',
  avatarUrl: undefined,
  followers: 12,
  following: 8,
  reviews: 4,
  cellarCount: 10
};

export function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!username) return;
      try {
        setProfile(await fetchUserProfile(username));
      } catch (err) {
        setError((err as Error).message);
        setProfile(fallbackProfile);
      }
    }
    load();
  }, [username]);

  if (!profile) return <div className="card">Loading profile...</div>;

  return (
    <section>
      <h2 className="section-title">@{profile.username}</h2>
      {error && <div style={{ color: '#b91c1c' }}>Using sample profile: {error}</div>}
      <p className="section-subtitle">{profile.displayName}</p>
      <p>{profile.bio}</p>
      <div className="metrics">
        <span className="metric">Followers: {profile.followers}</span>
        <span className="metric">Following: {profile.following}</span>
        <span className="metric">Reviews: {profile.reviews}</span>
        <span className="metric">Cellar: {profile.cellarCount}</span>
      </div>
    </section>
  );
}
