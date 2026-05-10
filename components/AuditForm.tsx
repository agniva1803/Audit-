"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ToolId, ToolEntry, AuditInput, UseCase } from "@/types";
import { TOOLS } from "@/lib/pricing";

const USE_CASES: { id: UseCase; label: string; emoji: string }[] = [
  { id: "coding", label: "Coding / Engineering", emoji: "💻" },
  { id: "writing", label: "Writing / Content", emoji: "✍️" },
  { id: "data", label: "Data / Analytics", emoji: "📊" },
  { id: "research", label: "Research", emoji: "🔬" },
  { id: "mixed", label: "Mixed / General", emoji: "🔀" },
];

const STORAGE_KEY = "spendwise_form_v1";

function defaultEntry(toolId: ToolId): ToolEntry {
  const meta = TOOLS.find((t) => t.id === toolId)!;
  return {
    toolId,
    plan: meta.plans[0].id,
    monthlySpend: meta.plans[0].pricePerSeat || 0,
    seats: 1,
  };
}

export default function AuditForm() {
  const router = useRouter();
  const [entries, setEntries] = useState<ToolEntry[]>([]);
  const [teamSize, setTeamSize] = useState<number>(5);
  const [useCase, setUseCase] = useState<UseCase>("coding");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist form state
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEntries(parsed.entries ?? []);
        setTeamSize(parsed.teamSize ?? 5);
        setUseCase(parsed.useCase ?? "coding");
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ entries, teamSize, useCase })
    );
  }, [entries, teamSize, useCase]);

  const addTool = (toolId: ToolId) => {
    if (entries.find((e) => e.toolId === toolId)) return;
    setEntries((prev) => [...prev, defaultEntry(toolId)]);
  };

  const removeTool = (toolId: ToolId) => {
    setEntries((prev) => prev.filter((e) => e.toolId !== toolId));
  };

  const updateEntry = (toolId: ToolId, patch: Partial<ToolEntry>) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.toolId !== toolId) return e;
        const updated = { ...e, ...patch };
        // Auto-update spend if plan changed
        if (patch.plan) {
          const meta = TOOLS.find((t) => t.id === toolId)!;
          const plan = meta.plans.find((p) => p.id === patch.plan);
          if (plan && plan.pricePerSeat > 0) {
            updated.monthlySpend = plan.pricePerSeat * (patch.seats ?? e.seats);
          }
        }
        if (patch.seats !== undefined && !patch.monthlySpend) {
          const meta = TOOLS.find((t) => t.id === toolId)!;
          const plan = meta.plans.find((p) => p.id === e.plan);
          if (plan && plan.pricePerSeat > 0) {
            updated.monthlySpend = plan.pricePerSeat * patch.seats;
          }
        }
        return updated;
      })
    );
  };

  const handleSubmit = async () => {
    if (entries.length === 0) {
      setError("Add at least one AI tool to audit.");
      return;
    }
    setError(null);
    setLoading(true);

    const input: AuditInput = { tools: entries, teamSize, useCase };

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, honeypot: "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/result/${data.audit.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addedIds = new Set(entries.map((e) => e.toolId));
  const totalSpend = entries.reduce((s, e) => s + (e.monthlySpend || 0), 0);

  return (
    <div>
      {/* Use case */}
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 6,
            color: "var(--text)",
          }}
        >
          About your team
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 20 }}>
          Helps us calibrate which tools actually fit your workflow
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text2)",
                marginBottom: 6,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Team size
            </label>
            <input
              type="number"
              min={1}
              max={10000}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text2)",
                marginBottom: 6,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Primary use case
            </label>
            <select
              value={useCase}
              onChange={(e) => setUseCase(e.target.value as UseCase)}
            >
              {USE_CASES.map((uc) => (
                <option key={uc.id} value={uc.id}>
                  {uc.emoji} {uc.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tool picker */}
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Select your AI tools
        </h2>
        <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 20 }}>
          Click to add, then fill in the details below
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {TOOLS.map((tool) => {
            const added = addedIds.has(tool.id);
            return (
              <button
                key={tool.id}
                onClick={() => (added ? removeTool(tool.id) : addTool(tool.id))}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: `1px solid ${added ? "var(--accent)" : "var(--border2)"}`,
                  background: added ? "var(--accent-dim)" : "transparent",
                  color: added ? "var(--accent)" : "var(--text2)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                <span>{tool.emoji}</span>
                {tool.name}
                {added && (
                  <span
                    style={{
                      marginLeft: 2,
                      fontSize: 10,
                      opacity: 0.7,
                    }}
                  >
                    ✕
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tool entries */}
        {entries.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "var(--text3)",
              fontSize: 14,
              border: "1px dashed var(--border)",
              borderRadius: 8,
            }}
          >
            ↑ Click a tool above to add it to your audit
          </div>
        )}

        {entries.map((entry, i) => {
          const meta = TOOLS.find((t) => t.id === entry.toolId)!;
          return (
            <div
              key={entry.toolId}
              className="card"
              style={{
                padding: 20,
                marginBottom: 12,
                background: "var(--bg2)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{meta.emoji}</span>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{meta.name}</span>
                  <span
                    className="badge badge-neutral"
                    style={{ fontSize: 10, marginLeft: 4 }}
                  >
                    {meta.category}
                  </span>
                </div>
                <button
                  onClick={() => removeTool(entry.toolId)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text3)",
                    cursor: "pointer",
                    fontSize: 18,
                    padding: "0 4px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text3)",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Plan
                  </label>
                  <select
                    value={entry.plan}
                    onChange={(e) =>
                      updateEntry(entry.toolId, { plan: e.target.value })
                    }
                  >
                    {meta.plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                        {p.pricePerSeat > 0 ? ` — $${p.pricePerSeat}/seat` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text3)",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Seats / Users
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={entry.seats}
                    onChange={(e) =>
                      updateEntry(entry.toolId, { seats: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text3)",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Monthly Spend ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={entry.monthlySpend}
                    onChange={(e) =>
                      updateEntry(entry.toolId, {
                        monthlySpend: Number(e.target.value),
                      })
                    }
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      {entries.length > 0 && (
        <div
          className="card"
          style={{
            padding: "16px 24px",
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "var(--surface2)",
            border: "1px solid var(--border2)",
          }}
        >
          <div>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              {entries.length} tool{entries.length !== 1 ? "s" : ""} ·{" "}
              {teamSize} person{teamSize !== 1 ? "s" : ""}
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              Total reported
            </span>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: "var(--text)",
                letterSpacing: "-0.02em",
              }}
            >
              ${totalSpend.toFixed(0)}
              <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text3)" }}>
                {" "}
                /mo
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            background: "var(--danger-dim)",
            border: "1px solid var(--danger)",
            borderRadius: 8,
            color: "var(--danger)",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={loading || entries.length === 0}
        style={{ width: "100%", justifyContent: "center", padding: "16px 24px", fontSize: 16 }}
      >
        {loading ? (
          <>
            <span
              style={{
                display: "inline-block",
                width: 16,
                height: 16,
                border: "2px solid rgba(12,15,14,0.3)",
                borderTopColor: "#0c0f0e",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            Analyzing your stack…
          </>
        ) : (
          <>Run Free Audit →</>
        )}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "var(--text3)",
          marginTop: 12,
        }}
      >
        No account needed · Results in seconds · Your data stays private
      </p>
    </div>
  );
}
