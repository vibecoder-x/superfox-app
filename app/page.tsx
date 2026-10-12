import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import LearningWorld from '@/components/LearningWorld';
import StoryLibrary from '@/components/StoryLibrary';
import MiniGames from '@/components/MiniGames';
import AboutSuperfox from '@/components/AboutSuperfox';
import ParentZone from '@/components/ParentZone';
import Footer from '@/components/Footer';
import SuperfoxChat from '@/components/SuperfoxChat';
import WelcomeAudio from '@/components/WelcomeAudio';
import { isChatPreviewEnabled } from '@/lib/server/chat-config';

export default function Home() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navigation />
      <HeroSection />
      <WelcomeAudio />
      <section id="learning"><LearningWorld /></section>
      <StoryLibrary />
      <MiniGames />
      <section id="about"><AboutSuperfox /></section>
      <section id="parent"><ParentZone /></section>
      <Footer />
      <SuperfoxChat enabled={isChatPreviewEnabled()} />
    </main>
  );
}
