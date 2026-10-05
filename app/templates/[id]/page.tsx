import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PreviewFormData, TemplateType } from "@/app/lib/types/dreamsite";
import { ModernAgencyTemplate } from "@/components/templates/modern-agency/modern-agency-template";
import { EditorialPortfolioTemplate } from "@/components/templates/editorial/editorial-template";
import { BoldSaasTemplate } from "@/components/templates/bold-saas/saas-template";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    businessName?: string;
    category?: string;
    tagline?: string;
    whatsapp?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const formattedTitle = resolvedParams.id
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${formattedTitle} Preview | Tagelabs`,
  };
}

export default async function TemplatePreviewPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const validTemplates: TemplateType[] = [
    "modern_agency",
    "editorial_portfolio",
    "bold_saas",
  ];

  if (!validTemplates.includes(resolvedParams.id as TemplateType)) {
    notFound();
  }

  // Construct data object from search query params or fall back to defaults
  const previewData: PreviewFormData = {
    businessName: resolvedSearchParams.businessName || "Tagelabs Digital",
    category: resolvedSearchParams.category || "Digital Architecture",
    tagline:
      resolvedSearchParams.tagline ||
      "Engineering high-performance web platforms for market leaders.",
    whatsapp: resolvedSearchParams.whatsapp || "+234000000000",
    template: resolvedParams.id as TemplateType,
  };

  return (
    <main className="min-h-screen w-full bg-zinc-950">
      {resolvedParams.id === "modern_agency" && (
        <ModernAgencyTemplate data={previewData} />
      )}
      {resolvedParams.id === "editorial_portfolio" && (
        <EditorialPortfolioTemplate data={previewData} />
      )}
      {resolvedParams.id === "bold_saas" && (
        <BoldSaasTemplate data={previewData} />
      )}
    </main>
  );
}
