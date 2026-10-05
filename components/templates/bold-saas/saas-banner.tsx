import React from "react";

interface Props {
  whatsapp: string;
}

export const SaasBanner: React.FC<Props> = ({ whatsapp }) => {
  return (
    <section className="bg-indigo-600 px-6 py-16 text-white text-center">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Transform Your Business Operations Today
        </h2>
        <p className="mt-4 text-indigo-100 text-sm">
          Speak to an enterprise specialist directly on WhatsApp.
        </p>
        <div className="mt-8">
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-white px-8 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg"
          >
            WhatsApp Support ({whatsapp || "+234000000000"})
          </a>
        </div>
      </div>
    </section>
  );
};
