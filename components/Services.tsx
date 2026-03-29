const services = [
  {
    number: "01",
    title: "Landing Page Design",
    description:
      "High-converting, beautifully designed landing pages built to turn visitors into customers. Every pixel earns its place.",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
  },
  {
    number: "02",
    title: "CV & Portfolio Optimization",
    description:
      "Professional CVs and portfolio sites that position you for the opportunities you actually want — not just any opportunity.",
    tags: ["Design", "Copywriting", "Web"],
  },
  {
    number: "03",
    title: "Minimalist Graphics",
    description:
      "Clean, intentional graphic design for brands that want to communicate clarity and confidence — not noise.",
    tags: ["Brand", "Visual Identity", "Design"],
  },
  {
    number: "04",
    title: "Frontend Development",
    description:
      "Scalable, performant frontend code using modern frameworks. From component libraries to full product UIs.",
    tags: ["React", "TypeScript", "React Native"],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <p className="text-blue text-sm font-medium tracking-widest uppercase mb-4 font-body">
              What we do
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-navy max-w-md leading-tight">
              Services built for results.
            </h2>
          </div>
          <p className="font-body text-navy/50 max-w-sm text-sm leading-relaxed">
            Every service is designed with one goal — to move your business forward in a way that's visible, measurable, and lasting.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-px bg-navy/10">
          {services.map((s) => (
            <div
              key={s.number}
              className="bg-white p-10 group hover:bg-offwhite transition-colors duration-300"
            >
              <span className="font-body text-xs text-blue tracking-widest">{s.number}</span>
              <h3 className="font-display text-2xl font-semibold text-navy mt-4 mb-4 group-hover:text-blue transition-colors duration-200">
                {s.title}
              </h3>
              <p className="font-body text-navy/60 text-sm leading-relaxed mb-6">
                {s.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-blue/10 text-blue px-3 py-1 rounded-full"
                  >
                    {tag}
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
