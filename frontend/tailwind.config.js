/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0A0B0F",
          surface: "#121319",
          elevated: "#1A1C24",
        },
        civic: {
          950: "#0A0B0F",
          900: "#121319",
          850: "#1A1C24",
          800: "#1F222F",
          700: "#334155",
          600: "#475569",
          400: "#94A3B8",
          200: "#E2E8F0",
          100: "#F1F5F9",
        },
        accent: {
          indigo: "#6366F1",
          blue: "#6366F1",
          emerald: "#22C55E",
          amber: "#F59E0B",
          rose: "#EF4444",
          violet: "#6366F1",
        },
        semantic: {
          critical: "#EF4444",
          warning: "#F59E0B",
          good: "#22C55E",
          neutral: "#9CA3AF",
        }
      },
      borderColor: {
        subtle: "rgba(255, 255, 255, 0.08)",
        hover: "rgba(255, 255, 255, 0.16)",
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}

