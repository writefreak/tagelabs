import React from "react";

export const EditorialProjects: React.FC = () => {
  const works = [
    { year: "2026", title: "Maison de Culture", category: "Identity & Web" },
    { year: "2025", title: "Vanguard Atelier", category: "Editorial Digital" },
    { year: "2025", title: "Solstice Monograph", category: "E-Commerce" },
  ];

  return (
    <section
      id="archive"
      className="border-t border-stone-200 bg-stone-100 px-8 py-20 text-stone-900"
    >
      <div className="mx-auto max-w-4xl">
        <h2 className="font-serif text-xs uppercase tracking-widest text-stone-500 mb-12">
          Selected Index
        </h2>
        <div className="divide-y divide-stone-300">
          {works.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-6">
              <div>
                <h3 className="font-serif text-2xl text-stone-900">
                  {item.title}
                </h3>
                <p className="font-serif text-xs italic text-stone-600">
                  {item.category}
                </p>
              </div>
              <span className="font-serif text-sm text-stone-500">
                {item.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
