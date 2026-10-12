# Security and child safety — Phase 1

## Credential incident and immediate owner actions

A DeepSeek API credential was hardcoded in the public `app/api/chat/route.ts`. Treat it as compromised. Phase 1 removes the credential from current application source and replaces it with server-only configuration. Source removal does **not** revoke the old key or remove earlier Git commits.

A second secret-shaped credential was found in tracked local tool settings, `.claude/settings.local.json`. This file is removed from tracking and `.claude/` is ignored; the local file is retained. Review its credentials privately and treat any credential exposed through repository history as compromised. Do not paste credential values into issues, documentation, terminal output, shell arguments, or chat.

The project owner must:

1. Revoke the exposed DeepSeek key directly in the provider dashboard immediately. Revoke any other exposed key found in the local settings. No provider credential has been revoked or rotated by this implementation.
2. Privately review provider usage and billing for unexpected activity, and review deployment settings and build logs for additional copies.
3. Create a fresh credential only if the adult developer preview is needed. Store it as `DEEPSEEK_API_KEY` in an ignored `.env.local`, or the host's server-side secret settings. Never add a `NEXT_PUBLIC_` prefix.
4. Remove obsolete deployment secrets, deploy the hardened application, and verify the live production chat endpoint returns `503` with `CHAT_DISABLED` and the interface offers existing learning activities.
5. Enable available repository secret scanning and push protection. Ensure everyone uses placeholders in examples and reviews staged files without displaying historical secret values.

## Current chat architecture

`lib/server/chat-config.ts` has a `server-only` import and is the only chat module that reads environment variables. `DEEPSEEK_API_KEY` is passed directly to the upstream authorization header inside the server route; it is never passed as a client prop. `.env.example` contains placeholders only. `.gitignore` excludes environment files, local settings, private-key file types, and generated test output.

Open-ended AI chat is locked in every environment except exact `NODE_ENV=development` plus explicit `SUPERFOX_CHAT_PREVIEW_ENABLED=true`. Public production remains locked even if that flag is accidentally enabled and a key is configured. The API checks the production lock before processing conversations or calling DeepSeek. No production API key is required to use the educational application.

The homepage receives only a server-derived boolean. With chat disabled, the Superfox dialog shows a branded explanation, Math Adventures and Story Library links, and a predefined activity. There is no question field or provider call in that state. The adult developer preview is clearly labeled and requires no real child's conversation or personal details for testing.

The API accepts POST only; other methods return `405` with `Allow: POST`. It rejects cross-origin browser submissions, non-JSON content types, compressed requests, malformed JSON, unexpected fields, invalid roles, invalid role ordering, empty content, and disallowed control characters. Requests are bounded by the bytes actually read from the body, even without a `Content-Length` header.

| Control | Current limit |
| --- | --- |
| Request body | 16,384 bytes; 5-second read timeout |
| Conversation | 11 messages maximum, alternating user/assistant, starting and ending with user |
| User message | 500 JavaScript string characters, before trimming |
| Assistant message | 1,000 JavaScript string characters |
| Total conversation | 6,000 trimmed JavaScript string characters |
| Upstream request | 12-second total timeout; aborted on timeout or client disconnection |
| Upstream response body | 8,192 bytes |
| Upstream generation | 150-token output cap |
| Adult local preview quota | Five requests per rolling minute, shared across the local process |

Client requests contain only user and assistant roles. The server adds its own system instructions. Error responses contain a stable code and a short, safe message; internal exceptions, provider bodies, and credentials are never returned. The client uses a predefined fallback for failures. Application chat code does not log raw questions, responses, upstream bodies, or exceptions and adds no conversation analytics. Responses use `Cache-Control: no-store`.

The preview keeps messages in React memory in the current tab; it does not write conversation history to localStorage or a database. Preview questions and recent history are transmitted to DeepSeek. This application does not control or guarantee that provider's retention, training, security, or disclosure practices. Hosting and provider metadata handling must be reviewed separately.

## Abuse protection and known limitations

The process-local limiter is **only for the optional developer preview**. It is not a production limiter and does not coordinate multiple instances. Public production fails closed, so the open-ended AI endpoint cannot incur provider requests through this application. No new paid service or external infrastructure was introduced during Phase 1.

There is no implemented authentication, verified parental consent, age assurance, parental control backend, independently verified moderation, personal-information detector, or distress escalation system. The system prompt is defense in depth, not a child-safety guarantee. Preview users can supply assistant history; its integrity is not verified. The development preview must not be exposed as a public child-facing deployment.

Local math progress and creative artwork remain browser-based, without accounts or synchronization. Their privacy statements must reflect their actual storage scope. Application settings and scripts cannot establish legal compliance. Obtain a separate legal and privacy review before enabling services that process children's personal information.

## Dependency audit and remaining tooling risk

After the Next.js security update and PostCSS/parser overrides, the 12 October 2026 audit reports zero production dependency vulnerabilities with `npm audit --omit=dev`. The full audit still reports seven high findings, all in the development tooling chain through Tailwind 3, ESLint, glob matching, and `braces`. These are propagated package findings from an upstream issue, not seven independent application exploits. The [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) currently lists no patched release. Do not process attacker-supplied glob patterns or expose the development server publicly. Review a future tooling migration separately and continue monitoring the advisory.

Next.js pinned an older PostCSS copy; the override reuses patched PostCSS 8 from the project's declared dependency. [PostCSS 8.5.23](https://github.com/postcss/postcss/releases/tag/8.5.23) supplies the final source-map guard required by the reviewed advisories. The selector-parser override uses version 7.1.6 or later to address [the CPU-exhaustion issue](https://github.com/advisories/GHSA-rj75-hqrm-r3gf). An isolated comparison of this application's Tailwind/autoprefixer output before and after the parser upgrade was byte-identical. Overrides still need the ordinary clean install, build, test, and visual verification whenever dependencies change.

The application has no current public route for processing user CSS or glob patterns; this reduces the observed public reachability of those tooling issues. That is an assessment of the current code, not a claim that every dependency or build environment is vulnerability-free. Key revocation, a hardened deployment, and verification of the live production lock remain separate manual requirements.

## Acceptance gates for a future public chat release

Keep the production lock until all of these controls have been implemented and verified:

- Verified parental consent where required, age-appropriate access, adult-managed permissions, usage limits, deletion controls, and a documented legal/privacy review.
- Educational scope with independently evaluated age-appropriate input and output moderation; adversarial tests covering prompt injection and abusive requests. A friendly prompt alone is insufficient.
- Minimal collection, explicit prohibition and detection of names/contact details/addresses/passwords/photos, no requests for personal information, and a documented retention/deletion policy covering hosting and the provider. Avoid raw-conversation analytics and logs.
- Safe handling of bullying, distress, harmful content, and inappropriate requests, including appropriate trusted-adult guidance. Test escalation and fallback behavior with specialists.
- No unrestricted external links, advertising, solicitation, or chat-initiated purchases. Enforce this on the server and verify outputs, rather than relying on the prompt.
- A distributed quota store or equivalent existing managed infrastructure, with trusted identities, deployment-wide limits, burst/concurrency limits, spend limits, and a fail-closed response when protection is unavailable. Document the cost and rationale before introducing another service.
- Server-owned or integrity-protected history; clear session boundaries, request cancellation, safe errors, and regression tests for all protections. Test deployed multiple-instance behavior with mocked upstream responses before any child-facing launch.
- A deliberate code review and deployment verification to remove the hard production lock only after these acceptance gates pass.

## Git history: a separate owner-controlled procedure

No shared history has been rewritten and no force push is part of Phase 1. Revocation is the first response to exposed credentials. If historical removal is still needed, coordinate it separately with repository owners and collaborators because rewritten commits change identifiers and can disrupt branches and pull requests. Use a fresh, isolated checkout with `git-filter-repo`, remove the settings file from all affected paths/refs, and replace secret text using a private input file outside the repository. Do not print that input or commit it. Privately scan the result and agree on the update before altering shared history. Collaborators must clean or replace old clones to avoid reintroducing the secret. Copies in forks, cached views, and pull-request references need separate handling; a history rewrite cannot revoke a credential or erase every existing copy. Follow [GitHub's sensitive-data removal procedure](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

## Verification

`npm test` compiles the isolated TypeScript test configuration and uses Node's built-in test runner. Chat security tests mock every provider response and require no real API credential or paid request. They cover production lock/opt-in, missing configuration, methods, malformed input, invalid roles and histories, character/body/history bounds, cross-origin/content rules, local preview quotas, safe upstream errors, timeouts, and client-disconnection cancellation.

Also run `npm ci`, `npx tsc --noEmit`, `npm run lint`, and `npm run build` before deployment. A passing local build verifies the source configuration; it does not prove the public deployment has been updated or that manual key revocation has occurred.
