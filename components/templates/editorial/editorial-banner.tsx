import React from "react";

interface Props {
  whatsapp: string;
}

export const EditorialBanner: React.FC<Props> = ({ whatsapp }) => {
  return (
    <section
      id="contact"
      className="border-t border-stone-200 bg-amber-50/40 px-8 py-20 text-stone-900"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl italic text-stone-900">
          Initiate a Dialogue
        </h2>
        <p className="mt-4 font-serif text-sm text-stone-600">
          We accept a limited number of commissions per calendar year.
        </p>
        <div className="mt-8">
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-b-2 border-stone-900 pb-1 font-serif text-sm uppercase tracking-widest text-stone-900 hover:text-amber-800 hover:border-amber-800 transition-colors"
          >
            Direct Inquiry on WhatsApp ({whatsapp || "+234000000000"})
          </a>
        </div>
      </div>
    </section>
  );
};
