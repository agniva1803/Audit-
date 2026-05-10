import { Metadata } from "next";
import ResultClient from "./ResultClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `AI Spend Audit #${id} — SpendWise AI`,
    description: "See where this team is overpaying for AI tools.",
    openGraph: {
      title: `AI Spend Audit — SpendWise AI`,
      description: "Free AI tool spend audit. See potential savings.",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResultClient auditId={id} />;
}
