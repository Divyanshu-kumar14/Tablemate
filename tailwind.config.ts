import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F0",
        paper: "#FFFDF8",
        ink: "#1E1B16",
        muted: "#5B554B",
        line: "#DDD3C4",
        teal: {
          DEFAULT: "#0F5B55",
          dark: "#0A3F3B",
          light: "#DCEEEA",
        },
        amber: {
          DEFAULT: "#B45309",
          light: "#FCEBD5",
        },
        reported: "#166534",
        likely: "#92400E",
        ask: "#475569",
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', "Palatino", "Georgia", "serif"],
        sans: ['"Avenir Next"', "Avenir", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(30,27,22,0.06), 0 8px 24px rgba(30,27,22,0.08)",
        lift: "0 2px 4px rgba(30,27,22,0.08), 0 16px 40px rgba(30,27,22,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
