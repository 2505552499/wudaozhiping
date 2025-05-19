import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import StatCounter from '../ui/StatCounter';
import GradientTitle from '../ui/GradientTitle';

const StatsSection: React.FC = () => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50" ref={ref}>
      <div className="container mx-auto px-4">
        <GradientTitle
          as="h2"
          align="center"
          className="mb-12"
        >
          专业武术评价平台
        </GradientTitle>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={container}
          initial="hidden"
          animate={controls}
        >
          <motion.div variants={item}>
            <StatCounter 
              value={5000} 
              label="活跃用户" 
              suffix="+" 
              className="text-center"
            />
          </motion.div>
          
          <motion.div variants={item}>
            <StatCounter 
              value={100} 
              label="专业教练" 
              suffix="+" 
              className="text-center"
            />
          </motion.div>
          
          <motion.div variants={item}>
            <StatCounter 
              value={15000} 
              label="动作分析" 
              suffix="+" 
              className="text-center"
            />
          </motion.div>
          
          <motion.div variants={item}>
            <StatCounter 
              value={98} 
              label="用户满意度" 
              suffix="%" 
              className="text-center"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
