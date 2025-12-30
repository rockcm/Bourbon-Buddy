export type Bottle = {
  id: string;
  name: string;
  brand: string;
  category: string;
  abv?: number;
  ageYears?: number;
  region?: string;
  thumbnailUrl?: string;
  description?: string;
  categoryId?: string;
  averageRating?: number | null;
  reviewCount?: number;
};

export type BottleDetail = Bottle & {
  notes?: string;
  distillery?: string;
};

export type RankedBottle = {
  bottleId: string;
  name: string;
  brand: string;
  category: string;
  averageRating: number;
  reviewCount: number;
};

export type DiscoverResponse = {
  trending: RankedBottle[];
  topRated: RankedBottle[];
  bestValue: RankedBottle[];
};

export type ReviewRequest = {
  userId: string;
  bottleId: string;
  rating: number;
  noseRating?: number | null;
  palateRating?: number | null;
  mouthfeelRating?: number | null;
  valueRating?: number | null;
  notes: string;
  visibility: string;
  tags: string[];
  imageUrls: string[];
};

export type ReviewResponse = {
  id: string;
  userId?: string;
  bottleId?: string;
  username: string;
  rating: number;
  valueRating?: number | null;
  notes: string;
  createdAt: string;
  tags: string[];
  imageUrls: string[];
  visibility?: string;
  likeCount?: number;
  commentCount?: number;
};

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  followers: number;
  following: number;
  reviews: number;
  cellarCount: number;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
