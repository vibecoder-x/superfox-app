export const MATH_PROGRESS_KEY = 'mathAdventuresStats';
export const MATH_PROGRESS_EVENT = 'superfox:math-progress';

export interface MathProgress {
  lessonsCompleted: number;
  quizzesPassed: number;
  starsEarned: number;
  totalScore: number;
  gamesPlayed: number;
  lastActivity: string;
}

export const emptyMathProgress = (): MathProgress => ({
  lessonsCompleted: 0, quizzesPassed: 0, starsEarned: 0,
  totalScore: 0, gamesPlayed: 0, lastActivity: 'Never',
});

type ProgressStorage = Pick<Storage, 'getItem' | 'setItem'>;
let sessionProgress = emptyMathProgress();
const unsavedProgress = new WeakMap<ProgressStorage, MathProgress>();

export function parseMathProgress(raw: string | null): MathProgress {
  const defaults = emptyMathProgress();
  if (!raw || raw.length > 4096) return defaults;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) return defaults;
    const data = value as Record<string, unknown>;
    for (const key of ['lessonsCompleted', 'quizzesPassed', 'starsEarned', 'totalScore', 'gamesPlayed'] as const) {
      const count = data[key];
      if (typeof count === 'number' && Number.isSafeInteger(count) && count >= 0) defaults[key] = count;
    }
    if (typeof data.lastActivity === 'string' && data.lastActivity.length <= 40) defaults.lastActivity = data.lastActivity;
    return defaults;
  } catch {
    return defaults;
  }
}

function browserStorage(): ProgressStorage | undefined {
  try { return typeof window === 'undefined' ? undefined : window.localStorage; } catch { return undefined; }
}

export function readMathProgress(storage = browserStorage()): MathProgress {
  if (!storage) return { ...sessionProgress };
  const unsaved = unsavedProgress.get(storage);
  if (unsaved) return { ...unsaved };
  try { return parseMathProgress(storage.getItem(MATH_PROGRESS_KEY)); } catch { return { ...sessionProgress }; }
}

// Read the latest record when an activity actually changes progress. Mounting never writes defaults.
export function updateMathProgress(update: (current: MathProgress) => MathProgress, storage = browserStorage()): MathProgress {
  const next = parseMathProgress(JSON.stringify(update(readMathProgress(storage))));
  sessionProgress = next;
  try {
    storage?.setItem(MATH_PROGRESS_KEY, JSON.stringify(next));
    if (storage) unsavedProgress.delete(storage);
  } catch {
    if (storage) unsavedProgress.set(storage, next);
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(MATH_PROGRESS_EVENT));
  return next;
}
