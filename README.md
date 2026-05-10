# SpendWise AI — Free AI Spend Audit for Startups

SpendWise AI is a free web app that audits your team's AI tool spend across Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, Windsurf, and APIs — giving you a per-tool breakdown of overspend, with specific actions and monthly + annual savings estimates. Built as a lead-generation asset for [Credex](https://credex.rocks), which sells discounted AI infrastructure credits.

**Live:** [https://spendwise-ai.vercel.app](https://spendwise-ai.vercel.app)

---

## Screenshots

> Add screenshots or a Loom/YouTube link here after deploy.

---

## Quick start

```bash
git clone https://github.com/agniva1803/spendwise-ai
cd spendwise-ai
npm install

# Copy env template
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY

npm run dev
# → http://localhost:3000
```

### Deploy to Vercel

```bash
npx vercel --prod
# Set ANTHROPIC_API_KEY in Vercel dashboard > Settings > Environment Variables
```

### Run tests

```bash
npm test
```

---

## Decisions

1. **Next.js App Router over plain React** — SSR for result pages means shareable audit URLs get proper OG tags on first load without client-side hydration delay. Trade-off: more complex routing and `async params` in page components.

2. **In-memory storage over Supabase for MVP** — Fastest to ship, no external dependency. Trade-off: audits expire on cold start. Migration path documented in `ARCHITECTURE.md`. The storage interface is abstracted so swapping is one file change.

3. **Rule-based audit engine, not LLM-driven** — The audit math uses deterministic rules with cited pricing data. An LLM would introduce hallucinated numbers and non-reproducible reasoning. AI is used only for the prose summary (gracefully falling back to a template on API failure). This is intentional and documented.

4. **No login before value** — Email is captured after the audit result is shown, never before. This reduces drop-off on the critical conversion step. Trade-off: we can't pre-populate the form for returning users (mitigated by `localStorage` persistence).

5. **Honeypot over reCAPTCHA for abuse protection** — hCaptcha/reCAPTCHA adds 200–400ms, requires CDN load, and annoys legitimate users. A hidden honeypot field blocks the vast majority of automated submissions with zero UX friction. Rate limiting (10 req/min per IP) covers the rest.
