'use client';

import { useEffect, useState } from 'react';
import { FEEDBACK_SOUND_EVENT, feedbackSoundEnabled, setFeedbackSoundEnabled } from '@/lib/audio-preference';

export default function FeedbackSoundControl() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const refresh = () => setEnabled(feedbackSoundEnabled());
    refresh();
    window.addEventListener(FEEDBACK_SOUND_EVENT, refresh);
    return () => window.removeEventListener(FEEDBACK_SOUND_EVENT, refresh);
  }, []);
  return <button type="button" aria-pressed={enabled} onClick={() => setFeedbackSoundEnabled(!enabled)} className="bg-white text-gray-800 font-bold py-3 px-5 rounded-full shadow-lg">{enabled ? '🔊 Learning sounds on — turn off' : '🔇 Learning sounds off — turn on'}</button>;
}
