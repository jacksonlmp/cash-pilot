import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-container": "rgb(var(--color-surface-container) / <alpha-value>)",
        "surface-container-low":
          "rgb(var(--color-surface-container-low) / <alpha-value>)",
        "surface-container-lowest":
          "rgb(var(--color-surface-container-lowest) / <alpha-value>)",
        "surface-container-high":
          "rgb(var(--color-surface-container-high) / <alpha-value>)",
        "surface-tint": "rgb(var(--color-surface-tint) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-container":
          "rgb(var(--color-primary-container) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        "secondary-container":
          "rgb(var(--color-secondary-container) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        outline: "rgb(var(--color-outline) / <alpha-value>)",
        "on-surface": "rgb(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant":
          "rgb(var(--color-on-surface-variant) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        ambient: "0 24px 24px -4px rgba(35, 0, 96, 0.06)",
        floating: "0 30px 50px -12px rgba(35, 0, 96, 0.12)",
      },
      borderRadius: {
        xl2: "1.5rem",
        xl3: "2rem",
      },
      transitionTimingFunction: {
        kinetic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-primary-container)))",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
