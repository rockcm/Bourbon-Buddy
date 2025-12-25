# Bourbon Buddy frontend

A lightweight Vite + React interface for the Bourbon Buddy API. It exposes quick entry points for discovery, bottle search, and posting reviews.

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

By default the app targets `http://localhost:5000/api`. Override with `VITE_API_BASE_URL`:

```bash
VITE_API_BASE_URL=https://your-api.example.com/api npm run dev
```

## Features
- Discovery widgets for trending/top-rated/best-value bottles
- Bottle catalog search with category filter
- Recent review feed
- Quick review form that posts to `/api/reviews`
