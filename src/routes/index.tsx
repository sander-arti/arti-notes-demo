import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';

// Public pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import FeaturesPage from '@/pages/FeaturesPage';
import PricingPage from '@/pages/PricingPage';
import EnterprisePage from '@/pages/EnterprisePage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import DocsPage from '@/pages/DocsPage';

// Authenticated pages
import DashboardPage from '@/pages/DashboardPage';
import MeetingDetailsPage from '@/pages/MeetingDetailsPage';
import SettingsPage from '@/pages/SettingsPage';
import TemplatesPage from '@/pages/TemplatesPage';
import OrganizationPage from '@/pages/OrganizationPage';
import SupportPage from '@/pages/SupportPage';

// Legal pages
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UsersPage from '@/pages/admin/UsersPage';
import AnalyticsDashboard from '@/pages/admin/AnalyticsDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public routes
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'features', element: <FeaturesPage /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'enterprise', element: <EnterprisePage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'docs', element: <DocsPage /> },

      // Legal routes
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },

      // Authenticated routes
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'meetings/:id', element: <MeetingDetailsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'organization', element: <OrganizationPage /> },
      { path: 'support', element: <SupportPage /> },

      // Admin routes
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'admin/users', element: <UsersPage /> },
      { path: 'admin/analytics', element: <AnalyticsDashboard /> },
    ],
  },
]);
