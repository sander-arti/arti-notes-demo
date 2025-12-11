import { useState, useRef, useCallback } from 'react';

interface RecordingState {
  isRecording: boolean;
  audioBlob: Blob | null;
  duration: number;
  error: string | null;
  isProcessing: boolean;
}

export function useRecording() {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    audioBlob: null,
    duration: 0,
    error: null,
    isProcessing: false
  });

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);
  const durationInterval = useRef<number>();

  const startRecording = useCallback(async (stream: MediaStream) => {
    try {
      console.log('Starting recording...');
      // Reset state
      setState(prev => ({
        ...prev,
        audioBlob: null,
        duration: 0,
        error: null,
        isProcessing: false
      }));
      audioChunks.current = [];

      // Use simple MediaRecorder options
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });

      mediaRecorder.current = recorder;

      recorder.ondataavailable = (event) => {
        console.log('Data available:', event.data.size);
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        console.log('Recording stopped, processing chunks...');
        setState(prev => ({ ...prev, isProcessing: true }));

        if (audioChunks.current.length > 0) {
          const audioBlob = new Blob(audioChunks.current, {
            type: 'audio/webm'
          });
          console.log('Audio blob created:', audioBlob.size);
          setState(prev => ({
            ...prev,
            audioBlob,
            isProcessing: false
          }));
        } else {
          console.error('No audio chunks recorded');
          setState(prev => ({
            ...prev,
            error: 'Ingen lyd ble tatt opp. Prøv igjen.',
            isProcessing: false
          }));
        }
      };

      recorder.start(1000);
      console.log('MediaRecorder started');
      setState(prev => ({ ...prev, isRecording: true, error: null }));

      durationInterval.current = window.setInterval(() => {
        setState(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } catch (error) {
      console.error('Recording error:', error);
      setState(prev => ({
        ...prev,
        error: 'Kunne ikke få tilgang til mikrofonen. Sjekk tillatelser.',
        isProcessing: false
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    console.log('Stopping recording...');
    if (mediaRecorder.current && state.isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());

      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }

      setState(prev => ({ ...prev, isRecording: false }));
    }
  }, [state.isRecording]);

  const resetRecording = useCallback(() => {
    setState({
      isRecording: false,
      audioBlob: null,
      duration: 0,
      error: null,
      isProcessing: false
    });
    audioChunks.current = [];
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
    }
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording
  };
}
