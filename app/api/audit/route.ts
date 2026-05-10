import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit-engine";
import { saveAudit } from "@/lib/storage";
import type { AuditInput } from "@/types";

// Rate limiting — simple in-memory (per-process)
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 10) return true;
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  let body: { input: AuditInput; honeypot?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot check — bots fill hidden fields, humans don't
  if (body.honeypot) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const { input } = body;

  if (!input?.tools?.length) {
    return NextResponse.json(
      { error: "At least one tool required" },
      { status: 400 }
    );
  }

  if (!input.teamSize || input.teamSize < 1) {
    return NextResponse.json(
      { error: "Team size must be at least 1" },
      { status: 400 }
    );
  }

  const audit = runAudit(input);

  // Generate AI summary
  try {
    const { generateSummary } = await import("@/lib/ai-summary");
    audit.aiSummary = await generateSummary(audit);
  } catch (err) {
    console.error("AI summary failed, using fallback:", err);
    audit.aiSummary = buildFallbackSummary(audit);
  }

  saveAudit(audit);

  return NextResponse.json({ audit });
}

function buildFallbackSummary(
  audit: import("@/types").AuditResult
): string {
  const toolCount = audit.recommendations.length;
  const savingTools = audit.recommendations.filter(
    (r) => r.monthlySavings > 0
  ).length;
  if (audit.isOptimal) {
    return `Your team is running a lean AI stack across ${toolCount} tool${toolCount !== 1 ? "s" : ""} with spend well-matched to your use case. No significant optimizations found — keep monitoring as your team grows.`;
  }
  return `Your ${toolCount}-tool AI stack has ${savingTools} optimization${savingTools !== 1 ? "s" : ""} available. Acting on our recommendations could save your team $${audit.totalMonthlySavings.toFixed(0)}/month ($${audit.totalAnnualSavings.toFixed(0)}/year) without sacrificing capability for your primary use case.`;
}
