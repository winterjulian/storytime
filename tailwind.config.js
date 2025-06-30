/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      boxShadow: {
        "inner-strong": "inset 0 4px 6px rgba(0,0,0,0.6)",
        "inner-xl": "inset 0 8px 12px rgba(0,0,0,0.8)",
      },
    },
  },
  plugins: [],
};
