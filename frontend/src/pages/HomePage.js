import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { RocketOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import HeroSection from '../components/home/HeroSection';
import { StyledButton } from '../components/ui/DesignSystem';

// 懒加载组件以提升首屏加载性能
const StatsSection = lazy(() => import('../components/home/StatsSection'));
const FeaturesSection = lazy(() => import('../components/home/FeaturesSection'));
const ProcessSection = lazy(() => import('../components/home/ProcessSection'));
const PersonalizedRecommendations = lazy(() => import('../components/recommendations/PersonalizedRecommendations'));

// 自定义加载组件
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
  </div>
);

const HomePage = () => {
  const { t } = useTranslation();
  const [userId, setUserId] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // 设置页面标题
    document.title = `${t('home.hero.title')} - ${t('home.hero.subtitle')}`;

    // 页面加载时滚动到顶部
    window.scrollTo(0, 0);

    // 检查用户登录状态
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (token && storedUserId) {
      setUserId(storedUserId);
    }

    // 页面加载完成后的动画效果
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [t]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isPageLoaded ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 英雄区域 */}
      <HeroSection />

      <Suspense fallback={<LoadingFallback />}>
        {/* 特性展示 */}
        <FeaturesSection />

        {/* 个性化推荐 - 仅对登录用户显示 */}
        {userId && <PersonalizedRecommendations userId={userId} />}

        {/* 使用流程 */}
        <ProcessSection />

        {/* 数据统计 */}
        <StatsSection />
      </Suspense>

      {/* 美化的行动号召区域 */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-cyan-400/30">
              <RocketOutlined className="text-cyan-400" />
              <span className="text-white text-sm font-medium">{t('home.cta.startJourney')}</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t('home.cta.title', '开始您的武术精进之旅')}
              </span>
            </h2>

            <p className="text-blue-100 text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
              {t('home.cta.description', '无论您是武术初学者还是有经验的爱好者，琪武智创平台都能为您提供专业的动作分析和建议，帮助您更快地掌握技巧，提高技术水平')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <StyledButton
                size="large"
                icon={<RocketOutlined />}
                className="text-lg px-10 py-4 shadow-2xl hover:shadow-blue-500/25"
                onClick={() => window.location.href = '/login'}
              >
                {t('home.cta.joinNow', '立即加入')}
              </StyledButton>

              <StyledButton
                variant="outline"
                size="large"
                className="text-lg px-10 py-4 border-white/30 text-white hover:bg-white hover:text-gray-900"
                onClick={() => window.location.href = '/about'}
              >
                {t('home.cta.learnMore')}
              </StyledButton>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
