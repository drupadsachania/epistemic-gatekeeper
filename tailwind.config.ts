import type { Config } from "tailwindcss";

export default {
  darkMode: ["selector", '[data-theme="dark"]'],
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
        /* Serif for voice, mono for machinery (kairos-design-handoff §4) */
        sans:    ['legitima', 'Georgia', '"Times New Roman"', 'serif'],
        serif:   ['teimer-web', 'Georgia', '"Times New Roman"', 'serif'],
        display: ['teimer-web', 'Georgia', '"Times New Roman"', 'serif'],
        mono:    ['"Red Hat Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
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
          act:         "hsl(var(--st-act) / <alpha-value>)",
          defer:       "hsl(var(--st-defer) / <alpha-value>)",
          hold:        "hsl(var(--st-defer) / <alpha-value>)",
          escalate:    "hsl(var(--st-escalate) / <alpha-value>)",
          "fail-safe": "hsl(var(--st-failsafe) / <alpha-value>)",
          refuse:      "hsl(var(--st-failsafe) / <alpha-value>)",
        },
        /* ShadCN / Tailwind compatibility */
        border: "hsl(var(--border) / <alpha-value>)",
        input:  "hsl(var(--input) / <alpha-value>)",
        ring:   "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground:  "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT:    "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT:    "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        xs: "var(--k-radius-xs)",
        sm: "var(--k-radius-sm)",
        md: "var(--k-radius-md)",
        lg: "var(--k-radius-lg)",
        xl: "var(--k-radius-xl)",
        "2xl": "var(--k-radius-2xl)",
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
