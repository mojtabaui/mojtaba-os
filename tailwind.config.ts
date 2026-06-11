import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          DEFAULT: '#F2EDE4',
          50: '#FDFAF6',
          100: '#F8F4EE',
          200: '#F2EDE4',
          300: '#E8E0D4',
          400: '#D4C9B8',
          500: '#B8A990',
          600: '#9A8A70',
          700: '#7A6A52',
        },
        ink: {
          DEFAULT: '#1A1410',
          50: '#3A342E',
          100: '#2E2820',
          200: '#1A1410',
          300: '#0E0A06',
          400: '#080604',
        },
        sidebar: '#0A0A0A',
        'sidebar-border': '#1E1E1E',
        'sidebar-hover': '#141414',
        p1: '#EF4444',
        p2: '#F97316',
        p3: '#3B82F6',
        p4: '#22C55E',
        p5: '#A855F7',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(26,20,16,0.06), 0 1px 2px rgba(26,20,16,0.04)',
        'card-hover': '0 4px 12px rgba(26,20,16,0.10), 0 2px 4px rgba(26,20,16,0.06)',
        modal: '0 20px 60px rgba(26,20,16,0.15)',
      },
      screens: {
        '3xl': '2560px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
