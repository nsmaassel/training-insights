const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../libs/shared/ui/src/**/*.{js,ts,jsx,tsx}" // Add shared UI lib
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out'
      }
    },
  },
  plugins: [],
};
