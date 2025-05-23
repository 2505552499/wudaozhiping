import React, { useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeaturesSection from '../components/home/FeaturesSection';
import ProcessSection from '../components/home/ProcessSection';
import GradientButton from '../components/ui/GradientButton';

const HomePage = () => {
  useEffect(() => {
    // 设置页面标题
    document.title = '武道智评 - AI助力武道动作评估';
    
    // 页面加载时滚动到顶部
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      {/* 英雄区域 */}
      <HeroSection />
      
      {/* 特性展示 */}
      <FeaturesSection />
      
      {/* 使用流程 */}
      <ProcessSection />
      
      {/* 数据统计 */}
      <StatsSection />
      
      {/* 行动号召 */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-accent text-white">
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
              className="px-8 py-3 text-lg bg-white/10 border-none hover:bg-white/20"
              onClick={() => window.location.href = '/login'}
            >
              立即加入
            </GradientButton>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
