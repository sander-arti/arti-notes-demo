import { useState, useRef, useCallback } from 'react';

interface AudioRecorderState {
  isRecording: boolean;
  audioBlob: Blob | null;
  duration: number;
  error: string | null;
}

export function useAudioRecorder() {
  const [state, setState] = useState<AudioRecorderState>({
    isRecording: false,
    audioBlob: null,
    duration: 0,
    error: null
  });
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const durationInterval = useRef<number>();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setState(prev => ({ ...prev, audioBlob }));
      };

      mediaRecorder.current.start(1000);
      setState(prev => ({ ...prev, isRecording: true, error: null }));

      durationInterval.current = window.setInterval(() => {
        setState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Kunne ikke få tilgang til mikrofonen. Sjekk tillatelser.'
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && state.isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      clearInterval(durationInterval.current);
      setState(prev => ({ ...prev, isRecording: false }));
    }
  }, [state.isRecording]);

  return {
    ...state,
    startRecording,
    stopRecording
  };
}