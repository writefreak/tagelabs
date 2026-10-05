import React from "react";

interface Props {
  whatsapp: string;
}

export const ModernAgencyBanner: React.FC<Props> = ({ whatsapp }) => {
  return (
    <section className="border-t border-zinc-800 bg-cyan-950/20 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-white md:text-4xl">
          Ready to Deploy Your Digital Infrastructure?
        </h2>
        <p className="mt-4 font-mono text-xs text-zinc-400">
          Connect directly with our engineering team via WhatsApp.
        </p>
        <div className="mt-8">
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-cyan-500 px-8 py-4 font-mono text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-cyan-400 transition-colors"
          >
            Start WhatsApp Consultation ({whatsapp || "+234000000000"})
          </a>
        </div>
      </div>
    </section>
  );
};
