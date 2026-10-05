import { PreviewFormData } from "@/app/lib/types/dreamsite";
import React from "react";
import { ModernAgencyNav } from "./modern-agency-nav";
import { ModernAgencyHero } from "./modern-agency-hero";
import { ModernAgencyProjects } from "./modern-agency-proj";
import { ModernAgencyBanner } from "./modern-agency-banner";

interface Props {
  data: PreviewFormData;
}

export const ModernAgencyTemplate: React.FC<Props> = ({ data }) => {
  return (
    <div className="min-h-full bg-zinc-950 font-sans text-zinc-100 antialiased">
      <ModernAgencyNav businessName={data.businessName} />
      <ModernAgencyHero
        businessName={data.businessName}
        category={data.category}
        tagline={data.tagline}
      />
      <ModernAgencyProjects />
      <ModernAgencyBanner whatsapp={data.whatsapp} />
    </div>
  );
};
