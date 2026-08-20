/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          950: "#090D16",
          900: "#0F172A",
          850: "#151F32",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
          400: "#94A3B8",
          200: "#E2E8F0",
          100: "#F1F5F9",
        },
        accent: {
          blue: "#38BDF8",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
          violet: "#8B5CF6",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
