import React from 'react';
import { useTranslation } from 'react-i18next';
import StatCounter from '../ui/StatCounter';
import GradientTitle from '../ui/GradientTitle';
import { useInView } from 'react-intersection-observer';

const StatsSection = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // 数据统计项
  const stats = [
    { value: 10000, suffix: '+', label: t('home.stats.users') },
    { value: 50, suffix: '+', label: t('home.stats.coaches') },
    { value: 1000000, suffix: '+', label: t('home.stats.analyses') },
    { value: 98, suffix: '%', label: t('home.stats.accuracy') }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* 粒子背景效果 */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* 动态光点 */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-cyan-300 rounded-full animate-pulse animation-delay-4000"></div>

        {/* 渐变光晕 */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full filter blur-3xl"></div>
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-white drop-shadow-lg">
              {t('home.stats.sectionTitle')}
            </span>
            <span className="text-cyan-300 drop-shadow-lg">
              {t('home.stats.sectionHighlight')}
            </span>
          </h2>
          <p className="text-blue-100 text-lg max-w-3xl mx-auto">
            {t('home.stats.sectionDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/30 hover:border-white/50 transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* 背景光效 */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* 统计内容 */}
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-blue-100 font-medium text-base">{stat.label}</div>
              </div>

              {/* 装饰元素 */}
              <div className="absolute top-4 right-4 w-8 h-8 border border-cyan-400/30 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* 装饰线条 */}
        <div className="mt-16 flex items-center justify-center">
          <div className="h-px w-32 bg-gradient-to-r from-transparent to-cyan-400/50"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full mx-4 animate-pulse"></div>
          <div className="h-px w-32 bg-gradient-to-l from-transparent to-purple-400/50"></div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
