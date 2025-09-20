/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'premium': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'premium': {
          'dark': '#0f172a',
          'darker': '#020617',
          'blue': '#1e293b',
          'blue-light': '#334155',
          'purple': '#7c3aed',
          'purple-light': '#a855f7',
          'gold': '#fbbf24',
          'gold-light': '#fcd34d',
          'accent': '#f59e0b',
          'surface': '#1e293b',
          'surface-light': '#334155',
          'text': '#f1f5f9',
          'text-secondary': '#cbd5e1',
        },
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #7c3aed 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(51,65,85,0.6) 100%)',
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'premium-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'ripple': 'ripple 0.6s linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(251, 191, 36, 0.6)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}