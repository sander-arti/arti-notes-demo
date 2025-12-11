import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // Allow access in demo mode (no user)
  return <>{children}</>;
}