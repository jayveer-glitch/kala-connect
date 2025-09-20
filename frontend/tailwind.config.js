/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Living Ink on Handmade Paper Theme
        'paper': '#F8F5F2',        // Textured off-white handmade paper
        'charcoal': '#2C2C2C',     // Rich dark charcoal, not pure black
        'cobalt': '#0047AB',       // Vibrant deep cobalt blue (AI magic)
        'terracotta': '#E07A5F',   // Earthy terracotta (handcrafted element)
        // Legacy colors (keep for compatibility)
        'off-white': '#FAFAFA',
        'cream': '#F6F4D2',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],   // Beautiful high-contrast serif
        'inter': ['Inter', 'sans-serif'],            // Clean, modern sans-serif
        'poppins': ['Poppins', 'sans-serif'],        // Legacy
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'ink-flow': 'ink-flow 3s ease-out forwards',
        'paper-texture': 'paper-texture 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-20px) translateX(10px)' },
          '66%': { transform: 'translateY(10px) translateX(-10px)' },
        },
        'ink-flow': {
          '0%': { opacity: '0', transform: 'scale(0.8) blur(3px)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1) blur(1px)' },
          '100%': { opacity: '1', transform: 'scale(1) blur(0px)' },
        },
        'paper-texture': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.text-shadow': {
          'text-shadow': '2px 2px 4px rgba(0,0,0,0.5)'
        },
        '.glass': {
          'backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(255, 255, 255, 0.1)'
        }
      }
      addUtilities(newUtilities)
    }
  ],
}