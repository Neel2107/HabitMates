/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        'inter-thin': ['Inter_28pt-Thin'],
        'inter-extralight': ['Inter_28pt-ExtraLight'],
        'inter-light': ['Inter_28pt-Light'],
        'inter-regular': ['Inter'], // Default Inter
        'inter-medium': ['Inter_28pt-Medium'],
        'inter-semibold': ['Inter_28pt-SemiBold'],
        'inter-bold': ['Inter_28pt-Bold'],
        'inter-extrabold': ['Inter_28pt-ExtraBold'],
      },
      colors: {
        brand: {
          primary: '#059669', // emerald-600
          'primary-dark': '#6ee7b7', // emerald-300
          secondary: '#6366f1', // keeping indigo for secondary
          'secondary-dark': '#818cf8',
        },
        app: {
          light: '#f8fafc',
          dark: '#171717',
        },
       
      },
    },
  },
  plugins: [],
}