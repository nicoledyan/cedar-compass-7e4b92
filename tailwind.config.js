/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        moon: {
          bg: '#FFFCF4',
          surface: '#EFE3FA',
          card: '#FFFFFF',
          accent: '#BFA2DC',
          text: '#2B2232',
          muted: '#6E5D78',
          border: '#E4D5F1'
        }
      },
      boxShadow: {
        soft: '0 16px 40px rgba(71, 44, 89, 0.08)',
        glow: '0 4px 20px rgba(191, 162, 220, 0.38)',
        'glow-lg': '0 6px 32px rgba(191, 162, 220, 0.48)'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      keyframes: {
        'check-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '60%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(5px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'check-in': 'check-in 0.22s ease-out forwards',
        'fade-up': 'fade-up 0.3s ease-out forwards'
      }
    }
  },
  plugins: []
};
