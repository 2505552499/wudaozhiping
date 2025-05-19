import React from 'react';
import StatCounter from '../ui/StatCounter';
import GradientTitle from '../ui/GradientTitle';

const StatsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <GradientTitle
          as="h2"
          align="center"
          className="mb-12"
        >
          专业武术评价平台
        </GradientTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCounter 
            value={5000} 
            label="活跃用户" 
            suffix="+" 
            className="text-center"
          />
          
          <StatCounter 
            value={100} 
            label="专业教练" 
            suffix="+" 
            className="text-center"
          />
          
          <StatCounter 
            value={15000} 
            label="动作分析" 
            suffix="+" 
            className="text-center"
          />
          
          <StatCounter 
            value={98} 
            label="用户满意度" 
            suffix="%" 
            className="text-center"
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
