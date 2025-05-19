import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import ServicesSection from '../components/home/ServicesSection';
import GradientButton from '../components/ui/GradientButton';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 英雄区域 */}
      <HeroSection />
      
      {/* 数据统计 */}
      <StatsSection />
      
      {/* 服务内容 */}
      <ServicesSection />
      
      {/* 行动号召 */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            开始您的武术精进之旅
          </h2>
          
          <p 
            className="text-lg md:text-xl mb-10 max-w-3xl mx-auto"
          >
            无论您是武术初学者还是有经验的爱好者，武道智评平台都能为您提供专业的动作分析和建议，
            帮助您更快地掌握技巧，提高技术水平
          </p>
          
          <div>
            <GradientButton 
              className="px-8 py-3 text-lg bg-white text-xtalpi-indigo hover:bg-gray-100"
              onClick={() => window.location.href = '/login'}
            >
              立即加入
            </GradientButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
