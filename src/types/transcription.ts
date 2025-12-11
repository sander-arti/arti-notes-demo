export interface TranscriptionSegment {
  text: string;
  timestamp: number;
  duration: number;
  speaker?: string;
  confidence?: number;
}

export interface SaladSegment {
  start: number;
  end: number;
  text: string;
  speaker?: string;
  confidence?: number;
}

export interface TranscriptionContent {
  segments: TranscriptionSegment[];
  language: string;
  speaker_count?: number;
  confidence_score?: number;
}

export type TranscriptionStatus = 'processing' | 'completed' | 'error';

export interface Transcription {
  id: string;
  recording_id: string;
  user_id: string;
  status: TranscriptionStatus;
  content: TranscriptionContent;
  salad_job_id?: string;
  language: string;
  speaker_count?: number;
  confidence_score?: number;
  created_at: string;
  updated_at: string;
}