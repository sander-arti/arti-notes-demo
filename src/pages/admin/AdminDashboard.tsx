import { useState, useEffect } from 'react';
import {
  Users,
  HardDrive,
  Clock,
  Database
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { AdminStats } from '@/types/admin';

const mockStats: AdminStats = {
  totalUsers: 247,
  activeUsers: 189,
  totalRecordings: 1523,
  storageUsed: 48318382080, // 45 GB in bytes
  recentActivity: [
    {
      id: '1',
      type: 'user_created',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      details: 'Ny bruker registrert: john.doe@example.com'
    },
    {
      id: '2',
      type: 'recording_uploaded',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      details: 'Opptak lastet opp: Kvartalsgjennomgang Q4'
    },
    {
      id: '3',
      type: 'transcription_completed',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      details: 'Transkripsjon fullført for: Styremøte 2024'
    },
    {
      id: '4',
      type: 'user_created',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      details: 'Ny bruker registrert: maria.hansen@example.com'
    },
    {
      id: '5',
      type: 'recording_uploaded',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      details: 'Opptak lastet opp: Prosjektplanlegging 2025'
    }
  ]
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler kort loading for realistisk UX
    setTimeout(() => {
      setStats(mockStats);
      setIsLoading(false);
    }, 300);
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold">{stats?.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold">{stats?.activeUsers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Recordings</p>
                <p className="text-2xl font-semibold">{stats?.totalRecordings}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <HardDrive className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-semibold">
                  {Math.round((stats?.storageUsed || 0) / 1024 / 1024 / 1024)} GB
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Database className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats?.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      {activity.details}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
