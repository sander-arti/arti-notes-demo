import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  Building2,
  Users,
  UserPlus,
  Folder,
  Settings,
  Crown,
  User,
  Mail,
  MoreVertical,
  Trash2,
  Shield,
  Clock,
  X,
  Send,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { mockOrganization, formatLastActive, OrganizationMember } from '@/lib/mockOrganization';
import { mockFolders } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: 'admin' | 'member') => void;
}

function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onInvite(email, role);
      setEmail('');
      setRole('member');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <UserPlus className="h-5 w-5 text-violet-600" />
                </div>
                <h2 className="text-xl font-bold">Inviter nytt medlem</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-postadresse
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                  placeholder="kollega@firma.no"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rolle
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('member')}
                  className={cn(
                    "flex items-center p-3 rounded-lg border-2 transition-colors",
                    role === 'member'
                      ? "border-violet-600 bg-violet-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <User className={cn(
                    "h-5 w-5 mr-2",
                    role === 'member' ? "text-violet-600" : "text-gray-400"
                  )} />
                  <div className="text-left">
                    <div className={cn(
                      "font-medium",
                      role === 'member' ? "text-violet-900" : "text-gray-900"
                    )}>
                      Medlem
                    </div>
                    <div className="text-xs text-gray-500">Standard tilgang</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={cn(
                    "flex items-center p-3 rounded-lg border-2 transition-colors",
                    role === 'admin'
                      ? "border-violet-600 bg-violet-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <Shield className={cn(
                    "h-5 w-5 mr-2",
                    role === 'admin' ? "text-violet-600" : "text-gray-400"
                  )} />
                  <div className="text-left">
                    <div className={cn(
                      "font-medium",
                      role === 'admin' ? "text-violet-900" : "text-gray-900"
                    )}>
                      Administrator
                    </div>
                    <div className="text-xs text-gray-500">Full tilgang</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="button-secondary"
              >
                Avbryt
              </button>
              <button
                type="submit"
                className="button-primary inline-flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Send invitasjon
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface MemberCardProps {
  member: OrganizationMember;
  isCurrentUser: boolean;
  onRemove: () => void;
  onChangeRole: (role: 'admin' | 'member') => void;
}

function MemberCard({ member, isCurrentUser, onRemove, onChangeRole }: MemberCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
          {member.avatar ? (
            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
          ) : (
            <User className="h-5 w-5 text-violet-600" />
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{member.name}</span>
            {isCurrentUser && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                Deg
              </span>
            )}
            {member.role === 'admin' && (
              <Crown className="h-4 w-4 text-amber-500" />
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <span>{member.email}</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatLastActive(member.lastActive)}
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 rounded-lg"
          disabled={isCurrentUser}
        >
          <MoreVertical className={cn(
            "h-5 w-5",
            isCurrentUser ? "text-gray-300" : "text-gray-400"
          )} />
        </button>

        {showMenu && !isCurrentUser && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <button
              onClick={() => {
                onChangeRole(member.role === 'admin' ? 'member' : 'admin');
                setShowMenu(false);
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Shield className="h-4 w-4 mr-2" />
              {member.role === 'admin' ? 'Gjør til medlem' : 'Gjør til admin'}
            </button>
            <button
              onClick={() => {
                onRemove();
                setShowMenu(false);
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Fjern fra organisasjon
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrganizationPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [members, setMembers] = useState(mockOrganization.members);
  const [pendingInvitations, setPendingInvitations] = useState(mockOrganization.pendingInvitations);

  const currentUserId = 'user-1'; // Mock current user

  const handleInvite = (email: string, role: 'admin' | 'member') => {
    const newInvitation = {
      id: `inv-${Date.now()}`,
      email,
      role,
      invitedBy: 'Demo Bruker',
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    setPendingInvitations([...pendingInvitations, newInvitation]);
    toast.success(`Invitasjon sendt til ${email}`);
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
    toast.success('Medlem fjernet fra organisasjonen');
  };

  const handleChangeRole = (memberId: string, newRole: 'admin' | 'member') => {
    setMembers(members.map(m =>
      m.id === memberId ? { ...m, role: newRole } : m
    ));
    toast.success(`Rolle endret til ${newRole === 'admin' ? 'administrator' : 'medlem'}`);
  };

  const handleCancelInvitation = (invitationId: string) => {
    setPendingInvitations(pendingInvitations.filter(i => i.id !== invitationId));
    toast.success('Invitasjon kansellert');
  };

  const sharedFoldersList = mockFolders.filter(f =>
    mockOrganization.sharedFolders.includes(f.id)
  );

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tilbake til dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-violet-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-violet-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{mockOrganization.name}</h1>
                <p className="text-gray-600">
                  {members.length} medlemmer • {mockOrganization.plan.charAt(0).toUpperCase() + mockOrganization.plan.slice(1)} plan
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="button-primary inline-flex items-center"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Inviter medlem
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-violet-50 rounded-lg">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{members.length}</div>
                <div className="text-sm text-gray-600">Aktive medlemmer</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Mail className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingInvitations.length}</div>
                <div className="text-sm text-gray-600">Ventende invitasjoner</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Folder className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{sharedFoldersList.length}</div>
                <div className="text-sm text-gray-600">Delte mapper</div>
              </div>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-400" />
              Teammedlemmer
            </h2>
            <span className="text-sm text-gray-500">
              {members.length} / {mockOrganization.maxMembers} plasser brukt
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isCurrentUser={member.id === currentUserId}
                onRemove={() => handleRemoveMember(member.id)}
                onChangeRole={(role) => handleChangeRole(member.id, role)}
              />
            ))}
          </div>
        </div>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-400" />
                Ventende invitasjoner
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium">{invitation.email}</div>
                      <div className="text-sm text-gray-500">
                        Invitert av {invitation.invitedBy} • {invitation.role === 'admin' ? 'Administrator' : 'Medlem'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelInvitation(invitation.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Kanseller
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shared Folders */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold flex items-center">
              <Folder className="h-5 w-5 mr-2 text-gray-400" />
              Delte mapper
            </h2>
            <button
              onClick={() => toast.info('Administrer delte mapper fra dashboard')}
              className="text-sm text-violet-600 hover:text-violet-700"
            >
              Administrer
            </button>
          </div>
          <div className="p-4">
            {sharedFoldersList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sharedFoldersList.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Folder className="h-5 w-5 text-violet-600" />
                    <span>{folder.name}</span>
                    <Check className="h-4 w-4 text-green-500 ml-auto" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Ingen delte mapper ennå
              </p>
            )}
          </div>
        </div>

        {/* Organization Settings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-400" />
              Organisasjonsinnstillinger
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organisasjonsnavn
                </label>
                <input
                  type="text"
                  defaultValue={mockOrganization.name}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faktura e-post
                </label>
                <input
                  type="email"
                  defaultValue={mockOrganization.billingEmail}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => toast.success('Innstillinger lagret')}
                className="button-primary"
              >
                Lagre endringer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInvite}
      />
    </main>
  );
}
