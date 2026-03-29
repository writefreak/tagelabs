"use client";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const percent = (scrolled / total) * 100;
      setScrollPercent(percent);
      setVisible(scrolled > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const size = 48;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPercent / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-8 right-8 z-50 transition-all duration-500 group ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <div className="relative w-14 h-14 flex items-center justify-center">
        {/* Progress ring */}
        <svg
          width={size + 8}
          height={size + 8}
          className="absolute inset-0 -rotate-90"
          viewBox={`0 0 ${size + 8} ${size + 8}`}
        >
          {/* Track */}
          <circle
            cx={(size + 8) / 2}
            cy={(size + 8) / 2}
            r={radius}
            fill="none"
            stroke="rgba(17,35,105,0.1)"
            strokeWidth="2"
          />
          {/* Progress */}
          <circle
            cx={(size + 8) / 2}
            cy={(size + 8) / 2}
            r={radius}
            fill="none"
            stroke="#4a8fe2"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-150"
          />
        </svg>

        {/* Button core */}
        <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shadow-lg group-hover:bg-blue transition-colors duration-200 group-hover:scale-110 transform">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-white group-hover:-translate-y-0.5 transition-transform duration-200"
          >
            <path
              d="M8 12V4M8 4L4 8M8 4L12 8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}