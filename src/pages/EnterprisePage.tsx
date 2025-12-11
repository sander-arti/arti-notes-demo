import { Link } from 'react-router-dom';
import { 
  Building, 
  Shield, 
  Users, 
  Settings, 
  ArrowRight, 
  CheckCircle,
  Server,
  Lock,
  Headphones,
  Zap
} from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Enterprise-grade sikkerhet',
    description: 'End-to-end kryptering, SSO, og avanserte sikkerhetsinnstillinger.'
  },
  {
    icon: Settings,
    title: 'Skreddersydd oppsett',
    description: 'Tilpass løsningen etter deres unike behov og arbeidsflyt.'
  },
  {
    icon: Server,
    title: 'On-premise eller privat sky',
    description: 'Velg mellom on-premise installasjon eller dedikert skyløsning.'
  },
  {
    icon: Users,
    title: 'Ubegrenset med brukere',
    description: 'Skaler opp eller ned etter behov uten ekstra kostnad per bruker.'
  }
];

const features = [
  'Dedikert teknisk kontaktperson',
  'Garantert oppetid med SLA',
  'Prioritert support 24/7',
  'Egen AI-modell trent på deres data',
  'Tilpassede integrasjoner',
  'Avansert brukeradministrasjon',
  'Egendefinerte eksportformater',
  'Revisjonslogg og compliance-rapporter'
];

export default function EnterprisePage() {
  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-violet-100 mb-8">
              <Building className="h-4 w-4 text-violet-600 mr-2" />
              <span className="text-sm font-medium text-violet-600">Enterprise</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              <span className="gradient-text">Skreddersydd for store organisasjoner</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              En komplett løsning som møter de høyeste krav til sikkerhet, 
              skalerbarhet og tilpasning.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact" className="button-primary">
                Kontakt salg
              </Link>
              <button className="button-secondary inline-flex items-center">
                <span>Se demo</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon mb-6">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Alt du trenger for å lykkes</h2>
            <p className="text-xl text-gray-600">
              Komplette løsninger for virksomheter som setter høye krav
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card flex items-start p-6">
                <CheckCircle className="h-5 w-5 text-violet-600 mr-3 flex-shrink-0 mt-1" />
                <span className="text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Dedikert støtte på alle nivåer
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Fra implementering til daglig drift - vi er her for å sikre deres suksess.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="feature-icon mr-4">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">24/7 Prioritert Support</h3>
                    <p className="text-gray-600">
                      Dedikert supportteam med garantert responstid
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="feature-icon mr-4">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Smidig Implementering</h3>
                    <p className="text-gray-600">
                      Full støtte under oppstart og implementering
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="feature-icon mr-4">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Sikkerhetskonsultasjon</h3>
                    <p className="text-gray-600">
                      Ekspertrådgivning for optimal sikkerhetskonfigurasjon
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1">
                <div className="h-full w-full rounded-xl bg-white p-8">
                  <h3 className="text-2xl font-bold mb-6">La oss diskutere deres behov</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Navn
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-violet-500 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrift
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-violet-500 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-post
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-violet-500 focus:ring-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Melding
                      </label>
                      <textarea
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-violet-500 focus:ring-violet-500"
                      />
                    </div>
                    <button type="submit" className="button-primary w-full">
                      Send forespørsel
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}