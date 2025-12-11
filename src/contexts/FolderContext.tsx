import { createContext, useContext, useState, useEffect } from 'react';
import { mockFolders } from '@/lib/mockData';

export interface Folder {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface FolderContextType {
  folders: Folder[];
  isLoading: boolean;
  error: string | null;
  addFolder: (name: string) => Promise<void>;
  removeFolder: (id: string) => Promise<void>;
  updateFolder: (id: string, name: string) => Promise<void>;
}

const FolderContext = createContext<FolderContextType | null>(null);

export function FolderProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // Last inn mock-mapper ved oppstart
  useEffect(() => {
    // Simuler kort loading for realistisk UX
    setTimeout(() => {
      setFolders(mockFolders);
      setIsLoading(false);
    }, 300);
  }, []);

  // Mock addFolder - kun lokal state
  const addFolder = async (name: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setFolders(prev => [...prev, newFolder]);
  };

  // Mock removeFolder - kun lokal state
  const removeFolder = async (id: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
  };

  // Mock updateFolder - kun lokal state
  const updateFolder = async (id: string, name: string) => {
    setFolders(prev => prev.map(folder =>
      folder.id === id ? { ...folder, name, updated_at: new Date().toISOString() } : folder
    ));
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        isLoading,
        error,
        addFolder,
        removeFolder,
        updateFolder
      }}
    >
      {children}
    </FolderContext.Provider>
  );
}

export function useFolders() {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error('useFolders must be used within a FolderProvider');
  }
  return context;
}
