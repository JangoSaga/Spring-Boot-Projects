/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB', // MediCare Blue
          hover: '#1D4ED8',
          light: '#EFF6FF',
        },
        secondary: {
          DEFAULT: '#0F172A', // Slate 900
          hover: '#1E293B',
          light: '#F1F5F9',
        },
        success: {
          DEFAULT: '#10B981', // Emerald 500
          hover: '#059669',
          light: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#F59E0B', // Amber 500
          hover: '#D97706',
          light: '#FEF3C7',
        },
        danger: {
          DEFAULT: '#EF4444', // Red 500
          hover: '#DC2626',
          light: '#FEF2F2',
        },
        background: '#F8FAFC', // Slate 50
        surface: '#FFFFFF',    // White
        border: '#E2E8F0',     // Slate 200
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
