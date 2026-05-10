/**
 * In-memory storage for audits (persists per process).
 * In production, swap for Supabase / Cloudflare D1.
 * See ARCHITECTURE.md for the migration path.
 */

import type { AuditResult, LeadData } from "@/types";

// Simple in-memory store — resets on cold start
const auditStore = new Map<string, AuditResult>();
const leadStore = new Map<string, LeadData>();

export function saveAudit(audit: AuditResult): void {
  auditStore.set(audit.id, audit);
}

export function getAudit(id: string): AuditResult | undefined {
  return auditStore.get(id);
}

export function saveLead(lead: LeadData): void {
  leadStore.set(lead.auditId, lead);
}

export function getLead(auditId: string): LeadData | undefined {
  return leadStore.get(auditId);
}
