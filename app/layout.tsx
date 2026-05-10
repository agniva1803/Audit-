import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendWise AI — Free AI Spend Audit for Startups",
  description:
    "Find out if you're overpaying for AI tools in 2 minutes. Get a free audit of your Cursor, Claude, ChatGPT, and Copilot spend. No login required.",
  openGraph: {
    title: "SpendWise AI — Free AI Spend Audit",
    description:
      "Most startups overpay for AI tools and don't know it. Get your free audit in 2 minutes.",
    url: "https://spendwiseai.vercel.app",
    siteName: "SpendWise AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendWise AI — Free AI Spend Audit",
    description:
      "Most startups overpay for AI tools and don't know it. Get your free audit in 2 minutes.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
