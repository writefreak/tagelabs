import React from "react";

interface Props {
  businessName: string;
}

export const EditorialNav: React.FC<Props> = ({ businessName }) => {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-amber-50/40 px-8 py-6 text-stone-900">
      <span className="font-serif text-xl italic tracking-tight">
        {businessName || "Tagelabs Editorial"}
      </span>
      <nav className="space-x-8 font-serif text-sm italic text-stone-600 hidden md:block">
        <a href="#archive" className="hover:text-stone-900 transition-colors">
          Archive
        </a>
        <a href="#about" className="hover:text-stone-900 transition-colors">
          Essays
        </a>
        <a href="#contact" className="hover:text-stone-900 transition-colors">
          Contact
        </a>
      </nav>
      <button className="border-b border-stone-900 pb-0.5 font-serif text-xs uppercase tracking-widest text-stone-900 hover:border-amber-700 transition-colors">
        Inquire
      </button>
    </header>
  );
};
