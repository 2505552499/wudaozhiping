import React from 'react';
import { Link } from 'react-router-dom';
import GradientTitle from '../ui/GradientTitle';

const ServiceCard = ({ title, description, icon, link, delay = 0 }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 hover:translate-y-[-8px] group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Link to={link}>
        <div className="p-6">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple flex items-center justify-center mb-4">
            <div className="text-white text-2xl">{icon}</div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-xtalpi-indigo transition-colors">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </Link>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      title: "图像分析",
      description: "上传武术动作图片，AI自动识别姿态并提供专业评分与改进建议",
      icon: "📷",
      link: "/image-analysis"
    },
    {
      title: "视频分析",
      description: "分析武术动作视频，获取连续动作的评估与详细动作分解",
      icon: "🎬",
      link: "/video-analysis"
    },
    {
      title: "实时分析",
      description: "通过摄像头实时监测姿态，即时反馈武术动作准确度",
      icon: "📹",
      link: "/camera-analysis"
    },
    {
      title: "专业教练",
      description: "预约资深武术教练，获取一对一专业指导和个性化训练计划",
      icon: "👨‍🏫",
      link: "/coach-appointment"
    },
    {
      title: "精品课程",
      description: "精选武术课程，从入门到精通，系统学习各种流派技巧",
      icon: "📚",
      link: "/courses"
    },
    {
      title: "武友论坛",
      description: "加入武术爱好者社区，分享经验、讨论技巧、结交同道中人",
      icon: "💬",
      link: "/forum"
    }
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <GradientTitle
          as="h2"
          align="center"
          className="mb-4"
        >
          全方位武术评估解决方案
        </GradientTitle>
        
        <p
          className="text-gray-600 text-lg max-w-3xl mx-auto text-center mb-12"
        >
          武道智评平台提供多种专业服务，满足不同层次武术爱好者和专业人士的需求
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
