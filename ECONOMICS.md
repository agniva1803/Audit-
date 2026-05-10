# Unit Economics

## What a converted lead is worth to Credex

Credex sells discounted AI credits. A typical deal:
- Company spends $2,000/mo on AI tools at retail
- Credex offers $1,600/mo equivalent credits (20% discount)
- Credex sources those credits at $1,200/mo (40% off retail, from overforecasted inventory)
- **Gross margin per customer: $400/mo = $4,800/year**

Assume 12-month average customer lifetime (conservative for a SaaS-adjacent product):
**LTV per converted customer ≈ $4,800**

Higher-spend customers (e.g., $8,000/mo on AI) yield ~$16,000 LTV.
Using a blended estimate across deal sizes: **LTV = $6,000–$8,000 per customer.**

---

## CAC by channel

| Channel | Cost per audit | Audit → email rate | Email → consult rate | Consult → purchase | CAC |
|---|---|---|---|---|---|
| HN / organic | ~$0 | 30% | 8% | 35% | ~$0 (time only) |
| Direct LinkedIn DM | ~$2 (time) | 20% | 10% | 35% | ~$29 |
| Newsletter sponsorship | $500/issue, ~500 visitors | 25% | 8% | 35% | ~$143 |
| Warm Credex existing customer | ~$5 | 60% | 25% | 50% | ~$67 |

Blended CAC at early stage (mostly organic + DM): **~$40–$80 per customer.**

LTV:CAC = $7,000 / $60 ≈ **117x** — extremely healthy for a B2B tool at this stage.

---

## Conversion funnel math

Starting with 1,000 monthly audit completions:

```
1,000 audits completed
  → 300 email captures (30% conversion — value shown first)
    → 24 consult bookings (8% of email captures book)
      → 8 credit purchases (35% of consults convert)
```

At $7,000 LTV per customer:
**8 customers × $7,000 LTV = $56,000 MRR contribution per 1,000 audits**

To hit $1M ARR from this channel alone:
- Need ~$83,333/mo in new customer revenue
- At $7,000 LTV over 12 months = ~$583/mo per customer
- Need **~143 new customers/month**
- At 0.8% audit-to-customer rate = **~17,900 audits/month**

---

## Path to $1M ARR in 18 months

What would have to be true:

1. **Audits scale to ~18k/month by month 12.** Achievable via: HN + ProductHunt launch (month 1), newsletter partnerships (months 2–4), SEO from audit result pages being indexed (months 3–6), referral loop from shared audit URLs (ongoing).

2. **Consult booking rate holds at 8%.** This requires the Credex consultation to be genuinely useful — not a sales call. If the consult converts to a real credit offer with better savings than the audit alone found, 8% is conservative.

3. **Credit inventory stays available.** Credex's model depends on overforecasted inventory from AI vendors. This is the key business risk — if the AI credit secondary market dries up, the offer weakens. At $1M ARR, Credex should have direct vendor relationships that don't depend on spot inventory.

4. **Average deal size ≥ $500/mo spend.** The audit tool naturally filters for this — teams spending <$100/mo see "You're spending well" and don't book a consult. The self-selection is a feature.

### Rough 18-month model

| Month | Monthly audits | Customers added | Cumulative ARR |
|---|---|---|---|
| 1 | 500 | 4 | $28k |
| 3 | 2,000 | 16 | $140k |
| 6 | 6,000 | 48 | $476k |
| 9 | 12,000 | 96 | $980k |
| 12 | 18,000 | 144 | $1.4M |
| 18 | 25,000 | 200 | $2.1M |

These are rough estimates — the inputs (30% email capture, 8% consult, 35% purchase) are the levers. If consult → purchase drops to 20%, month-12 ARR is ~$800k. Still a strong business.
