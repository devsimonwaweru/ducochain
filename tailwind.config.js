/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DocuChain Theme Colors
        primary: {
          DEFAULT: '#1E3A8A',
          light: '#1E40AF',
          dark: '#1E2F5E',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          light: '#2DD4BF',
          dark: '#0F766E',
        },
        accent: {
          DEFAULT: '#7C3AED',
        },
        verified: '#22C55E',
        pending: '#F59E0B',
        flagged: '#EF4444',
        // Defining app-bg explicitly
        'app-bg': '#F3F4F6', 
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}