# Metrics

## North Star Metric

**Audits completed per week.**

Why: An "audit completed" means the user saw the result page — we delivered value. Everything upstream (traffic, form completion) and downstream (email capture, consultations) is driven by this. It's a leading indicator of revenue (consultations booked) and of viral growth (result pages shared). DAU or sessions would be wrong — users come back quarterly at most, so daily activity metrics are misleading for a tool used episodically.

## 3 Input Metrics

**1. Form completion rate (visitors → audit submitted)**  
Target: ≥30%. If this drops, the form is too long, the value prop isn't clear, or traffic quality is wrong. This is the first place to look when the North Star drops.

**2. Result page share rate (audits → shareable link copied)**  
Target: ≥15%. This is the viral loop. Each shared audit is a warm referral. If share rate is low, either the design of the result page isn't screenshot-worthy, or we're not surfacing the share button prominently enough.

**3. Email capture rate (result views → email submitted)**  
Target: ≥20%. We show value before asking for email — the conversion rate from result to email is a measure of how much the user trusted the audit. If this is below 15%, either the audit results aren't compelling or the lead form copy is wrong.

## What we'd instrument first

1. **Funnel events** (in order): `page_view`, `tool_added`, `audit_submitted`, `result_viewed`, `share_link_copied`, `lead_form_submitted`
2. **Audit result metadata**: savings bucket (0, $1–$100, $101–$500, $500+), number of tools, use case, team size — to understand which segments produce the most valuable audits
3. **Source tracking**: UTM on every inbound link so we know which channels (HN, X, newsletter) produce audits vs just pageviews

Implementation: Plausible (privacy-friendly, no cookie banner needed) for page-level, custom event tracking via a `/api/event` endpoint for funnel steps.

## Pivot trigger

**If weekly audits < 50 after 6 weeks of active distribution.**

Below 50 audits/week with consistent distribution effort means either (a) the product doesn't resonate or (b) we're reaching the wrong audience. At that point: pivot the targeting (maybe the right user is a CFO, not a CTO), or rebuild around the benchmark feature (peer comparison) which may have stronger pull.

Revenue trigger: If audit → consultation conversion is below 3% after 100 audits with high-savings results, the audit is not convincing enough or Credex's sales motion needs work — not a product problem alone.
