import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "oklch(var(--color-background) / <alpha-value>)",
        foreground: "oklch(var(--color-foreground) / <alpha-value>)",
        card: "oklch(var(--color-card) / <alpha-value>)",
        'card-foreground': "oklch(var(--color-card-foreground) / <alpha-value>)",
        popover: "oklch(var(--color-popover) / <alpha-value>)",
        'popover-foreground': "oklch(var(--color-popover-foreground) / <alpha-value>)",
        primary: "oklch(var(--color-primary) / <alpha-value>)",
        'primary-foreground': "oklch(var(--color-primary-foreground) / <alpha-value>)",
        secondary: "oklch(var(--color-secondary) / <alpha-value>)",
        'secondary-foreground': "oklch(var(--color-secondary-foreground) / <alpha-value>)",
        muted: "oklch(var(--color-muted) / <alpha-value>)",
        'muted-foreground': "oklch(var(--color-muted-foreground) / <alpha-value>)",
        accent: "oklch(var(--color-accent) / <alpha-value>)",
        'accent-foreground': "oklch(var(--color-accent-foreground) / <alpha-value>)",
        destructive: "oklch(var(--color-destructive) / <alpha-value>)",
        'destructive-foreground': "oklch(var(--color-destructive-foreground) / <alpha-value>)",
        border: "oklch(var(--color-border) / <alpha-value>)",
        input: "oklch(var(--color-input) / <alpha-value>)",
        ring: "oklch(var(--color-ring) / <alpha-value>)",
        // Sidebar tokens
        sidebar: "oklch(var(--color-sidebar) / <alpha-value>)",
        'sidebar-foreground': "oklch(var(--color-sidebar-foreground) / <alpha-value>)",
        'sidebar-primary': "oklch(var(--color-sidebar-primary) / <alpha-value>)",
        'sidebar-primary-foreground': "oklch(var(--color-sidebar-primary-foreground) / <alpha-value>)",
        'sidebar-accent': "oklch(var(--color-sidebar-accent) / <alpha-value>)",
        'sidebar-accent-foreground': "oklch(var(--color-sidebar-accent-foreground) / <alpha-value>)",
        'sidebar-border': "oklch(var(--color-sidebar-border) / <alpha-value>)",
        'sidebar-ring': "oklch(var(--color-sidebar-ring) / <alpha-value>)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  darkMode: ["class", "[data-theme=dark]"]
};

export default config;

