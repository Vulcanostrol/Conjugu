const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        conjugu: {
          "primary": "#0000ff",
          "secondary": "#00dd9d",
          "accent": "#00ce00",
          "neutral": "#151d2b",
          "base-100": "#2c2535",
          "info": "#0082b7",
          "success": "#42b741",
          "warning": "#dc8200",
          "error": "#d73246",
        },
      },
    ],
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        'Gabarito',
        ...defaultTheme.fontFamily.sans,
      ]
    },
    extend: {
      screens: {
        'short': { 'raw': '(max-height: 700px)' },
      }
    }
  },
  plugins: [
    require("daisyui"),
  ],
};
