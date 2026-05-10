# User Interviews

Three conversations conducted May 6–8, 2026. Each was 10–15 minutes via DM on X or a quick video call. Names anonymized on request.

---

## Interview 1 — R.K., CTO, B2B SaaS startup, 18 employees, Series A

**Role & context:** R.K. runs a 6-person engineering team at a data infrastructure startup. They use Cursor Business, GitHub Copilot Business, Claude Team, and the Anthropic API. He estimates ~$1,800/mo in AI spend.

**Direct quotes:**
- "I have no idea if we're getting value from Copilot anymore since everyone switched to Cursor. But cancelling feels risky."
- "I look at the Anthropic invoice and I genuinely don't know what half of it is. Someone's hitting the API hard and I can't trace it."
- "I don't need a dashboard. I need someone to tell me what to turn off."

**Most surprising thing:** He wasn't interested in a benchmark ("how much do similar teams spend"). He specifically said benchmarks feel like justification, not action. He wanted a concrete list: "just tell me what to cancel."

**What it changed:** I removed the benchmark feature from MVP scope and prioritized the per-tool action clarity on the result page. Each card now leads with the action ("Cancel," "Downgrade to X"), not the savings number.

---

## Interview 2 — S.M., Engineering Manager, fintech startup, 34 employees, Series B

**Role & context:** S.M. manages 12 engineers. Her company has a formal procurement process for software but AI tools crept in under the $500/mo per-tool threshold that triggers review. She estimates $3,200/mo total.

**Direct quotes:**
- "Every engineer added their own Cursor or Copilot and expensed it. Now I have overlap and I can't see it."
- "My CFO keeps asking me to 'rationalize the AI spend' and I don't know how to explain to them why we need four different LLM tools."
- "If you could give me a one-pager I could share with finance, that would be the thing."

**Most surprising thing:** She explicitly asked for a shareable report — something she could forward, not just view. She said "email me a PDF" before I even mentioned lead capture. This validated the shareable URL feature as the right MVP choice over a full PDF export.

**What it changed:** I made the shareable link more prominent on the result page, and the lead capture copy specifically says "share with your CFO." The OG preview was already planned but this made it a priority.

---

## Interview 3 — A.P., Founder/CTO, dev tools startup, 7 employees, bootstrapped

**Role & context:** A.P. is a solo technical founder with 6 engineers. They're bootstrapped and extremely cost-conscious. Total AI spend: ~$480/mo. He uses Claude Pro personally, GitHub Copilot Individual for each engineer, and OpenAI API.

**Direct quotes:**
- "I asked my engineers to move to the free tier of Copilot and they complained so much I gave up. I'd rather have data to back up that conversation."
- "I don't trust 'you could save $X' unless you show me the math. I've seen too many SaaS tools manufacture savings."
- "The Anthropic API bill is my biggest anxiety. I built a feature that calls it on every page load and I regret it."

**Most surprising thing:** He wanted the audit to tell him when he was *not* overspending — explicitly. He said tools that only surface problems feel like they're trying to sell him something. An honest "you're doing fine" would increase his trust in the tool's other findings.

**What it changed:** I added the "You're spending well" state to the result page for low-savings audits, with specific language like "No significant savings found." This was a direct result of this conversation. I also made the audit reasoning more explicit — every recommendation now shows the arithmetic, not just the conclusion.
