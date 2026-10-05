import React from "react";

export const ModernAgencyProjects: React.FC = () => {
  const projects = [
    { id: "01", title: "Fintech Core OS", tag: "Next.js / Supabase" },
    { id: "02", title: "Aero Dynamics", tag: "WebGL / Tailwind" },
    { id: "03", title: "Quantum Vault", tag: "Prisma / PostgreSQL" },
  ];

  return (
    <section
      id="work"
      className="border-t border-zinc-800 bg-zinc-900 px-6 py-16 text-zinc-100"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-8">
          Selected Engagements
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((item) => (
            <div
              key={item.id}
              className="group border border-zinc-800 bg-zinc-950 p-6 transition-colors hover:border-zinc-700"
            >
              <span className="font-mono text-xs text-zinc-500">{item.id}</span>
              <h3 className="mt-4 text-xl font-bold uppercase tracking-wide text-zinc-100 group-hover:text-cyan-400 transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 font-mono text-xs text-zinc-400">{item.tag}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
