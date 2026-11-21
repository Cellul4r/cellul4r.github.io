// The site is styled with hand-written CSS and the summer tokens in src/styles.
// Tailwind supplies the Preflight reset (@tailwind base in globals.css). These
// font stacks feed Preflight's defaults for html and code/pre/kbd/samp.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
