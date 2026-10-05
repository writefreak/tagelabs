import React from "react";

interface Props {
  businessName: string;
  category: string;
  tagline: string;
}

export const EditorialHero: React.FC<Props> = ({
  businessName,
  category,
  tagline,
}) => {
  return (
    <section className="bg-amber-50/40 px-8 py-24 text-stone-900 lg:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <span className="font-serif text-xs uppercase tracking-widest text-amber-900/70">
          {category || "Architectural & Brand Design"}
        </span>
        <h1 className="mt-4 font-serif text-5xl font-normal tracking-tight text-stone-900 sm:text-7xl">
          {businessName || "Tagelabs Editorial"}
        </h1>
        <p className="mt-8 font-serif text-lg leading-relaxed text-stone-700 sm:text-xl">
          {tagline ||
            "Crafting timeless digital experiences through rigorous typography, curated spatial design, and thoughtful brand expression."}
        </p>
      </div>
    </section>
  );
};
