import { useState, useEffect } from 'react';
import {
  Users as UsersIcon,
  Search,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Mail,
  User
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { cn } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/Pagination';

const USERS_PER_PAGE = 50;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: number;
}

interface UserGrowthData {
  dates: string[];
  newUsers: number[];
  totalUsers: number[];
}

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  recordings_count: number;
  file_storage: number;
  transcription_storage: number;
}

// Mock data
const mockStats: UserStats = {
  totalUsers: 247,
  activeUsers: 189,
  newUsers: 34,
  userGrowth: 12.5
};

const mockUsers: UserData[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  email: `bruker${i + 1}@example.com`,
  created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  last_sign_in_at: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
  recordings_count: Math.floor(Math.random() * 50),
  file_storage: Math.floor(Math.random() * 500 * 1024 * 1024),
  transcription_storage: Math.floor(Math.random() * 10 * 1024 * 1024)
}));

const generateMockGrowthData = (months: number): UserGrowthData => {
  const dates: string[] = [];
  const newUsers: number[] = [];
  const totalUsers: number[] = [];
  let total = 150;

  for (let i = months * 4; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i * 7);
    dates.push(date.toLocaleDateString('no', { day: 'numeric', month: 'short' }));
    const newCount = Math.floor(Math.random() * 15) + 5;
    newUsers.push(newCount);
    total += newCount;
    totalUsers.push(total);
  }

  return { dates, newUsers, totalUsers };
};

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [growthData, setGrowthData] = useState<UserGrowthData | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<keyof UserData>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y'>('3m');

  useEffect(() => {
    setTimeout(() => {
      setStats(mockStats);
      setUsers(mockUsers);
      setGrowthData(generateMockGrowthData(timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12));
      setIsLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    setGrowthData(generateMockGrowthData(timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : 12));
  }, [timeRange]);

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('no', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBytes = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase() || '')
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const toggleSort = (key: keyof UserData) => {
    if (sortBy === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('desc');
    }
  };

  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return sortedUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  };

  const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Brukere</h1>
          <div className="flex items-center space-x-2">
            {(['3m', '6m', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  timeRange === range
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {range === '3m' ? 'Siste 3 mnd' :
                 range === '6m' ? 'Siste 6 mnd' :
                 'Siste år'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Totalt antall brukere</p>
                <p className="text-2xl font-semibold">{stats?.totalUsers || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Aktive brukere (30d)</p>
                <p className="text-2xl font-semibold">{stats?.activeUsers || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nye brukere (30d)</p>
                <p className="text-2xl font-semibold">{stats?.newUsers || 0}</p>
                <div className="flex items-center mt-2">
                  {stats?.userGrowth && stats.userGrowth > 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 ml-1">
                        {stats.userGrowth.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600 ml-1">
                        {Math.abs(stats?.userGrowth || 0).toFixed(1)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Gjennomsnittlig aktivitet</p>
                <p className="text-2xl font-semibold">
                  {stats?.totalUsers ? (
                    ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) + '%'
                  ) : '0%'}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Brukervekst</h3>
          <div className="h-[300px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : growthData && (
              <Line
                data={{
                  labels: growthData.dates,
                  datasets: [{
                    label: 'Nye brukere',
                    data: growthData.newUsers,
                    borderColor: 'rgb(124, 58, 237)',
                    borderWidth: 2,
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    fill: true,
                    tension: 0.4
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true },
                    x: { grid: { display: false } }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* User List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Søk etter brukere..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => toggleSort('email')}>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      E-post
                      {sortBy === 'email' && (sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => toggleSort('created_at')}>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Registrert
                      {sortBy === 'created_at' && (sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />)}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer" onClick={() => toggleSort('last_sign_in_at')}>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Sist aktiv
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Opptak</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Lagring</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    </td>
                  </tr>
                ) : (
                  getCurrentPageUsers().map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.last_sign_in_at)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.recordings_count}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatBytes(user.file_storage)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
