export interface AdminUser {
  id: string;
  email: string;
  name: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRecordings: number;
  storageUsed: number;
  recentActivity: Array<{
    id: string;
    type: 'user_created' | 'recording_uploaded' | 'transcription_completed';
    timestamp: string;
    details: string;
  }>;
}