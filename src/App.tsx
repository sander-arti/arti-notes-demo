import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext';
import { FolderProvider } from '@/contexts/FolderContext';
import { AdminProvider } from '@/contexts/AdminContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedAdminRoute from '@/components/admin/ProtectedAdminRoute';
import ScrollToTop from '@/components/ScrollToTop';
import UsersPage from '@/pages/admin/UsersPage';
import AnalyticsDashboard from '@/pages/admin/AnalyticsDashboard';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import MeetingDetailsPage from './pages/MeetingDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import EnterprisePage from './pages/EnterprisePage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import DocsPage from './pages/DocsPage';
import ContactPage from './pages/ContactPage';

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="admin" element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="admin/users" element={
            <ProtectedAdminRoute>
              <UsersPage />
            </ProtectedAdminRoute>
          } />
          <Route path="admin/analytics" element={
            <ProtectedAdminRoute>
              <AnalyticsDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="meetings/:id" element={<MeetingDetailsPage />} />
          <Route path="settings" element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="enterprise" element={<EnterprisePage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <FolderProvider>
          <AdminProvider>
            <ScrollToTop />
            <AppRoutes />
          </AdminProvider>
        </FolderProvider>
      </AuthProvider>
    </Router>
  );
}
