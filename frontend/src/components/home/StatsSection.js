import React from 'react';
import StatCounter from '../ui/StatCounter';
import GradientTitle from '../ui/GradientTitle';
import { useInView } from 'react-intersection-observer';

const StatsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  // 数据统计项
  const stats = [
    { value: 10000, suffix: '+', label: '注册用户' },
    { value: 50, suffix: '+', label: '专业教练' },
    { value: 1000000, suffix: '+', label: '分析次数' },
    { value: 98, suffix: '%', label: '准确率' }
  ];
  
  return (
    <section className="py-20 bg-surface relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden z-0 opacity-5">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-primary-500 filter blur-3xl opacity-20"></div>
        <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-accent filter blur-3xl opacity-10"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={ref} 
          className="text-center mb-16"
          style={{ 
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.7s ease-out, transform 0.7s ease-out'
          }}
        >
          <GradientTitle
            as="h2"
            align="center"
            className="mb-6"
          >
            数据见证<span className="text-primary-500">实力</span>
          </GradientTitle>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            自武道智评平台上线以来，已经帮助数以万计的武术爱好者提升技能水平
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCounter 
              key={index}
              value={stat.value} 
              label={stat.label} 
              suffix={stat.suffix} 
              className="text-center"
              duration={2.5}
            />
          ))}
        </div>
        
        {/* 装饰元素 */}
        <div className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>
      </div>
    </section>
  );
};

export default StatsSection;
