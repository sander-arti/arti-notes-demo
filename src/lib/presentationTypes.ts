import {
  TrendingUp,
  PiggyBank,
  ClipboardList,
  FileText,
  GraduationCap,
  Lightbulb,
  LucideIcon
} from 'lucide-react';

export type PresentationType =
  | 'sales'
  | 'investor'
  | 'status'
  | 'summary'
  | 'training'
  | 'proposal';

export interface PresentationTypeConfig {
  id: PresentationType;
  name: string;
  description: string;
  icon: LucideIcon;
  defaultSlides: number;
  promptPrefix: string;
}

export interface PresentationOptions {
  type: PresentationType;
  language: 'no' | 'en';
  slideCount: number;
  includeParticipants: boolean;
  includeActionItems: boolean;
  includeTimeline: boolean;
  includeTranscription: boolean;
  customInstructions: string;
}

export interface GeneratedPresentation {
  id: string;
  url: string;
  title: string;
  slideCount: number;
  createdAt: string;
  type: PresentationType;
}

export const presentationTypes: PresentationTypeConfig[] = [
  {
    id: 'sales',
    name: 'Salgspresentasjon',
    description: 'Overbevisende presentasjon for kunder og prospects',
    icon: TrendingUp,
    defaultSlides: 8,
    promptPrefix: 'Create a compelling sales presentation that highlights key benefits and value propositions from this meeting:'
  },
  {
    id: 'investor',
    name: 'Investor pitch',
    description: 'Profesjonell pitch for investorer',
    icon: PiggyBank,
    defaultSlides: 10,
    promptPrefix: 'Create an investor pitch deck that emphasizes growth metrics, market opportunity, and key decisions from this meeting:'
  },
  {
    id: 'status',
    name: 'Statusrapport',
    description: 'Prosjektstatus og fremdrift',
    icon: ClipboardList,
    defaultSlides: 6,
    promptPrefix: 'Create a status report presentation summarizing progress, blockers, and next steps from this meeting:'
  },
  {
    id: 'summary',
    name: 'Møtesammendrag',
    description: 'Oversiktlig sammendrag av møtet',
    icon: FileText,
    defaultSlides: 5,
    promptPrefix: 'Create a meeting summary presentation with key takeaways, decisions, and action items:'
  },
  {
    id: 'training',
    name: 'Opplæringsmateriale',
    description: 'Pedagogisk presentasjon',
    icon: GraduationCap,
    defaultSlides: 12,
    promptPrefix: 'Create educational training material that explains concepts and processes discussed in this meeting:'
  },
  {
    id: 'proposal',
    name: 'Prosjektforslag',
    description: 'Forslag til nytt prosjekt eller initiativ',
    icon: Lightbulb,
    defaultSlides: 8,
    promptPrefix: 'Create a project proposal presentation outlining objectives, approach, and expected outcomes from this meeting:'
  }
];

export const slideCountOptions = [5, 6, 7, 8, 10, 12, 15];

export const languageOptions = [
  { value: 'no' as const, label: 'Norsk' },
  { value: 'en' as const, label: 'English' }
];

// Mock Gamma API generator (frontend-only simulation)
export const mockGeneratePresentation = async (
  options: PresentationOptions,
  meetingData: { id: string; title: string; summary: string }
): Promise<GeneratedPresentation> => {
  // Simulate processing time (3-5 seconds)
  await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

  // Simulate occasional errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Kunne ikke generere presentasjon. Vennligst prøv igjen.');
  }

  const typeConfig = presentationTypes.find(t => t.id === options.type);
  const typeName = typeConfig?.name || 'Presentasjon';

  return {
    id: `pres-${Date.now()}`,
    url: `https://gamma.app/docs/notably-${meetingData.id}-${Date.now()}`,
    title: `${typeName} - ${meetingData.title}`,
    slideCount: options.slideCount,
    createdAt: new Date().toISOString(),
    type: options.type
  };
};

// Progress steps for loading state
export const generationSteps = [
  { id: 'analyze', label: 'Analyserer møteinnhold' },
  { id: 'structure', label: 'Strukturerer innhold' },
  { id: 'generate', label: 'Genererer slides' },
  { id: 'finalize', label: 'Ferdigstiller design' }
];

// Default options
export const defaultPresentationOptions: PresentationOptions = {
  type: 'summary',
  language: 'no',
  slideCount: 8,
  includeParticipants: true,
  includeActionItems: true,
  includeTimeline: false,
  includeTranscription: false,
  customInstructions: ''
};
