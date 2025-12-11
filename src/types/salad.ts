export interface SaladSegment {
  start: number;
  end: number;
  text: string;
  speaker?: string;
  confidence?: number;
}

export interface SaladTranscriptionRequest {
  input: {
    url: string;
    language_code: string;
    word_level_timestamps: boolean;
    diarization: boolean;
    sentence_diarization: boolean;
    srt: boolean;
  };
}

export interface SaladApiResponse {
  id: string;
  status: 'pending' | 'created' | 'running' | 'succeeded' | 'failed';
  output?: {
    sentence_level_timestamps: Array<{
      start: number;
      end: number;
      text: string;
      speaker?: string;
    }>;
    word_segments?: Array<{
      start: number;
      end: number;
      text: string;
      confidence?: number;
    }>;
    text: string;
    duration: number;
    processing_time: number;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface SaladTranscriptionResponse {
  id: string;
  status: 'pending' | 'created' | 'running' | 'succeeded' | 'failed';
  text?: string;
  segments?: SaladSegment[];
  error?: string;
  duration?: number;
  processing_time?: number;
}