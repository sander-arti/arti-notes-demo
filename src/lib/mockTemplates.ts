export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'standard' | 'formal' | 'agile' | 'sales' | 'hr';
  sections: string[];
  isDefault?: boolean;
  isCustom?: boolean;
  icon: string;
}

export const mockTemplates: Template[] = [
  {
    id: 'template-1',
    name: 'Standard møtereferat',
    description: 'En enkel og allsidig mal for generelle møter',
    category: 'standard',
    sections: [
      'Møteinformasjon',
      'Deltakere',
      'Agenda',
      'Diskusjonspunkter',
      'Beslutninger',
      'Oppfølgingspunkter',
      'Neste møte'
    ],
    isDefault: true,
    icon: '📝'
  },
  {
    id: 'template-2',
    name: 'Styremøte',
    description: 'Formell mal for styremøter og generalforsamlinger',
    category: 'formal',
    sections: [
      'Møtets åpning',
      'Godkjenning av innkalling',
      'Godkjenning av protokoll fra forrige møte',
      'Saker til behandling',
      'Vedtak',
      'Eventuelt',
      'Møtets avslutning'
    ],
    icon: '🏛️'
  },
  {
    id: 'template-3',
    name: '1:1 Samtale',
    description: 'Mal for en-til-en samtaler mellom leder og medarbeider',
    category: 'hr',
    sections: [
      'Hvordan har du det?',
      'Fremgang siden sist',
      'Utfordringer',
      'Mål og prioriteringer',
      'Støtte du trenger',
      'Tilbakemeldinger',
      'Aksjoner'
    ],
    icon: '👥'
  },
  {
    id: 'template-4',
    name: 'Sprint Planning',
    description: 'Mal for planlegging av sprinter i agile team',
    category: 'agile',
    sections: [
      'Sprint mål',
      'Kapasitet',
      'Backlog gjennomgang',
      'Valgte user stories',
      'Estimater',
      'Avhengigheter',
      'Risiko'
    ],
    icon: '🏃'
  },
  {
    id: 'template-5',
    name: 'Sprint Retrospektiv',
    description: 'Mal for retrospektiv etter hver sprint',
    category: 'agile',
    sections: [
      'Hva gikk bra?',
      'Hva kan forbedres?',
      'Hva skal vi slutte med?',
      'Hva skal vi begynne med?',
      'Aksjoner for neste sprint',
      'Anerkjennelser'
    ],
    icon: '🔄'
  },
  {
    id: 'template-6',
    name: 'Salgsmøte',
    description: 'Mal for salgsmøter og kundeoppfølging',
    category: 'sales',
    sections: [
      'Kundeinfo',
      'Behov og utfordringer',
      'Presenterte løsninger',
      'Innvendinger',
      'Neste steg',
      'Tidslinje',
      'Oppfølgingspunkter'
    ],
    icon: '💼'
  },
  {
    id: 'template-7',
    name: 'Klientmøte',
    description: 'Mal for møter med eksterne klienter og partnere',
    category: 'sales',
    sections: [
      'Møtedeltakere',
      'Statusoppdatering',
      'Gjennomgang av leveranser',
      'Feedback',
      'Kommende milepæler',
      'Aksjoner',
      'Dato for neste møte'
    ],
    icon: '🤝'
  },
  {
    id: 'template-8',
    name: 'Prosjektstatusmøte',
    description: 'Mal for ukentlige eller månedlige prosjektoppdateringer',
    category: 'standard',
    sections: [
      'Prosjektstatus',
      'Fullførte oppgaver',
      'Pågående arbeid',
      'Kommende milepæler',
      'Risiko og blokkere',
      'Ressursbehov',
      'Beslutninger trengs'
    ],
    icon: '📊'
  },
  {
    id: 'template-9',
    name: 'Intervju',
    description: 'Mal for jobbintervjuer og kandidatvurderinger',
    category: 'hr',
    sections: [
      'Kandidatinfo',
      'Bakgrunn og erfaring',
      'Tekniske ferdigheter',
      'Kulturell match',
      'Motivasjon',
      'Spørsmål fra kandidat',
      'Samlet vurdering',
      'Anbefaling'
    ],
    icon: '🎯'
  },
  {
    id: 'template-10',
    name: 'All-hands møte',
    description: 'Mal for fellesmøter med hele organisasjonen',
    category: 'formal',
    sections: [
      'Velkommen',
      'Bedriftsnyheter',
      'Avdelingsoppdateringer',
      'Viktige kunngjøringer',
      'Anerkjennelser',
      'Q&A',
      'Avslutning'
    ],
    icon: '🎤'
  }
];

export const templateCategories = [
  { id: 'all', name: 'Alle maler' },
  { id: 'standard', name: 'Standard' },
  { id: 'formal', name: 'Formelle' },
  { id: 'agile', name: 'Agile' },
  { id: 'sales', name: 'Salg' },
  { id: 'hr', name: 'HR' }
];

export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === 'all') return mockTemplates;
  return mockTemplates.filter(t => t.category === category);
};

export const getTemplateById = (id: string): Template | undefined => {
  return mockTemplates.find(t => t.id === id);
};
