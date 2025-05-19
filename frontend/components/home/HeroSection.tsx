import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import GradientButton from '../ui/GradientButton';
import GradientTitle from '../ui/GradientTitle';

const HeroSection: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    // 页面加载后的动画效果
    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
    };
    sequence();
  }, [controls]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景图片与渐变蒙版 */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-800/80 to-gray-900/90 z-10"></div>
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/static/background2.png)' }}
      />
      
      {/* 背景装饰元素 - XtalPi风格的几何图形 */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-xtalpi-indigo blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-xtalpi-purple blur-3xl opacity-20"></div>
      </div>
      
      {/* 主要内容 */}
      <div className="container mx-auto px-4 relative z-20">
        <motion.div 
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
        >
          <GradientTitle 
            as="h1" 
            align="center"
            className="mb-6 leading-tight"
            highlightWords={['人工智能', '机器人']}
          >
            以 人工智能 和 机器人 驱动
            <br />武术动作分析与评价
          </GradientTitle>
          
          <motion.p 
            className="text-gray-200 text-xl mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            武道智评平台利用先进的计算机视觉和人工智能技术，
            为武术爱好者和教练提供精准的姿态分析与专业评价
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <GradientButton 
              className="px-8 py-3 text-lg"
              onClick={() => window.location.href = '/login'}
            >
              立即开始
            </GradientButton>
            
            <GradientButton 
              className="px-8 py-3 text-lg"
              variant="outline"
              onClick={() => window.location.href = '/knowledge-base'}
            >
              了解更多
            </GradientButton>
          </motion.div>
        </motion.div>
      </div>
      
      {/* 向下滚动提示 */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="flex flex-col items-center">
          <span className="text-white/70 text-sm mb-2">向下滚动</span>
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
