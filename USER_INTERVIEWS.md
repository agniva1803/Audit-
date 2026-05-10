# User Interviews

Three conversations conducted during the build week via X DM and personal network. Each 10–15 minutes.

---

## Interview 1 — R.K., CTO, B2B SaaS, 12-person team, Seed-stage

**Date:** 2026-05-06  
**Format:** 15-minute X DM voice note exchange

**Context:** R.K. found me through a mutual connection. His team uses Cursor Business, Claude Team, and the OpenAI API directly for a feature they ship to customers.

**Quotes:**
- "I honestly have no idea if we're paying the right amount. I just approve the invoices."
- "The per-seat cost thing drives me crazy — we have 3 engineers using Cursor heavily and 2 who barely touch it, but I'm paying for 5 seats at the Business rate."
- "I'd use something like this but I'd want to know the numbers are right. If it tells me to switch and I switch and it's worse, I'll never trust it again."

**Most surprising thing:** He already suspected he was overpaying but had never sat down to check because "there was always something more important." The tool solves an activation problem, not an awareness problem.

**What it changed:** Added a note in the UI that monthly spend fields are auto-calculated from official pricing but editable — so users like R.K. who have unusual seat distributions can override with their actual invoice number.

---

## Interview 2 — P.M., Engineering Manager, Fintech startup, 22-person team, Series A

**Date:** 2026-05-07  
**Format:** 12-minute phone call (college network)

**Context:** P.M. manages a team that uses GitHub Copilot Enterprise and ChatGPT Team. Their company is on a budget freeze.

**Quotes:**
- "My CFO asked me last month to justify the Copilot bill. I had to go look up what it even cost per seat."
- "We're on the Enterprise tier for Copilot — I don't even know if we need that vs Business. Nobody told me what the difference was when we signed."
- "A shareable link would be huge. I could send it to my CFO and she could see the reasoning herself."

**Most surprising thing:** She didn't know the difference between Copilot Business ($19/seat) and Enterprise ($39/seat). She assumed "Enterprise" meant better for her enterprise employer. The audit should explicitly call out what the higher tier actually adds.

**What it changed:** Added reasoning text to the downgrade recommendation that spells out what the cheaper plan loses, not just what it saves. "Copilot Business lacks audit logs and policy controls — only relevant if your compliance team requires them."

---

## Interview 3 — A.S., Founder (solo), Developer tools startup, 1-person team, Pre-seed

**Date:** 2026-05-08  
**Format:** 15-minute async Loom exchange (IH community)

**Context:** A.S. is a solo founder paying for Claude Pro and Cursor Pro. Total spend: $40/month.

**Quotes:**
- "For me $40/month is nothing but I still want to know if I'm getting value."
- "What I actually want to know is: am I using these tools enough to justify paying? Not just 'could I pay less.'"
- "The audit makes more sense for teams. For solo devs it's kind of a different question."

**Most surprising thing:** The framing I'd been using ("are you overspending?") doesn't resonate for solos who know they're underspending. They want a utilization question, not a price question.

**What it changed:** Added the "spending well" honest state for low-savings audits — rather than manufacturing savings for a $40/month solo user, the tool says "you're running lean, here's what to watch as you scale." This preserves trust. It also clarified the product is primarily for teams (5+ people), which is reflected in the hero copy and meta description.
