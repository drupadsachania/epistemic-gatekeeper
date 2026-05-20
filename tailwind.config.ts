import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        /* JetBrains Mono is the primary mono font in the Prism design */
        sans:  ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Geist Mono', 'ui-monospace', 'Menlo', 'monospace'],
        serif: ['Instrument Serif', '"Times New Roman"', 'serif'],
      },
      colors: {
        /* Prism light canvas */
        bg: {
          DEFAULT: "var(--bg)",
          tint: "var(--bg-tint)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          strong: "var(--surface-strong)",
        },

        /* Foreground — INK tokens are DARK text on light canvas */
        ink: {
          0: "var(--ink-0)",
          1: "var(--ink-1)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
          4: "var(--ink-4)",
        },

        /* Brand accents */
        indigo: {
          DEFAULT: "var(--indigo)",
          bright: "var(--indigo-bright)",
        },
        amber: {
          DEFAULT: "var(--amber)",
          soft: "var(--amber-soft)",
        },

        /* Decision state colors */
        deny:  "var(--deny)",
        state: {
          act:    "var(--state-act)",
          hold:   "var(--state-hold)",
          defer:  "var(--state-defer)",
          refuse: "var(--state-refuse)",
        },

        /* ShadCN / Tailwind compatibility */
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        xs: "var(--r-xs, 4px)",
        sm: "var(--r-sm, 6px)",
        md: "var(--r-md, 10px)",
        lg: "var(--r-lg, 16px)",
        xl: "var(--r-xl, 24px)",
      },
      animation: {
        "pulse-soft":  "pulse-soft 2s ease-in-out infinite",
        "pulse-glow":  "pulse-glow 2s ease-out infinite",
        "drift":       "drift 3s ease-in-out infinite",
        "flow-down":   "flow-down 6s linear infinite",
        "scan":        "scan 2s linear infinite",
        "shimmer":     "shimmer 2.5s linear infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "0.5" },
          "50%":      { opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(67,56,202,0.40)" },
          "70%":      { boxShadow: "0 0 0 12px rgba(67,56,202,0)" },
        },
        "drift": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        "flow-down": {
          "0%":       { transform: "translateY(-100%)", opacity: "0" },
          "20%, 80%": { opacity: "1" },
          "100%":     { transform: "translateY(700%)", opacity: "0" },
        },
        "scan": {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
