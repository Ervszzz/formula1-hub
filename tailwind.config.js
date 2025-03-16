/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "tech-dark": "#080A0F",
        "tech-darker": "#050709",
        "tech-light": "#1A1F2A",
        "tech-red": {
          DEFAULT: "#DC0000",
          50: "rgba(220, 0, 0, 0.05)",
          100: "rgba(220, 0, 0, 0.1)",
          200: "rgba(220, 0, 0, 0.2)",
          300: "rgba(220, 0, 0, 0.3)",
          400: "rgba(220, 0, 0, 0.4)",
          500: "rgba(220, 0, 0, 0.5)",
          600: "rgba(220, 0, 0, 0.6)",
          700: "rgba(220, 0, 0, 0.7)",
          800: "rgba(220, 0, 0, 0.8)",
          900: "rgba(220, 0, 0, 0.9)",
        },
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        scan: "scan 2s linear infinite",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(20, 20, 30, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 20, 30, 0.1) 1px, transparent 1px)",
        "tech-gradient":
          "radial-gradient(circle at top right, rgba(255, 0, 0, 0.1), transparent 70%)",
      },
    },
  },
  plugins: [],
};
