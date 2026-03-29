export default function Footer() {
  return (
    <footer className="bg-navy py-10 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display text-lg font-semibold text-white">
          Tage<span className="text-blue">Labs</span>
        </p>
        <p className="font-body text-white/30 text-xs">
          © {new Date().getFullYear()} TageLabs. All rights reserved.
        </p>
        <p className="font-body text-white/30 text-xs">
          Built by TageLabs.
        </p>
      </div>
    </footer>
  );
}
