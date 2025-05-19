module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // 'media' 或 'class'

  theme: {
    extend: {
      colors: {
        // 保留原来的XtalPi品牌色
        'xtalpi-dark-blue': '#0033FF',
        'xtalpi-indigo': '#4F49FF',
        'xtalpi-purple': '#6E43FF',
        'xtalpi-cyan': '#36CFC9',
        'xtalpi-green': '#5CDBD3',
        
        // 添加新的武道智评品牌色彩系统
        'primary': {
          500: '#165DFF', // 武术"劲气"蓝
          600: '#274CFF'
        },
        'accent': '#8B5CFF',
        'dark-bg': '#0A0A0A',
        'surface': '#161616',
        'text': {
          'primary': '#FFFFFF',
          'secondary': 'rgba(255,255,255,0.68)'
        },
        'wudao-primary': '#c62828', // 保留原武道主题色，方便渐进式更新
      },
      fontFamily: {
        sans: ['"HarmonyOS Sans"', '"Noto Sans SC"', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'counter-up': 'counterUp 2s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'bounce': 'bounce 1s infinite',
        'spin-slow': 'spin 8s linear infinite',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-accent': 'linear-gradient(to right, #165DFF, #8B5CFF)',
      },
    },
  },
  plugins: [
    require('autoprefixer'),
  ],
};
