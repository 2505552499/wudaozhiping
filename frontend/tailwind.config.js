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
        
        // 现代渐变背景色彩方案
        'modern-bg': {
          'start': '#1a2332', // 深蓝色起点
          'mid': '#2d3748',   // 中间过渡色
          'end': '#4a5568'    // 浅灰色终点
        },
        
        // 保留原配置以便渐进式迁移
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
        // 现代渐变背景方案
        'gradient-modern': 'linear-gradient(135deg, #1a2332 0%, #2d3748 50%, #4a5568 100%)',
        'gradient-modern-light': 'linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #718096 100%)',
        'gradient-modern-subtle': 'linear-gradient(180deg, #1a2332 0%, #2d3748 100%)',
      },
    },
  },
  plugins: [
    require('autoprefixer'),
  ],
};
