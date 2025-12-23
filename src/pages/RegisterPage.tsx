import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    acceptTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email.trim()) {
      setError('Vennligst skriv inn en e-postadresse');
      return;
    }

    if (formData.password.length < 6) {
      setError('Passordet må være minst 6 tegn');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passordene matcher ikke');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Du må akseptere vilkårene');
      return;
    }

    setIsLoading(true);

    try {
      const { requiresEmailConfirmation } = await register(formData.email, formData.password);
      
      if (requiresEmailConfirmation) {
        setEmailSent(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'En feil oppstod under registrering');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <main className="min-h-screen pt-16">
        <div className="max-w-md mx-auto p-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 rounded-xl bg-green-100 mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Sjekk e-posten din</h1>
            <p className="text-gray-600">
              Vi har sendt en bekreftelseslenke til {formData.email}. 
              Klikk på lenken for å aktivere kontoen din.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16">
      <div className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Opprett konto</h1>
          <p className="text-gray-600">Start din 14-dagers gratis prøveperiode</p>
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
                placeholder="din@epost.no"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                Organisasjon (valgfritt)
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Bekreft passord
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                Jeg aksepterer{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                  vilkårene
                </Link>{' '}
                og{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                  personvernerklæringen
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Oppretter konto...
                </div>
              ) : (
                <>
                  Start prøveperiode
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Har du allerede en konto?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Logg inn her
          </Link>
        </p>
      </div>
    </main>
  );
}