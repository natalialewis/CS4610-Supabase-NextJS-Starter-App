import type { Config } from "tailwindcss";

/**
 * Tailwind v4: Theme (colors, fonts, etc.) lives in CSS via @theme in globals.css.
 * This file is OPTIONAL — use only for:
 *   - content paths (if auto-detection misses files)
 *   - plugins
 * Do NOT put theme colors or font definitions here; use @theme in globals.css.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
