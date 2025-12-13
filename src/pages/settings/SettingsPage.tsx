import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  User,
  Settings as SettingsIcon,
  CreditCard,
  Users,
  Shield,
  Bell,
  Volume2,
  Globe,
  Clock,
  Lock,
  Download,
  Trash2,
  ExternalLink,
  Mail,
  Building,
  CheckCircle,
  Crown,
  MoreVertical,
  UserPlus,
  Folder,
  Check,
  X,
  Send,
  Plug,
  Calendar,
  MessageSquare,
  Zap,
  Key,
  Webhook,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Terminal,
  Bot,
  Mic,
  Languages,
  FileText,
  Sun,
  Moon,
  Sparkles,
  UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockUser, mockFolders } from '@/lib/mockData';
import { mockTemplates } from '@/lib/mockTemplates';
import { mockOrganization, formatLastActive, OrganizationMember } from '@/lib/mockOrganization';
import { useDemoUser, mockDemoUsers } from '@/contexts/DemoUserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from '@/components/ui/toast';
import ChangePasswordModal from '@/components/ChangePasswordModal';
import { motion, AnimatePresence } from 'framer-motion';

// Tab configuration
const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'preferences', label: 'Preferanser', icon: SettingsIcon },
  { id: 'billing', label: 'Abonnement', icon: CreditCard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'integrations', label: 'Integrasjoner', icon: Plug },
  { id: 'security', label: 'Sikkerhet', icon: Shield }
];

// Shared components
interface ToggleSettingProps {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleSetting({ icon: Icon, title, description, enabled, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-start space-x-3">
        <div className="p-1">
          <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          enabled ? "bg-violet-600" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

interface SelectSettingProps {
  icon: React.ElementType;
  title: string;
  description: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function SelectSetting({ icon: Icon, title, description, value, options, onChange }: SelectSettingProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
      <div className="flex items-start space-x-3">
        <div className="p-1">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:border-violet-500 focus:ring-violet-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Profile Tab
function ProfileTab() {
  const { mode, isSolo, isMember, isAdmin } = useDemoUser();
  const currentUserData = mockDemoUsers[mode];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white">Min profil</h2>
      </div>
      <div className="p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <div className={cn(
            "h-20 w-20 rounded-full flex items-center justify-center",
            isSolo && "bg-emerald-100 dark:bg-emerald-900/50",
            isMember && "bg-amber-100 dark:bg-amber-900/50",
            isAdmin && "bg-violet-100 dark:bg-violet-900/50"
          )}>
            {isSolo && <UserCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />}
            {isMember && <Users className="h-10 w-10 text-amber-600 dark:text-amber-400" />}
            {isAdmin && <User className="h-10 w-10 text-violet-600 dark:text-violet-400" />}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{currentUserData.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{currentUserData.email}</p>
            <button className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 mt-1">
              Endre profilbilde
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Navn
            </label>
            <input
              type="text"
              defaultValue={currentUserData.name}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              E-post
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={currentUserData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                />
              </div>
              <button className="px-4 py-2 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
                Endre
              </button>
            </div>
          </div>

          {/* Organization info - only for org users */}
          {!isSolo && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className={cn(
                "flex items-center space-x-3 p-4 rounded-lg",
                isAdmin ? "bg-violet-50 dark:bg-violet-900/30" : "bg-amber-50 dark:bg-amber-900/30"
              )}>
                <Building className={cn(
                  "h-5 w-5",
                  isAdmin ? "text-violet-600 dark:text-violet-400" : "text-amber-600 dark:text-amber-400"
                )} />
                <div>
                  <p className={cn(
                    "font-medium",
                    isAdmin ? "text-violet-900 dark:text-violet-200" : "text-amber-900 dark:text-amber-200"
                  )}>
                    {mockOrganization.name}
                  </p>
                  <p className={cn(
                    "text-sm",
                    isAdmin ? "text-violet-700 dark:text-violet-400" : "text-amber-700 dark:text-amber-400"
                  )}>
                    {isAdmin ? 'Administrator' : 'Medlem'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Create org CTA - only for Solo users */}
          {isSolo && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                    <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-emerald-900 dark:text-emerald-200">Samarbeid med teamet ditt</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                      Opprett en organisasjon for å dele møtenotater, maler og mapper med kollegene dine.
                    </p>
                    <button className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Opprett organisasjon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={() => toast.success('Profil oppdatert')}
            className="button-primary"
          >
            Lagre endringer
          </button>
        </div>
      </div>
    </div>
  );
}

// Styled Dropdown Component with Portal
interface StyledDropdownProps {
  value: string;
  options: { value: string; label: string; description?: string }[];
  onChange: (value: string) => void;
  icon?: React.ElementType;
}

function StyledDropdown({ value, options, onChange, icon: Icon }: StyledDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.value === value);

  // Update position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Close on page scroll (but not dropdown scroll)
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (e: Event) => {
      // Don't close if scrolling inside the dropdown
      if (dropdownRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 border rounded-xl transition-all text-left",
          isOpen
            ? "bg-white dark:bg-gray-700 border-violet-300 dark:border-violet-600 ring-2 ring-violet-100 dark:ring-violet-900/50 shadow-md"
            : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
        )}
      >
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className={cn(
              "p-1.5 rounded-lg shadow-sm transition-colors",
              isOpen ? "bg-violet-100 dark:bg-violet-900/50" : "bg-white dark:bg-gray-600"
            )}>
              <Icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
          )}
          <span className="font-medium text-gray-900 dark:text-white">{selectedOption?.label}</span>
        </div>
        <ChevronLeft className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen ? "rotate-90 text-violet-500" : "-rotate-90 text-gray-400 dark:text-gray-500"
        )} />
      </button>

      {/* Portal dropdown to body so it can overflow any parent container */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              width: position.width,
            }}
            className="z-[9999] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 max-h-80 overflow-y-auto scrollbar-thin"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className={cn(
                  "w-full flex items-center px-4 py-3 text-left transition-colors",
                  option.value === value
                    ? "bg-violet-50 dark:bg-violet-900/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                <div className="flex-1">
                  <span className={cn(
                    "font-medium",
                    option.value === value ? "text-violet-700 dark:text-violet-300" : "text-gray-900 dark:text-white"
                  )}>{option.label}</span>
                  {option.description && (
                    <p className={cn(
                      "text-xs mt-0.5",
                      option.value === value ? "text-violet-600/70 dark:text-violet-400/70" : "text-gray-500 dark:text-gray-400"
                    )}>{option.description}</p>
                  )}
                </div>
                {option.value === value && (
                  <div className="p-1 bg-violet-100 dark:bg-violet-900/50 rounded-full ml-3">
                    <Check className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                  </div>
                )}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

// Preferences Tab
function PreferencesTab() {
  // Recording settings
  const [autoRecord, setAutoRecord] = useState(true);
  const [defaultTemplate, setDefaultTemplate] = useState('template-1');
  const [defaultLanguage, setDefaultLanguage] = useState('auto');

  // Interface settings
  const [language, setLanguage] = useState('no');
  const [timezone, setTimezone] = useState('Europe/Oslo');
  const { theme, toggleTheme } = useTheme();

  // Notification settings
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const templateOptions = mockTemplates.map(t => ({
    value: t.id,
    label: t.name,
    description: t.description
  }));

  const meetingLanguageOptions = [
    { value: 'auto', label: 'Oppdag automatisk', description: 'Vi gjenkjenner språket fra samtalen' },
    { value: 'no', label: 'Norsk' },
    { value: 'en', label: 'English' },
    { value: 'sv', label: 'Svenska' },
    { value: 'da', label: 'Dansk' },
    { value: 'de', label: 'Deutsch' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' }
  ];

  const interfaceLanguageOptions = [
    { value: 'no', label: 'Norsk' },
    { value: 'en', label: 'English' }
  ];

  const timezoneOptions = [
    { value: 'Europe/Oslo', label: 'Oslo (CET/CEST)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Stockholm', label: 'Stockholm (CET/CEST)' },
    { value: 'Europe/Copenhagen', label: 'København (CET/CEST)' },
    { value: 'America/New_York', label: 'New York (EST/EDT)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
    { value: 'UTC', label: 'UTC' }
  ];

  return (
    <div className="space-y-6">
      {/* Recording Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/50 dark:to-fuchsia-900/50 rounded-xl">
              <Mic className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Opptak</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hvordan Notably håndterer møtene dine</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Auto-record toggle - redesigned as a card */}
          <div className="p-5 bg-gradient-to-r from-violet-50/50 to-fuchsia-50/50 dark:from-violet-900/30 dark:to-fuchsia-900/30 rounded-xl border border-violet-100 dark:border-violet-800">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Automatisk opptak</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notably deltar automatisk på møter fra kalenderen din og lager notater for deg.
                </p>
              </div>
              <button
                onClick={() => setAutoRecord(!autoRecord)}
                className={cn(
                  "relative inline-flex h-7 w-12 items-center rounded-full transition-colors shadow-inner",
                  autoRecord ? "bg-violet-600" : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform",
                    autoRecord ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Template selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Mal for notater</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Velg hvordan notatene dine skal struktureres</p>
              </div>
            </div>
            <StyledDropdown
              value={defaultTemplate}
              options={templateOptions}
              onChange={setDefaultTemplate}
              icon={FileText}
            />
          </div>

          {/* Language selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Språk i møter</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hvilket språk snakkes det i møtene dine?</p>
              </div>
            </div>
            <StyledDropdown
              value={defaultLanguage}
              options={meetingLanguageOptions}
              onChange={setDefaultLanguage}
              icon={Languages}
            />
          </div>
        </div>
      </div>

      {/* Interface Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-xl">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Visning</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tilpass hvordan appen ser ut for deg</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* App language */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Språk i appen</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Velg hvilket språk menyer og knapper vises på</p>
              </div>
            </div>
            <StyledDropdown
              value={language}
              options={interfaceLanguageOptions}
              onChange={setLanguage}
              icon={Languages}
            />
          </div>

          {/* Timezone */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Tidssone</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Påvirker når møter vises i kalenderen</p>
              </div>
            </div>
            <StyledDropdown
              value={timezone}
              options={timezoneOptions}
              onChange={setTimezone}
              icon={Clock}
            />
          </div>

          {/* Dark Mode Toggle */}
          <div className="pt-2">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "p-2.5 rounded-xl transition-all duration-300",
                  theme === 'dark'
                    ? "bg-violet-500/20 shadow-lg shadow-violet-500/20"
                    : "bg-amber-100"
                )}>
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-violet-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-amber-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {theme === 'dark' ? 'Mørk modus' : 'Lys modus'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {theme === 'dark' ? 'Skift til lyst tema' : 'Skift til mørkt tema'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={cn(
                  "relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 shadow-inner",
                  theme === 'dark'
                    ? "bg-violet-600"
                    : "bg-gray-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center",
                    theme === 'dark' ? "translate-x-8" : "translate-x-1"
                  )}
                >
                  {theme === 'dark' ? (
                    <Moon className="h-3 w-3 text-violet-600" />
                  ) : (
                    <Sun className="h-3 w-3 text-amber-500" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl">
              <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Varsler</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bestem hvordan du vil bli oppdatert</p>
            </div>
          </div>
        </div>
        <ToggleSetting
          icon={Mail}
          title="E-postvarsler"
          description="Få beskjed når notater er klare eller noe viktig skjer"
          enabled={notifications}
          onChange={setNotifications}
        />
        <ToggleSetting
          icon={Volume2}
          title="Lydeffekter"
          description="Hør en lyd når handlinger fullføres"
          enabled={soundEffects}
          onChange={setSoundEffects}
        />
      </div>
    </div>
  );
}

// Billing Tab - Team Member View (company pays)
function BillingTabTeamMember() {
  const billingAdmin = mockOrganization.members.find(m => m.role === 'admin');

  return (
    <div className="space-y-6">
      {/* Organization Subscription Info */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Bedriftsabonnement</h2>
        </div>
        <div className="p-6">
          <div className="p-6 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl border border-violet-100">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Building className="h-6 w-6 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-4">
                  Du er del av <span className="font-semibold text-gray-900">{mockOrganization.name}</span> sitt abonnement.
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium flex items-center">
                      <Crown className="h-4 w-4 text-amber-500 mr-1" />
                      Enterprise
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Administrert av:</span>
                    <span className="font-medium">{billingAdmin?.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Teammedlemmer:</span>
                    <span className="font-medium">{mockOrganization.members.length} / {mockOrganization.maxMembers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="p-1">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-800">
                  Fakturering håndteres av din organisasjon. Kontakt din administrator for spørsmål om abonnement eller fakturering.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <a
              href={`mailto:${billingAdmin?.email}?subject=Spørsmål om Notably-abonnement`}
              className="button-secondary w-full inline-flex items-center justify-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Kontakt administrator
            </a>
          </div>
        </div>
      </div>

      {/* What's included */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Inkludert i din plan</h2>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            {['Ubegrenset møter og opptak', 'Transkripsjon på 50+ språk', 'AI-oppsummering og handlingspunkter', 'Prioritert transkripsjon', 'Kalender-integrasjon', 'Dedikert support', 'SSO / SAML', 'Egendefinerte maler'].map((feature, i) => (
              <li key={i} className="flex items-center text-sm text-gray-700">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Billing Tab - Admin/Solo View (full control)
function BillingTabAdmin({ isOrgAdmin = false }: { isOrgAdmin?: boolean }) {
  const plans = [
    { id: 'basic', name: 'Basic', price: 299, features: ['Ubegrenset møter', 'Transkripsjon NO/EN', 'AI-oppsummering'] },
    { id: 'pro', name: 'Pro', price: 499, features: ['Alt i Basic', 'Prioritert transkripsjon', 'Kalender-integrasjon'], current: !isOrgAdmin },
    { id: 'enterprise', name: 'Enterprise', price: null, features: ['Alt i Pro', 'Dedikert support', 'SSO', 'On-premise'], current: isOrgAdmin }
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">
            {isOrgAdmin ? 'Organisasjonens abonnement' : 'Gjeldende abonnement'}
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl border border-violet-100">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Crown className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{isOrgAdmin ? 'Enterprise' : 'Pro-plan'}</h3>
                <p className="text-gray-600">
                  {isOrgAdmin
                    ? `${mockOrganization.members.length} seter • Fornyes 15. jan 2026`
                    : '499 kr/mnd • Fornyes 15. jan 2026'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                <CheckCircle className="h-4 w-4 mr-1" />
                Aktiv
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="button-secondary">
              {isOrgAdmin ? 'Administrer seter' : 'Endre plan'}
            </button>
            <button className="button-secondary">
              Se fakturaer
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Betalingsmetode</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Utløper 12/26</p>
              </div>
            </div>
            <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
              Endre
            </button>
          </div>
        </div>
      </div>

      {/* All Plans - only show for solo users */}
      {!isOrgAdmin && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold">Tilgjengelige planer</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-colors",
                    plan.current
                      ? "border-violet-600 bg-violet-50"
                      : "border-gray-200 hover:border-violet-200"
                  )}
                >
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-1">
                    {plan.price ? `${plan.price} kr` : 'Kontakt oss'}
                    {plan.price && <span className="text-sm font-normal text-gray-500">/mnd</span>}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.current && (
                    <p className="mt-3 text-sm text-violet-600 font-medium">Nåværende plan</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Billing Tab - Solo User (personal subscription)
function BillingTabSolo() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Mitt abonnement</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl border border-emerald-100 dark:border-emerald-800">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <Crown className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Pro-plan</h3>
                <p className="text-gray-600 dark:text-gray-400">199 kr/mnd • Fornyes 15. jan 2026</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                <CheckCircle className="h-4 w-4 mr-1" />
                Aktiv
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="button-secondary">
              Endre plan
            </button>
            <button className="button-secondary">
              Se fakturaer
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Betalingsmetode</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Utløper 12/26</p>
              </div>
            </div>
            <button className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
              Endre
            </button>
          </div>
        </div>
      </div>

      {/* All Plans */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">Tilgjengelige planer</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'basic', name: 'Basic', price: 99, features: ['10 møter/mnd', 'Transkripsjon NO/EN', 'AI-oppsummering'] },
              { id: 'pro', name: 'Pro', price: 199, features: ['Ubegrenset møter', 'Prioritert transkripsjon', 'Kalender-integrasjon'], current: true },
              { id: 'team', name: 'Team', price: 399, features: ['Alt i Pro', 'Delte mapper', 'Team-admin', 'Inviter 5 brukere'] }
            ].map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-colors",
                  plan.current
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                )}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                  {plan.price} kr
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/mnd</span>
                </p>
                <ul className="mt-3 space-y-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <Check className="h-4 w-4 text-emerald-500 mr-1" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.current && (
                  <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 font-medium">Nåværende plan</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team CTA */}
      <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/30 dark:to-fuchsia-900/30 rounded-xl p-6 border border-violet-100 dark:border-violet-800">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-violet-100 dark:bg-violet-900/50 rounded-xl">
            <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-violet-900 dark:text-violet-200">Trenger du team-funksjonalitet?</h3>
            <p className="text-violet-700 dark:text-violet-400 mt-1">
              Oppgrader til Team-planen for å invitere kollegaer, dele mapper og samarbeide om møtenotater.
            </p>
            <button className="mt-4 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors">
              Oppgrader til Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Billing Tab - Main component with role detection
function BillingTab() {
  const { isSolo, isMember, isAdmin } = useDemoUser();

  // Solo user - personal subscription
  if (isSolo) {
    return <BillingTabSolo />;
  }

  // Team member (not admin) - read-only view
  if (isMember) {
    return <BillingTabTeamMember />;
  }

  // Admin - full control over org billing
  return <BillingTabAdmin isOrgAdmin={true} />;
}

// Team Tab - Member Card with optional actions
interface MemberCardReadOnlyProps {
  member: OrganizationMember;
  isCurrentUser: boolean;
  showActions: boolean;
  onRemove: () => void;
  onChangeRole: (role: 'admin' | 'member') => void;
}

function MemberCardReadOnly({ member, isCurrentUser, showActions, onRemove, onChangeRole }: MemberCardReadOnlyProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
          <User className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{member.name}</span>
            {isCurrentUser && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Deg</span>
            )}
            {member.role === 'admin' && <Crown className="h-4 w-4 text-amber-500" />}
          </div>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <span>{member.email}</span>
            <span className="text-gray-300">•</span>
            <span>{formatLastActive(member.lastActive)}</span>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={isCurrentUser}
          >
            <MoreVertical className={cn("h-5 w-5", isCurrentUser ? "text-gray-300" : "text-gray-400")} />
          </button>

          {showMenu && !isCurrentUser && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => { onChangeRole(member.role === 'admin' ? 'member' : 'admin'); setShowMenu(false); }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Shield className="h-4 w-4 mr-2" />
                {member.role === 'admin' ? 'Gjør til medlem' : 'Gjør til admin'}
              </button>
              <button
                onClick={() => { onRemove(); setShowMenu(false); }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Fjern fra organisasjon
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-postadresse</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Rolle</label>
              <div className="grid grid-cols-2 gap-3">
                {(['member', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex items-center p-3 rounded-lg border-2 transition-colors",
                      role === r ? "border-violet-600 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {r === 'admin' ? <Shield className={cn("h-5 w-5 mr-2", role === r ? "text-violet-600" : "text-gray-400")} /> : <User className={cn("h-5 w-5 mr-2", role === r ? "text-violet-600" : "text-gray-400")} />}
                    <div className="text-left">
                      <div className={cn("font-medium", role === r ? "text-violet-900" : "text-gray-900")}>
                        {r === 'admin' ? 'Administrator' : 'Medlem'}
                      </div>
                      <div className="text-xs text-gray-500">{r === 'admin' ? 'Full tilgang' : 'Standard tilgang'}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="button-secondary">Avbryt</button>
              <button type="submit" className="button-primary inline-flex items-center">
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

function TeamTab() {
  const { mode, isAdmin: isOrgAdmin, currentUserId } = useDemoUser();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [members, setMembers] = useState(mockOrganization.members);
  const [pendingInvitations, setPendingInvitations] = useState(mockOrganization.pendingInvitations);

  // Get current user from members
  const currentUser = members.find(m => m.id === currentUserId) || members[0];

  const sharedFoldersList = mockFolders.filter(f => mockOrganization.sharedFolders.includes(f.id));

  const handleInvite = (email: string, role: 'admin' | 'member') => {
    const newInvitation = {
      id: `inv-${Date.now()}`,
      email,
      role,
      invitedBy: currentUser?.name || 'Ukjent',
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
    setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    toast.success(`Rolle endret til ${newRole === 'admin' ? 'administrator' : 'medlem'}`);
  };

  const handleCancelInvitation = (invitationId: string) => {
    setPendingInvitations(pendingInvitations.filter(i => i.id !== invitationId));
    toast.success('Invitasjon kansellert');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
            <Building className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{mockOrganization.name}</h2>
            <p className="text-gray-600">{members.length} medlemmer • Business plan</p>
          </div>
        </div>
        {isOrgAdmin && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="button-primary inline-flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Inviter medlem
          </button>
        )}
      </div>

      {/* Info banner for non-admins */}
      {!isOrgAdmin && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                Du ser en oversikt over teamet ditt. Kontakt en administrator hvis du trenger å gjøre endringer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats - show different stats based on role */}
      <div className={cn("grid gap-4", isOrgAdmin ? "grid-cols-3" : "grid-cols-2")}>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-violet-50 rounded-lg">
              <Users className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <div className="text-xl font-bold">{members.length}</div>
              <div className="text-sm text-gray-600">Medlemmer</div>
            </div>
          </div>
        </div>
        {isOrgAdmin && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Mail className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-xl font-bold">{pendingInvitations.length}</div>
                <div className="text-sm text-gray-600">Ventende</div>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Folder className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold">{sharedFoldersList.length}</div>
              <div className="text-sm text-gray-600">Delte mapper</div>
            </div>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2 text-gray-400" />
            Teammedlemmer
          </h3>
          {isOrgAdmin && (
            <span className="text-sm text-gray-500">{members.length} / {mockOrganization.maxMembers} plasser</span>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {members.map((member) => (
            <MemberCardReadOnly
              key={member.id}
              member={member}
              isCurrentUser={member.id === currentUserId}
              showActions={isOrgAdmin}
              onRemove={() => handleRemoveMember(member.id)}
              onChangeRole={(role) => handleChangeRole(member.id, role)}
            />
          ))}
        </div>
      </div>

      {/* Pending Invitations - only for admins */}
      {isOrgAdmin && pendingInvitations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold flex items-center">
              <Mail className="h-5 w-5 mr-2 text-gray-400" />
              Ventende invitasjoner
            </h3>
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

      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}

// Integration Card Component
interface IntegrationCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  name: string;
  description: string;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  status?: string;
}

function IntegrationCard({
  icon: Icon,
  iconBg,
  iconColor,
  name,
  description,
  connected,
  onConnect,
  onDisconnect,
  status
}: IntegrationCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex items-center space-x-4">
        <div className={cn("p-3 rounded-xl", iconBg)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-600">{description}</p>
          {connected && status && (
            <p className="text-xs text-green-600 mt-1">{status}</p>
          )}
        </div>
      </div>
      {connected ? (
        <button
          onClick={onDisconnect}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          Koble fra
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="px-4 py-2 text-sm font-medium text-violet-600 hover:text-violet-700 hover:bg-violet-50 rounded-lg border border-violet-200 transition-colors"
        >
          Koble til
        </button>
      )}
    </div>
  );
}

// Integrations Tab
function IntegrationsTab() {
  const [googleConnected, setGoogleConnected] = useState(true);
  const [microsoftConnected, setMicrosoftConnected] = useState(false);
  const [slackConnected, setSlackConnected] = useState(true);
  const [crmConnected, setCrmConnected] = useState(false);
  const [zapierConnected, setZapierConnected] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState('sk_live_notably_abc123xyz789def456ghi');

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API-nøkkel kopiert til utklippstavle');
  };

  const handleRegenerateApiKey = () => {
    toast.success('Ny API-nøkkel generert');
  };

  return (
    <div className="space-y-6">
      {/* Personal Integrations */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Mine integrasjoner</h2>
          <p className="text-sm text-gray-600 mt-1">Koble til kalenderen din for automatisk møtesynkronisering</p>
        </div>
        <div className="p-6 space-y-4">
          <IntegrationCard
            icon={Calendar}
            iconBg="bg-red-50"
            iconColor="text-red-600"
            name="Google Calendar"
            description="Synkroniser møter automatisk fra Google Calendar"
            connected={googleConnected}
            status="Synkronisert med demo@notably.no"
            onConnect={() => { setGoogleConnected(true); toast.success('Google Calendar koblet til'); }}
            onDisconnect={() => { setGoogleConnected(false); toast.success('Google Calendar frakoblet'); }}
          />
          <IntegrationCard
            icon={Calendar}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            name="Microsoft 365"
            description="Synkroniser møter fra Outlook og Teams"
            connected={microsoftConnected}
            onConnect={() => { setMicrosoftConnected(true); toast.success('Microsoft 365 koblet til'); }}
            onDisconnect={() => { setMicrosoftConnected(false); toast.success('Microsoft 365 frakoblet'); }}
          />
        </div>
      </div>

      {/* Organization Integrations (Admin only) */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Organisasjonsintegrasjoner</h2>
              <p className="text-sm text-gray-600 mt-1">Del møtenotater og automatiser arbeidsflyter</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              <Crown className="h-3 w-3 mr-1" />
              Kun admin
            </span>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <IntegrationCard
            icon={MessageSquare}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            name="Slack"
            description="Send møtesammendrag til Slack-kanaler"
            connected={slackConnected}
            status="Koblet til #meetings-kanal"
            onConnect={() => { setSlackConnected(true); toast.success('Slack koblet til'); }}
            onDisconnect={() => { setSlackConnected(false); toast.success('Slack frakoblet'); }}
          />
          <IntegrationCard
            icon={Users}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            name="CRM (Salesforce/HubSpot)"
            description="Koble møtenotater til kunder og leads"
            connected={crmConnected}
            onConnect={() => { setCrmConnected(true); toast.success('CRM koblet til'); }}
            onDisconnect={() => { setCrmConnected(false); toast.success('CRM frakoblet'); }}
          />
          <IntegrationCard
            icon={Zap}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
            name="Zapier"
            description="Automatiser arbeidsflyter med 5000+ apper"
            connected={zapierConnected}
            onConnect={() => { setZapierConnected(true); toast.success('Zapier koblet til'); }}
            onDisconnect={() => { setZapierConnected(false); toast.success('Zapier frakoblet'); }}
          />
        </div>
      </div>

      {/* Developer Tools (Pro/Enterprise) */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Utviklerverktøy</h2>
              <p className="text-sm text-gray-600 mt-1">Bygg egne integrasjoner med Notably API</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
              Pro / Enterprise
            </span>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* MCP Server */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <Bot className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-medium">MCP-server</h3>
                  <p className="text-sm text-gray-600">Koble Notably til AI-assistenter via Model Context Protocol</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Konfigurasjon for Claude Desktop</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`{
  "mcpServers": {
    "notably": {
      "command": "npx",
      "args": ["-y", "@anthropic/notably-mcp"],
      "env": {
        "NOTABLY_API_KEY": "${apiKey}"
      }
    }
  }
}`);
                    toast.success('MCP-konfigurasjon kopiert');
                  }}
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Kopier
                </button>
              </div>
              <pre className="text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre">{`{
  "mcpServers": {
    "notably": {
      "command": "npx",
      "args": ["-y", "@anthropic/notably-mcp"],
      "env": {
        "NOTABLY_API_KEY": "din-api-nøkkel"
      }
    }
  }
}`}</pre>
            </div>
            <div className="mt-3 flex items-start space-x-2">
              <Terminal className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-500">
                Legg til denne konfigurasjonen i <code className="bg-gray-100 px-1 rounded">claude_desktop_config.json</code> for å gi Claude tilgang til dine møtenotater, transkripsjoner og opptak.
              </p>
            </div>
          </div>

          {/* API Key */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Key className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">API-nøkkel</h3>
                  <p className="text-sm text-gray-600">Programmatisk tilgang til dine data</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="w-full px-4 py-2 pr-20 rounded-lg border border-gray-300 bg-gray-50 font-mono text-sm"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded"
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <button
                onClick={handleCopyApiKey}
                className="p-2 hover:bg-gray-100 rounded-lg border border-gray-300"
                title="Kopier"
              >
                <Copy className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={handleRegenerateApiKey}
                className="p-2 hover:bg-gray-100 rounded-lg border border-gray-300"
                title="Regenerer"
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Opprettet 1. des 2024 • Sist brukt for 2 timer siden
            </p>
          </div>

          {/* Webhooks */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Webhook className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">Webhooks</h3>
                  <p className="text-sm text-gray-600">Motta varsler når hendelser skjer</p>
                </div>
              </div>
              <button className="button-secondary text-sm">
                + Legg til webhook
              </button>
            </div>

            {/* Existing webhooks list */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">https://api.example.com/webhooks/notably</p>
                  <p className="text-xs text-gray-500">Hendelser: transcription.completed, meeting.ended</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                    Aktiv
                  </span>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Documentation link */}
          <div className="pt-4 border-t border-gray-100">
            <a
              href="#"
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-violet-200 hover:bg-violet-50/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <ExternalLink className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-medium">API-dokumentasjon</h3>
                  <p className="text-sm text-gray-600">Se alle tilgjengelige endepunkter og eksempler</p>
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Security Tab
function SecurityTab() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = () => {
    toast.success('Din dataeksport er startet. Du vil motta en e-post når den er klar.');
  };

  const handleDeleteAccount = () => {
    toast.error('Kontoen din er slettet. Du blir nå logget ut.');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Password */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Passord</h2>
        </div>
        <div className="p-6">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-violet-200 hover:bg-violet-50/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Lock className="h-5 w-5 text-violet-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Endre passord</h3>
                <p className="text-sm text-gray-600">Oppdater ditt påloggingspassord</p>
              </div>
            </div>
            <ChevronLeft className="h-5 w-5 text-gray-400 rotate-180" />
          </button>
        </div>
      </div>

      {/* Privacy & Data */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold">Personvern og data</h2>
        </div>
        <div className="p-6 space-y-4">
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-violet-200 hover:bg-violet-50/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Download className="h-5 w-5 text-violet-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Eksporter data</h3>
                <p className="text-sm text-gray-600">Last ned alle dine opptak og data (GDPR)</p>
              </div>
            </div>
            <ChevronLeft className="h-5 w-5 text-gray-400 rotate-180" />
          </button>

          <Link
            to="/privacy"
            className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-violet-200 hover:bg-violet-50/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Shield className="h-5 w-5 text-violet-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Personvernerklæring</h3>
                <p className="text-sm text-gray-600">Les hvordan vi behandler dine data</p>
              </div>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-red-600">Faresone</h2>
        </div>
        <div className="p-6">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-red-200 hover:border-red-300 hover:bg-red-50/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-red-700">Slett konto</h3>
                  <p className="text-sm text-red-600">Slett permanent din konto og alle data</p>
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-red-400 rotate-180" />
            </button>
          ) : (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="font-medium text-red-700 mb-2">Er du sikker?</h3>
              <p className="text-sm text-red-600 mb-4">
                Denne handlingen kan ikke angres. Alle dine opptak, transkripsjoner og data vil bli permanent slettet.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
                >
                  Ja, slett kontoen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}

// Main Settings Page
export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  const { mode, isSolo, isInOrganization } = useDemoUser();

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  // Filter tabs based on user mode
  const visibleTabs = tabs.filter(tab => {
    // Hide Team tab for Solo users
    if (tab.id === 'team' && isSolo) {
      return false;
    }
    return true;
  });

  // If Solo user tries to access Team tab, redirect to profile
  const effectiveTab = (activeTab === 'team' && isSolo) ? 'profile' : activeTab;

  const renderTabContent = () => {
    switch (effectiveTab) {
      case 'profile':
        return <ProfileTab />;
      case 'preferences':
        return <PreferencesTab />;
      case 'billing':
        return <BillingTab />;
      case 'team':
        return <TeamTab />;
      case 'integrations':
        return <IntegrationsTab />;
      case 'security':
        return <SecurityTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tilbake til dashboard
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <SettingsIcon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Innstillinger</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isSolo ? 'Administrer profil og preferanser' : 'Administrer profil, preferanser og team'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 p-1">
          <div className="flex space-x-1 overflow-x-auto">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    effectiveTab === tab.id
                      ? "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content - key forces re-render when demo user mode changes */}
        <div key={mode}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
