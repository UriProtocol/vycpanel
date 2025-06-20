import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        primary: {
          DEFAULT: '#f7dac6', // Your primary color
        },
        success: {
          DEFAULT: '#f2a366', // Your success color
        },
        warning: {
          DEFAULT: '#f7dac670', 
        },
        danger: {
          DEFAULT: "oklch(41% 0.159 10.272)"
        }
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}

module.exports = config;