import React from "react";

interface Props {
  businessName: string;
}

export const ModernAgencyNav: React.FC<Props> = ({ businessName }) => {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4 text-zinc-100">
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 bg-cyan-500" />
      </div>
      <nav className="hidden space-x-6 text-xs uppercase tracking-widest text-zinc-400 md:flex">
        <a href="#work" className="hover:text-cyan-400 transition-colors">
          Work
        </a>
        <a href="#services" className="hover:text-cyan-400 transition-colors">
          Services
        </a>
        <a href="#about" className="hover:text-cyan-400 transition-colors">
          About
        </a>
      </nav>
      <button className="border border-zinc-700 bg-zinc-900 px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-zinc-200 hover:border-cyan-500 hover:text-cyan-400 transition-all">
        Init Project
      </button>
    </header>
  );
};
