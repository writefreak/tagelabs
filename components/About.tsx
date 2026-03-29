export default function About() {
  return (
    <section id="about" className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        {/* Left */}
        <div>
          <p className="text-blue text-sm font-medium tracking-widest uppercase mb-4 font-body">
            About TageLabs
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-navy leading-tight mb-8">
            A studio that builds for the long game.
          </h2>

          <div className="w-16 h-0.5 bg-blue mb-8" />

          <p className="font-body text-navy/60 leading-relaxed mb-6 text-sm">
            TageLabs is a digital solutions studio founded on one belief — that good design and clean code are not luxuries, they are competitive advantages.
          </p>
          <p className="font-body text-navy/60 leading-relaxed text-sm">
            We work with ambitious businesses and individuals who understand that their digital presence is a direct reflection of their brand. Every project we take on is treated as a partnership, not a transaction.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            {[
              { label: "Precision", desc: "Every detail is intentional." },
              { label: "Speed", desc: "Fast delivery without compromise." },
              { label: "Clarity", desc: "No fluff. Just results." },
              { label: "Ambition", desc: "We build for scale." },
            ].map((v) => (
              <div key={v.label} className="border-l-2 border-blue pl-4">
                <p className="font-body font-semibold text-navy text-sm">{v.label}</p>
                <p className="font-body text-navy/50 text-xs mt-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — visual block */}
        <div className="relative">
          <div
            className="rounded-2xl w-full aspect-square"
            style={{
              background: "linear-gradient(135deg, #112369 0%, #4a8fe2 100%)",
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
              <p className="font-display text-6xl font-semibold mb-2">TL</p>
              <p className="font-body text-white/60 text-sm tracking-widest uppercase">
                TageLabs Studio
              </p>
              <div className="mt-8 w-12 h-0.5 bg-white/30" />
              <p className="mt-6 font-body text-white/70 text-xs text-center leading-relaxed max-w-xs">
                "We don't just build websites. We build the digital face of your business."
              </p>
            </div>
          </div>
          {/* Offset accent */}
          <div
            className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl -z-10"
            style={{ background: "#4a8fe2", opacity: 0.2 }}
          />
        </div>
      </div>
    </section>
  );
}
