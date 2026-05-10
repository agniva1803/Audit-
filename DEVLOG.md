# DEVLOG — SpendWise AI

## Day 1 — 2026-05-04

**Hours worked:** 4

**What I did:** Read assignment thoroughly twice. Set up Next.js 15 project with TypeScript and Tailwind. Designed the data model (ToolEntry, AuditInput, AuditResult types). Built first draft of the pricing data in `lib/pricing.ts` and started the audit engine skeleton. Verified official pricing URLs for Cursor, GitHub Copilot, Claude, ChatGPT.

**What I learned:** Next.js 15 App Router changed `params` to be async Promises — `await params` now required in page components. Caught this early.

**Blockers / what I'm stuck on:** Nanoid v5 is ESM-only and doesn't play nicely with Jest + ts-jest in CommonJS mode. Need to mock it or switch to a CJS alternative.

**Plan for tomorrow:** Finish audit engine rules, write first 5 tests, start on the form UI.

---

## Day 2 — 2026-05-05

**Hours worked:** 5

**What I did:** Completed audit engine with 5 rules (team-plan right-sizing, use-case mismatch, alternative-tool suggestion, API spend threshold, retail vs credits). Wrote 8 Jest tests — all passing after mocking nanoid. Started the AuditForm component.

**What I learned:** The rule for suggesting alternative tools required me to build a capability-score matrix per use case. Writing it out made me realize coding tools (Cursor, Copilot) should never be suggested as writing alternatives — obvious in retrospect, not obvious in code.

**Blockers / what I'm stuck on:** Form state sync between plan dropdown and monthlySpend auto-calculation is tricky — need to not overwrite user-entered spend when they change seats.

**Plan for tomorrow:** Finish form UI, build result page, wire up API routes.

---

## Day 3 — 2026-05-06

**Hours worked:** 6

**What I did:** Completed AuditForm with localStorage persistence. Built the three API routes (`/api/audit`, `/api/result`, `/api/lead`). Built ResultClient with per-tool breakdown cards, hero savings block, and shareable link copy. Integrated Anthropic SDK for AI summary with fallback.

**What I learned:** The `generateMetadata` function in Next.js App Router needs `await params` too. The OG tags for result pages need to be server-side rendered — important for the viral sharing loop.

**Blockers / what I'm stuck on:** AI summary sometimes exceeds 120 words. Need to prompt more tightly.

**Plan for tomorrow:** Polish UI, build LeadCapture component, write markdown docs.

---

## Day 4 — 2026-05-07

**Hours worked:** 5

**What I did:** Built LeadCapture component with honeypot spam protection. Added rate limiting to `/api/audit`. Tightened AI summary prompt — added explicit word count instruction. Wrote `PRICING_DATA.md`, `PROMPTS.md`, `ARCHITECTURE.md` with Mermaid diagram.

**What I learned:** Honeypot is more user-friendly than hCaptcha and catches >90% of automated submissions. Documented the reasoning in `ARCHITECTURE.md` and `README.md` decisions section.

**Blockers / what I'm stuck on:** Resend email integration needs an API key I don't have in this environment — logged as a TODO in the code with clear instructions.

**Plan for tomorrow:** Write entrepreneurial files (GTM, ECONOMICS, USER_INTERVIEWS), add CI workflow.

---

## Day 5 — 2026-05-08

**Hours worked:** 5

**What I did:** Conducted 3 user interviews (DM'd founders on X and used college network). Wrote GTM.md, ECONOMICS.md, USER_INTERVIEWS.md, LANDING_COPY.md, METRICS.md. Added GitHub Actions CI workflow. Verified all tests still pass.

**What I learned:** Talking to actual users changed two design decisions: (1) founders want to see the audit result before any email ask — confirmed my "value first" approach; (2) CTOs care more about per-seat cost benchmarks than total spend — added the per-seat view to the breakdown.

**Blockers / what I'm stuck on:** Can't fully test the transactional email flow without a Resend API key. Code is wired up and commented — just needs the key.

**Plan for tomorrow:** Final polish, REFLECTION.md, env file, deploy check.

---

## Day 6 — 2026-05-09

**Hours worked:** 4

**What I did:** Final UI polish — tightened spacing, improved mobile layout, added loading states. Wrote REFLECTION.md with all 5 answers. Created `.env.example`. Verified build passes (`npm run build`). Checked git log to confirm commits across 5+ days.

**What I learned:** The result page hero card is the "screenshot moment" — the one thing users share. Getting that number large, clear, and green is worth 2 hours of CSS.

**Blockers / what I'm stuck on:** None outstanding. All 6 MVP features complete.

**Plan for tomorrow:** Final submission review, README screenshots, submit.

---

## Day 7 — 2026-05-10

**Hours worked:** 2

**What I did:** Added screenshots to README. Final review of all markdown files. Checked git log for 5+ calendar days. Verified deployed URL. Submitted form.

**What I learned:** The git hygiene check (`git log --pretty=format:"%ad" --date=short | sort -u | wc -l`) is a real programmatic check — glad I verified early.

**Blockers / what I'm stuck on:** None. Project complete.

**Plan for tomorrow:** N/A — submitted.
