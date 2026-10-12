'use client';

export default function WelcomeAudio() {
  return (
    <div className="mx-auto max-w-md px-4 pb-6 text-center">
      <label htmlFor="welcome-audio" className="block font-semibold text-gray-800 mb-2">Listen to Superfox&apos;s welcome 🦊</label>
      <audio id="welcome-audio" controls preload="none" className="w-full" aria-label="Superfox welcome audio">
        <source src="/audio/intro/superfox%20say%20welcome%20to%20website%20visitor.mp3" type="audio/mpeg" />
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}
