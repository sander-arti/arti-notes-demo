import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type DemoUserMode = 'solo' | 'member' | 'admin';

interface DemoUserContextType {
  mode: DemoUserMode;
  setMode: (mode: DemoUserMode) => void;
  isSolo: boolean;
  isMember: boolean;
  isAdmin: boolean;
  isInOrganization: boolean;
  // Legacy support - keeping for backwards compatibility
  currentUserId: string;
  toggleUser: () => void;
}

// Mock user data for each mode
export const mockDemoUsers = {
  solo: {
    id: 'user-solo',
    name: 'Solo Bruker',
    email: 'solo@notably.no',
    organization: null,
    plan: 'pro'
  },
  member: {
    id: 'user-2',
    name: 'Anna Hansen',
    email: 'anna@notably.no',
    organizationRole: 'member'
  },
  admin: {
    id: 'user-1',
    name: 'Demo Bruker',
    email: 'demo@notably.no',
    organizationRole: 'admin'
  }
};

const DemoUserContext = createContext<DemoUserContextType | undefined>(undefined);

export function DemoUserProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<DemoUserMode>('admin');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notably-demo-mode') as DemoUserMode;
    if (saved && ['solo', 'member', 'admin'].includes(saved)) {
      setModeState(saved);
    }
  }, []);

  const setMode = (newMode: DemoUserMode) => {
    setModeState(newMode);
    localStorage.setItem('notably-demo-mode', newMode);
  };

  // Legacy toggle function - cycles through modes
  const toggleUser = () => {
    const modes: DemoUserMode[] = ['solo', 'member', 'admin'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  // Computed properties
  const isSolo = mode === 'solo';
  const isMember = mode === 'member';
  const isAdmin = mode === 'admin';
  const isInOrganization = mode === 'member' || mode === 'admin';

  // Legacy currentUserId for backwards compatibility
  const currentUserId = mockDemoUsers[mode].id;

  return (
    <DemoUserContext.Provider value={{
      mode,
      setMode,
      isSolo,
      isMember,
      isAdmin,
      isInOrganization,
      currentUserId,
      toggleUser
    }}>
      {children}
    </DemoUserContext.Provider>
  );
}

export function useDemoUser() {
  const context = useContext(DemoUserContext);
  if (!context) {
    throw new Error('useDemoUser must be used within DemoUserProvider');
  }
  return context;
}
