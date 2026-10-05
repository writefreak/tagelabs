import React from "react";

interface Props {
  businessName: string;
  category: string;
  tagline: string;
}

export const ModernAgencyHero: React.FC<Props> = ({
  businessName,
  category,
  tagline,
}) => {
  return (
    <section className="relative overflow-hidden bg-zinc-950 px-6 py-20 text-zinc-100 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="inline-block border border-cyan-500/30 bg-cyan-950/20 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyan-400 mb-6">
          [{category || "DIGITAL ARCHITECTURE"}]
        </div>
        <h1 className="text-4xl font-extrabold uppercase tracking-tight text-white sm:text-6xl lg:text-7xl leading-none">
          {businessName || "TAGELABS STUDIO"}
        </h1>
        <p className="mt-6 max-w-2xl font-mono text-sm text-zinc-400 leading-relaxed md:text-base">
          {tagline ||
            "Engineering high-performance web platforms and bespoke enterprise applications for market leaders."}
        </p>
        <div className="mt-8 flex flex-wrap gap-4 font-mono text-xs">
          <div className="flex items-center space-x-2 border border-zinc-800 bg-zinc-900/50 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-300">SYSTEM STATUS: OPTIMAL</span>
          </div>
          <div className="flex items-center space-x-2 border border-zinc-800 bg-zinc-900/50 px-4 py-2">
            <span className="text-zinc-400">LATENCY: &lt;16MS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
