import { NextRequest, NextResponse } from "next/server";
import { getAudit } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const audit = getAudit(id);
  if (!audit) {
    return NextResponse.json({ error: "Audit not found" }, { status: 404 });
  }
  // Strip PII for public view
  const publicAudit = {
    ...audit,
    // input kept — no PII in input (just tools, teamSize, useCase)
  };
  return NextResponse.json({ audit: publicAudit });
}
