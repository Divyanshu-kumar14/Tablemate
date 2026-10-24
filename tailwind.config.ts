import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#070709",
          950: "#070709",
          900: "#0c0c10",
          850: "#121217",
          800: "#1a1a22",
        },
        gold: {
          DEFAULT: "#d97706",
          light: "#fbbf24",
          champagne: "#fef3c7",
          dark: "#b45309",
        },
        ink: "#f4f4f6",
        muted: "#9494a0",
        line: "rgba(255, 255, 255, 0.08)",
        reported: "#10b981",
        likely: "#f59e0b",
        ask: "#94a3b8",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        "glass-glow": "0 0 35px -5px rgba(245, 158, 11, 0.15), 0 8px 32px 0 rgba(0, 0, 0, 0.5)",
        "amber-glow": "0 0 25px -3px rgba(245, 158, 11, 0.3)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        beam: {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
