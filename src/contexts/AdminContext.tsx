import { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminState, setAdminState] = useState<AdminContextType>({
    isAdmin: false,
    isLoading: true
  });

  useEffect(() => {
    // Demo mode - alltid admin tilgang
    setTimeout(() => {
      setAdminState({ isAdmin: true, isLoading: false });
    }, 200);
  }, []);

  return (
    <AdminContext.Provider value={adminState}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
