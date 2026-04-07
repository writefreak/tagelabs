import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#112369",
        blue: "#4a8fe2",
        offwhite: "#f8f9fc",
      },
      // fontFamily: {
      //   display: ["'Playfair Display'", "serif"],
      //   body: ["'DM Sans'", "sans-serif"],
      // },

      fontFamily: {
  display: ["var(--font-clash-display)", "sans-serif"],
  body: ["'DM Sans'", "sans-serif"],
},
      animation: {
        "fade-up": "fadeUp 0.7s ease forwards",
        "fade-in": "fadeIn 0.6s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
