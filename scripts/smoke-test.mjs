import assert from 'node:assert/strict';

const origin = process.env.SUPERFOX_TEST_ORIGIN || 'http://localhost:3000';
for (const [path, heading] of [
  ['/', 'Learn, Play, and Grow'], ['/math-adventures', 'Math Adventures'],
  ['/science-lab', 'Science Lab'], ['/creative-studio', 'Creative Studio'],
]) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert(html.includes(heading), `missing heading on ${path}`);
  assert(!html.includes('pagead2.googlesyndication.com'), 'advertising script returned');
  assert(!html.includes('href="#"'), `dead link on ${path}`);
  if (path === '/') {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'duplicate home IDs');
  }
}
const chat = await fetch(new URL('/api/chat', origin), {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'What is 2 plus 2?' }] }),
});
assert.equal(chat.status, 503);
assert.equal((await chat.json()).code, 'CHAT_DISABLED');
assert.equal((await fetch(new URL('/api/chat', origin))).status, 405);
console.log('Production smoke checks passed: four pages, navigation markup, advertising absent, chat locked, methods restricted.');
