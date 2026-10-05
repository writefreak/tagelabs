import { PreviewFormData } from "@/app/lib/types/dreamsite";
import React from "react";
import { EditorialNav } from "./editorial-nav";
import { EditorialHero } from "./editorial-hero";
import { EditorialProjects } from "./editorial-projs";
import { EditorialBanner } from "./editorial-banner";

interface Props {
  data: PreviewFormData;
}

export const EditorialPortfolioTemplate: React.FC<Props> = ({ data }) => {
  return (
    <div className="min-h-full bg-stone-50 text-stone-900 antialiased">
      <EditorialNav businessName={data.businessName} />
      <EditorialHero
        businessName={data.businessName}
        category={data.category}
        tagline={data.tagline}
      />
      <EditorialProjects />
      <EditorialBanner whatsapp={data.whatsapp} />
    </div>
  );
};
