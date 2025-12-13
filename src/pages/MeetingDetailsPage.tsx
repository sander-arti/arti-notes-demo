import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Download,
  Share2,
  Trash2,
  Presentation,
  FileText,
  ClipboardList,
  MessageSquare,
  Captions,
  Pencil,
  RefreshCw,
  Check,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import DownloadModal from '@/components/DownloadModal';
import PresentationModal from '@/components/PresentationModal';
import ShareSummaryModal from '@/components/ShareSummaryModal';
import MiniAudioPlayer from '@/components/MiniAudioPlayer';
import FolderSelect from '@/components/FolderSelect';
import TagSelect from '@/components/TagSelect';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import EditableSummary from '@/components/EditableSummary';
import EditableTitle from '@/components/EditableTitle';
import MeetingChat from '@/components/MeetingChat';
import ParticipantList from '@/components/ParticipantList';
import { cn } from '@/lib/utils';
import { getMockMeetingDetail } from '@/lib/mockMeetingDetails';
import { mockTemplates, Template } from '@/lib/mockTemplates';
import { toast } from '@/components/ui/toast';

interface Meeting {
  id: string;
  title: string;
  created_at: string;
  duration: number;
  status: 'processing' | 'completed' | 'error';
  file_url?: string;
  folder_id?: string | null;
}

interface Transcription {
  id: string;
  content: Array<{
    text: string;
    timestamp: number;
  }>;
  summary_text?: string;
  summary_topics?: string[];
  action_items?: string[];
}

interface Participant {
  id: string;
  name: string;
  email?: string;
}

interface MinutesSection {
  title: string;
  content: string;
}

interface MeetingMinutes {
  sections: MinutesSection[];
  generatedAt: string;
}

type TabType = 'overview' | 'minutes' | 'ai' | 'transcription';

const tabs = [
  { id: 'overview' as const, label: 'Oversikt', icon: FileText },
  { id: 'minutes' as const, label: 'Referat', icon: ClipboardList },
  { id: 'ai' as const, label: 'AI-assistent', icon: MessageSquare },
  { id: 'transcription' as const, label: 'Transkripsjon', icon: Captions },
];

export default function MeetingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [minutes, setMinutes] = useState<MeetingMinutes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Minutes editing state
  const [isEditingMinutes, setIsEditingMinutes] = useState(false);
  const [editedMinutes, setEditedMinutes] = useState<MinutesSection[]>([]);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Audio player state (lifted up for mini-player)
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [hasEverPlayed, setHasEverPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const transcriptionContainerRef = useRef<HTMLDivElement>(null);
  const lastHighlightedRef = useRef<HTMLDivElement | null>(null);

  // Last inn mock-data ved oppstart
  useEffect(() => {
    if (id) {
      loadMockMeetingDetails(id);
    }
  }, [id]);

  const loadMockMeetingDetails = (meetingId: string) => {
    setTimeout(() => {
      const mockData = getMockMeetingDetail(meetingId);
      if (mockData) {
        setMeeting(mockData.meeting);
        setTranscription(mockData.transcription);
        setParticipants(mockData.participants);
        setMinutes(mockData.minutes || null);
        setIsLoading(false);
      } else {
        setError('Møte ikke funnet');
        setIsLoading(false);
      }
    }, 300);
  };

  // Scroll to current transcription segment
  useEffect(() => {
    if (currentTimestamp && transcriptionContainerRef.current && activeTab === 'transcription') {
      const segments = transcription?.content || [];
      const currentSegmentIndex = segments.findIndex((segment, index) =>
        currentTimestamp >= segment.timestamp &&
        currentTimestamp < (segments[index + 1]?.timestamp || Infinity)
      );

      if (currentSegmentIndex !== -1) {
        const segmentElement = transcriptionContainerRef.current.children[currentSegmentIndex] as HTMLDivElement;
        if (segmentElement && segmentElement !== lastHighlightedRef.current) {
          lastHighlightedRef.current = segmentElement;
          const container = transcriptionContainerRef.current;
          const containerRect = container.getBoundingClientRect();
          const elementRect = segmentElement.getBoundingClientRect();
          const relativeTop = elementRect.top - containerRect.top;

          if (relativeTop < 0 || relativeTop > containerRect.height) {
            container.scrollTo({
              top: container.scrollTop + relativeTop - containerRect.height / 2,
              behavior: 'smooth'
            });
          }
        }
      }
    }
  }, [currentTimestamp, transcription, activeTab]);

  // Mock handlers
  const handleFolderChange = async (folderId: string | null) => {
    if (!meeting) return;
    setMeeting(prev => prev ? { ...prev, folder_id: folderId } : null);
  };

  const handleTitleChange = async (newTitle: string) => {
    if (!meeting) return;
    setMeeting(prev => prev ? { ...prev, title: newTitle } : null);
  };

  const handleSaveSummary = async (data: {
    summaryText: string;
    topics: string[];
    actionItems: string[];
  }) => {
    if (!transcription?.id) return;
    setTranscription(prev => prev ? {
      ...prev,
      summary_text: data.summaryText,
      summary_topics: data.topics,
      action_items: data.actionItems
    } : null);
  };

  const handleDeleteMeeting = async () => {
    navigate('/dashboard');
  };

  // Minutes editing handlers
  const startEditingMinutes = () => {
    if (minutes) {
      setEditedMinutes([...minutes.sections]);
      setIsEditingMinutes(true);
    }
  };

  const cancelEditingMinutes = () => {
    setIsEditingMinutes(false);
    setEditedMinutes([]);
  };

  const saveMinutesEdits = () => {
    if (minutes && editedMinutes.length > 0) {
      setMinutes({
        ...minutes,
        sections: editedMinutes,
        generatedAt: new Date().toISOString()
      });
      setIsEditingMinutes(false);
      toast.success('Referat oppdatert');
    }
  };

  const updateMinutesSection = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...editedMinutes];
    updated[index] = { ...updated[index], [field]: value };
    setEditedMinutes(updated);
  };

  const regenerateMinutes = async (template: Template) => {
    setShowTemplateSelector(false);
    setIsRegenerating(true);

    // Simuler regenerering med ny mal
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generer nye seksjoner basert på mal
    const newSections: MinutesSection[] = template.sections.map(sectionTitle => ({
      title: sectionTitle,
      content: generateMockContent(sectionTitle, meeting?.title || '')
    }));

    setMinutes({
      sections: newSections,
      generatedAt: new Date().toISOString()
    });

    setIsRegenerating(false);
    toast.success(`Referat regenerert med "${template.name}"`);
  };

  // Mock content generator for demo
  const generateMockContent = (sectionTitle: string, meetingTitle: string): string => {
    const contentMap: Record<string, string> = {
      'Møteinformasjon': `Møte: ${meetingTitle}\nDato: ${new Date().toLocaleDateString('no')}\nVarighet: ${formatDuration(meeting?.duration || 0)}`,
      'Deltakere': participants.map(p => `• ${p.name}`).join('\n'),
      'Agenda': '1. Velkommen og introduksjon\n2. Gjennomgang av hovedtema\n3. Diskusjon og spørsmål\n4. Oppsummering og neste steg',
      'Diskusjonspunkter': 'Teamet diskuterte de viktigste punktene og kom til enighet om veien videre.',
      'Beslutninger': '• Vedtatt å fortsette med nåværende strategi\n• Enighet om tidsplan for implementering',
      'Oppfølgingspunkter': '• Sende ut oppfølgingse-post til alle deltakere\n• Planlegge neste møte',
      'Neste møte': 'Planlegges innen to uker',
    };
    return contentMap[sectionTitle] || `Innhold for "${sectionTitle}" vil bli generert basert på møtetranskripsjonen.`;
  };

  // Audio handlers
  const handlePlayPause = () => {
    const willPlay = !isPlaying;
    setIsPlaying(willPlay);

    // On first play, auto-navigate to transcription tab
    if (willPlay && !hasEverPlayed) {
      setHasEverPlayed(true);
      setActiveTab('transcription');
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTimestamp(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const handleSkip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(currentTimestamp + seconds, meeting?.duration || 0));
    setCurrentTimestamp(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Compute current transcript segment and speaker based on timestamp
  const currentSegment = useMemo(() => {
    if (!transcription?.content || transcription.content.length === 0) return null;

    const segments = transcription.content;
    for (let i = segments.length - 1; i >= 0; i--) {
      if (currentTimestamp >= segments[i].timestamp) {
        return segments[i];
      }
    }
    return segments[0];
  }, [transcription, currentTimestamp]);

  // Mock speaker names based on segment index (in real app, this would come from transcription data)
  const mockSpeakers = ['Kari Nordmann', 'Ole Hansen', 'Lisa Johansen'];
  const currentSpeaker = useMemo(() => {
    if (!currentSegment || !isPlaying) return undefined;
    // Rotate speakers based on segment text hash for consistent but varied speakers
    const hash = currentSegment.text.length % mockSpeakers.length;
    return participants[hash]?.name || mockSpeakers[hash];
  }, [currentSegment, isPlaying, participants]);

  const currentTranscript = useMemo(() => {
    if (!currentSegment || !isPlaying) return undefined;
    // Truncate long segments for display
    const text = currentSegment.text;
    return text.length > 80 ? text.substring(0, 80) + '...' : text;
  }, [currentSegment, isPlaying]);

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const parts = [];
    if (hours > 0) parts.push(`${hours}t`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);
    return parts.join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('no', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDownloadDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('no', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Møte ikke funnet'}</p>
          <Link to="/dashboard" className="text-violet-600 hover:text-violet-700 dark:text-violet-400">
            Tilbake til dashboard
          </Link>
        </div>
      </div>
    );
  }

  const downloadData = meeting && transcription ? {
    title: meeting.title,
    date: formatDownloadDate(meeting.created_at),
    duration: formatDuration(meeting.duration),
    file_url: meeting.file_url,
    summary: transcription.summary_text ? {
      text: transcription.summary_text,
      topics: transcription.summary_topics,
      actionItems: transcription.action_items
    } : undefined,
    transcription: transcription.content?.map(segment => ({
      timestamp: new Date(segment.timestamp * 1000).toISOString().substr(14, 5),
      text: segment.text
    }))
  } : undefined;

  return (
    <div className="min-h-screen pt-16 pb-20 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tilbake til dashboard
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <EditableTitle
                title={meeting.title}
                onSave={handleTitleChange}
              />
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                <span>{formatDate(meeting.created_at)}</span>
                <span>•</span>
                <span>{formatDuration(meeting.duration)}</span>
                <span>•</span>
                <span>{participants.length} deltakere</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                      activeTab === tab.id
                        ? "border-b-2 border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Participants */}
                    <ParticipantList
                      participants={participants}
                      className="mb-4"
                    />

                    {/* Summary with integrated Topics and Action Items */}
                    {transcription?.summary_text && (
                      <EditableSummary
                        summaryText={transcription.summary_text}
                        topics={transcription.summary_topics || []}
                        actionItems={transcription.action_items || []}
                        onSave={handleSaveSummary}
                      />
                    )}
                  </div>
                )}

                {/* Minutes Tab */}
                {activeTab === 'minutes' && (
                  <div className="space-y-6">
                    {isRegenerating ? (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 mb-4">
                          <Sparkles className="h-8 w-8 text-violet-600 dark:text-violet-400 animate-pulse" />
                        </div>
                        <p className="text-gray-900 dark:text-white font-medium mb-2">Genererer nytt referat...</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Dette tar vanligvis noen sekunder.
                        </p>
                      </div>
                    ) : minutes ? (
                      <>
                        {/* Header med handlinger */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Generert {new Date(minutes.generatedAt).toLocaleString('no')}
                          </div>
                          <div className="flex items-center gap-2">
                            {isEditingMinutes ? (
                              <>
                                <button
                                  onClick={cancelEditingMinutes}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                  Avbryt
                                </button>
                                <button
                                  onClick={saveMinutesEdits}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                                >
                                  <Check className="h-4 w-4" />
                                  Lagre
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={startEditingMinutes}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                  <Pencil className="h-4 w-4" />
                                  Rediger
                                </button>
                                <div className="relative">
                                  <button
                                    onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                    Regenerer
                                    <ChevronDown className={cn("h-4 w-4 transition-transform", showTemplateSelector && "rotate-180")} />
                                  </button>

                                  {/* Template selector dropdown */}
                                  {showTemplateSelector && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                                      <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Velg mal</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Referatet regenereres med valgt mal</p>
                                      </div>
                                      <div className="max-h-64 overflow-y-auto">
                                        {mockTemplates.map((template) => (
                                          <button
                                            key={template.id}
                                            onClick={() => regenerateMinutes(template)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
                                          >
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{template.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{template.description}</p>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Innhold - redigeringsmodus eller visning */}
                        {isEditingMinutes ? (
                          <div className="space-y-4">
                            {editedMinutes.map((section, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <input
                                  type="text"
                                  value={section.title}
                                  onChange={(e) => updateMinutesSection(index, 'title', e.target.value)}
                                  className="w-full text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-b border-gray-200 dark:border-gray-700 pb-2 mb-3 focus:outline-none focus:border-violet-500 dark:focus:border-violet-400"
                                  placeholder="Seksjonstittel"
                                />
                                <textarea
                                  value={section.content}
                                  onChange={(e) => updateMinutesSection(index, 'content', e.target.value)}
                                  rows={4}
                                  className="w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 resize-none"
                                  placeholder="Seksjoninnhold"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {minutes.sections.map((section, index) => (
                              <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0">
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                                  {section.title}
                                </h3>
                                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                  {section.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <ClipboardList className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 mb-2">Referat genereres automatisk...</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          Et detaljert møtereferat vil være tilgjengelig snart.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* AI Tab */}
                {activeTab === 'ai' && (
                  <div>
                    {transcription ? (
                      <MeetingChat
                        recordingId={meeting.id}
                        transcription={transcription}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          AI-assistent krever transkripsjon.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Transcription Tab */}
                {activeTab === 'transcription' && (
                  <div className="space-y-4">
                    {/* Inline Audio Player - appears when on transcription tab */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-xl border border-violet-100 dark:border-violet-800/50 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-violet-100 dark:border-violet-800/50">
                        <h3 className="text-sm font-medium text-violet-700 dark:text-violet-300">Spill av opptaket</h3>
                      </div>
                      <MiniAudioPlayer
                        src=""
                        duration={meeting.duration}
                        currentTime={currentTimestamp}
                        isPlaying={isPlaying}
                        volume={volume}
                        playbackSpeed={playbackSpeed}
                        onPlayPause={handlePlayPause}
                        onSeek={handleSeek}
                        onVolumeChange={handleVolumeChange}
                        onPlaybackSpeedChange={handlePlaybackSpeedChange}
                        onSkip={handleSkip}
                        onDownload={() => setShowDownloadModal(true)}
                        isReady={true}
                        currentTranscript={currentTranscript}
                        currentSpeaker={currentSpeaker}
                        className="border-t-0 shadow-none"
                      />
                    </motion.div>

                    {/* Transcription Content */}
                    {transcription?.content && transcription.content.length > 0 ? (
                      <div
                        ref={transcriptionContainerRef}
                        className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-violet-200 dark:scrollbar-thumb-violet-800 scrollbar-track-gray-100 dark:scrollbar-track-gray-800"
                      >
                        {transcription.content.map((segment, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex items-start space-x-4 p-2 rounded-lg transition-colors",
                              currentTimestamp >= segment.timestamp &&
                              currentTimestamp < (transcription.content[index + 1]?.timestamp || Infinity)
                                ? "bg-violet-50 dark:bg-violet-900/30"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                          >
                            <button
                              onClick={() => handleSeek(segment.timestamp)}
                              className="w-16 flex-shrink-0 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 cursor-pointer hover:underline"
                            >
                              {new Date(segment.timestamp * 1000).toISOString().substr(14, 5)}
                            </button>
                            <p className="text-gray-600 dark:text-gray-300">{segment.text}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Captions className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Transkripsjon ikke tilgjengelig.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 1 col */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Handlinger</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="w-full button-primary justify-center py-3 flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Last ned
                </button>
                <button
                  onClick={() => setShowPresentationModal(true)}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white justify-center py-3 flex items-center rounded-lg transition-all"
                >
                  <Presentation className="h-5 w-5 mr-2" />
                  Lag presentasjon
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full button-secondary justify-center py-3 flex items-center"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Del sammendrag
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 justify-center py-3 flex items-center rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Slett møtet
                </button>
              </div>
            </div>

            {/* Folder Management */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
              <FolderSelect
                currentFolderId={meeting.folder_id || null}
                onFolderChange={handleFolderChange}
              />
            </div>

            {/* Tag Management */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
              <TagSelect
                recordingId={meeting.id}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mini Audio Player - only shows when NOT on transcription tab */}
      <AnimatePresence>
        {activeTab !== 'transcription' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-0 left-0 right-0 z-40 shadow-lg"
          >
            <MiniAudioPlayer
              src=""
              duration={meeting.duration}
              currentTime={currentTimestamp}
              isPlaying={isPlaying}
              volume={volume}
              playbackSpeed={playbackSpeed}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              onVolumeChange={handleVolumeChange}
              onPlaybackSpeedChange={handlePlaybackSpeedChange}
              onSkip={handleSkip}
              onDownload={() => setShowDownloadModal(true)}
              isReady={true}
              currentTranscript={currentTranscript}
              currentSpeaker={currentSpeaker}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {downloadData && (
        <DownloadModal
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          hasSummary={!!transcription?.summary_text}
          hasTranscription={!!transcription?.content?.length}
          hasAudio={true}
          meeting={downloadData}
        />
      )}

      {/* Presentation Modal */}
      <PresentationModal
        isOpen={showPresentationModal}
        onClose={() => setShowPresentationModal(false)}
        meetingId={meeting.id}
        meetingTitle={meeting.title}
        meetingSummary={transcription?.summary_text || ''}
      />

      {/* Share Summary Modal */}
      <ShareSummaryModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        meetingTitle={meeting.title}
        summaryPreview={transcription?.summary_text}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteMeeting}
        title="Slett opptak"
        message="Er du sikker på at du vil slette dette opptaket? Denne handlingen kan ikke angres."
      />

      {/* Hidden audio element for future real playback */}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
