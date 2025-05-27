import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import {
  RobotOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  TeamOutlined,
  StarFilled
} from '@ant-design/icons';
import GradientTitle from '../ui/GradientTitle';
import { BeautifulCard } from '../ui/DesignSystem';

// 美化的特性卡片组件
const FeatureCard = ({ icon, title, description, delay = 0, gradient }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      className="group"
    >
      <div className={`
        relative overflow-hidden rounded-3xl p-8 h-full
        bg-gradient-to-br ${gradient}
        shadow-xl hover:shadow-2xl
        transform hover:-translate-y-2 transition-all duration-500
        border border-white/10
        before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/40 before:to-black/20 before:rounded-3xl
      `}>
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>

        {/* 内容 */}
        <div className="relative z-10">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/25 backdrop-blur-sm mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <div className="text-2xl text-white drop-shadow-lg">
              {icon}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-100 transition-colors duration-300 drop-shadow-lg">
            {title}
          </h3>
          <p className="text-white/90 leading-relaxed drop-shadow">
            {description}
          </p>
        </div>

        {/* 悬停效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // 美化的特性数据
  const features = [
    {
      icon: <RobotOutlined />,
      title: "AI智能分析",
      description: "利用先进的计算机视觉算法，对武术动作进行多维度分析，提供精确的评分和改进建议。",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      icon: <ThunderboltOutlined />,
      title: "实时反馈系统",
      description: "通过摄像头实时分析动作，提供即时反馈，帮助练习者及时调整姿势，避免形成错误习惯。",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: <EyeOutlined />,
      title: "个性化训练",
      description: "根据用户的练习数据和进步情况，自动生成个性化训练计划，科学安排训练强度和内容。",
      gradient: "from-green-600 to-emerald-600"
    },
    {
      icon: <TeamOutlined />,
      title: "专业教练指导",
      description: "连接全国优秀武术教练资源，提供线上辅导和点评，让每位用户都能获得专业指导。",
      gradient: "from-orange-600 to-red-600"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/50 to-indigo-50 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full px-6 py-2 mb-8 shadow-lg">
            <StarFilled className="text-yellow-300" />
            <span className="text-sm font-medium">核心功能特性</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              科技赋能，
            </span>
            <br/>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              重新定义武术训练
            </span>
          </h2>

          <p className="text-gray-600 text-xl max-w-4xl mx-auto leading-relaxed">
            融合人工智能与传统武学精髓，打造全方位的智能训练体系，让每一次练习都更有效果
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              delay={index}
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
