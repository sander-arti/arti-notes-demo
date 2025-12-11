import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Download,
  Share2,
  Trash2
} from 'lucide-react';
import DownloadModal from '@/components/DownloadModal';
import AudioPlayer from '@/components/AudioPlayer';
import FolderSelect from '@/components/FolderSelect';
import TagSelect from '@/components/TagSelect';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import EditableSummary from '@/components/EditableSummary';
import EditableTitle from '@/components/EditableTitle';
import MeetingChat from '@/components/MeetingChat';
import ParticipantList from '@/components/ParticipantList';
import { cn } from '@/lib/utils';
import { getMockMeetingDetail } from '@/lib/mockMeetingDetails';

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

export default function MeetingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  const [audioPlayerRef, setAudioPlayerRef] = useState<HTMLAudioElement | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const transcriptionContainerRef = useRef<HTMLDivElement>(null);
  const lastHighlightedRef = useRef<HTMLDivElement | null>(null);

  // Last inn mock-data ved oppstart
  useEffect(() => {
    if (id) {
      loadMockMeetingDetails(id);
    }
  }, [id]);

  const loadMockMeetingDetails = (meetingId: string) => {
    // Simuler kort delay for realistisk UX
    setTimeout(() => {
      const mockData = getMockMeetingDetail(meetingId);
      if (mockData) {
        setMeeting(mockData.meeting);
        setTranscription(mockData.transcription);
        setParticipants(mockData.participants);
        setIsLoading(false);
      } else {
        setError('Møte ikke funnet');
        setIsLoading(false);
      }
    }, 300);
  };

  useEffect(() => {
    if (currentTimestamp && transcriptionContainerRef.current) {
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
  }, [currentTimestamp, transcription]);

  // Mock folder change - kun lokal state
  const handleFolderChange = async (folderId: string | null) => {
    if (!meeting) return;
    setMeeting(prev => prev ? { ...prev, folder_id: folderId } : null);
  };

  // Mock title change - kun lokal state
  const handleTitleChange = async (newTitle: string) => {
    if (!meeting) return;
    setMeeting(prev => prev ? { ...prev, title: newTitle } : null);
  };

  // Mock save summary - kun lokal state
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

  // Mock delete - navigerer tilbake
  const handleDeleteMeeting = async () => {
    navigate('/dashboard');
  };

  const formatDuration = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0s';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const parts = [];

    if (hours > 0) {
      parts.push(`${hours}t`);
    }
    if (minutes > 0 || hours > 0) {
      parts.push(`${minutes}m`);
    }
    if (remainingSeconds > 0 || parts.length === 0) {
      parts.push(`${remainingSeconds}s`);
    }

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

  const handleTimeUpdate = (time: number) => {
    setCurrentTimestamp(time);
  };

  const handleAudioRef = (ref: HTMLAudioElement) => {
    setAudioPlayerRef(ref);
  };

  const handleSeek = (time: number) => {
    if (audioPlayerRef) {
      audioPlayerRef.currentTime = time;
      audioPlayerRef.play().catch(console.error);
      setCurrentTimestamp(time);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Møte ikke funnet'}</p>
          <Link to="/dashboard" className="text-violet-600 hover:text-violet-700">
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
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
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
            <div>
              <EditableTitle
                title={meeting.title}
                onSave={handleTitleChange}
              />
              <div className="flex items-center space-x-4 text-gray-600">
                <span>{formatDate(meeting.created_at)}</span>
                <span>•</span>
                <span>{formatDuration(meeting.duration)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Participants */}
        <ParticipantList
          participants={participants}
          className="mb-6"
        />

        {/* Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Summary */}
            {transcription?.summary_text && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Sammendrag</h2>
                <EditableSummary
                  summaryText={transcription.summary_text}
                  topics={transcription.summary_topics || []}
                  actionItems={transcription.action_items || []}
                  onSave={handleSaveSummary}
                />
              </div>
            )}

            {/* Audio Player - Viser kun UI uten faktisk avspilling */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 pb-4">
                <h2 className="text-lg font-semibold mb-4">Lydopptak</h2>
                <p className="text-sm text-gray-500 mb-4">Demo-modus: Lydavspilling er deaktivert</p>
              </div>
              <AudioPlayer
                src=""
                initialDuration={meeting.duration}
                onAudioRef={handleAudioRef}
                onSeek={handleSeek}
                onTimeUpdate={handleTimeUpdate}
              />
            </div>

            {/* Chat */}
            {transcription && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold">Still spørsmål om møtet</h2>
                    <span className="px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 rounded-full">
                      AI
                    </span>
                  </div>
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      showChat
                        ? "bg-violet-100 text-violet-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {showChat ? 'Skjul chat' : 'Vis chat'}
                  </button>
                </div>
                {showChat && (
                  <MeetingChat
                    recordingId={meeting.id}
                    transcription={transcription}
                  />
                )}
              </div>
            )}

            {/* Transcription */}
            {transcription?.content && transcription.content.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Transkripsjon</h2>
                <div
                  ref={transcriptionContainerRef}
                  className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-violet-200 scrollbar-track-gray-100"
                >
                  {transcription.content.map((segment, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start space-x-4 p-2 rounded-lg transition-colors",
                        currentTimestamp &&
                        currentTimestamp >= segment.timestamp &&
                        currentTimestamp < (transcription.content[index + 1]?.timestamp || Infinity)
                          ? "bg-violet-50"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <button
                        onClick={() => handleSeek(segment.timestamp)}
                        className="w-16 flex-shrink-0 text-sm text-violet-600 hover:text-violet-700 cursor-pointer hover:underline"
                      >
                        {new Date(segment.timestamp * 1000).toISOString().substr(14, 5)}
                      </button>
                      <p className="text-gray-600">{segment.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Handlinger</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="w-full button-primary justify-center py-3 flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Last ned
                </button>
                <button
                  className="w-full button-secondary justify-center py-3 flex items-center"
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Del opptak
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full bg-red-100 text-red-700 hover:bg-red-200 justify-center py-3 flex items-center rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Slett opptak
                </button>
              </div>
            </div>

            {/* Folder Management */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <FolderSelect
                currentFolderId={meeting.folder_id || null}
                onFolderChange={handleFolderChange}
              />
            </div>

            {/* Tag Management */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <TagSelect
                recordingId={meeting.id}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {downloadData && (
        <DownloadModal
          isOpen={showDownloadModal}
          onClose={() => setShowDownloadModal(false)}
          hasSummary={!!transcription?.summary_text}
          hasTranscription={!!transcription?.content?.length}
          hasAudio={false}
          meeting={downloadData}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteMeeting}
        title="Slett opptak"
        message="Er du sikker på at du vil slette dette opptaket? Denne handlingen kan ikke angres."
      />
    </div>
  );
}
