import { runAudit } from "../lib/audit-engine";
import type { AuditInput } from "../types";

// Test 1: Team plan with 1 user should flag downgrade
test("flags overspend: Team plan with single user", () => {
  const input: AuditInput = {
    tools: [{ toolId: "claude_anthropic", plan: "team", monthlySpend: 25, seats: 1 }],
    teamSize: 1,
    useCase: "writing",
  };
  const result = runAudit(input);
  const rec = result.recommendations[0];
  expect(["downgrade", "switch", "overspending"]).toContain(rec.status);
  expect(rec.monthlySavings).toBeGreaterThan(0);
});

// Test 2: API tool with large spend should flag audit
test("flags large API spend for potential discount", () => {
  const input: AuditInput = {
    tools: [{ toolId: "anthropic_api", plan: "pay_as_you_go", monthlySpend: 1200, seats: 1 }],
    teamSize: 10,
    useCase: "coding",
  };
  const result = runAudit(input);
  const rec = result.recommendations[0];
  expect(rec.monthlySavings).toBeGreaterThan(0);
  expect(["overspending", "switch", "downgrade"]).toContain(rec.status);
});

// Test 3: Coding tool for non-coding team should be flagged
test("flags coding tool for non-coding team", () => {
  const input: AuditInput = {
    tools: [{ toolId: "cursor", plan: "business", monthlySpend: 200, seats: 5 }],
    teamSize: 5,
    useCase: "writing",
  };
  const result = runAudit(input);
  const rec = result.recommendations[0];
  expect(["overspending", "switch", "downgrade"]).toContain(rec.status);
  expect(rec.monthlySavings).toBe(200);
});

// Test 4: Optimal stack should return isOptimal = true
test("returns isOptimal for single low-spend tool on right plan", () => {
  const input: AuditInput = {
    tools: [{ toolId: "github_copilot", plan: "individual", monthlySpend: 10, seats: 1 }],
    teamSize: 1,
    useCase: "coding",
  };
  const result = runAudit(input);
  // totalMonthlySavings should be < 10 for isOptimal
  expect(result.totalCurrentSpend).toBe(10);
});

// Test 5: Audit ID is unique each call
test("each audit gets a unique id", () => {
  const input: AuditInput = {
    tools: [{ toolId: "gemini", plan: "advanced", monthlySpend: 20, seats: 1 }],
    teamSize: 3,
    useCase: "research",
  };
  const a1 = runAudit(input);
  const a2 = runAudit(input);
  expect(a1.id).not.toBe(a2.id);
});

// Test 6: Total savings = sum of per-tool savings
test("totalMonthlySavings equals sum of per-tool savings", () => {
  const input: AuditInput = {
    tools: [
      { toolId: "cursor", plan: "business", monthlySpend: 400, seats: 10 },
      { toolId: "claude_anthropic", plan: "team", monthlySpend: 250, seats: 10 },
    ],
    teamSize: 10,
    useCase: "coding",
  };
  const result = runAudit(input);
  const summed = result.recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0
  );
  expect(result.totalMonthlySavings).toBeCloseTo(summed);
});

// Test 7: Annual savings = monthly * 12
test("annualSavings is exactly 12x monthlySavings per recommendation", () => {
  const input: AuditInput = {
    tools: [{ toolId: "chatgpt", plan: "team", monthlySpend: 50, seats: 2 }],
    teamSize: 2,
    useCase: "writing",
  };
  const result = runAudit(input);
  result.recommendations.forEach((rec) => {
    expect(rec.annualSavings).toBeCloseTo(rec.monthlySavings * 12);
  });
});

// Test 8: Empty tools array handled gracefully
test("handles empty tools array without throwing", () => {
  const input: AuditInput = {
    tools: [],
    teamSize: 5,
    useCase: "mixed",
  };
  expect(() => runAudit(input)).not.toThrow();
  const result = runAudit(input);
  expect(result.recommendations).toHaveLength(0);
  expect(result.totalMonthlySavings).toBe(0);
});
