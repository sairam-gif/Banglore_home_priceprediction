/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Geist", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          blue: "oklch(60% 0.15 250)",
          indigo: "oklch(55% 0.18 265)",
          emerald: "oklch(70% 0.15 150)",
          rose: "oklch(65% 0.18 20)",
        },
        surface: "oklch(98% 0.005 250)",
        on: {
          surface: "oklch(20% 0.02 250)",
        },
        outline: "oklch(92% 0.01 250)",
      },
      spacing: {
        "8xl": "96rem",
      },
      animation: {
        "reveal-up": "revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "revealUp 1s ease-out both",
        "scale-in": "scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      keyframes: {
        revealUp: {
          "0%": { transform: "translateY(10px)" },
          "100%": { transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.98)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
}
