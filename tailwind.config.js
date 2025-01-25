/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#059669', // emerald-600
          'primary-dark': '#6ee7b7', // emerald-300
          secondary: '#6366f1', // keeping indigo for secondary
          'secondary-dark': '#818cf8',
        },
        app: {
          light: '#f8fafc',
          dark: '#0f172a',
          'card-light': '#ffffff',
          'card-dark': '#1e293b',
        },
        content: {
          'primary-light': '#1e293b',
          'primary-dark': '#ffffff',
          'secondary-light': '#64748b',
          'secondary-dark': '#94a3b8',
        },
        border: {
          light: '#e2e8f0',
          dark: '#334155',
        },
        status: {
          success: {
            light: '#34d399', // emerald-400
            dark: '#6ee7b7', // emerald-300
          },
          error: {
            light: '#ef4444',
            dark: '#f87171',
          },
          warning: {
            light: '#f59e0b',
            dark: '#fbbf24',
          },
        },
        feature: {
          notification: {
            light: '#8b5cf6',
            dark: '#a78bfa',
          },
          achievement: {
            light: '#f59e0b',
            dark: '#fbbf24',
          },
        },
      },
    },
  },
  plugins: [],
}