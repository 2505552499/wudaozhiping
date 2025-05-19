module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'

  theme: {
    extend: {
      colors: {
        'xtalpi-dark-blue': '#0033FF',
        'xtalpi-indigo': '#4F49FF',
        'xtalpi-purple': '#6E43FF',
        'xtalpi-cyan': '#36CFC9',
        'xtalpi-green': '#5CDBD3',
        'wudao-primary': '#c62828', // 保留原武道主题色，方便渐进式更新
      },
      fontFamily: {
        sans: ['HarmonyOS Sans SC', 'Source Han Sans SC', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'counter-up': 'counterUp 2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        counterUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('autoprefixer'),
  ],
};
