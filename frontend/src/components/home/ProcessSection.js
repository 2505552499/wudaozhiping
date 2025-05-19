import React from 'react';
import { useInView } from 'react-intersection-observer';
import GradientTitle from '../ui/GradientTitle';
import { motion } from 'framer-motion';

// 流程步骤组件
const ProcessStep = ({ number, title, description, imageSrc, icon }) => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });
  
  // 计算延迟时间，实现连续的动画效果
  const delayBase = 0.2;  // 基础延迟时间
  const delayIncrement = parseInt(number) * 0.1;  // 根据步骤编号增加延迟
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: delayBase + delayIncrement, ease: [0.215, 0.61, 0.355, 1] }}
      className="flex-1 max-w-xs mx-auto md:mx-0"
    >
      {/* 步骤编号与圆形背景 */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/20 to-accent/10 flex items-center justify-center border border-primary-500/30 mr-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent text-transparent bg-clip-text">{number}</span>
        </div>
        <div className="h-px flex-grow bg-gradient-to-r from-primary-500/30 to-transparent"></div>
      </div>
      
      {/* 卡片内容 */}
      <div className="w-full bg-surface rounded-xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-2 border border-primary-500/10 group">
        {/* 图片区域 */}
        <div className="h-48 overflow-hidden bg-primary-500/5 flex items-center justify-center relative">
          {/* 渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent/5 group-hover:from-primary-500/15 group-hover:to-accent/10 transition-all duration-500"></div>
          
          {number === "01" && (
            <div className="w-full h-full flex items-center justify-center relative">
              <motion.div 
                initial={{ scale: 1 }}
                animate={{ scale: inView ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="w-24 h-24 border-4 border-dashed border-primary-500/40 rounded-full flex items-center justify-center relative z-10 group-hover:border-primary-500/60"
              >
                {icon}
              </motion.div>
              <div className="absolute bottom-4 right-4 text-xs text-primary-500/70 bg-dark-bg/50 px-2 py-1 rounded">MP4, AVI, MOV</div>
            </div>
          )}
          
          {number === "02" && (
            <div className="w-full h-full flex items-center justify-center relative">
              <motion.div 
                initial={{ opacity: 1 }}
                animate={{ opacity: inView ? [1, 0.8, 1] : 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="relative z-10 group-hover:scale-110 transition-transform duration-500"
              >
                <div className="w-32 h-32 relative">
                  <div className="absolute inset-0 border-2 border-accent/30 rounded flex items-center justify-center">
                    {icon}
                  </div>
                  <div className="absolute inset-4 border border-primary-500/50 rounded-full animate-ping opacity-70"></div>
                </div>
              </motion.div>
              <div className="absolute bottom-4 left-4 text-xs text-accent/70 bg-dark-bg/70 px-2 py-1 rounded">AI分析中...</div>
            </div>
          )}
          
          {number === "03" && (
            <div className="w-full h-full flex items-center justify-center relative">
              <div className="relative z-10 transform transition-transform group-hover:scale-110 duration-500">
                <motion.div 
                  initial={{ x: 0 }}
                  animate={{ x: inView ? [0, 5, 0, -5, 0] : 0 }}
                  transition={{ duration: 5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                  className="w-44 flex flex-col items-center backdrop-blur-sm bg-dark-bg/40 p-4 rounded-lg border border-primary-500/20"
                >
                  <div className="flex items-center justify-center mb-2">
                    {icon}
                    <span className="text-primary-500 text-lg ml-2 font-semibold">姿态评分</span>
                  </div>
                  <div className="w-full h-6 bg-dark-bg/70 rounded-full mt-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: inView ? '85%' : '0%' }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-accent rounded-full"
                    ></motion.div>
                  </div>
                  <div className="w-full flex justify-between text-xs mt-1">
                    <span className="text-text-secondary">0</span>
                    <span className="text-primary-500 font-bold">85/100</span>
                    <span className="text-text-secondary">100</span>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
        
        {/* 文字内容 */}
        <div className="p-6 relative overflow-hidden">
          {/* 装饰线条 - 只在悬停时显示 */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500/50 to-accent/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          
          <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-primary-500 to-accent text-transparent bg-clip-text group-hover:from-accent group-hover:to-primary-500 transition-all duration-500">{title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ProcessSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  // 流程步骤数据
  const cardData = [
    {
      number: "01",
      title: "上传武术视频",
      description: "上传您的武术练习视频，支持多种常见格式，如MP4、AVI和MOV。系统会快速处理您的视频文件，准备AI分析。",
      imageSrc: "/img/process/upload.png",
      icon: (
        <svg className="w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    },
    {
      number: "02",
      title: "AI动作分析",
      description: "我们的AI系统会自动识别和分析您的武术动作、姿势和技术细节，实时进行多角度评估，精确到每个关节位置和动作轨迹。",
      imageSrc: "/img/process/analysis.png",
      icon: (
        <svg className="w-12 h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      number: "03",
      title: "获取专业评价",
      description: "获得详细的武术评分报告和专业的改进建议，包括关节角度矫正、动作速度调整和力量分配优化，以及为您量身定制的个性化练习计划。",
      imageSrc: "/img/process/feedback.png",
      icon: (
        <svg className="w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];
  
  return (
    <section className="py-20 bg-dark-bg relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute right-0 bottom-0 w-1/3 h-2/3" style={{
          backgroundImage: 'url("/static/tech-pattern.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat'
        }}></div>
        <div className="absolute left-0 top-0 w-1/3 h-2/3" style={{
          backgroundImage: 'url("/static/circuit-pattern.png")',
          backgroundSize: 'contain',
          backgroundPosition: 'top left',
          backgroundRepeat: 'no-repeat'
        }}></div>
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
          <GradientTitle align="center" className="mb-6">
            <span className="text-primary-500">简单三步</span>，提升武术水平
          </GradientTitle>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            武道智评让武术技能评估变得简单高效，只需三个简单步骤，即可获得专业分析
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-10">
          {cardData.map((step, index) => (
            <ProcessStep
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              imageSrc={step.imageSrc}
              delay={index * 200}
            />
          ))}
        </div>
        
        {/* 连接线 */}
        <div className="hidden md:block relative mt-8 h-1">
          <div className="absolute left-[12%] right-[12%] top-0 h-0.5 bg-gradient-to-r from-primary-500/50 via-accent/50 to-primary-500/50 transform -translate-y-20"></div>
          
          {/* 装饰点 */}
          <div className="absolute left-1/4 top-0 w-3 h-3 rounded-full bg-dark-bg border border-primary-500 transform -translate-x-1/2 -translate-y-[78px]"></div>
          <div className="absolute left-1/2 top-0 w-3 h-3 rounded-full bg-dark-bg border border-accent transform -translate-x-1/2 -translate-y-[78px]"></div>
          <div className="absolute left-3/4 top-0 w-3 h-3 rounded-full bg-dark-bg border border-primary-500 transform -translate-x-1/2 -translate-y-[78px]"></div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
