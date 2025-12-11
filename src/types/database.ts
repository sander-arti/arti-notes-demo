export interface User {
  id: string;
  email: string;
  organization?: string;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  recording_id: string;
  name: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Recording {
  id: string;
  user_id: string;
  folder_id?: string | null;
  title: string;
  duration: number;
  status: 'processing' | 'completed' | 'error';
  file_url?: string;
  transcription_id?: string;
  created_at: string;
  updated_at: string;
  participants?: Participant[];
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface RecordingTag {
  recording_id: string;
  tag_id: string;
  created_at: string;
}

export interface Transcription {
  id: string;
  recording_id: string;
  user_id: string;
  status: 'processing' | 'completed' | 'error';
  content: TranscriptionSegment[];
  assembly_ai_job_id?: string;
  summary?: string;
  language: string;
  confidence_score?: number;
  speaker_count?: number;
  whisper_response?: any;
  summary_text?: string;
  summary_topics?: string[];
  action_items?: string[];
  created_at: string;
  updated_at: string;
}

export interface TranscriptionSegment {
  text: string;
  timestamp: number;
  duration?: number;
}

export interface UserCalendarToken {
  id: string;
  user_id: string;
  provider: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  created_at: string;
  updated_at: string;
}

export interface MicrosoftConnection {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}