import Anthropic from "@anthropic-ai/sdk";
import type { AuditResult } from "@/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Prompt documented in PROMPTS.md
const SYSTEM_PROMPT = `You are a concise financial advisor specializing in AI tool spend for startups.
Given an audit of a team's AI tool usage, write a 80-120 word personalized summary paragraph.
Be specific with numbers. Be honest — if they're efficient, say so. If they're overspending, say where.
Tone: direct, helpful, no fluff. Do NOT use bullet points. Write prose only.
Do NOT start with "Your team" — vary the opener.`;

export async function generateSummary(audit: AuditResult): Promise<string> {
  const userPrompt = `Audit data:
- Team size: ${audit.input.teamSize}
- Primary use case: ${audit.input.useCase}
- Total monthly spend: $${audit.totalCurrentSpend.toFixed(0)}
- Total monthly savings identified: $${audit.totalMonthlySavings.toFixed(0)}
- Tools reviewed: ${audit.recommendations.map((r) => `${r.toolName} (${r.currentPlan}, $${r.currentSpend}/mo, ${r.seats} seats)`).join("; ")}
- Key recommendations: ${audit.recommendations.filter((r) => r.monthlySavings > 0).map((r) => `${r.action} on ${r.toolName} saves $${r.monthlySavings}/mo`).join("; ") || "None — stack is well optimized"}

Write the 80-120 word summary now:`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text.trim() : buildFallback(audit);
}

function buildFallback(audit: AuditResult): string {
  if (audit.isOptimal) {
    return `Running ${audit.recommendations.length} AI tools for a ${audit.input.teamSize}-person team, your stack is well-calibrated for ${audit.input.useCase} work. Spend is at $${audit.totalCurrentSpend.toFixed(0)}/month with no major inefficiencies detected. Keep monitoring as your team scales — thresholds that work today can shift quickly as seat counts grow.`;
  }
  return `Across ${audit.recommendations.length} AI tools, this ${audit.input.teamSize}-person team is spending $${audit.totalCurrentSpend.toFixed(0)}/month. We identified $${audit.totalMonthlySavings.toFixed(0)}/month in optimizations — that's $${audit.totalAnnualSavings.toFixed(0)} annually — without downgrading core capabilities for your ${audit.input.useCase} workflows. The biggest wins come from plan right-sizing and switching to cost-equivalent alternatives.`;
}
