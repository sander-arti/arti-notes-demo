export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar?: string;
  joinedAt: string;
  lastActive: string;
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: 'admin' | 'member';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  plan: 'starter' | 'business' | 'enterprise';
  members: OrganizationMember[];
  pendingInvitations: PendingInvitation[];
  sharedFolders: string[];
  createdAt: string;
  billingEmail: string;
  maxMembers: number;
}

export const mockOrganization: Organization = {
  id: 'org-1',
  name: 'Demo Organisasjon AS',
  logo: undefined,
  plan: 'business',
  createdAt: new Date('2024-01-15').toISOString(),
  billingEmail: 'faktura@demo-org.no',
  maxMembers: 25,
  members: [
    {
      id: 'user-1',
      name: 'Demo Bruker',
      email: 'demo@notably.no',
      role: 'admin',
      joinedAt: new Date('2024-01-15').toISOString(),
      lastActive: new Date().toISOString()
    },
    {
      id: 'user-2',
      name: 'Anna Hansen',
      email: 'anna.hansen@demo-org.no',
      role: 'member',
      joinedAt: new Date('2024-02-01').toISOString(),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'user-3',
      name: 'Erik Olsen',
      email: 'erik.olsen@demo-org.no',
      role: 'member',
      joinedAt: new Date('2024-03-10').toISOString(),
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'user-4',
      name: 'Maria Berg',
      email: 'maria.berg@demo-org.no',
      role: 'member',
      joinedAt: new Date('2024-04-05').toISOString(),
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'user-5',
      name: 'Thomas Lund',
      email: 'thomas.lund@demo-org.no',
      role: 'member',
      joinedAt: new Date('2024-05-20').toISOString(),
      lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  pendingInvitations: [
    {
      id: 'inv-1',
      email: 'ny.kollega@demo-org.no',
      role: 'member',
      invitedBy: 'Demo Bruker',
      invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  sharedFolders: ['folder-1', 'folder-3']
};

export const organizationPlans = [
  {
    id: 'starter',
    name: 'Starter',
    maxMembers: 5,
    price: 0,
    features: ['5 brukere', '10 timer opptak/mnd', 'Standard maler']
  },
  {
    id: 'business',
    name: 'Business',
    maxMembers: 25,
    price: 499,
    features: ['25 brukere', 'Ubegrenset opptak', 'Alle maler', 'Prioritert støtte']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    maxMembers: -1,
    price: -1,
    features: ['Ubegrensede brukere', 'Ubegrenset opptak', 'Egendefinerte maler', 'Dedikert support', 'SSO', 'API-tilgang']
  }
];

export const formatLastActive = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 5) return 'Aktiv nå';
  if (diffMins < 60) return `${diffMins} min siden`;
  if (diffHours < 24) return `${diffHours} timer siden`;
  if (diffDays === 1) return 'I går';
  if (diffDays < 7) return `${diffDays} dager siden`;
  return date.toLocaleDateString('no');
};
