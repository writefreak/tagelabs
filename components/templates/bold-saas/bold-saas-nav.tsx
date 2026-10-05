import React from "react";

interface Props {
  businessName: string;
}

export const SaasNav: React.FC<Props> = ({ businessName }) => {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
          T
        </div>
        <span className="text-base font-bold text-slate-900">
          {businessName || "Tagelabs SaaS"}
        </span>
      </div>
      <nav className="hidden space-x-6 text-sm font-medium text-slate-600 md:flex">
        <a href="#features" className="hover:text-indigo-600 transition-colors">
          Features
        </a>
        <a href="#pricing" className="hover:text-indigo-600 transition-colors">
          Pricing
        </a>
        <a href="#docs" className="hover:text-indigo-600 transition-colors">
          Documentation
        </a>
      </nav>
      <button className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-colors">
        Start Free Trial
      </button>
    </header>
  );
};
