import assert from 'node:assert/strict';
import test from 'node:test';
import { emptyMathProgress, MATH_PROGRESS_KEY, parseMathProgress, readMathProgress, updateMathProgress } from '../lib/math-progress';
import { numericOptions, placeValueAnswer } from '../lib/math-questions';

function memoryStorage(initial: string | null) {
  let raw = initial;
  let writes = 0;
  return {
    getItem: (key: string) => key === MATH_PROGRESS_KEY ? raw : null,
    setItem: (_key: string, value: string) => { raw = value; writes++; },
    writes: () => writes,
  };
}

test('malformed, oversized, null and non-object progress recover safely', () => {
  for (const raw of ['{', 'null', '[]', 'true', '1', 'x'.repeat(5000), null]) {
    assert.deepEqual(parseMathProgress(raw), emptyMathProgress());
  }
});

test('legacy records retain valid counters and repair missing/invalid fields', () => {
  const stats = parseMathProgress(JSON.stringify({ starsEarned: 12, quizzesPassed: -1, gamesPlayed: '7', totalScore: 1.5 }));
  assert.equal(stats.starsEarned, 12);
  assert.equal(stats.gamesPlayed, 0);
  assert.equal(stats.quizzesPassed, 0);
  assert.equal(stats.totalScore, 0);
});

test('initialization reads saved data without writing or overwriting progress', () => {
  const storage = memoryStorage(JSON.stringify({ ...emptyMathProgress(), totalScore: 50, starsEarned: 5 }));
  assert.equal(readMathProgress(storage).totalScore, 50);
  assert.equal(storage.writes(), 0);
});

test('updates merge the latest activity results instead of a stale page snapshot', () => {
  const storage = memoryStorage(JSON.stringify(emptyMathProgress()));
  const stale = readMathProgress(storage);
  updateMathProgress(current => ({ ...current, totalScore: current.totalScore + 20 }), storage);
  updateMathProgress(current => ({ ...current, lessonsCompleted: current.lessonsCompleted + 1 }), storage);
  assert.equal(stale.totalScore, 0);
  assert.equal(readMathProgress(storage).totalScore, 20);
  assert.equal(readMathProgress(storage).lessonsCompleted, 1);
});

test('malformed progress can be updated and blocked storage cannot crash lessons', () => {
  const storage = memoryStorage('{bad');
  assert.equal(updateMathProgress(current => ({ ...current, starsEarned: 5 }), storage).starsEarned, 5);
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.doesNotThrow(() => updateMathProgress(current => ({ ...current, totalScore: 10 }), blocked));
});

test('quiz distractors terminate at zero with distinct answers', () => {
  for (const answer of [0, 1, 2, 24]) {
    const options = numericOptions(answer);
    assert.equal(options.length, 4);
    assert.equal(new Set(options).size, 4);
    assert(options.includes(answer));
    assert(options.every(value => value >= 0));
  }
});

test('quota failures retain progress within this session', () => {
  const fullStorage = {
    getItem: () => JSON.stringify(emptyMathProgress()),
    setItem: () => { throw new Error('quota'); },
  };
  updateMathProgress(current => ({ ...current, totalScore: 10 }), fullStorage);
  updateMathProgress(current => ({ ...current, totalScore: current.totalScore + 10 }), fullStorage);
  assert.equal(readMathProgress(fullStorage).totalScore, 20);
});

test('place-value answer comes from the new question', () => {
  assert.equal(placeValueAnswer(305, 'ones'), '5');
  assert.equal(placeValueAnswer(305, 'tens'), '0');
  assert.equal(placeValueAnswer(305, 'hundreds'), '3');
  assert.equal(placeValueAnswer(305, 'expanded-form'), '300 + 0 + 5');
});
