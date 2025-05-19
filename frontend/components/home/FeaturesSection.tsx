import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import GradientTitle from '../ui/GradientTitle';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <GradientTitle
          as="h2"
          align="center"
          className="mb-4"
        >
          专业武术评估技术
        </GradientTitle>
        
        <motion.p
          className="text-gray-600 text-lg max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          基于先进的计算机视觉和深度学习算法，精准分析武术动作中的关键点、角度和速度
        </motion.p>
        
        {/* 核心技术展示 - XtalPi风格圆形图标与渐变 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">智能姿态识别</h3>
            <p className="text-gray-600">采用业界领先的人体姿态识别算法，精准定位17个关键骨骼点</p>
          </motion.div>
          
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl">📊</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">角度精准分析</h3>
            <p className="text-gray-600">精确计算关节角度和身体线条，与标准动作对比提供量化评分</p>
          </motion.div>
          
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl">💡</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3">专业改进建议</h3>
            <p className="text-gray-600">基于AI分析结果，提供有针对性的动作修正建议和训练方向</p>
          </motion.div>
        </div>
        
        {/* 技术展示案例 - XtalPi风格大图展示 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple bg-clip-text text-transparent">
              实时动作分析与专业评估
            </h3>
            <p className="text-gray-600 mb-6">
              武道智评平台不仅能够识别您的姿势，更能提供专业的动作评分和详细的改进建议。
              系统会检测关键点位置、角度偏差、动作速度和力量分布，全方位评估您的武术表现。
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2">✓</span>
                <span>精确计算17个人体关键点位置</span>
              </li>
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2">✓</span>
                <span>动作标准度评分与专业评价</span>
              </li>
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2">✓</span>
                <span>针对不同武术流派的专业分析</span>
              </li>
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2">✓</span>
                <span>个性化练习计划推荐</span>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            className="order-1 lg:order-2 rounded-xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-[4/3] w-full">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                {/* 后续可以替换为实际的武道姿态分析截图 */}
                <span className="text-gray-400 text-lg">武术姿态分析演示图</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
