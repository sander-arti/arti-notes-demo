import { Link } from 'react-router-dom';
import { Mic } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Funksjoner', to: '/features' },
    { name: 'Priser', to: '/pricing' },
    { name: 'API', to: '/api' },
    { name: 'Enterprise', to: '/enterprise' },
  ],
  company: [
    { name: 'Om oss', to: '/about' },
    { name: 'Blogg', to: '/blog' },
    { name: 'Karriere', to: '/careers' },
    { name: 'Kontakt', to: '/contact' },
  ],
  resources: [
    { name: 'Dokumentasjon', to: '/docs' },
    { name: 'Hjelp', to: '/help' },
    { name: 'Support', to: '/support' },
  ],
  legal: [
    { name: 'Personvern', to: '/privacy' },
    { name: 'Vilkår', to: '/terms' },
    { name: 'GDPR', to: '/gdpr' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <Mic className="h-8 w-8 text-violet-600" />
            <span className="text-xl font-medium tracking-tight">ARTI Notes</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Produkt</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Selskap</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Ressurser</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Juridisk</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-600 hover:text-gray-900">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200/50 pt-8">
          <p className="text-sm text-gray-600 text-center">
            © {new Date().getFullYear()} ARTI Notes av ARTI Consult. Alle rettigheter reservert.
          </p>
        </div>
      </div>
    </footer>
  );
}