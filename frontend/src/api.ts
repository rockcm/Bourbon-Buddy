import { Bottle, DiscoverResponse, ReviewRequest, ReviewResponse } from './types';

// During development we proxy `/api` to the backend (see vite.config.ts).
// Use `VITE_API_BASE_URL` to override in production or non-proxied setups.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }
  return response.json() as Promise<T>;
}

export async function fetchBottles(search?: string, category?: string): Promise<Bottle[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  params.set('limit', '24');

  const res = await fetch(`${API_BASE_URL}/bottles?${params.toString()}`);
  return handle<Bottle[]>(res);
}

export async function fetchDiscover(): Promise<DiscoverResponse> {
  const res = await fetch(`${API_BASE_URL}/discover`);
  return handle<DiscoverResponse>(res);
}

export async function fetchRecentReviews(): Promise<ReviewResponse[]> {
  const res = await fetch(`${API_BASE_URL}/reviews?limit=12`);
  return handle<ReviewResponse[]>(res);
}

export async function submitReview(payload: ReviewRequest): Promise<ReviewResponse> {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handle<ReviewResponse>(res);
}

export const apiBaseUrl = API_BASE_URL;
