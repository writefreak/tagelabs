import React from "react";

export const SaasFeatures: React.FC = () => {
  const features = [
    {
      title: "Instant Deployment",
      desc: "Deploy preview environments within seconds using automated CI/CD.",
    },
    {
      title: "Global Database",
      desc: "Powered by Supabase PostgreSQL for minimal query overhead.",
    },
    {
      title: "Zero Latency",
      desc: "In-memory client preview execution at 60 FPS performance.",
    },
  ];

  return (
    <section
      id="features"
      className="border-t border-slate-200 bg-white px-6 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Architected for Speed and Scale
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 p-6 bg-slate-50/50"
            >
              <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mb-4">
                0{idx + 1}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
