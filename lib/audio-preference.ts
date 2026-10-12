export const FEEDBACK_SOUND_EVENT = 'superfox:feedback-sound';
let enabled = false;
export function feedbackSoundEnabled() { return enabled; }
export function setFeedbackSoundEnabled(value: boolean) {
  enabled = value;
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(FEEDBACK_SOUND_EVENT));
}
