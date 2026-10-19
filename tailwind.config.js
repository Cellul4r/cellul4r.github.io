/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08110d',
        paper: '#f1efe5',
        forest: '#1f7a55',
        wine: '#8f3744',
        gold: '#d3aa63',
        'theme-evergreen': '#174d38',
        'theme-burgundy': '#873747',
        'theme-gold': '#805713',
        'theme-body': '#223b2e',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
