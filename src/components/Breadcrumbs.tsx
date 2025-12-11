import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbConfig {
  path: string;
  label: string;
  icon?: React.ElementType;
}

const breadcrumbConfigs: Record<string, BreadcrumbConfig> = {
  dashboard: {
    path: '/dashboard',
    label: 'Dashboard'
  },
  meetings: {
    path: '/meetings',
    label: 'Møter'
  },
  settings: {
    path: '/settings',
    label: 'Innstillinger'
  },
  admin: {
    path: '/admin',
    label: 'Admin'
  },
  'admin/users': {
    path: '/admin/users',
    label: 'Brukere'
  },
  'admin/analytics': {
    path: '/admin/analytics',
    label: 'Analyser'
  }
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on public pages
  if (pathSegments.length === 0 || !breadcrumbConfigs[pathSegments[0]]) {
    return null;
  }

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const config = breadcrumbConfigs[pathSegments.slice(0, index + 1).join('/')];

    if (!config) return null;

    const Icon = config.icon;

    return {
      path,
      label: config.label,
      icon: Icon,
      isLast: index === pathSegments.length - 1
    };
  }).filter((crumb): crumb is NonNullable<typeof crumb> => crumb !== null);

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
          )}
          {crumb.isLast ? (
            <span className="font-medium text-gray-900">
              {crumb.label}
            </span>
          ) : (
            <Link 
              to={crumb.path}
              className="text-gray-600 hover:text-violet-600 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}