import { Link } from 'react-router-dom';
import { ChevronLeft, FileText, CheckCircle, XCircle, AlertTriangle, CreditCard, Scale, Mail } from 'lucide-react';

const sections = [
  {
    id: 'aksept',
    title: 'Aksept av vilkår',
    icon: CheckCircle,
    content: `Ved å registrere deg for eller bruke Notably ("Tjenesten"), aksepterer du å være bundet av disse vilkårene for bruk ("Vilkårene"). Hvis du ikke godtar Vilkårene, skal du ikke bruke Tjenesten.

Notably AS ("vi", "oss" eller "Notably") forbeholder seg retten til å oppdatere disse Vilkårene når som helst. Vi vil varsle deg om vesentlige endringer via e-post eller gjennom Tjenesten.`
  },
  {
    id: 'tjenesten',
    title: 'Beskrivelse av tjenesten',
    icon: FileText,
    content: `Notably er en tjeneste for møtetranskribering og -notater som tilbyr:

- **Lydopptak**: Opptak av møter direkte i appen eller opplasting av lydfiler
- **Transkribering**: Automatisk konvertering av tale til tekst ved hjelp av AI
- **Sammendrag**: AI-genererte sammendrag av møteinnhold
- **Organisering**: Mapper, etiketter og søkefunksjonalitet
- **Samarbeid**: Deling av opptak og notater med teammedlemmer

Tjenesten leveres "som den er" og vi garanterer ikke 100% nøyaktighet i transkripsjoner eller sammendrag.`
  },
  {
    id: 'brukerkonto',
    title: 'Brukerkonto og ansvar',
    icon: CheckCircle,
    content: `**Kontoregistrering**
Du må oppgi nøyaktig og fullstendig informasjon ved registrering. Du er ansvarlig for å holde kontoinformasjonen din oppdatert.

**Kontosikkerhet**
Du er ansvarlig for å beskytte passordet ditt og for all aktivitet som skjer under kontoen din. Varsle oss umiddelbart ved mistanke om uautorisert bruk.

**Aldersgrense**
Du må være minst 18 år for å bruke Tjenesten. Ved bruk på vegne av en organisasjon bekrefter du at du har fullmakt til å binde organisasjonen til disse Vilkårene.`
  },
  {
    id: 'akseptabel-bruk',
    title: 'Akseptabel bruk',
    icon: AlertTriangle,
    content: `Du samtykker til å ikke bruke Tjenesten til å:

- Bryte gjeldende lover eller forskrifter
- Ta opp samtaler uten samtykke fra alle deltakere der dette kreves
- Laste opp innhold som er ulovlig, støtende eller krenker andres rettigheter
- Forsøke å få uautorisert tilgang til systemer eller data
- Distribuere skadelig programvare eller spam
- Bruke Tjenesten til konkurranseanalyse eller reverse engineering
- Videresende eller selge tilgang til Tjenesten uten tillatelse

Brudd på disse reglene kan føre til umiddelbar suspensjon eller avslutning av kontoen din.`
  },
  {
    id: 'betaling',
    title: 'Betaling og abonnement',
    icon: CreditCard,
    content: `**Abonnementer**
Tjenesten tilbys i ulike abonnementsplaner. Priser og funksjoner for hver plan finnes på vår prisside.

**Fakturering**
Abonnementer faktureres på forskudd, månedlig eller årlig avhengig av valgt plan. Alle beløp er oppgitt i NOK og inkluderer MVA.

**Fornyelse**
Abonnementer fornyes automatisk med mindre du sier opp før fornyelsesdatoen.

**Refusjon**
Vi tilbyr 14 dagers angrerett for nye abonnementer. Etter denne perioden gis det normalt ikke refusjon for ubrukt tid.`
  },
  {
    id: 'immaterielle',
    title: 'Immaterielle rettigheter',
    icon: Scale,
    content: `**Vårt innhold**
Notably og tilhørende varemerker, logoer, design og programvare er vår eiendom og beskyttet av opphavsrett og andre immaterielle rettigheter.

**Ditt innhold**
Du beholder alle rettigheter til innhold du laster opp eller oppretter i Tjenesten. Ved å bruke Tjenesten gir du oss en begrenset lisens til å behandle innholdet ditt for å levere Tjenesten.

**Tilbakemeldinger**
Hvis du gir oss tilbakemeldinger eller forslag, kan vi fritt bruke disse uten kompensasjon til deg.`
  },
  {
    id: 'ansvarsbegrensning',
    title: 'Ansvarsbegrensning',
    icon: XCircle,
    content: `**Garantifraskrivelse**
Tjenesten leveres "som den er" uten garantier av noe slag. Vi garanterer ikke at Tjenesten vil være feilfri, sikker eller uavbrutt.

**Ansvarsbegrensning**
I den grad loven tillater det, er Notably ikke ansvarlig for indirekte tap, tapt fortjeneste, datatap eller andre følgeskader som oppstår ved bruk av Tjenesten.

**Maksimumsansvar**
Vårt samlede ansvar overfor deg er begrenset til det beløpet du har betalt for Tjenesten de siste 12 månedene.`
  },
  {
    id: 'oppsigelse',
    title: 'Oppsigelse',
    icon: XCircle,
    content: `**Din oppsigelse**
Du kan når som helst si opp kontoen din via innstillingene i Tjenesten. Ved oppsigelse beholdes dataene dine i 30 dager før permanent sletting.

**Vår oppsigelse**
Vi kan suspendere eller avslutte kontoen din umiddelbart ved brudd på Vilkårene, eller med 30 dagers varsel av andre årsaker.

**Etter oppsigelse**
Visse bestemmelser i disse Vilkårene fortsetter å gjelde etter oppsigelse, inkludert ansvarsbegrensninger og tvisteløsning.`
  },
  {
    id: 'kontakt',
    title: 'Kontakt',
    icon: Mail,
    content: `Har du spørsmål om disse vilkårene?

**E-post**: juridisk@notably.no
**Adresse**: Notably AS, Karl Johans gate 25, 0159 Oslo

**Lovvalg**: Disse Vilkårene er underlagt norsk lov.
**Verneting**: Eventuelle tvister skal avgjøres ved Oslo tingrett.`
  }
];

export default function TermsPage() {
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
              <FileText className="h-6 w-6 text-violet-600" />
            </div>
            <h1 className="text-3xl font-bold">Vilkår for bruk</h1>
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
          <p>Ved å bruke Notably godtar du disse vilkårene for bruk.</p>
          <p className="mt-2">
            Se også vår{' '}
            <Link to="/privacy" className="text-violet-600 hover:underline">
              personvernerklæring
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
