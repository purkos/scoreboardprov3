/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      darkMode: "class",
      fontFamily: {
        roboto: ["Roboto Condensed", "sans-serif"],
        saira: ["Saira", "sans-serif"],
      },
      fontSize: {
        "2xs": "0.65rem",
        xs: "0.75rem", // Extra Small
        sm: "0.875rem", // Small
        base: "1rem", // Base
        lg: "1.125rem", // Large
        xl: "1.25rem", // Extra Large
        "2xl": "1.5rem", // 2 Extra Large
        "3xl": "1.875rem", // 3 Extra Large
        "4xl": "2.25rem", // 4 Extra Large
        "5xl": "3rem", // 5 Extra Large
      },
      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      borderWidth: {
        0.5: "0.5px",
        0.7: "0.7px",
        1: "1px",
      },
      colors: {
        textColor: {
          primary: "#313131",
          secondary: "#232323",
          third: "#1a1a1a",
          fourth: "#545454",
        },
        // Define shades of green
        rhino: {
          50: "#f2f6fc",
          100: "#e2ebf7",
          200: "#ccdcf1",
          300: "#a9c5e7",
          400: "#80a7da",
          500: "#628acf",
          600: "#4e71c2",
          700: "#445fb1",
          800: "#3c4f91",
          900: "#2b385f",
          950: "#242c47",
          primary: "#2b385f", // Primary color for emerald
          secondary: "#a9c5e7", // Secondary color for emerald
          accent: "#e2ebf7", // Accent color for emerald
          background: "#f6f7fb", // Background color for emerald
          shadow: "#242c47",
        },
        matisse: {
          50: "#f4f7fb",
          100: "#e7eff7",
          200: "#cadeed",
          300: "#9cc2dd",
          400: "#67a2c9",
          500: "#4486b3",
          600: "#2e628a",
          700: "#2a567a",
          800: "#264a66",
          900: "#243f56",
          950: "#182939",
          primary: "#4486b3", // Primary color for matisse
          secondary: "#9cc2dd", // Secondary color for matisse
          accent: "#e7eff7", // Accent color for matisse
          background: "#f4f7fb", // Background color for matisse
          shadow: "#182939",
        },

        mercury: {
          50: "#f7f7f7",
          100: "#ededed",
          200: "#e0e0e0",
          300: "#c8c8c8",
          400: "#adadad",
          500: "#999999",
          600: "#888888",
          700: "#7b7b7b",
          800: "#676767",
          900: "#545454",
          950: "#363636",
          primary: "#999999", // Primary color for mercury
          secondary: "#c8c8c8", // Secondary color for mercury
          accent: "#ededed", // Accent color for mercury
          background: "#f7f7f7", // Background color for mercury
          shadow: "#363636",
        },
      },
    },
  },
  plugins: [],
};
