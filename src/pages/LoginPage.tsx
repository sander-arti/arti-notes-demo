import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mic, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email format
    if (!validateEmail(formData.email)) {
      setError('Vennligst skriv inn en gyldig e-postadresse');
      return;
    }

    // Validate password
    if (!formData.password) {
      setError('Vennligst skriv inn passordet ditt');
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError('Feil brukernavn eller passord');
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 mb-4">
            <Mic className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Velkommen tilbake</h1>
          <p className="text-gray-600">Logg inn for å fortsette til dashbordet</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-post
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="din@epost.no"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Passord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Husk meg</span>
              </label>

              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Glemt passord?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full flex items-center justify-center"
            >
              {isLoading ? 'Logger inn...' : 'Logg inn'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </button>
          </form>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-center text-sm text-gray-600">
            Har du ikke konto?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Start gratis prøveperiode
            </Link>
          </p>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">eller</span>
            </div>
          </div>

          <Link
            to="/dashboard"
            className="block w-full text-center px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
          >
            Se demo av dashbordet
          </Link>
        </div>
      </div>
    </main>
  );
}