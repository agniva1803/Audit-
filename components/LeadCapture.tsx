"use client";

import { useState } from "react";

interface Props {
  auditId: string;
  highSavings: boolean;
}

export default function LeadCapture({ auditId, highSavings }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState(""); // bots fill this

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setError("Enter a valid email.");
      return;
    }
    if (honeypot) return; // silently drop bot

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, companyName: company, role, auditId, honeypot }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="card"
        style={{
          padding: 28,
          marginTop: 32,
          textAlign: "center",
          border: "1px solid var(--accent)",
          background: "var(--accent-dim)",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
        <div
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Report saved to your inbox
        </div>
        <p style={{ fontSize: 14, color: "var(--text2)" }}>
          {highSavings
            ? "Given your savings potential, a Credex advisor will reach out within 1 business day with a custom credit offer."
            : "We'll notify you when new optimizations apply to your stack."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        padding: 28,
        marginTop: 32,
        border: "1px solid var(--border2)",
      }}
    >
      <h3
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {highSavings ? "Get your full report + Credex quote" : "Save your audit report"}
      </h3>
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 20 }}>
        {highSavings
          ? "Enter your email to receive the full report and hear how Credex credits can stack on top of these savings."
          : "We'll email you the report and ping you when new savings become available for your stack."}
      </p>

      {/* Honeypot — hidden from humans, bots fill it */}
      <div style={{ display: "none" }} aria-hidden>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div style={{ display: "grid", gap: 12 }}>
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
            Work email *
          </label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
              Company (optional)
            </label>
            <input
              type="text"
              placeholder="Acme Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
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
              Role (optional)
            </label>
            <input
              type="text"
              placeholder="CTO, Eng Manager…"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              background: "var(--danger-dim)",
              border: "1px solid var(--danger)",
              borderRadius: 6,
              color: "var(--danger)",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {loading ? "Sending…" : highSavings ? "Send report + book consult →" : "Email me my report →"}
        </button>

        <p style={{ fontSize: 11, color: "var(--text3)", textAlign: "center" }}>
          No spam. Unsubscribe anytime. We don't sell your data.
        </p>
      </div>
    </div>
  );
}
