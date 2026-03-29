"use client";
import { useEffect, useRef } from "react";
import { saveAs } from "file-saver";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const blobRightRef = useRef<HTMLDivElement>(null);
  const blobLeftRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    saveAs("/TageLabs BrandStory.pdf", "TageLabs-Brand-Story.pdf");
  };

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".anim");
    els?.forEach((el, i) => {
      setTimeout(() => {
        el.classList.remove("opacity-0");
        el.classList.add("animate-fade-up");
      }, i * 150);
    });
  }, []);

  useEffect(() => {
    let frame: number;
    let t = 0;

    const animate = () => {
      t += 0.007;

      if (blobRightRef.current) {
        const x = 30 + Math.sin(t) * 4;
        const y = -30 + Math.cos(t * 0.8) * 4;
        blobRightRef.current.style.transform = `translate(${x}%, ${y}%)`;
      }

      if (blobLeftRef.current) {
        const x = -30 + Math.cos(t * 0.9) * 4;
        const y = -20 + Math.sin(t * 0.7) * 4;
        blobLeftRef.current.style.transform = `translate(${x}%, ${y}%)`;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
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

      {/* Accent blob — right */}
      <div
        ref={blobRightRef}
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(74,143,226,0.12) 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
          willChange: "transform",
        }}
      />

      {/* Accent blob — left */}
      <div
        ref={blobLeftRef}
        className="absolute top-1/2 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(17,35,105,0.08) 0%, transparent 70%)",
          transform: "translate(-30%, -20%)",
          willChange: "transform",
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full">
        {/* Headline */}
        <div className="flex flex-col justify-center items-center">
          <h1 className="anim opacity-0 text-center font-display text-[39px] md:text-5xl lg:text-7xl font-semibold text-navy leading-tight mb-8 max-w-4xl">
            Transforming businesses with{" "}
            <span className="text-blue italic">scalable</span> digital solutions.
          </h1>

          {/* Sub */}
          <p className="anim opacity-0 text-center font-body text-base md:text-lg text-navy/60 max-w-xl mb-12 leading-relaxed">
            We design and build landing pages, portfolios, CVs, and frontend
            products that convert for ambitious businesses worldwide.
          </p>
        </div>

        {/* CTAs */}
        <div className="anim opacity-0 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-navy text-white font-medium px-8 py-4 rounded-full hover:bg-blue transition-colors duration-200 text-sm"
          >
            Start a project
          </a>
          <button
            onClick={handleDownload}
            className="inline-flex items-center justify-center border border-navy/20 text-navy font-medium px-8 py-4 rounded-full hover:border-blue hover:text-blue transition-colors duration-200 text-sm"
          >
            Our Brand Story
          </button>
        </div>
      </div>
    </section>
  );
}