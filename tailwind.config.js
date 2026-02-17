/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cinematic: {
          950: '#04050A',
          900: '#0B0F1A',
          800: '#0E1220',
          700: '#111426',
          500: '#1E293B',
          neutral: '#0F1724',
          text: '#E6EEF6',
          muted: '#94A3B8',
          accent: {
            DEFAULT: '#FF5A5F',
            600: '#e84b50'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Poppins', 'Inter']
      },
      boxShadow: {
        'card-md': '0 10px 30px rgba(2,6,23,0.6)'
      },
      borderRadius: {
        'lg-md': '12px'
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 360ms ease-out both'
      }
    }
  },
  plugins: []
};