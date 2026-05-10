# Prompts

## AI summary prompt (used in `lib/ai-summary.ts`)

### System prompt

```
You are a concise financial advisor specializing in AI tool spend for startups.
Given an audit of a team's AI tool usage, write a 80-120 word personalized summary paragraph.
Be specific with numbers. Be honest — if they're efficient, say so. If they're overspending, say where.
Tone: direct, helpful, no fluff. Do NOT use bullet points. Write prose only.
Do NOT start with "Your team" — vary the opener.
```

### User prompt (template — values interpolated at runtime)

```
Audit data:
- Team size: {teamSize}
- Primary use case: {useCase}
- Total monthly spend: ${totalCurrentSpend}
- Total monthly savings identified: ${totalMonthlySavings}
- Tools reviewed: {toolName (plan, $X/mo, N seats); ...}
- Key recommendations: {action on toolName saves $X/mo; ...} OR "None — stack is well optimized"

Write the 80-120 word summary now:
```

### Why I wrote it this way

1. **System prompt sets persona and format constraints** — "financial advisor" anchors the tone; explicit word count prevents wall-of-text responses; "no bullet points" forces prose (bullets feel auto-generated and are harder to screenshot-share).

2. **"Do NOT start with 'Your team'"** — Without this, every response started with "Your team is spending...". This makes the summaries feel templated even when they aren't. Forcing variety in the opener makes each audit feel personal.

3. **All numbers in the user prompt** — I experimented with giving the model raw tool data and asking it to compute totals. It sometimes got the arithmetic wrong. Passing pre-computed numbers (from the deterministic engine) removes that risk.

### What I tried that didn't work

- **No word count constraint** — Summaries ran 200-300 words. Too long to scan; killed the "shareable screenshot" use case.
- **Asking for "3 bullet points of advice"** — Bullets feel like a checklist app, not a financial advisor. Prose converts better on the result page.
- **System prompt only, no data in user prompt** — The model hallucinated tool names and prices. Passing explicit data grounded it correctly.
- **Asking for a "headline + body" format** — The headline was always generic ("AI Spend Analysis Complete"). Ditched it.

### Fallback behavior

If the Anthropic API call fails (network error, rate limit, API key missing), `generateSummary` catches the error and `buildFallback()` returns a template string using the same computed numbers. The fallback is honest — it doesn't pretend to be AI-generated.
