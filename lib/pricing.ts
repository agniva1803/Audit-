// Pricing data — verified against official vendor pages, May 2026
// See PRICING_DATA.md for all source URLs

import type { ToolId } from "@/types";

export interface Plan {
  id: string;
  label: string;
  pricePerSeat: number; // per month per seat, 0 if flat
  flatPrice?: number; // flat monthly price (no per-seat)
  minSeats?: number;
  maxSeats?: number;
  bestFor?: string;
  goodFor: Array<"coding" | "writing" | "data" | "research" | "mixed">;
}

export interface ToolMeta {
  id: ToolId;
  name: string;
  plans: Plan[];
  category: "coding" | "llm" | "api";
  emoji: string;
}

export const TOOLS: ToolMeta[] = [
  {
    id: "cursor",
    name: "Cursor",
    category: "coding",
    emoji: "⚡",
    plans: [
      { id: "hobby", label: "Hobby", pricePerSeat: 0, goodFor: ["coding"] },
      { id: "pro", label: "Pro", pricePerSeat: 20, goodFor: ["coding"] },
      { id: "business", label: "Business", pricePerSeat: 40, goodFor: ["coding"] },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 60, goodFor: ["coding"] },
    ],
  },
  {
    id: "github_copilot",
    name: "GitHub Copilot",
    category: "coding",
    emoji: "🐙",
    plans: [
      { id: "individual", label: "Individual", pricePerSeat: 10, goodFor: ["coding"] },
      { id: "business", label: "Business", pricePerSeat: 19, goodFor: ["coding"] },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 39, goodFor: ["coding"] },
    ],
  },
  {
    id: "claude_anthropic",
    name: "Claude (Anthropic)",
    category: "llm",
    emoji: "🤖",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0, goodFor: ["writing", "research", "mixed"] },
      { id: "pro", label: "Pro", pricePerSeat: 20, goodFor: ["writing", "research", "mixed"] },
      { id: "max5", label: "Max (5x)", pricePerSeat: 100, goodFor: ["writing", "research", "mixed", "coding", "data"] },
      { id: "max20", label: "Max (20x)", pricePerSeat: 200, goodFor: ["writing", "research", "mixed", "coding", "data"] },
      { id: "team", label: "Team", pricePerSeat: 25, minSeats: 5, goodFor: ["writing", "research", "mixed"] },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 0, goodFor: ["writing", "research", "mixed", "coding", "data"] },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT (OpenAI)",
    category: "llm",
    emoji: "💬",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0, goodFor: ["writing", "research", "mixed"] },
      { id: "plus", label: "Plus", pricePerSeat: 20, goodFor: ["writing", "research", "mixed"] },
      { id: "team", label: "Team", pricePerSeat: 25, minSeats: 2, goodFor: ["writing", "research", "mixed"] },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 0, goodFor: ["writing", "research", "mixed", "coding", "data"] },
      { id: "api_direct", label: "API Direct", pricePerSeat: 0, goodFor: ["coding", "data", "mixed"] },
    ],
  },
  {
    id: "anthropic_api",
    name: "Anthropic API",
    category: "api",
    emoji: "🔌",
    plans: [
      { id: "pay_as_you_go", label: "Pay-as-you-go", pricePerSeat: 0, goodFor: ["coding", "data", "mixed", "research", "writing"] },
    ],
  },
  {
    id: "openai_api",
    name: "OpenAI API",
    category: "api",
    emoji: "🔌",
    plans: [
      { id: "pay_as_you_go", label: "Pay-as-you-go", pricePerSeat: 0, goodFor: ["coding", "data", "mixed", "research", "writing"] },
    ],
  },
  {
    id: "gemini",
    name: "Gemini (Google)",
    category: "llm",
    emoji: "♊",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0, goodFor: ["writing", "research", "mixed"] },
      { id: "advanced", label: "Gemini Advanced (Pro)", pricePerSeat: 19.99, goodFor: ["writing", "research", "mixed", "coding"] },
      { id: "business", label: "Gemini Business", pricePerSeat: 24, minSeats: 1, goodFor: ["writing", "research", "mixed"] },
      { id: "api", label: "API", pricePerSeat: 0, goodFor: ["coding", "data", "mixed"] },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf (Codeium)",
    category: "coding",
    emoji: "🏄",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0, goodFor: ["coding"] },
      { id: "pro", label: "Pro", pricePerSeat: 15, goodFor: ["coding"] },
      { id: "teams", label: "Teams", pricePerSeat: 35, minSeats: 1, goodFor: ["coding"] },
    ],
  },
];

export function getToolMeta(id: ToolId): ToolMeta {
  return TOOLS.find((t) => t.id === id)!;
}

export function getPlan(toolId: ToolId, planId: string): Plan | undefined {
  return getToolMeta(toolId)?.plans.find((p) => p.id === planId);
}
