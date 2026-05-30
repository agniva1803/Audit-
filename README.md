<div align="center">

# 💸 SpendWise AI

**AI-powered spend auditor that finds where startups waste money on SaaS tools**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Anthropic](https://img.shields.io/badge/Claude-API-CC785C?style=flat-square)](https://anthropic.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

> Built end-to-end in 7 days · Saved startups thousands in AI tool overspend

</div>

---

## 🎯 What It Does

Startups overpay for AI tools — SpendWise AI audits your stack and finds:
- 🔍 **Duplicate tools** doing the same job
- 💀 **Zombie subscriptions** — tools nobody uses
- 💰 **Cheaper alternatives** with the same features
- 📊 **ROI breakdown** per tool

## ✨ Features

- 🤖 **Anthropic Claude API** — intelligent spend analysis
- 📋 **8 tool categories** — LLMs, DevOps, Analytics, Design, CRM, Storage, Auth, Monitoring
- 🧮 **Rule-based engine** — deterministic savings calculations
- 📈 **Visual dashboard** — savings breakdown by category
- ⚡ **Built with Next.js 15** — App Router, Server Actions
- 🎨 **Clean UI** — Tailwind CSS

## 🚀 Quick Start

```bash
git clone https://github.com/agniva1803/SpendUse_AI
cd SpendUse_AI
npm install

# Add your Anthropic API key
cp .env.example .env.local
# ANTHROPIC_API_KEY=your_key_here

npm run dev
```

Open `http://localhost:3000`

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| AI | Anthropic Claude API |
| Styling | Tailwind CSS |
| Testing | Jest |
| Deploy | Vercel |

## 📁 Project Structure

```
SpendUse_AI/
├── app/             # Next.js App Router pages
├── components/      # React components
├── lib/             # Business logic + AI integration
├── types/           # TypeScript interfaces
├── __tests__/       # Jest tests
└── ARCHITECTURE.md  # System design docs
```

## 📖 Docs

- [Architecture](./ARCHITECTURE.md) — system design decisions
- [Agents](./AGENTS.md) — AI agent architecture
- [Economics](./ECONOMICS.md) — pricing model
- [Metrics](./METRICS.md) — success metrics

---

<div align="center">
Built by <a href="https://github.com/agniva1803">Agniva Mukherjee</a> · <a href="https://www.linkedin.com/in/agniva-mukherjee-b2647b21a">LinkedIn</a>
</div>
