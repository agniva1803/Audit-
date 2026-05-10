import { NextRequest, NextResponse } from "next/server";
import { saveLead, getAudit } from "@/lib/storage";
import type { LeadData } from "@/types";

// Honeypot + basic validation
export async function POST(req: NextRequest) {
  let body: LeadData & { honeypot?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.honeypot) {
    return NextResponse.json({ ok: true }); // silently swallow bot
  }

  const { email, auditId, companyName, role } = body;

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  if (!auditId) {
    return NextResponse.json({ error: "auditId required" }, { status: 400 });
  }

  const audit = getAudit(auditId);
  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }

  const lead: LeadData = { email, auditId, companyName, role };
  saveLead(lead);

  // In production: send transactional email via Resend
  // POST https://api.resend.com/emails with Resend API key
  // For now, log to console
  console.log(`New lead: ${email} | audit: ${auditId} | savings: $${audit.totalMonthlySavings}/mo`);

  return NextResponse.json({
    ok: true,
    highSavings: audit.totalMonthlySavings > 500,
  });
}
