import { useState } from 'react';
import { X, FileText, FileDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasSummary: boolean;
  hasTranscription: boolean;
  hasAudio: boolean;
  meeting: {
    title: string;
    date: string;
    duration: string;
    file_url?: string;
    summary?: {
      text: string;
      topics?: string[];
      actionItems?: string[];
    };
    transcription?: Array<{
      timestamp: string;
      text: string;
    }>;
  };
}

type ContentType = 'summary' | 'transcription' | 'audio';
type FileFormat = 'pdf' | 'docx' | 'csv' | 'mp3';

export default function DownloadModal({
  isOpen,
  onClose,
  hasSummary,
  hasTranscription,
  hasAudio,
  meeting
}: DownloadModalProps) {
  const [selectedType, setSelectedType] = useState<ContentType>('summary');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async (format: FileFormat) => {
    setIsLoading(true);

    // Demo mode - simulate download
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Demo: Would download', {
      format,
      contentType: selectedType,
      meeting: meeting.title
    });

    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Last ned</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={isLoading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content Type Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {hasSummary && (
              <button
                onClick={() => setSelectedType('summary')}
                disabled={isLoading}
                className={cn(
                  'flex-1 py-3 px-4 text-sm font-medium relative',
                  selectedType === 'summary'
                    ? 'text-violet-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Sammendrag
                {selectedType === 'summary' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
                )}
              </button>
            )}
            {hasTranscription && (
              <button
                onClick={() => setSelectedType('transcription')}
                disabled={isLoading}
                className={cn(
                  'flex-1 py-3 px-4 text-sm font-medium relative',
                  selectedType === 'transcription'
                    ? 'text-violet-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Transkripsjon
                {selectedType === 'transcription' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
                )}
              </button>
            )}
            {hasAudio && (
              <button
                onClick={() => setSelectedType('audio')}
                disabled={isLoading}
                className={cn(
                  'flex-1 py-3 px-4 text-sm font-medium relative',
                  selectedType === 'audio'
                    ? 'text-violet-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Lydklipp
                {selectedType === 'audio' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Format Options */}
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Velg format
          </h4>

          <p className="text-xs text-amber-600 mb-4">
            Demo-modus: Nedlasting simulert
          </p>

          <div className="space-y-3">
            {selectedType === 'audio' ? (
              <button
                onClick={() => handleDownload('mp3')}
                disabled={isLoading}
                className="w-full button-primary justify-center py-3 flex items-center"
              >
                <FileDown className="h-5 w-5 mr-2" />
                Last ned lydklipp
                {isLoading && (
                  <div className="ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleDownload('pdf')}
                  disabled={isLoading}
                  className="w-full button-primary justify-center py-3 flex items-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Last ned PDF
                  {isLoading && (
                    <div className="ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                </button>
                <button
                  onClick={() => handleDownload('docx')}
                  disabled={isLoading}
                  className="w-full button-secondary justify-center py-3 flex items-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Last ned DOCX
                </button>
                {selectedType === 'transcription' && (
                  <button
                    onClick={() => handleDownload('csv')}
                    disabled={isLoading}
                    className="w-full button-secondary justify-center py-3 flex items-center"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Last ned CSV
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
