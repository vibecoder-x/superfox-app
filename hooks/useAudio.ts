import { useRef, useCallback, useEffect, useState } from 'react';
import { feedbackSoundEnabled, FEEDBACK_SOUND_EVENT } from '@/lib/audio-preference';

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackVersion = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    const versionRef = playbackVersion;
    const stopDisabledSounds = () => {
      if (feedbackSoundEnabled()) return;
      versionRef.current++;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      setIsPlaying(false);
    };
    window.addEventListener(FEEDBACK_SOUND_EVENT, stopDisabledSounds);
    return () => {
      window.removeEventListener(FEEDBACK_SOUND_EVENT, stopDisabledSounds);
      versionRef.current++;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = useCallback(async (audioPath: string): Promise<boolean> => {
    if (!feedbackSoundEnabled()) return false;
    const version = ++playbackVersion.current;
    try {
      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      // Encode the audio path to handle special characters
      const encodedPath = encodeURI(audioPath);

      // Create new audio instance
      const audio = new Audio(encodedPath);
      audioRef.current = audio;

      // Set volume
      audio.volume = 1.0;

      setAudioError(null);
      audio.addEventListener('ended', () => {
        if (audioRef.current === audio) setIsPlaying(false);
      });
      audio.addEventListener('error', () => {
        if (audioRef.current === audio) {
          setIsPlaying(false);
          setAudioError('Audio is unavailable right now. You can keep learning without sound.');
        }
      });
      await audio.play();
      if (audioRef.current === audio) setIsPlaying(true);
      return audioRef.current === audio;
    } catch {
      if (playbackVersion.current === version) {
        setIsPlaying(false);
        setAudioError('Audio could not start. Try the sound button again.');
      }
      return false;
    }
  }, []);

  const stopAudio = useCallback(() => {
    playbackVersion.current++;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  return { playAudio, stopAudio, isPlaying, audioError };
};

// Math Adventures audio files - simple numbered filenames
export const mathAudioFiles = {
  correct: [
    '/audio/math-adventures/correct1.mp3',
    '/audio/math-adventures/correct2.mp3',
    '/audio/math-adventures/correct3.mp3',
    '/audio/math-adventures/correct4.mp3',
    '/audio/math-adventures/correct5.mp3',
    '/audio/math-adventures/correct6.mp3',
  ],
  incorrect: [
    '/audio/math-adventures/wrong1.mp3',
    '/audio/math-adventures/wrong2.mp3',
    '/audio/math-adventures/wrong3.mp3',
    '/audio/math-adventures/wrong4.mp3',
  ],
  encouragement: [
    '/audio/math-adventures/correct1.mp3',
    '/audio/math-adventures/correct2.mp3',
    '/audio/math-adventures/correct3.mp3',
  ],
  welcome: '/audio/intro/superfox say welcome to website visitor.mp3',
  story: '/audio/intro/The Magical Forest.mp3',
};

export const getRandomAudio = (audioArray: string[]) => {
  return audioArray[Math.floor(Math.random() * audioArray.length)];
};
