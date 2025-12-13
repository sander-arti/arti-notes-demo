import { Link } from 'react-router-dom';
import { ChevronLeft, Shield, Lock, Eye, Server, Trash2, Mail } from 'lucide-react';

const sections = [
  {
    id: 'innledning',
    title: 'Innledning',
    icon: Shield,
    content: `Notably AS ("vi", "oss" eller "vår") er opptatt av å beskytte personvernet ditt. Denne personvernerklæringen forklarer hvordan vi samler inn, bruker, deler og beskytter informasjon om deg når du bruker vår tjeneste for møtetranskribering og -notater.`
  },
  {
    id: 'data-vi-samler',
    title: 'Data vi samler inn',
    icon: Eye,
    content: `Vi samler inn følgende typer informasjon:

**Kontoinformasjon**
- E-postadresse
- Navn
- Organisasjonsnavn (valgfritt)
- Passord (kryptert)

**Møtedata**
- Lydopptak av møter
- Transkripsjoner generert fra lydopptak
- AI-genererte sammendrag og notater
- Møtetitler og metadata

**Teknisk informasjon**
- IP-adresse
- Nettlesertype og versjon
- Enhetsinformasjon
- Bruksmønstre og statistikk`
  },
  {
    id: 'hvordan-vi-bruker',
    title: 'Hvordan vi bruker dataene',
    icon: Server,
    content: `Vi bruker dataene dine til følgende formål:

- **Levere tjenesten**: Transkribere møter, generere sammendrag og lagre notatene dine
- **Forbedre tjenesten**: Analysere bruksmønstre for å forbedre brukeropplevelsen
- **Kommunikasjon**: Sende deg viktige oppdateringer om tjenesten
- **Sikkerhet**: Beskytte mot uautorisert tilgang og misbruk
- **Juridisk overholdelse**: Oppfylle lovpålagte krav`
  },
  {
    id: 'datalagring',
    title: 'Datalagring og sikkerhet',
    icon: Lock,
    content: `**Lagring**
Alle data lagres på sikre servere i EU/EØS-området. Vi bruker industristandarder for kryptering både under overføring (TLS 1.3) og ved lagring (AES-256).

**Sikkerhetstiltak**
- Ende-til-ende-kryptering av sensitive data
- Regelmessige sikkerhetsrevisjoner
- Tilgangskontroll basert på minste privilegium
- Automatisk logging av alle datatilganger

**Oppbevaringstid**
Vi oppbevarer dataene dine så lenge kontoen din er aktiv. Ved sletting av konto slettes alle dine data permanent innen 30 dager.`
  },
  {
    id: 'dine-rettigheter',
    title: 'Dine rettigheter',
    icon: Trash2,
    content: `I henhold til GDPR har du følgende rettigheter:

- **Innsyn**: Du kan be om en kopi av alle data vi har om deg
- **Retting**: Du kan korrigere unøyaktige opplysninger
- **Sletting**: Du kan be om at dataene dine slettes
- **Dataportabilitet**: Du kan eksportere dataene dine i et standard format
- **Begrensning**: Du kan be om begrenset behandling av dataene dine
- **Innsigelse**: Du kan protestere mot visse typer behandling

For å utøve disse rettighetene, kontakt oss på personvern@notably.no`
  },
  {
    id: 'kontakt',
    title: 'Kontakt oss',
    icon: Mail,
    content: `Har du spørsmål om personvern eller ønsker å utøve dine rettigheter?

**E-post**: personvern@notably.no
**Adresse**: Notably AS, Karl Johans gate 25, 0159 Oslo

**Behandlingsansvarlig**: Notably AS
**Organisasjonsnummer**: XXX XXX XXX`
  }
];

export default function PrivacyPage() {
  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tilbake
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Shield className="h-6 w-6 text-violet-600" />
            </div>
            <h1 className="text-3xl font-bold">Personvernerklæring</h1>
          </div>
          <p className="text-gray-600">
            Sist oppdatert: 1. desember 2024
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="font-semibold mb-4">Innholdsfortegnelse</h2>
          <nav className="space-y-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center text-gray-600 hover:text-violet-600 transition-colors"
              >
                <span className="text-violet-600 mr-2">{index + 1}.</span>
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="bg-white rounded-xl shadow-sm p-6 scroll-mt-24"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-violet-50 rounded-lg">
                  <section.icon className="h-5 w-5 text-violet-600" />
                </div>
                <h2 className="text-xl font-semibold">
                  {index + 1}. {section.title}
                </h2>
              </div>
              <div className="prose prose-gray max-w-none">
                {section.content.split('\n\n').map((paragraph, pIndex) => (
                  <div key={pIndex} className="mb-4">
                    {paragraph.split('\n').map((line, lIndex) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <h3 key={lIndex} className="font-semibold text-gray-900 mt-4 mb-2">
                            {line.replace(/\*\*/g, '')}
                          </h3>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <li key={lIndex} className="text-gray-600 ml-4">
                            {line.substring(2).replace(/\*\*/g, '')}
                          </li>
                        );
                      }
                      return (
                        <p key={lIndex} className="text-gray-600">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Ved å bruke Notably godtar du denne personvernerklæringen.</p>
          <p className="mt-2">
            Se også våre{' '}
            <Link to="/terms" className="text-violet-600 hover:underline">
              vilkår for bruk
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
