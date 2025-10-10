import { useRef, useCallback, useEffect } from 'react';

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = useCallback((audioPath: string) => {
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

      // Play with better error handling
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playing successfully:', encodedPath);
          })
          .catch((error) => {
            console.error('Error playing audio:', error.message, 'Path:', encodedPath);
            // Retry once after a short delay
            setTimeout(() => {
              audio.play().catch(e => console.error('Retry failed:', e));
            }, 100);
          });
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { playAudio, stopAudio };
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
  welcome: '/audio/intro/superfox%20say%20welcome%20to%20website%20visitor.mp3',
  story: '/audio/intro/The%20Magical%20Forest%20story.mp3',
};

export const getRandomAudio = (audioArray: string[]) => {
  return audioArray[Math.floor(Math.random() * audioArray.length)];
};
