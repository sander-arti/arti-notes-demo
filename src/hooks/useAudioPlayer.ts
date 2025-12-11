import { useState, useRef, useEffect } from 'react';

interface UseAudioPlayerOptions {
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

export function useAudioPlayer(src: string, options?: UseAudioPlayerOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      options?.onTimeUpdate?.(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      options?.onEnded?.();
    };

    const handleError = () => {
      setError('Kunne ikke laste lydfilen');
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [src, options]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setAudioVolume = (value: number) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolume(value);
    }
  };

  return {
    isPlaying,
    duration,
    currentTime,
    volume,
    isLoading,
    error,
    togglePlay,
    seek,
    setVolume: setAudioVolume
  };
}
