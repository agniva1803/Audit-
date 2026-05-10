"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AuditResult } from "@/types";
import LeadCapture from "@/components/LeadCapture";

export default function ResultClient({ auditId }: { auditId: string }) {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/result?id=${auditId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setAudit(data.audit);
      })
      .catch(() => setError("Failed to load audit."))
      .finally(() => setLoading(false));
  }, [auditId]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            border: "3px solid var(--border2)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "var(--text3)", fontSize: 14 }}>Loading your audit…</p>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 40 }}>🔍</div>
        <p style={{ color: "var(--text2)" }}>Audit not found or expired.</p>
        <Link href="/" className="btn-primary">
          Run a new audit
        </Link>
      </div>
    );
  }

  const isHighSavings = audit.totalMonthlySavings > 500;
  const isLowSavings = audit.totalMonthlySavings < 100;

  return (
    <main style={{ minHeight: "100vh" }}>
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 32px",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          background: "rgba(12,15,14,0.92)",
          backdropFilter: "blur(12px)",
          zIndex: 100,
        }}
      >
        <Link
          href="/"
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}
        >
          <span style={{ fontSize: 20 }}>💸</span>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 17,
              color: "var(--text)",
            }}
          >
            SpendWise<span style={{ color: "var(--accent)" }}>AI</span>
          </span>
        </Link>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-secondary" onClick={copyLink} style={{ fontSize: 13 }}>
            {copied ? "✓ Copied!" : "🔗 Share"}
          </button>
          <Link href="/" className="btn-secondary" style={{ fontSize: 13, textDecoration: "none" }}>
            New Audit
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Hero savings card */}
        <div
          className="animate-fadeUp"
          style={{
            background: audit.isOptimal
              ? "var(--surface)"
              : "linear-gradient(135deg, var(--surface) 0%, rgba(0,232,122,0.06) 100%)",
            border: `1px solid ${audit.isOptimal ? "var(--border)" : "var(--accent)"}`,
            borderRadius: 20,
            padding: "40px 36px",
            marginBottom: 32,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {!audit.isOptimal && (
            <div
              style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 200,
                height: 200,
                background: "radial-gradient(circle, rgba(0,232,122,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 11,
                  color: "var(--text3)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Audit #{auditId} · {audit.input.teamSize} person team ·{" "}
                {audit.input.useCase}
              </div>
              {audit.isOptimal ? (
                <>
                  <div
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: 36,
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      color: "var(--text)",
                      marginBottom: 8,
                    }}
                  >
                    ✓ Spending well
                  </div>
                  <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.5 }}>
                    No significant savings found. Your stack is well-matched to
                    your team size and use case.
                  </p>
                </>
              ) : (
                <>
                  <div
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text2)",
                      marginBottom: 6,
                    }}
                  >
                    Potential monthly savings
                  </div>
                  <div
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: "clamp(40px, 6vw, 64px)",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: "var(--accent)",
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    ${audit.totalMonthlySavings.toFixed(0)}
                    <span
                      style={{ fontSize: "0.4em", fontWeight: 400, color: "var(--text2)" }}
                    >
                      {" "}
                      /mo
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      color: "var(--text3)",
                    }}
                  >
                    That&apos;s{" "}
                    <strong style={{ color: "var(--text)" }}>
                      ${audit.totalAnnualSavings.toFixed(0)}/year
                    </strong>{" "}
                    back in your budget
                  </div>
                </>
              )}
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{ fontSize: 12, color: "var(--text3)", marginBottom: 4 }}
              >
                Current spend
              </div>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                ${audit.totalCurrentSpend.toFixed(0)}
                <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text3)" }}>
                  {" "}
                  /mo
                </span>
              </div>
              {!audit.isOptimal && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "4px 12px",
                    background: "var(--accent-dim)",
                    borderRadius: 999,
                    fontSize: 12,
                    color: "var(--accent)",
                    fontWeight: 600,
                  }}
                >
                  {Math.round(
                    (audit.totalMonthlySavings / audit.totalCurrentSpend) * 100
                  )}
                  % potential savings
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Summary */}
        {audit.aiSummary && (
          <div
            className="card animate-fadeUp animate-delay-1"
            style={{ padding: 24, marginBottom: 24 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent)",
                }}
              />
              <span
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 11,
                  color: "var(--text3)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                AI Analysis
              </span>
            </div>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--text2)",
                fontStyle: "italic",
              }}
            >
              &ldquo;{audit.aiSummary}&rdquo;
            </p>
          </div>
        )}

        {/* Per-tool breakdown */}
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 16,
            color: "var(--text)",
          }}
        >
          Per-tool breakdown
        </h2>

        {audit.recommendations.map((rec, i) => (
          <div
            key={rec.toolId}
            className={`card animate-fadeUp animate-delay-${Math.min(i + 1, 5)}`}
            style={{
              padding: 24,
              marginBottom: 12,
              borderColor:
                rec.status === "overspending" || rec.status === "switch"
                  ? "var(--danger)"
                  : rec.status === "downgrade"
                  ? "var(--warning)"
                  : "var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 18 }}>
                    {/* emoji per tool */}
                    {{
                      cursor: "⚡",
                      github_copilot: "🐙",
                      claude_anthropic: "🤖",
                      chatgpt: "💬",
                      anthropic_api: "🔌",
                      openai_api: "🔌",
                      gemini: "♊",
                      windsurf: "🏄",
                    }[rec.toolId] ?? "🛠"}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>
                    {rec.toolName}
                  </span>
                  <span
                    className={`badge ${
                      rec.status === "optimal"
                        ? "badge-green"
                        : rec.status === "downgrade"
                        ? "badge-yellow"
                        : "badge-red"
                    }`}
                  >
                    {rec.status === "optimal"
                      ? "✓ optimal"
                      : rec.status === "downgrade"
                      ? "↓ downgrade"
                      : rec.status === "switch"
                      ? "⇄ switch"
                      : "⚠ overspending"}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text3)" }}>
                  {rec.currentPlan} · {rec.seats} seat
                  {rec.seats !== 1 ? "s" : ""} · $
                  {rec.currentSpend.toFixed(0)}/mo
                </div>
              </div>

              {rec.monthlySavings > 0 && (
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>
                    saves
                  </div>
                  <div
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontSize: 22,
                      fontWeight: 800,
                      color:
                        rec.status === "downgrade"
                          ? "var(--warning)"
                          : "var(--danger)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    ${rec.monthlySavings.toFixed(0)}/mo
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    ${rec.annualSavings.toFixed(0)}/yr
                  </div>
                </div>
              )}
            </div>

            <div className="divider" style={{ marginBottom: 12 }} />

            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                {rec.action}
              </div>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
                {rec.reasoning}
              </p>
            </div>
          </div>
        ))}

        {/* Credex CTA for high savings */}
        {isHighSavings && (
          <div
            className="card animate-fadeUp"
            style={{
              padding: 28,
              marginTop: 24,
              background:
                "linear-gradient(135deg, var(--surface) 0%, rgba(0,232,122,0.08) 100%)",
              border: "1px solid var(--accent)",
              borderRadius: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  You qualify for Credex credits
                </div>
                <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>
                  At $
                  {audit.totalMonthlySavings.toFixed(0)}/mo in identifiable savings,
                  Credex can often go further. We sell discounted AI infrastructure
                  credits sourced from companies that overforecast. Teams like yours
                  typically save 20–40% on top of plan optimization.
                </p>
              </div>
              <a
                href="https://credex.rocks"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ whiteSpace: "nowrap" }}
              >
                Book a Credex consult →
              </a>
            </div>
          </div>
        )}

        {/* Low savings — honest message */}
        {isLowSavings && !audit.isOptimal && (
          <div
            className="card"
            style={{
              padding: 24,
              marginTop: 24,
              border: "1px solid var(--border2)",
            }}
          >
            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>
              You&apos;re already running a fairly lean stack. While we found some
              minor optimizations, your spend is well within range for a team your
              size. Sign up below to be notified when new optimizations apply to
              your stack.
            </p>
          </div>
        )}

        {/* Lead capture */}
        <LeadCapture auditId={auditId} highSavings={isHighSavings} />

        {/* Share footer */}
        <div
          style={{
            marginTop: 32,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 12 }}>
            Share this audit with your team or CFO
          </p>
          <button className="btn-secondary" onClick={copyLink}>
            {copied ? "✓ Link copied!" : "🔗 Copy shareable link"}
          </button>
          <div style={{ marginTop: 12 }}>
            <Link
              href="/"
              style={{
                fontSize: 13,
                color: "var(--accent)",
                textDecoration: "none",
              }}
            >
              Run another audit →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
