import { AuditResult } from "@/types";

// In-memory store — replace with Supabase/Postgres in production
const store = new Map<string, AuditResult>();

export function saveAudit(result: AuditResult): void {
  store.set(result.id, result);
}

export function getAudit(id: string): AuditResult | undefined {
  return store.get(id);
}

// For serverless, we export the store so it can be persisted in edge KV
export { store as auditStore };
