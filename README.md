# 🦊 Superfox.net

An existing Next.js App Router educational playground for children aged 5–12. Phase 1 preserves its illustrations, lessons, games, animations, and audio while securing the API and repairing stability and accessibility defects.

## What is available

- **Math Adventures:** 22 existing activity entries, including the three guided Math Tutor lessons, quiz, counting/matching/sequence games, arithmetic, shapes, patterns, fractions, money, time, measurement, place value, comparison, estimation, graphs, and decimals.
- **Science Lab:** Space Explorer with planet information, solar-system view, and quiz. Nature, experiments, human body, and weather are clearly marked Coming Soon.
- **Creative Studio:** drawing tools, four coloring books, PNG download, and a gallery stored in this browser. Existing coloring pages: Fruits 11, Jungle 13, Dinosaurs 13, Animals 6.
- **Story Library:** The Magical Forest's illustrated pages and user-controlled narration. Other story cards are Coming Soon; category filters work.
- **Mini-Games:** Superfox Runner and Color Match. Number Quest, Shape Builder, and Music Maker are Coming Soon.
- **Parent Zone:** current storage/privacy information, FAQ, and a link to browser-local math progress. Accounts, parental consent, a parent dashboard, automated screen-time controls, and support/newsletter services are unavailable.
- **Superfox:** a branded activity dialog. Open-ended AI chat is hard-disabled in every production build.

Math Tutor completions, finished quizzes, and solved Number Games rounds update browser-local counters. Other math activities have session scores; there is no platform-wide badge or level system. Browser storage can be cleared, blocked, or exhausted, and is not a secure account or backup. It does not sync across devices. See [the audited status and action inventory](docs/PROJECT_STATUS.md).

## Local development

Use Node.js 22 or newer and npm; Node.js 24 is used for Phase 1 verification.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Default lessons, games, artwork, and the disabled-chat experience require **no secrets or external API calls**.

Copy `.env.example` to `.env.local` only if a developer needs the optional local AI preview. Never put credentials in source, browser storage, `NEXT_PUBLIC_*` variables, or commits.

| Variable | Default | Purpose |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | absent | New, server-only provider credential; only needed for optional developer preview. Revoke the previously exposed key first. |
| `SUPERFOX_CHAT_PREVIEW_ENABLED` | `false` | Exact `true` enables an unverified developer preview only under `npm run dev`. It cannot enable production chat. |

The preview sends questions and supplied history to DeepSeek. Use synthetic adult test content only. The friendly prompt is not a verified child-safety system. Do not expose the development server publicly. An in-memory quota is used only for local preview, never as a production protection.

## Verification

```sh
npm ci
npx tsc --noEmit
npm run lint
npm test
npm run build
npm run scan:secrets
npm audit
```

Lint uses ESLint's flat configuration and fails on warnings. Tests compile into ignored `.test-build/` and use Node's built-in test runner. They cover the production chat lock, invalid inputs/roles/limits, missing configuration, mocked provider failures/timeouts, navigation markup, question regressions, and progress/artwork storage. Tests do not call a paid AI API.

For checks against the built server, start it in another terminal:

```sh
npm start
npm run test:smoke
```

Set `SUPERFOX_TEST_ORIGIN` to test another local port. Smoke checks verify all four routes, navigation markup, absence of advertising, restricted HTTP methods, and production-disabled chat. Browser QA additionally checks mobile/tablet/desktop layout, keyboard/focus behavior, games, drawing, narration controls, and reduced motion. Static tests alone do not prove full accessibility.

## Production deployment

The configured repository is https://github.com/vibecoder-x/superfox-app, with primary branch `master`. Vercel uses `npm ci` and `npm run build`; a conventional host uses `npm start` after building. Do not set `NODE_ENV=development` on a public host. Leave `SUPERFOX_CHAT_PREVIEW_ENABLED=false`; a production deployment does not need a DeepSeek key in Phase 1.

The compromised key must be revoked by the owner in the DeepSeek dashboard, and a fresh key added only to the appropriate server-side environment if local preview is needed. Pushing source does not prove deployment succeeded: verify the deployed build and `/api/chat` lock after deployment. Review [SECURITY.md](docs/SECURITY.md) for manual incident actions and the future production safety gates.

The app contains no authentication, conversation persistence, custom analytics, or active advertising integration. Hosting and Google Fonts can receive connection information. Public privacy text describes these limits and makes no legal-compliance guarantee. Formal policies require owner and legal review.

## Child safety and accessibility

Public chat remains locked until verified parental consent where required, moderation and distress handling, personal-information protection, prompt-injection defenses, distributed quotas, and privacy/retention controls are implemented and tested. A flag alone cannot remove the production lock. The current application is not certified child-safe or legally compliant.

Welcome and story audio start only from their playback controls. Math feedback sound starts off; children can explicitly turn it on or stop it. Reduced-motion preferences are respected, including continuous decoration, and the runner offers pause/resume. Lessons and games remain playable without sound.

## Adding lessons and games later

1. Extend the existing `components/math`, `components/science`, `components/creative`, `components/stories`, or `components/games` architecture. Keep the Superfox palette in `tailwind.config.ts` and existing artwork.
2. Register actual destinations or handlers in the appropriate hub. Advertise only implemented submodes; label unfinished work Coming Soon.
3. Use semantic buttons/links, descriptive labels, visible focus, and `ActivityDialog` for modal activities. Support touch and keyboard input, small viewports, pause controls, and reduced motion. Keep educational feedback in text as well as audio.
4. Use bounded question generators and validate numeric answers exactly. Cancel timers when a mode changes or unmounts; `useActivityTimer` provides this behavior.
5. Update math counters through `lib/math-progress.ts`; use `useMathProgress` to read them. Never write default counters on mount or independently overwrite the complete storage record. Keep local storage limitations visible.
6. Keep provider credentials and safety checks server-only. Add meaningful regression tests, then run type-check, lint, tests, build, smoke, and relevant browser checks before pushing.

The final Phase 1 runtime dependency audit reports zero findings. Seven high findings remain in development tooling through one unpatched braces issue; see SECURITY.md. Do not expose the development server or process untrusted CSS/glob inputs. No forced tooling migration was performed.

Backend accounts, Reading World, additional content, parental controls, and production AI belong to later phases. Phase 1 does not implement that roadmap.
