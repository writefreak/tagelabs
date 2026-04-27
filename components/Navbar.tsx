"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    const phone = "2349169615448";
    const message =
      "Hi Tagelabs, I have a project in mind and I would like to bring it to life with your help.";
    const encoded = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phone}?text=${encoded}`;
    window.open(whatsappLink, "_blank");
    setIsClicked(!isClicked);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = ["About", "Services", "Work", "Reviews", "Contact"];

  return (
    <>
      {/* Nav bar */}
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
              className="text-sm font-medium bg-blue text-white px-5 py-2 rounded-full hover:bg-blue transition-colors duration-200"
            >
              Get Started
            </button>
          </div>

          {/* Spacer so logo stays left on mobile — hamburger is now a separate fixed element */}
          <div className="md:hidden w-10" />
        </div>
      </nav>

      {/* Hamburger — fixed sibling with its own z above the overlay */}
      <button
        className="md:hidden fixed top-4 right-6 z-[70] flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-navy transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-0.5 bg-navy transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-navy transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile full-screen overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[60] bg-white flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {links.map((link, i) => (
          <button
            key={link}
            onClick={() => scrollTo(link.toLowerCase())}
            className="text-2xl font-display font-semibold text-navy/70 hover:text-blue transition-colors text-center"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateX(0)" : "translateX(-24px)",
              transition: `opacity 0.35s ease ${i * 0.07}s, transform 0.35s ease ${i * 0.07}s, color 0.2s`,
            }}
          >
            {link}
          </button>
        ))}
        <button
          onClick={handleClick}
          className="text-base font-medium bg-blue text-white px-8 py-3 rounded-full text-center hover:bg-blue transition-colors"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateX(0)" : "translateX(-24px)",
            transition: `opacity 0.35s ease ${links.length * 0.07}s, transform 0.35s ease ${links.length * 0.07}s`,
          }}
        >
          Get Started
        </button>
      </div>
    </>
  );
}