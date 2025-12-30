import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthLayout } from './components/layout/AuthLayout';
import { AppLayout } from './components/layout/AppLayout';
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
import { AuthSplashPage } from './pages/AuthSplashPage';

// Routing table:
// /                     -> Login/Sign-up splash page
// /auth/login           -> Login form
// /auth/signup          -> Signup form
// /discover             -> Trending / Top Rated / Best Value lists (protected)
// /catalog              -> Bottle search and filters (protected)
// /home                 -> Landing overview for signed-in users (protected)
// /bottles/:id          -> Bottle detail with reviews (protected)
// /reviews              -> Recent review feed (protected)
// /reviews/new          -> Create review (protected)
// /profile/:username    -> Public profile (protected)
// /cellar               -> User inventory (protected)
// /settings             -> Account settings (protected)
export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<AuthSplashPage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/signup" element={<SignupPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="home" element={<HomePage />} />
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
        <Route path="cellar" element={<CellarPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/discover" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
