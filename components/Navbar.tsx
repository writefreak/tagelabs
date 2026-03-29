"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    const phone = "2349169615448";
    const message =
      "Hi Tagelabs, there's a project I would like to bring it to life with your help.";
    const encoded = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phone}?text=${encoded}`;
    window.open(whatsappLink, "_blank");
    setIsClicked(!isClicked);
  };

 const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
  setMenuOpen(false);
};

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Services", "Work", "About", "Contact"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="font-display font-700 text-xl text-navy tracking-tight">
          <div className="h-10 w-32">
            <img src="/tagelabslogo.png" alt="" className="h-full w-full" />
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase())}
              className="text-sm font-body font-medium text-navy/70 hover:text-blue transition-colors duration-200"
            >
              {link}
            </button>
          ))}
          <button
            onClick={handleClick}
            className="text-sm font-medium bg-navy text-white px-5 py-2 rounded-full hover:bg-blue transition-colors duration-200"
          >
            Get Started
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-navy transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-navy transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-navy transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-6 flex flex-col gap-6">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase())}
              className="text-sm font-medium text-navy/70 hover:text-blue transition-colors text-left"
            >
              {link}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contact")}
            className="text-sm font-medium bg-navy text-white px-5 py-2.5 rounded-full text-center hover:bg-blue transition-colors"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}