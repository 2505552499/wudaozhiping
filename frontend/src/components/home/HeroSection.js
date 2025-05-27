import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import { PlayCircleOutlined, RocketOutlined, StarFilled } from '@ant-design/icons';
import { StyledButton } from '../ui/DesignSystem';

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
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 页面加载后的动画效果
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* 粒子背景 */}
      <ParticleCanvas />

      {/* 武术元素装饰 */}
      <MartialArtsElements />

      {/* 主要内容 */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* 主标题区域 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: visible ? 1 : 0.9, opacity: visible ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300"
            >
              <StarFilled className="text-cyan-400 animate-pulse" />
              <span className="text-white text-sm font-medium tracking-wide">
                {t('home.hero.platformTag', 'AI驱动的武术分析平台')}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
                <Trans
                  i18nKey="home.hero.titleLine1"
                  defaults="以 <1>AI</1> 和 <1>CV</1> 驱动"
                  components={[
                    <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent font-extrabold animate-pulse" />
                  ]}
                />
              </span>
              <br/>
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent drop-shadow-2xl">
                {t('home.hero.titleLine2', {defaultValue: '武术动作分析与评价'})}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: visible ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-blue-100 text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90"
            >
              {t('home.hero.description')}
            </motion.p>
          </motion.div>

          {/* 按钮区域 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 text-lg px-10 py-4 flex items-center justify-center gap-2 h-14"
              onClick={() => navigate('/login')}
              style={{ color: 'white', minHeight: '56px' }}
            >
              <RocketOutlined style={{ color: 'white' }} />
              <span style={{ color: 'white', fontWeight: 'bold' }}>
                {t('home.hero.startNow')}
              </span>
            </button>

            <StyledButton
              variant="outline"
              size="large"
              icon={<PlayCircleOutlined />}
              className="text-lg px-10 py-4 border-white/30 text-white hover:bg-white hover:text-gray-900 h-14"
              style={{ minHeight: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => navigate('/about')}
            >
              <span style={{ color: 'inherit' }}>{t('home.hero.learnMore')}</span>
            </StyledButton>
          </motion.div>

          {/* 统计数据 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: '10k+', label: t('home.stats.users'), gradient: 'from-blue-400 to-cyan-400', delay: 0 },
              { value: '98%', label: t('home.stats.accuracy', '准确率'), gradient: 'from-green-400 to-emerald-400', delay: 0.1 },
              { value: '50+', label: t('home.stats.coaches'), gradient: 'from-purple-400 to-pink-400', delay: 0.2 },
              { value: '100万+', label: t('home.stats.analyses'), gradient: 'from-orange-400 to-red-400', delay: 0.3 }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
                transition={{ duration: 0.5, delay: 0.8 + stat.delay }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden group"
              >
                <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all duration-300">
                  {/* 背景光效 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>

                  <div className="relative text-center">
                    <motion.div
                      className="text-4xl md:text-5xl font-bold mb-2"
                      style={{
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-white text-sm font-medium tracking-wide">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
