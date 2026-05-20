import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        serif: ['Instrument Serif', '"Times New Roman"', 'serif'],
      },
      colors: {
        /* Canvas — ink-indigo backgrounds */
        ink: {
          0: "var(--ink-0)",
          1: "var(--ink-1)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
          4: "var(--ink-4)",
        },
        /* Foreground — text hierarchy */
        fg: {
          0: "var(--fg-0)",
          1: "var(--fg-1)",
          2: "var(--fg-2)",
          3: "var(--fg-3)",
          4: "var(--fg-4)",
        },
        /* Epistemic states */
        confident: "var(--confident)",
        uncertain: "var(--uncertain)",
        contested: "var(--contested)",
        reversible: "var(--reversible)",

        /* Legacy/backward compatible mappings */
        border: "hsl(var(--border, 214 32% 91%))",
        input: "hsl(var(--input, 214 32% 91%))",
        ring: "hsl(var(--ring, 221 83% 53%))",
        background: "var(--primary-bg, var(--ink-1))",
        foreground: "var(--text-primary, var(--fg-0))",
        primary: {
          DEFAULT: "var(--accent-primary, var(--confident))",
          foreground: "var(--ink-0)",
        },
        secondary: {
          DEFAULT: "var(--secondary-bg, var(--ink-3))",
          foreground: "var(--text-secondary, var(--fg-2))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84% 60%))",
          foreground: "hsl(var(--destructive-foreground, 210 40% 98%))",
        },
        muted: {
          DEFAULT: "var(--ink-3)",
          foreground: "var(--fg-2)",
        },
        accent: {
          DEFAULT: "var(--accent-primary, var(--confident))",
          foreground: "var(--ink-0)",
        },
        popover: {
          DEFAULT: "var(--ink-3)",
          foreground: "var(--fg-0)",
        },
        card: {
          DEFAULT: "var(--ink-3)",
          foreground: "var(--fg-0)",
        },
        state: {
          act: "var(--act, hsl(142, 71%, 45%))",
          escalate: "var(--escalate, hsl(48, 96%, 53%))",
          defer: "var(--defer, hsl(217, 91%, 60%))",
          "fail-safe": "var(--fail-safe, hsl(0, 84%, 60%))",
        },
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
      animation: {
        /* Eclipse animations */
        "pulse-soft": "pulse-soft 2s var(--ease-in-out, ease-in-out) infinite",
        "pulse-glow": "pulse-glow 2s ease-out infinite",
        "drift": "drift 3s ease-in-out infinite",
        "flow-down": "flow-down 6s linear infinite",
        "scan": "scan 2s linear infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": {
            "box-shadow": "0 0 0 0 rgb(var(--confident-rgb) / 0.45)",
          },
          "70%": {
            "box-shadow": "0 0 0 14px rgb(var(--confident-rgb) / 0)",
          },
        },
        "drift": {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
          "100%": { transform: "translateY(0)" },
        },
        "flow-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "20%, 80%": { opacity: "1" },
          "100%": { transform: "translateY(700%)", opacity: "0" },
        },
        "scan": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
