import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

// 简单版的计数器组件，模拟react-countup效果
const StatCounter = ({
  value,
  label,
  prefix = '',
  suffix = '',
  duration = 2.5,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  // 检测元素是否进入视口的函数
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // 计数动画效果
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime;
    let animationFrame;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);
      
      if (progress < 1) {
        setCount(Math.floor(value * progress));
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(value);
      }
    };
    
    animationFrame = requestAnimationFrame(updateCount);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, value, duration]);
  
  return (
    <div 
      ref={ref}
      className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple bg-clip-text text-transparent">
        {prefix}{count}{suffix}
      </div>
      <div className="mt-2 text-gray-600 font-medium text-lg">{label}</div>
    </div>
  );
};

StatCounter.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  duration: PropTypes.number,
  className: PropTypes.string,
};

export default StatCounter;
