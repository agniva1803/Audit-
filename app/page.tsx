import Link from "next/link";
import AuditForm from "@/components/AuditForm";

export default function Home() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>💸</span>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 18,
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}
          >
            SpendWise<span style={{ color: "var(--accent)" }}>AI</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontSize: 12,
              color: "var(--text3)",
              padding: "4px 12px",
              border: "1px solid var(--border)",
              borderRadius: 999,
            }}
          >
            Powered by Credex
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 32px 60px",
          maxWidth: 720,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Background grid */}
        <div
          className="grid-bg"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.3,
            pointerEvents: "none",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />

        <div className="animate-fadeUp" style={{ position: "relative" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              border: "1px solid var(--accent)",
              borderRadius: 999,
              background: "var(--accent-dim)",
              color: "var(--accent)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
                animation: "pulse-dot 2s infinite",
              }}
            />
            Free · No Login Required
          </div>

          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(36px, 6vw, 60px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--text)",
              marginBottom: 20,
            }}
          >
            Are you overpaying
            <br />
            for{" "}
            <span
              style={{
                color: "var(--accent)",
                position: "relative",
              }}
            >
              AI tools?
            </span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "var(--text2)",
              lineHeight: 1.6,
              maxWidth: 520,
              margin: "0 auto 36px",
            }}
          >
            Most startup teams pay 30–50% more than they need to. Get a
            2-minute audit of your Cursor, Claude, ChatGPT, and Copilot
            spend — free, instant, no signup.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 40,
              justifyContent: "center",
              marginBottom: 60,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "$1,240", label: "avg monthly savings found" },
              { value: "2 min", label: "to complete audit" },
              { value: "8 tools", label: "covered at launch" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--accent)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit Form */}
      <section
        style={{
          maxWidth: 820,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <AuditForm />
      </section>

      {/* How it works */}
      <section
        style={{
          borderTop: "1px solid var(--border)",
          padding: "60px 32px",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontFamily: "Syne, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 48,
            color: "var(--text)",
          }}
        >
          How it works
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              step: "01",
              icon: "📋",
              title: "Input your stack",
              desc: "Tell us which AI tools you pay for, what plan, and how many seats.",
            },
            {
              step: "02",
              icon: "🔍",
              title: "Instant audit",
              desc: "Our engine checks each tool against current pricing and usage-fit benchmarks.",
            },
            {
              step: "03",
              icon: "💰",
              title: "See your savings",
              desc: "Get a per-tool breakdown with specific actions and monthly + annual savings.",
            },
            {
              step: "04",
              icon: "📤",
              title: "Share the report",
              desc: "Each audit gets a unique URL — share it with your CFO or team.",
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className={`card animate-fadeUp animate-delay-${i + 1}`}
              style={{ padding: 24 }}
            >
              <div
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 11,
                  color: "var(--accent)",
                  fontWeight: 500,
                  marginBottom: 12,
                  letterSpacing: "0.1em",
                }}
              >
                {item.step}
              </div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: 8,
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, color: "var(--text3)" }}>
          Built by Credex · credex.rocks
        </span>
        <span style={{ fontSize: 13, color: "var(--text3)" }}>
          Pricing data verified weekly. See{" "}
          <Link
            href="https://github.com/agniva1803/spendwise-ai/blob/main/PRICING_DATA.md"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            PRICING_DATA.md
          </Link>
        </span>
      </footer>
    </main>
  );
}
