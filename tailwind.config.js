/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'c-red': '#e45858',
        'c-purple': '#6246ea',
        'dark-primary': '#2e333d',
        'dark-secondary': '#3a3e46',
        'dark-thirdary' : '#131313',
        'dark-action': '#6b8afd',
        'dark-text': '#ffffff',
      }
    },

  },
  plugins: [require("daisyui")],
  darkMode: 'class',
  daisyui: {
    styled: true,
    themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
}
