import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        rose: "#e2c6c3",
        sage: "#619ad2",
      },
      boxShadow: {
        soft: "0 14px 40px rgba(57, 66, 58, 0.07)",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
