/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {
      maxHeight: {
        128: "32rem",
      },
      borderColor: ["autofill"],
      shadowFill: ["autofill"],
      textFill: ["autofill"],
    },
  },
  plugins: [require("tailwindcss-autofill")],
  important: true,
};
