/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-be-vietnam)', 'sans-serif'],
      },
      colors: {
        pmc: {
          gold: "#D4AF37", // Màu vàng kim loại
        }
      }
    },
  },
  plugins: [],
};