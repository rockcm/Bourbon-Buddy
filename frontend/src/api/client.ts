import { AuthTokens, Bottle, BottleDetail, DiscoverResponse, ReviewRequest, ReviewResponse, UserProfile } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

type TokenGetter = () => AuthTokens | null;
type TokenSetter = (tokens: AuthTokens | null) => void;

let getTokens: TokenGetter = () => null;
let setTokens: TokenSetter = () => undefined;

export function registerAuthTokens(getter: TokenGetter, setter: TokenSetter) {
  getTokens = getter;
  setTokens = setter;
}

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }
  if (response.status === 204) {
    // @ts-expect-error deliberate empty response
    return null;
  }
  return response.json() as Promise<T>;
}

async function refreshTokens(): Promise<AuthTokens | null> {
  const tokens = getTokens();
  if (!tokens?.refreshToken) return null;

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: tokens.refreshToken })
  });

  if (!res.ok) {
    setTokens(null);
    return null;
  }

  const refreshed = await handle<AuthTokens>(res);
  setTokens(refreshed);
  return refreshed;
}

async function apiFetch<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const tokens = getTokens();
  const headers = new Headers(options.headers ?? {});
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept', 'application/json');
  if (tokens?.accessToken) {
    headers.set('Authorization', `Bearer ${tokens.accessToken}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const refreshed = await refreshTokens();
    if (refreshed?.accessToken) {
      return apiFetch<T>(path, options, false);
    }
  }

  return handle<T>(res);
}

export async function fetchBottles(search?: string, category?: string): Promise<Bottle[]> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);
  params.set('limit', '24');

  return apiFetch(`/bottles?${params.toString()}`);
}

export async function fetchBottle(id: string): Promise<BottleDetail> {
  return apiFetch(`/bottles/${id}`);
}

export async function fetchDiscover(): Promise<DiscoverResponse> {
  return apiFetch('/discover');
}

export async function fetchRecentReviews(): Promise<ReviewResponse[]> {
  return apiFetch('/reviews?limit=20');
}

export async function fetchBottleReviews(bottleId: string): Promise<ReviewResponse[]> {
  return apiFetch(`/reviews?bottleId=${bottleId}&limit=20`);
}

export async function submitReview(payload: ReviewRequest): Promise<ReviewResponse> {
  return apiFetch('/reviews', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function uploadImages(files: FileList): Promise<string[]> {
  const form = new FormData();
  Array.from(files).forEach((file) => form.append('files', file));

  return apiFetch('/uploads', {
    method: 'POST',
    body: form,
    headers: {}
  });
}

export async function signup(username: string, email: string, password: string, displayName?: string) {
  return apiFetch<{ user: UserProfile; tokens: AuthTokens }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, email, password, displayName })
  });
}

export async function login(usernameOrEmail: string, password: string) {
  return apiFetch<{ user: UserProfile; tokens: AuthTokens }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usernameOrEmail, password })
  });
}

export async function logout(refreshToken: string) {
  return apiFetch('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  });
}

export async function getMe(): Promise<UserProfile> {
  return apiFetch('/auth/me');
}

export async function fetchUserProfile(username: string): Promise<UserProfile> {
  return apiFetch(`/users/by-username/${username}`);
}

export const apiBaseUrl = API_BASE_URL;
