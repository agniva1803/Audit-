/**
 * Audit Engine — deterministic rule-based logic.
 * No AI here — knowing when NOT to use AI is part of the test.
 * Each rule is documented with its reasoning so a finance person can verify.
 */

import { nanoid } from "nanoid";
import type { AuditInput, AuditResult, ToolRecommendation } from "@/types";
import { getToolMeta, getPlan } from "./pricing";

// Per-use-case tool capability scores (0-10)
// Used to recommend alternatives with similar capability
const TOOL_USE_SCORES: Record<string, Record<string, number>> = {
  coding: {
    cursor: 10,
    github_copilot: 9,
    windsurf: 8,
    claude_anthropic: 7,
    chatgpt: 6,
    anthropic_api: 5,
    openai_api: 5,
    gemini: 6,
  },
  writing: {
    claude_anthropic: 10,
    chatgpt: 9,
    gemini: 8,
    anthropic_api: 7,
    openai_api: 7,
    cursor: 4,
    github_copilot: 3,
    windsurf: 3,
  },
  data: {
    chatgpt: 9,
    claude_anthropic: 9,
    gemini: 8,
    openai_api: 8,
    anthropic_api: 8,
    cursor: 5,
    github_copilot: 4,
    windsurf: 4,
  },
  research: {
    claude_anthropic: 10,
    chatgpt: 9,
    gemini: 9,
    anthropic_api: 8,
    openai_api: 7,
    cursor: 3,
    github_copilot: 2,
    windsurf: 2,
  },
  mixed: {
    claude_anthropic: 9,
    chatgpt: 9,
    gemini: 8,
    cursor: 8,
    anthropic_api: 7,
    openai_api: 7,
    windsurf: 7,
    github_copilot: 7,
  },
};

function computeEffectiveSpend(monthlySpend: number, seats: number, plan: { pricePerSeat: number; flatPrice?: number } | undefined): number {
  if (!plan) return monthlySpend;
  if (plan.flatPrice) return plan.flatPrice;
  if (plan.pricePerSeat > 0) return plan.pricePerSeat * seats;
  return monthlySpend; // API or enterprise — use user-reported spend
}

function analyseEntry(
  entry: { toolId: string; plan: string; monthlySpend: number; seats: number },
  useCase: string,
  _teamSize: number
): ToolRecommendation {
  const toolId = entry.toolId as import("@/types").ToolId;
  const meta = getToolMeta(toolId);
  const currentPlan = getPlan(toolId, entry.plan);
  const effectiveSpend = entry.monthlySpend > 0
    ? entry.monthlySpend
    : computeEffectiveSpend(entry.monthlySpend, entry.seats, currentPlan);
  const seats = entry.seats || 1;

  let status: ToolRecommendation["status"] = "optimal";
  let action = "Keep current plan";
  let reasoning = "Current plan is well-matched to your team size and use case.";
  let monthlySavings = 0;

  // ── Rule 1: Team plan with very few users ──────────────────────────────────
  if (entry.plan === "team" || entry.plan === "business") {
    const minSeats = currentPlan?.minSeats ?? 5;
    if (seats < minSeats && seats <= 2) {
      // Individual/Pro plan would suffice
      const altPlans = meta.plans.filter(
        (p) => !["team", "business", "enterprise"].includes(p.id) && p.pricePerSeat > 0
      );
      if (altPlans.length) {
        const cheapest = altPlans.sort((a, b) => a.pricePerSeat - b.pricePerSeat)[0];
        const altSpend = cheapest.pricePerSeat * seats;
        if (altSpend < effectiveSpend) {
          monthlySavings = effectiveSpend - altSpend;
          status = "downgrade";
          action = `Downgrade to ${cheapest.label}`;
          reasoning = `You have ${seats} seat${seats > 1 ? "s" : ""} on the ${currentPlan?.label ?? entry.plan} plan. The minimum useful team size for this tier is typically ${minSeats}+. Switching to ${cheapest.label} at $${cheapest.pricePerSeat}/seat would save $${monthlySavings.toFixed(0)}/mo without losing meaningful capability for a team this small.`;
        }
      }
    }
  }

  // ── Rule 2: Duplicate coding tools with heavy overlap ──────────────────────
  if (
    ["cursor", "github_copilot", "windsurf"].includes(toolId) &&
    useCase !== "coding"
  ) {
    // Non-coding teams paying for a coding IDE tool
    if (effectiveSpend > 0) {
      monthlySavings = effectiveSpend;
      status = "overspending";
      action = "Cancel — mismatched use case";
      reasoning = `Your primary use case is ${useCase}, but ${meta.name} is a specialized AI coding editor. Unless your team actively writes code, this is likely unused budget. Cancelling saves $${effectiveSpend.toFixed(0)}/mo.`;
    }
  }

  // ── Rule 3: Overpaying per-seat vs cheaper peer with same capability ───────
  if (status === "optimal" && effectiveSpend > 0) {
    const useCaseScores = TOOL_USE_SCORES[useCase] ?? TOOL_USE_SCORES.mixed;
    const myScore = useCaseScores[toolId] ?? 5;

    const cheaperPeers = Object.entries(useCaseScores)
      .filter(([id, score]) => {
        if (id === toolId) return false;
        if (score < myScore - 1) return false; // must be within 1 point of capability
        const peerMeta = getToolMeta(id as import("@/types").ToolId);
        if (!peerMeta) return false;
        // Find cheapest viable plan
        const viablePlans = peerMeta.plans.filter((p) => p.pricePerSeat > 0 && (p.minSeats ?? 1) <= seats);
        if (!viablePlans.length) return false;
        const bestPeerPlanCost = Math.min(...viablePlans.map((p) => p.pricePerSeat)) * seats;
        return bestPeerPlanCost < effectiveSpend * 0.7; // at least 30% cheaper
      })
      .sort((a, b) => {
        const aMeta = getToolMeta(a[0] as import("@/types").ToolId);
        const bMeta = getToolMeta(b[0] as import("@/types").ToolId);
        const aViable = aMeta.plans.filter((p) => p.pricePerSeat > 0 && (p.minSeats ?? 1) <= seats);
        const bViable = bMeta.plans.filter((p) => p.pricePerSeat > 0 && (p.minSeats ?? 1) <= seats);
        const aCost = Math.min(...aViable.map((p) => p.pricePerSeat)) * seats;
        const bCost = Math.min(...bViable.map((p) => p.pricePerSeat)) * seats;
        return aCost - bCost;
      });

    if (cheaperPeers.length) {
      const [bestId] = cheaperPeers[0];
      const peerMeta = getToolMeta(bestId as import("@/types").ToolId);
      const viablePlans = peerMeta.plans.filter((p) => p.pricePerSeat > 0 && (p.minSeats ?? 1) <= seats);
      const bestPlan = viablePlans.sort((a, b) => a.pricePerSeat - b.pricePerSeat)[0];
      const altCost = bestPlan.pricePerSeat * seats;
      const saving = effectiveSpend - altCost;
      if (saving > 5) {
        monthlySavings = saving;
        status = "switch";
        action = `Switch to ${peerMeta.name} (${bestPlan.label})`;
        reasoning = `${peerMeta.name} scores ${useCaseScores[bestId]}/10 for ${useCase} vs ${meta.name}'s ${myScore}/10 — comparable capability at $${altCost.toFixed(0)}/mo vs your current $${effectiveSpend.toFixed(0)}/mo. That's a $${saving.toFixed(0)}/mo saving with no material loss for your use case.`;
      }
    }
  }

  // ── Rule 4: Paying retail for something available via credits ──────────────
  if (
    status !== "overspending" &&
    effectiveSpend > 50 &&
    ["claude_anthropic", "chatgpt", "cursor"].includes(toolId)
  ) {
    if (monthlySavings === 0 && effectiveSpend > 100) {
      // Surface Credex only — don't double-count with above savings
      reasoning +=
        " Additionally, Credex sells discounted credits for this tool — teams paying retail often save 20–40% by switching to credited access.";
    }
  }

  // ── Rule 5: API spend with no rate context ─────────────────────────────────
  if (["anthropic_api", "openai_api"].includes(toolId) && effectiveSpend > 500) {
    if (status === "optimal") {
      status = "overspending";
      action = "Audit API usage — possible over-provisioning";
      reasoning = `At $${effectiveSpend.toFixed(0)}/mo on ${meta.name}, you likely qualify for enterprise pricing tiers or committed-use discounts (typically 15–30% off). Credex also sources API credits below list price for volumes like yours. Even a 20% reduction saves $${(effectiveSpend * 0.2).toFixed(0)}/mo.`;
      monthlySavings = effectiveSpend * 0.2;
    }
  }

  return {
    toolId,
    toolName: meta.name,
    currentPlan: currentPlan?.label ?? entry.plan,
    currentSpend: effectiveSpend,
    seats,
    status,
    action,
    reasoning,
    monthlySavings: Math.max(0, monthlySavings),
    annualSavings: Math.max(0, monthlySavings) * 12,
  };
}

export function runAudit(input: AuditInput): AuditResult {
  const recommendations = input.tools
    .filter((t) => t.toolId)
    .map((t) => analyseEntry(t, input.useCase, input.teamSize));

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;
  const totalCurrentSpend = recommendations.reduce(
    (sum, r) => sum + r.currentSpend,
    0
  );

  return {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    totalCurrentSpend,
    isOptimal: totalMonthlySavings < 10,
  };
}
