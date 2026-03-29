const works = [
  {
    title: "Youngs Solutions",
    category: "Frontend Development",
    description:
      "Collaborated on the frontend of a full-stack property and housing services platform. Delivered a clean, responsive UI across multiple sections.",
    tech: ["Next.js", "TypeScript"],
    accent: "#112369",
  },
  {
    title: "Acessyn",
    category: "React Native · Collaborator",
    description:
      "Built the cross-platform user app for a service marketplace platform using React Native, Expo, and NativeWind.",
    tech: ["React Native", "Expo", "TypeScript", "NativeWind"],
    accent: "#4a8fe2",
  },
  {
    title: "CV & Brand Assets",
    category: "CV Optimization · Graphics",
    description:
      "Designed modern, ATS-friendly CVs and minimalist brand assets for professionals across various industries.",
    tech: ["Design", "Brand", "Typography"],
    accent: "#112369",
  },
];

export default function Work() {
  return (
    <section id="work" className="py-28 px-6" style={{ background: "#f8f9fc" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <p className="text-blue text-sm font-medium tracking-widest uppercase mb-4 font-body">
            Selected work
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-navy max-w-md leading-tight">
            Built with intention.
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {works.map((work, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8 group hover:shadow-md transition-shadow duration-300"
            >
              {/* Number */}
              <div
                className="hidden md:flex items-center justify-center w-16 h-16 rounded-full text-white font-display font-semibold text-lg shrink-0"
                style={{ background: work.accent }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="font-body text-xs text-blue tracking-widest uppercase mb-2">
                  {work.category}
                </p>
                <h3 className="font-display text-2xl font-semibold text-navy mb-3">
                  {work.title}
                </h3>
                <p className="font-body text-navy/60 text-sm leading-relaxed max-w-lg">
                  {work.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 md:justify-end">
                {work.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-medium border border-navy/15 text-navy/60 px-3 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
