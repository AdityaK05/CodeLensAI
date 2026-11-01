/** tailwind.config.ts */
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ui: ["Inter", "system-ui", "sans-serif"],
        code: ["JetBrains Mono", "SF Mono", "monospace"],
      },
      colors: {
        mocha: {
          brown: "#6F4E37",
          cream: "#FFF8E7",
          dark: "#3E2723",
          light: "#A1887F",
        },
        bg: {
          dark: "#3E2723",
          light: "#FFF8E7",
        },
        surface: {
          dark: "#4E342E",
          light: "#FFF3E0",
        },
        elevated: {
          dark: "#5D4037",
          light: "#FFE0B2",
        },
        border: {
          dark: "#8D6E63",
          light: "#D7CCC8",
        },
        primary: {
          DEFAULT: "#6F4E37",
          dark: "#4E342E",
          light: "#A1887F",
        },
        text: {
          dark: "#FFF8E7",
          light: "#3E2723",
        },
        "secondary-text": {
          dark: "#D7CCC8",
          light: "#6F4E37",
        },
        success: {
          DEFAULT: "#5DD6A0",
          dark: "#51C593",
          light: "#48BB9B",
        },
        warning: {
          DEFAULT: "#F5C16C",
          dark: "#E5AE5E",
          light: "#EAB308",
        },
        error: {
          DEFAULT: "#FF737A",
          dark: "#FF6B7A",
          light: "#EF4444",
        },
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
      },
    },
  },
  plugins: [],
} satisfies Config;