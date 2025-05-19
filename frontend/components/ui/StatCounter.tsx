import React, { useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';

interface StatCounterProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

const StatCounter: React.FC<StatCounterProps> = ({
  value,
  label,
  prefix = '',
  suffix = '',
  duration = 2.5,
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <div 
      ref={ref}
      className={`text-center transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple bg-clip-text text-transparent">
        {prefix}
        {isInView ? (
          <CountUp 
            start={0} 
            end={value} 
            duration={duration} 
            separator=","
            useEasing
          />
        ) : (
          0
        )}
        {suffix}
      </div>
      <div className="mt-2 text-gray-600 font-medium text-lg">{label}</div>
    </div>
  );
};

export default StatCounter;
