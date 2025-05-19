import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientTitle from '../ui/GradientTitle';
import GradientButton from '../ui/GradientButton';

// 粒子动画效果
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    // 处理窗口大小变化
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = Math.min(100, Math.floor(dimensions.width / 20)); // 根据屏幕大小调整粒子数量

    // 设置Canvas大小
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        color: `rgba(${Math.floor(Math.random() * 100 + 55)}, ${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.random() * 0.6 + 0.1})`,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        sinOffset: Math.random() * Math.PI * 2
      });
    }

    let animationFrameId;

    // 连接附近的粒子
    const connectParticles = () => {
      const maxDistance = 150; // 连线的最大距离
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - (distance / maxDistance);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // 使用主题色的渐变线条
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y, particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, `rgba(22, 93, 255, ${opacity * 0.15})`); // primary-500
            gradient.addColorStop(1, `rgba(139, 92, 255, ${opacity * 0.15})`); // accent
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 更新并绘制每个粒子
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // 更新位置
        particle.sinOffset += 0.01;
        particle.x += particle.vx + Math.sin(particle.sinOffset) * 0.2;
        particle.y += particle.vy + Math.cos(particle.sinOffset) * 0.2;
        
        // 边界处理 - 循环出现
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      // 绘制粒子间的连接线
      connectParticles();
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

// 武术元素组件 - 结合图片和CSS效果
const MartialArtsElements = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-15 pointer-events-none overflow-hidden">
      {/* 太极图案 - 使用CSS */}
      <div className="absolute right-[5%] top-[15%] w-40 h-40 rounded-full border-8 border-white/20 flex items-center justify-center">
        <div className="absolute w-1/2 h-full bg-white/20 rounded-l-full"></div>
        <div className="absolute w-4 h-4 rounded-full bg-black top-1/4 left-1/2 transform -translate-x-1/2"></div>
        <div className="absolute w-4 h-4 rounded-full bg-white bottom-1/4 left-1/2 transform -translate-x-1/2"></div>
      </div>
      
      {/* 右侧武者剧影 - 使用内联SVG */}
      <div className="absolute right-[10%] bottom-[-5%] w-[35%] h-[90%] transform scale-x-[-1] opacity-10 flex items-end justify-center">
        <svg viewBox="0 0 100 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0C55 20 60 30 70 40C80 50 85 60 80 80C75 100 70 110 50 130C30 150 20 180 30 190C40 200 60 190 65 170C70 150 75 140 85 130C95 120 100 100 90 80C80 60 70 50 60 30C50 10 45 0 50 0Z" fill="currentColor" className="text-primary-500" />
          <path d="M20 80C25 70 35 65 45 70C55 75 65 85 60 95C55 105 45 115 35 110C25 105 15 90 20 80Z" fill="currentColor" className="text-accent" />
        </svg>
      </div>
      
      {/* 左侧武者剧影 - 使用内联SVG */}
      <div className="absolute left-[5%] bottom-[-5%] w-[30%] h-[85%] opacity-10 flex items-end justify-center">
        <svg viewBox="0 0 100 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 20C40 15 50 25 55 40C60 55 65 75 75 85C85 95 95 100 90 110C85 120 70 115 65 105C60 95 55 85 45 80C35 75 20 80 15 90C10 100 15 115 25 120C35 125 50 120 55 110C60 100 65 85 75 75C85 65 95 60 90 45C85 30 75 20 65 15C55 10 40 15 30 20Z" fill="currentColor" className="text-primary-500" />
          <path d="M40 140C50 130 65 135 75 145C85 155 90 170 80 180C70 190 55 185 45 175C35 165 30 150 40 140Z" fill="currentColor" className="text-accent" />
        </svg>
      </div>
      
      {/* 装饰线条元素 */}
      <div className="absolute right-[15%] bottom-[20%] w-40 h-60 opacity-20">
        <div className="w-20 h-20 rounded-full border border-primary-500/50 absolute top-0 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
        <div className="w-0.5 h-20 bg-primary-500/30 absolute top-20 left-1/2 transform -translate-x-1/2"></div>
        <div className="w-40 h-0.5 bg-accent/30 absolute top-30 left-0"></div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 页面加载后的动画效果
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-bg">
      {/* 粒子背景 */}
      <ParticleCanvas />
      
      {/* 武术元素装饰 */}
      <MartialArtsElements />
      
      {/* 主要内容 */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div 
            className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <GradientTitle as="h1" align="center" className="mb-6">
              以 <span className="text-primary-500">AI</span> 和 <span className="text-primary-500">CV</span> 驱动<br/>
              武术动作分析与评价
            </GradientTitle>
            
            <p 
              className={`text-text-secondary text-xl mb-10 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
            >
              武道智评平台利用先进的计算机视觉和人工智能技术，
              为武术爱好者和教练提供精准的姿态分析与专业评价
            </p>
          </div>
          
          <div 
            className={`flex flex-col sm:flex-row gap-5 justify-center transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <GradientButton 
              className="px-8 py-3 text-lg"
              onClick={() => navigate('/login')}
            >
              立即开始
            </GradientButton>
            
            <GradientButton 
              variant="outline"
              className="px-8 py-3 text-lg"
              onClick={() => navigate('/about')}
            >
              了解更多
            </GradientButton>
          </div>
          
          {/* 统计数据 */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center" 
            style={{ 
              opacity: visible ? 1 : 0, 
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1s ease-out 0.8s, transform 1s ease-out 0.8s'
            }}
          >
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent bg-clip-text text-transparent mb-2">10k+</div>
              <div className="text-text-secondary">注册用户</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent bg-clip-text text-transparent mb-2">98%</div>
              <div className="text-text-secondary">准确率</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent bg-clip-text text-transparent mb-2">50+</div>
              <div className="text-text-secondary">专业教练</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-accent bg-clip-text text-transparent mb-2">100万+</div>
              <div className="text-text-secondary">分析次数</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 向下滚动提示 */}
      <div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 transition-opacity animate-bounce"
        style={{ opacity: visible ? 0.7 : 0, transitionDelay: '1.5s', transitionDuration: '1s' }}
      >
        <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
