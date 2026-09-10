/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B0F19",
        surface: "#111827",
        card: "#161D2F",
        border: "#1E2A3D",
        saffron: "#FF9933",
        green: "#00FF66",
        ibm: "#0F62FE",
        muted: "#64748B",
        text: "#E2E8F0",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "Consolas", "monospace"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        saffron: "0 0 16px rgba(255,153,51,0.25)",
        green: "0 0 16px rgba(0,255,102,0.2)",
        ibm: "0 0 16px rgba(15,98,254,0.3)",
      },
      animation: {
        pulse_saffron: "pulse_saffron 2s ease-in-out infinite",
        slide_in: "slide_in 0.3s ease-out",
      },
      keyframes: {
        pulse_saffron: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,153,51,0)" },
          "50%": { boxShadow: "0 0 0 6px rgba(255,153,51,0.2)" },
        },
        slide_in: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
