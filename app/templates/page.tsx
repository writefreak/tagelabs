"use client";

import React, { useState } from "react";
import {
  Building2,
  Tag,
  FileText,
  Phone,
  Layout,
  CheckCircle2,
  ArrowRight,
  Globe,
  Loader2,
} from "lucide-react";
import { PreviewFormData, TemplateType } from "@/app/lib/types/dreamsite";
import { saveDreamSiteLead } from "@/app/lib/actions/dreamsite";
import { ModernAgencyTemplate } from "@/components/templates/modern-agency/modern-agency-template";
import { EditorialPortfolioTemplate } from "@/components/templates/editorial/editorial-template";
import { BoldSaasTemplate } from "@/components/templates/bold-saas/saas-template";

export default function TemplatesConfiguratorPage() {
  const [formData, setFormData] = useState<PreviewFormData>({
    businessName: "Tagelabs Digital",
    category: "Software Engineering",
    tagline: "High-performance digital products built for scale.",
    whatsapp: "+2348000000000",
    template: "modern_agency",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (template: TemplateType) => {
    setFormData((prev) => ({ ...prev, template }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setSaveStatus(null);

    const result = await saveDreamSiteLead(formData);

    if (result.success) {
      setSaveStatus("Success: Configuration saved");
    } else {
      setSaveStatus(`Error: ${result.error}`);
    }

    setIsSubmitting(false);
  };

  const renderTemplate = () => {
    switch (formData.template) {
      case "modern_agency":
        return <ModernAgencyTemplate data={formData} />;
      case "editorial_portfolio":
        return <EditorialPortfolioTemplate data={formData} />;
      case "bold_saas":
        return <BoldSaasTemplate data={formData} />;
      default:
        return <ModernAgencyTemplate data={formData} />;
    }
  };

  const templateOptions: { id: TemplateType; title: string; desc: string }[] = [
    {
      id: "modern_agency",
      title: "Modern Agency",
      desc: "High-tech dark split hero with mono tags.",
    },
    {
      id: "editorial_portfolio",
      title: "Editorial Portfolio",
      desc: "Minimalist serif aesthetic for creative studios.",
    },
    {
      id: "bold_saas",
      title: "Bold SaaS",
      desc: "High-contrast conversion grid with crisp cards.",
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-white pt-20 md:pt-20 md:px-14 text-[#112369] lg:h-screen lg:flex-row lg:overflow-hidden">
      {/* 1. DISPLAY PREVIEW (Shows FIRST on mobile, SECOND on desktop) */}
      <main className="order-1 flex flex-col p-4 sm:p-6 lg:order-2 lg:flex-1 lg:overflow-hidden">
        <div className="flex min-h-[500px] flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:min-h-0 lg:shadow-2xl">
          {/* Mock Browser Top Header Bar */}
          {/* <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100/80 px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-400 sm:h-3 sm:w-3" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400 sm:h-3 sm:w-3" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 sm:h-3 sm:w-3" />
            </div>

            <div className="mx-2 flex max-w-xs flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-500 shadow-inner sm:max-w-md sm:px-3 sm:text-xs font-jet">
              <Globe className="h-3 w-3 flex-shrink-0 text-slate-400 sm:h-3.5 sm:w-3.5" />
              <span className="truncate">
                https://preview.tagelabs.digital/templates/{formData.template}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 sm:px-2.5 sm:text-[10px]">
                Live Memory
              </span>
            </div>
          </div> */}

          {/* Interactive Viewport Area without Visible Scrollbar */}
          <div className="flex-1 overflow-y-auto bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {renderTemplate()}
          </div>
        </div>
      </main>

      {/* 2. CONFIGURATOR SIDEBAR (Shows SECOND on mobile, FIRST on desktop) */}
      <aside className="order-2 w-full flex-shrink-0 border-t border-slate-200 bg-white p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden lg:order-1 lg:w-[420px] lg:border-r lg:border-t-0 lg:overflow-y-auto">
        <div className="flex items-center space-x-2 text-[#112369]">
          <h2 className="text-base font-bold md:text-xl font-display">
            Dream Site Studio
          </h2>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Customize your business details below to see how your dream site looks
          like.
        </p>

        <div className="mt-6 space-y-5 text-xs lg:mt-8">
          {/* Business Name Field */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 font-bold text-[#112369]">
              <Building2 className="h-3.5 w-3.5 text-[#4a8fe2]" />
              Business Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                placeholder="e.g., Tagelabs Studio"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[#112369] shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-[#112369] focus:outline-none focus:ring-2 focus:ring-[#112369]/10"
              />
            </div>
          </div>

          {/* Industry Category Field */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 font-bold text-[#112369]">
              <Tag className="h-3.5 w-3.5 text-[#4a8fe2]" />
              Industry / Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Digital Architecture"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[#112369] shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-[#112369] focus:outline-none focus:ring-2 focus:ring-[#112369]/10"
            />
          </div>

          {/* Tagline Field */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 font-bold text-[#112369]">
              <FileText className="h-3.5 w-3.5 text-[#4a8fe2]" />
              Tagline / Value Proposition
            </label>
            <textarea
              name="tagline"
              value={formData.tagline}
              onChange={handleInputChange}
              rows={3}
              placeholder="Write a concise overview..."
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[#112369] shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-[#112369] focus:outline-none focus:ring-2 focus:ring-[#112369]/10"
            />
          </div>

          {/* WhatsApp Field */}
          <div>
            <label className="mb-1.5 flex items-center gap-2 font-bold text-[#112369]">
              <Phone className="h-3.5 w-3.5 text-[#4a8fe2]" />
              WhatsApp Contact
            </label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="e.g., +2348000000000"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[#112369] shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-[#112369] focus:outline-none focus:ring-2 focus:ring-[#112369]/10"
            />
          </div>

          {/* Template Selection Radio Cards */}
          <div>
            <label className="mb-2 flex items-center gap-2 font-bold text-[#112369]">
              <Layout className="h-3.5 w-3.5 text-[#4a8fe2]" />
              Select Layout Architecture
            </label>
            <div className="space-y-2">
              {templateOptions.map((opt) => {
                const isSelected = formData.template === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleTemplateSelect(opt.id)}
                    className={`group relative flex w-full items-start justify-between rounded-xl border p-3.5 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-[#112369] bg-[#112369]/[0.03] shadow-sm ring-1 ring-[#112369]"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#112369]">
                          {opt.title}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center rounded-full bg-[#112369] px-2 py-0.5 text-[10px] font-semibold text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] leading-snug text-slate-500">
                        {opt.desc}
                      </p>
                    </div>
                    <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center">
                      <div
                        className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? "border-[#112369] bg-[#112369]"
                            : "border-slate-300 group-hover:border-slate-400"
                        }`}
                      >
                        {isSelected && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-4 pb-6 lg:pb-0">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#112369] py-3.5 text-xs font-bold text-white shadow-md transition-all duration-200 hover:bg-[#112369]/90 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Persisting Configuration...</span>
                </>
              ) : (
                <>
                  <span>Save Configuration</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>

          {saveStatus && (
            <div
              className={`flex items-center gap-2 rounded-lg p-3 text-xs font-semibold ${
                saveStatus.startsWith("Success")
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>{saveStatus}</span>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
