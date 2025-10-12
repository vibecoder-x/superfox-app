'use client';

import { useEffect, useRef } from 'react';
import HeroSection from '@/components/HeroSection';
import LearningWorld from '@/components/LearningWorld';
import StoryLibrary from '@/components/StoryLibrary';
import MiniGames from '@/components/MiniGames';
import AboutSuperfox from '@/components/AboutSuperfox';
import ParentZone from '@/components/ParentZone';
import Footer from '@/components/Footer';
import SuperfoxChat from '@/components/SuperfoxChat';

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play welcome audio automatically and stop on any button click
  useEffect(() => {
    const hasPlayedWelcome = sessionStorage.getItem('superfoxWelcomePlayed');

    if (!hasPlayedWelcome) {
      const audioPath = '/audio/intro/superfox%20say%20welcome%20to%20website%20visitor.mp3';
      const audio = new Audio(audioPath);
      audio.volume = 1.0;
      audioRef.current = audio;

      // Try to play automatically
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Welcome audio playing automatically');
            sessionStorage.setItem('superfoxWelcomePlayed', 'true');
          })
          .catch(err => {
            console.log('Autoplay blocked by browser, trying with user interaction');

            // Fallback: play on first interaction
            const playOnInteraction = () => {
              audio.play()
                .then(() => {
                  console.log('Welcome audio playing after interaction');
                  sessionStorage.setItem('superfoxWelcomePlayed', 'true');
                })
                .catch(e => console.error('Failed to play audio:', e));

              // Remove listeners after first attempt
              document.removeEventListener('click', playOnInteraction);
              document.removeEventListener('keydown', playOnInteraction);
              document.removeEventListener('touchstart', playOnInteraction);
            };

            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('keydown', playOnInteraction, { once: true });
            document.addEventListener('touchstart', playOnInteraction, { once: true });
          });
      }
    }

    // Stop audio when any button is clicked
    const handleButtonClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'A' || target.closest('a')) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          console.log('Welcome audio stopped due to button click');
        }
      }
    };

    document.addEventListener('click', handleButtonClick);

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', handleButtonClick);
    };
  }, []);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <LearningWorld />
      <StoryLibrary />
      <MiniGames />
      <AboutSuperfox />
      <ParentZone />
      <Footer />
      <SuperfoxChat />
    </main>
  );
}
