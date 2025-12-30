import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CatalogPage } from './pages/CatalogPage';
import { CellarPage } from './pages/CellarPage';
import { CreateReviewPage } from './pages/CreateReviewPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReviewsPage } from './pages/ReviewsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SignupPage } from './pages/SignupPage';
import { BottleDetailPage } from './pages/BottleDetailPage';

// Routing table:
// /                -> Landing page with previews
// /discover        -> Trending / Top Rated / Best Value lists
// /catalog         -> Bottle search and filters
// /bottles/:id     -> Bottle detail with reviews
// /reviews         -> Recent review feed
// /reviews/new     -> Create review (protected)
// /profile/:username -> Public profile
// /cellar          -> User inventory (protected)
// /settings        -> Account settings (protected)
// /auth/signup     -> Sign up
// /auth/login      -> Login
export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="bottles/:id" element={<BottleDetailPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route
          path="reviews/new"
          element={
            <ProtectedRoute>
              <CreateReviewPage />
            </ProtectedRoute>
          }
        />
        <Route path="profile/:username" element={<ProfilePage />} />
        <Route
          path="cellar"
          element={
            <ProtectedRoute>
              <CellarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/signup" element={<SignupPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
