import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Print file names and counts only; never print matching content or Git patches.
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const patterns = [
  /\bsk-[A-Za-z0-9_-]{20,}\b/g,
  /\b(?:ghp|gho|github_pat)_[A-Za-z0-9_]{20,}\b/g,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
];
const findings = [];
for (const file of files) {
  if (!/\.(?:[cm]?[jt]sx?|json|md|txt|ya?ml|toml|env|example|sh|py)$/.test(file)) continue;
  let contents;
  try { contents = readFileSync(file, 'utf8'); } catch { continue; }
  const count = patterns.reduce((total, pattern) => total + [...contents.matchAll(pattern)].length, 0);
  if (count) findings.push({ file, count });
}
if (findings.length) {
  console.error(JSON.stringify({ credentialShapedFindings: findings }));
  process.exitCode = 1;
} else {
  console.log('No credential-shaped values found in current tracked/unignored text files. Historical commits and provider/deployment settings require separate review.');
}
