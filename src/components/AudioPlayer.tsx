import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Point {
  x: number;
  y: number;
}
interface AudioPlayerProps {
  src: string;
  onTimeUpdate?: (currentTime: number) => void;
  onAudioRef?: (ref: HTMLAudioElement) => void;
  onSeek?: (time: number) => void;
  initialDuration?: number;
  className?: string;
}
export default function AudioPlayer({ src, onTimeUpdate, onSeek, onAudioRef, initialDuration, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(initialDuration || 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);

  // Update time more frequently for smoother progress
  const updateTime = () => {
    if (!audioRef.current || !isPlaying) return;
    
    const now = performance.now();
    // Update every 8ms for smoother animation
    if (now - lastUpdateTimeRef.current >= 8) {
      setCurrentTime(audioRef.current.currentTime);
      onTimeUpdate?.(audioRef.current.currentTime);
      
      // Directly update progress bar fill for smoother animation
      if (progressFillRef.current && Number.isFinite(duration) && duration > 0) {
        const percentage = (audioRef.current.currentTime / duration * 100);
        progressFillRef.current.style.width = `${percentage}%`;
      }
      
      lastUpdateTimeRef.current = now;
    }
    
    animationFrameRef.current = requestAnimationFrame(updateTime);
  };

  useEffect(() => {
    setIsLoading(true);
    setIsReady(false);
    setError(null);
    setCurrentTime(0);
    setIsPlaying(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const audio = audioRef.current;
    if (!audio) return;
    audio.crossOrigin = "anonymous";
    
    // Pass audio ref to parent
    onAudioRef?.(audio);
    
    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration) && !isNaN(audio.duration)) {
        // Only update duration if not provided from database
        if (!initialDuration) {
          setDuration(audio.duration);
        }
        setIsLoading(false);
        setIsReady(true);
        // Set initial volume
        audio.volume = volume;
      }
    };
    const handleCanPlay = () => {
      setIsLoading(false);
      setIsReady(true);
    };
    const handleLoadStart = () => {
      setIsLoading(true);
      setIsReady(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    const handleError = () => {
      console.error('Audio loading error:', audio.error);
      let errorMessage = 'Kunne ikke laste lydfilen';
      if (audio.error?.code === 4) {
        errorMessage = 'Lydformatet støttes ikke av nettleseren';
      }
      setError(errorMessage);
      setIsLoading(false);
      setIsReady(false);
    };
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    // Check if audio is already loaded
    if (audio.readyState >= 2) {
      setIsLoading(false);
      setIsReady(true);
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    }
    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [src]);

  // Start/stop animation frame updates based on playing state
  useEffect(() => {
    if (isPlaying) {
      lastUpdateTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = async () => {
    if (!audioRef.current || !isReady) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(false);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Playback error:', err);
      setError('Kunne ikke spille av lydfilen');
      setIsPlaying(false);
    }
  };
  const handleProgressMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current || !isReady) return;
    event.preventDefault();
    setIsDragging(true);
    // Update time immediately on mouse down
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newTime = Math.max(0, Math.min(percentage * duration, duration));
    if (Number.isFinite(newTime) && audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      onTimeUpdate?.(newTime);
    }
    document.addEventListener('mousemove', handleProgressMouseMove);
    document.addEventListener('mouseup', handleProgressMouseUp);
  };
  const handleProgressMouseMove = (event: MouseEvent) => {
    if (!audioRef.current || !progressRef.current || !isDragging || !isReady) return;
    event.preventDefault();
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newTime = Math.max(0, Math.min(percentage * duration, duration));
    
    if (Number.isFinite(newTime)) {
      setCurrentTime(newTime);
      
      // Update progress fill directly during drag
      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${(newTime / duration * 100)}%`;
      }
      
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
        onTimeUpdate?.(newTime);
      }
    }
  };
  const handleProgressMouseUp = () => {
    if (!audioRef.current || !isDragging || !isReady) return;
    const wasPlaying = isPlaying;
    setIsDragging(false);
    // Resume playback if it was playing before dragging
    if (wasPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
    document.removeEventListener('mousemove', handleProgressMouseMove);
    document.removeEventListener('mouseup', handleProgressMouseUp);
  };
  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !isReady) return;
    event.preventDefault();
    const progressBar = progressRef.current;
    const audio = audioRef.current;
    if (!progressBar || !audio || !Number.isFinite(duration) || duration <= 0) return;
    
    const rect = progressBar.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newTime = Math.max(0, Math.min(percentage * duration, duration));
    
    if (Number.isFinite(newTime)) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      onTimeUpdate?.(newTime);
      onSeek?.(newTime);
    }
  };

  const handleSeek = (time: number) => {
    if (!audioRef.current || !isReady) return;
    try {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      onTimeUpdate?.(time);
      onSeek?.(time);
      if (!isPlaying) {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Error seeking:', err);
    }
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (Number.isFinite(newVolume) && audioRef.current) {
      setVolume(newVolume);
      audioRef.current.volume = newVolume;
    }
  };
  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <div className={cn('bg-white rounded-xl p-4 shadow-sm relative', className)}>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        crossOrigin="anonymous"
      />
      {error ? (
        <div className="text-red-600 text-sm text-center py-2">{error}</div>
      ) : (
        <>
          {/* Play Controls */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={togglePlay}
              disabled={!isReady}
              className={cn(
                "p-3 rounded-full text-white transition-colors",
                isReady ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
              )}
              aria-label={isPlaying ? 'Pause' : 'Spill av'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 1)}
                disabled={!isReady}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {volume > 0 ? (
                  <Volume2 className="h-5 w-5 text-gray-600" />
                ) : (
                  <VolumeX className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                disabled={!isReady}
                className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label="Volum"
              />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div
              ref={progressRef}
              className={cn(
                "relative h-2 bg-gray-200 rounded-full group",
                isReady ? "cursor-pointer" : "cursor-not-allowed"
              )}
              onClick={handleProgressClick}
              onMouseDown={handleProgressMouseDown}
            >
              <div
                ref={progressFillRef}
                className="absolute h-full bg-blue-600 rounded-full transition-all group-hover:bg-blue-700"
                style={{ width: `${(currentTime / duration * 100) || 0}%` }}
              />
              {/* Player Head */}
              <div
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-blue-600 transition-opacity",
                  isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
                style={{ left: `${(currentTime / duration * 100) || 0}%` }}
              />
            </div>
            {/* Time Display */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          {isLoading && !isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/75 rounded-xl">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
              <span className="ml-2 text-sm text-gray-600">Laster inn lydfil...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}