import { PreviewFormData } from "@/app/lib/types/dreamsite";
import React from "react";
import { SaasHero } from "./saas-hero";
import { SaasNav } from "./bold-saas-nav";
import { SaasFeatures } from "./saas-features";
import { SaasBanner } from "./saas-banner";

interface Props {
  data: PreviewFormData;
}

export const BoldSaasTemplate: React.FC<Props> = ({ data }) => {
  return (
    <div className="min-h-full bg-white font-sans text-slate-900 antialiased">
      <SaasNav businessName={data.businessName} />
      <SaasHero
        businessName={data.businessName}
        category={data.category}
        tagline={data.tagline}
      />
      <SaasFeatures />
      <SaasBanner whatsapp={data.whatsapp} />
    </div>
  );
};
