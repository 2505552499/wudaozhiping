import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 页面加载后的动画效果
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
        <div 
          className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span>以 </span>
            <span className="bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple bg-clip-text text-transparent">人工智能</span>
            <span> 和 </span>
            <span className="bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple bg-clip-text text-transparent">机器人</span>
            <span> 驱动</span>
            <br />武术动作分析与评价
          </h1>
          
          <p 
            className={`text-gray-200 text-xl mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
          >
            武道智评平台利用先进的计算机视觉和人工智能技术，
            为武术爱好者和教练提供精准的姿态分析与专业评价
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <button 
              className="px-8 py-3 text-lg rounded-lg bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              onClick={() => navigate('/login')}
            >
              立即开始
            </button>
            
            <button 
              className="px-8 py-3 text-lg rounded-lg border-2 border-xtalpi-indigo text-white hover:bg-gradient-to-r hover:from-xtalpi-dark-blue hover:via-xtalpi-indigo hover:to-xtalpi-purple hover:border-transparent transition-all duration-300"
              onClick={() => navigate('/knowledge-base')}
            >
              了解更多
            </button>
          </div>
        </div>
      </div>
      
      {/* 向下滚动提示 */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-1000 delay-1000 ${visible ? 'opacity-70' : 'opacity-0'} animate-bounce`}
      >
        <div className="flex flex-col items-center">
          <span className="text-white text-sm mb-2">向下滚动</span>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
