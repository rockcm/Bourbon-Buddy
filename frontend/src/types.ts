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
  notes: string;
  visibility: string;
  tags: string[];
  imageUrls: string[];
};

export type ReviewResponse = {
  id: string;
  username: string;
  rating: number;
  notes: string;
  createdAt: string;
  tags: string[];
  imageUrls: string[];
};
