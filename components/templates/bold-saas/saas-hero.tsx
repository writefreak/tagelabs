import React from "react";

interface Props {
  businessName: string;
  category: string;
  tagline: string;
}

export const SaasHero: React.FC<Props> = ({
  businessName,
  category,
  tagline,
}) => {
  return (
    <section className="bg-slate-50 px-6 py-20 text-center lg:py-32">
      <div className="mx-auto max-w-4xl">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-500/20 mb-6">
          {category || "ENTERPRISE SAAS PLATFORM"}
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          {businessName || "Tagelabs Engine"}
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          {tagline ||
            "Automate workflow pipelines, streamline modern deployments, and scale application performance effortlessly."}
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <button className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors">
            Get Started Instant
          </button>
          <button className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Book Demo
          </button>
        </div>
      </div>
    </section>
  );
};
