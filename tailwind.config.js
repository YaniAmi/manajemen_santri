const defaultConfig = require("tailwindcss/defaultConfig");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  important: true,
  theme: {
    ...defaultConfig.theme,
    colors: {
      ...defaultConfig.theme.colors,
      primary: "#FCFAFA",
      white: "#FCFAFA",
      text: {
        DEFAULT: "#042F67",
        light: "#282A30",
      },
      light: {
        DEFAULT: "#B0E2FF",
        lighter: "#F3F4F6",
      },
    },
    extend: {},
  },
  plugins: [require("flowbite/plugin"), require("@tailwindcss/typography")],
};

// /** @type {import('tailwindcss').Config} */
// const defaultTheme = require("tailwindcss/defaultConfig");
// module.exports = {
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",

//     // Or if using `src` directory:
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//   ],

//   important: true,
//   theme: {
//     ...defaultTheme,
//     colors: {
//       ...defaultTheme.colors,
//       primary: "#3B81F6",
//       white: "#ffffff",
//       text: {
//         DEFAULT: "#1F2937",
//         light: "#6C7281",
//       },
//       light: {
//         DEFAULT: "#FAFBFC",
//         lighter: "#F3F4F6",
//       },
//     },
//     extend: {},
//   },
//   plugins: [require("flowbite/plugin"), require("@tailwindcss/typography")],
// };
