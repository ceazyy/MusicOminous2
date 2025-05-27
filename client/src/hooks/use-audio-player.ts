import { useState, useRef, useCallback } from "react";

interface AudioPlayerState {
  isPlaying: boolean;
  currentTrack: number | null;
  duration: number;
  currentTime: number;
}

export function useAudioPlayer() {
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTrack: null,
    duration: 0,
    currentTime: 0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playTrack = useCallback((trackId: number, audioUrl: string) => {
    // Stop any currently playing track
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState(prev => ({
      ...prev,
      isPlaying: true,
      currentTrack: trackId,
    }));

    // Since we don't have actual audio files, simulate playback
    // In a real implementation, you would create an actual Audio element
    // audioRef.current = new Audio(audioUrl);
    // audioRef.current.play();

    // Simulate 30-second preview
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        currentTrack: null,
      }));
    }, 30000);
  }, []);

  const stopTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setState(prev => ({
      ...prev,
      isPlaying: false,
      currentTrack: null,
    }));
  }, []);

  return {
    isPlaying: state.isPlaying,
    currentTrack: state.currentTrack,
    duration: state.duration,
    currentTime: state.currentTime,
    playTrack,
    stopTrack,
  };
}
