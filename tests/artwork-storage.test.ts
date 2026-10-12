import assert from 'node:assert/strict';
import test from 'node:test';
import { readArtworks, saveArtwork, writeArtworks } from '../components/creative/artworkStorage';

const artwork = { id: 'artwork-100', dataUrl: 'data:image/png;base64,aGVsbG8=', timestamp: 100 };

function storage(initial: string | null = null, failWrites = false) {
  let raw = initial;
  const fake: Storage = {
    getItem: key => key === 'superfox-artworks' ? raw : null,
    setItem: (_key, value) => { if (failWrites) throw new Error('quota'); raw = value; },
    removeItem: () => { raw = null; },
    clear: () => { raw = null; },
    key: () => 'superfox-artworks',
    length: initial ? 1 : 0,
  };
  Object.defineProperty(globalThis, 'localStorage', { value: fake, configurable: true });
  return () => raw;
}

test('artwork storage reads valid local PNGs and does not write during initialization', () => {
  const initial = JSON.stringify([artwork]);
  const raw = storage(initial);
  assert.deepEqual(readArtworks(), [artwork]);
  assert.equal(raw(), initial);
});

test('artwork storage rejects malformed JSON and non-array collections without overwriting them', () => {
  for (const value of ['{', 'null', '{}', '42']) {
    const raw = storage(value);
    assert.throws(() => readArtworks());
    assert.throws(() => saveArtwork(artwork.dataUrl, 'artwork'));
    assert.equal(raw(), value);
  }
});

test('artwork storage filters invalid schemas and arbitrary or active-content URLs', () => {
  storage(JSON.stringify([
    artwork,
    null,
    { ...artwork, id: '../outside' },
    { ...artwork, timestamp: '100' },
    { ...artwork, timestamp: -1 },
    { ...artwork, dataUrl: 'https://example.com/tracker.png' },
    { ...artwork, dataUrl: 'javascript:alert(1)' },
    { ...artwork, dataUrl: 'data:image/svg+xml;base64,aGVsbG8=' },
  ]));
  assert.deepEqual(readArtworks(), [artwork]);
});

test('saving preserves existing artwork and deleting writes the updated collection', () => {
  storage(JSON.stringify([artwork]));
  saveArtwork(artwork.dataUrl, 'coloring');
  const saved = readArtworks();
  assert.equal(saved.length, 2);
  assert.deepEqual(saved[0], artwork);
  assert.match(saved[1].id, /^coloring-\d+$/);
  writeArtworks([saved[1]]);
  assert.deepEqual(readArtworks(), [saved[1]]);
});

test('quota failures and rejected artwork cannot erase an existing gallery', () => {
  const initial = JSON.stringify([artwork]);
  const raw = storage(initial, true);
  assert.throws(() => saveArtwork(artwork.dataUrl, 'artwork'), /quota/);
  assert.throws(() => writeArtworks([]), /quota/);
  assert.throws(() => saveArtwork('https://example.com/art.png', 'artwork'), /Invalid artwork/);
  assert.equal(raw(), initial);
});

test('blocked browser storage propagates a controlled failure for the interface to handle', () => {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('blocked'); } });
  assert.throws(() => readArtworks(), /blocked/);
  assert.throws(() => saveArtwork(artwork.dataUrl, 'artwork'), /blocked/);
});
