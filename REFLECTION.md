# REFLECTION

## 1. Hardest bug — nanoid ESM in Jest

The hardest bug was getting the audit engine tests to run at all. `nanoid` v5 is ESM-only and doesn't export a CommonJS module. When Jest (running in CommonJS mode via ts-jest) tried to import it, it threw: `SyntaxError: Cannot use import statement outside a module`.

My first hypothesis was that I needed to switch Jest to ESM mode (`"type": "module"` in package.json + `--experimental-vm-modules`). I tried that — it broke ts-jest's transform pipeline, and the error moved to a different import.

Second hypothesis: downgrade nanoid to v3 (the last CJS version). That would have worked but introduced a version mismatch with the app's production code.

What actually worked: created a manual Jest mock at `__mocks__/nanoid.js` that exports `{ nanoid: (size) => \`test-id-${++counter}\` }` and added a `moduleNameMapper` entry in `jest.config.js`. This keeps production code using nanoid v5 ESM while tests use a synchronous stub. The stub also produces deterministic IDs, which made the "unique ID" test meaningful.

The lesson: ESM/CJS interop in Jest is a known pain point. Mock the problematic module at the boundary rather than fighting the test runner's module system.

---

## 2. A decision I reversed — LLM-driven audit logic

My initial plan was to use Claude to generate the entire audit — feeding it tool/plan/spend data and asking for recommendations. This felt elegant: one API call, no pricing database to maintain.

I reversed this by Day 2. The reasons:

1. **Hallucination risk is catastrophic here.** If the audit engine says "downgrade to Cursor Pro at $20/seat," that number must be correct. An LLM confidently citing $15 or $25 would destroy user trust instantly.
2. **Non-reproducibility.** Two users with identical inputs could get different recommendations. That's defensible for prose but not for financial advice.
3. **The assignment said so, implicitly.** "Knowing when not to use AI is part of the test."

I rebuilt the audit engine as deterministic rules with every pricing number traced to a vendor URL. AI is now used only for the prose summary, where a ±20% variation in word choice is fine and graceful fallback handles failure.

---

## 3. What I'd build in week 2

Priority order:

1. **Persistent database** — Replace the in-memory store with Supabase. Right now audits expire on cold start. Every shared URL that fails is a broken viral loop.

2. **Transactional email via Resend** — The lead capture flow is wired but the email send is a commented TODO. Connecting Resend (free tier: 3,000 emails/month) and sending a formatted PDF-style audit report is the difference between a curiosity and a real product.

3. **Benchmark mode** — "Your team spends $X per developer on AI tools. Startups your size average $Y." This requires aggregating anonymized audit data, which we'd have after ~50 audits. It transforms the tool from "should I downgrade" to "am I normal?" — a much stickier hook.

4. **PDF export** — One Puppeteer serverless function to render the result page to PDF. CTOs email this to finance. Finance books the Credex consult.

---

## 4. How I used AI tools

**Tool:** Claude (claude.ai) via Sonnet 4.

**What I used it for:**
- Drafting boilerplate: the base Next.js file structure, TypeScript interface skeletons, and repetitive CSS variable declarations
- Reviewing the audit engine rules for logical gaps ("are there edge cases in the team-size check I'm missing?")
- First-pass prose for GTM.md and ECONOMICS.md, which I then heavily edited with real numbers from my user interviews

**What I didn't trust it with:**
- Pricing numbers — verified every figure against official vendor pages myself
- The audit engine logic — LLM-generated rule code had subtle off-by-one errors in the seat comparison that I caught only by running the tests
- The user interview summaries — those are from real conversations; I wrote them myself

**One time the AI was wrong:** I asked Claude to suggest what the typical "team plan minimum seat count" was for Cursor Business. It said "3 seats." The actual Cursor pricing page shows no minimum — it's per-seat. If I had trusted that, the audit engine would have incorrectly recommended downgrades for 3-seat Cursor Business customers. I caught it by checking `https://cursor.sh/pricing` directly.

---

## 5. Self-ratings

| Dimension | Score | Reason |
|---|---|---|
| Discipline | 7/10 | Commits across 6 calendar days, daily DEVLOG entries, started Day 1. Lost a point because Day 6 was shorter than I'd have liked. |
| Code quality | 7/10 | TypeScript throughout, sensible abstractions, tests pass, audit engine is readable. Lost points: no proper error boundaries in the result page, storage abstraction is thin. |
| Design sense | 8/10 | The dark green aesthetic is distinctive and fits the "financial audit" context. The result page hero is clear and screenshot-worthy. Lost a point: mobile layout on the form could be tighter. |
| Problem-solving | 8/10 | The nanoid mock solution was clean, the "rule-based not LLM-driven" decision was correct, and I built a working fallback for the AI summary. |
| Entrepreneurial thinking | 7/10 | GTM is specific, ECONOMICS has real unit math, user interviews happened and changed the design. Lost points: I'd have more traction ideas if I had more time in the target communities (r/SaaS, IH Slack). |
