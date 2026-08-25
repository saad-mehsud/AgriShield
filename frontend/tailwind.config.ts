import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        earth: {
          800: '#92400e',
          900: '#78350f',
        },
        sunlight: {
          canvas: '#f8fafc',
          card: '#ffffff',
          charcoal: '#0f172a',
          muted: '#475569',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'Noto Sans Arabic', 'Gulzar', 'sans-serif'],
      },
      animation: {
        'laser-scan': 'laserScan 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        laserScan: {
          '0%': { top: '0%' },
          '100%': { top: '95%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
