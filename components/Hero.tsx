"use client";
import { useEffect, useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".anim");
    els?.forEach((el, i) => {
      setTimeout(() => {
        el.classList.remove("opacity-0");
        el.classList.add("animate-fade-up");
      }, i * 150);
    });
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #ffffff 60%, #eef3fb 100%)" }}
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(17,35,105,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(17,35,105,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Accent blob */}
      <div
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(74,143,226,0.12) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full">
        {/* Eyebrow */}
        <p className="anim opacity-0 text-blue text-sm font-medium tracking-widest uppercase mb-6 font-body">
          Digital Studio
        </p>

        {/* Headline */}
        <h1 className="anim opacity-0 font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-navy leading-tight mb-8 max-w-4xl">
          Transforming businesses with{" "}
          <span className="text-blue italic">scalable</span> digital solutions.
        </h1>

        {/* Sub */}
        <p className="anim opacity-0 font-body text-lg md:text-xl text-navy/60 max-w-xl mb-12 leading-relaxed">
          We design and build landing pages, portfolios, CVs, and frontend
          products that convert — for ambitious businesses worldwide.
        </p>

        {/* CTAs */}
        <div className="anim opacity-0 flex flex-col sm:flex-row gap-4">
          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-navy text-white font-medium px-8 py-4 rounded-full hover:bg-blue transition-colors duration-200 text-sm"
          >
            Start a project
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center border border-navy/20 text-navy font-medium px-8 py-4 rounded-full hover:border-blue hover:text-blue transition-colors duration-200 text-sm"
          >
            See what we do
          </a>
        </div>

        {/* Stats bar */}
        <div className="anim opacity-0 mt-20 pt-10 border-t border-navy/10 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl">
          {[
            { value: "100%", label: "Client satisfaction" },
            { value: "Fast", label: "Turnaround times" },
            { value: "Global", label: "Clientele" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-semibold text-navy">{stat.value}</p>
              <p className="font-body text-sm text-navy/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
