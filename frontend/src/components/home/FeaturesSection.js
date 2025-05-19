import React from 'react';
import { useInView } from 'react-intersection-observer';
import GradientTitle from '../ui/GradientTitle';

// 特性卡片组件
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <div
      ref={ref}
      className="bg-surface rounded-lg p-6 shadow-lg border border-primary-500/10 transition-all duration-500"
      style={{
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        opacity: inView ? 1 : 0,
        transitionDelay: `${delay}ms`
      }}
    >
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-primary-500/10 to-accent/10 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // 特性数据
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "精准姿态分析",
      description: "利用先进的计算机视觉算法，对武术动作进行多维度分析，提供精确的评分和改进建议。"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: "实时反馈系统",
      description: "通过摄像头实时分析动作，提供即时反馈，帮助练习者及时调整姿势，避免形成错误习惯。"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "个性化训练计划",
      description: "根据用户的练习数据和进步情况，自动生成个性化训练计划，科学安排训练强度和内容。"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "专业教练指导",
      description: "连接全国优秀武术教练资源，提供线上辅导和点评，让每位用户都能获得专业指导。"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-dark-bg to-dark-bg/90">
      <div className="container mx-auto px-4">
        <div 
          ref={ref}
          className="text-center mb-16 transition-all duration-700"
          style={{
            transform: inView ? 'translateY(0)' : 'translateY(40px)',
            opacity: inView ? 1 : 0
          }}
        >
          <GradientTitle align="center" className="mb-6">
            科技赋能，<span className="text-primary-500">重新定义</span>武术训练
          </GradientTitle>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            融合人工智能与传统武学精髓，打造全方位的智能训练体系，让每一次练习都更有效果
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 150}
            />
          ))}
        </div>
      </div>

      {/* 科技感装饰元素 */}
      <div className="relative mt-20 overflow-hidden max-w-6xl mx-auto h-12 opacity-20">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent top-1/2 transform -translate-y-1/2"></div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-dark-bg rounded-full border border-primary-500 shadow-lg shadow-primary-500/50"></div>
        <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-dark-bg rounded-full border border-accent shadow-lg shadow-accent/50"></div>
        <div className="absolute left-3/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-dark-bg rounded-full border border-accent shadow-lg shadow-accent/50"></div>
      </div>
    </section>
  );
};

export default FeaturesSection;
