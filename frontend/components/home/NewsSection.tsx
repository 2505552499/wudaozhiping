import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GradientTitle from '../ui/GradientTitle';

interface NewsCardProps {
  title: string;
  date: string;
  summary: string;
  imageUrl?: string;
  link: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, date, summary, imageUrl, link }) => {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <div className="relative overflow-hidden h-48">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'linear-gradient(to right, #4F49FF, #6E43FF)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <span className="text-sm font-medium">{date}</span>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold mb-3 line-clamp-2">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{summary}</p>
        <Link 
          href={link}
          className="text-xtalpi-indigo font-medium hover:underline self-start"
        >
          查看详情
        </Link>
      </div>
    </div>
  );
};

const NewsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // 示例新闻数据
  const newsItems: NewsCardProps[] = [
    {
      title: "武道智评平台年度功能更新公告",
      date: "2025年5月15日",
      summary: "我们很高兴地宣布，武道智评平台迎来了2025年度的重大功能更新。此次更新包括全新的动作识别算法、更精准的角度分析系统和优化的用户界面，为武术爱好者带来更专业的评估体验。",
      link: "/news/1"
    },
    {
      title: "全国武术姿态分析大赛即将开始",
      date: "2025年5月10日",
      summary: "由武道智评平台主办的首届全国武术姿态分析大赛将于下月举行。参赛者可以通过平台提交自己的武术动作视频，由AI系统和专业教练共同评判，优胜者将获得丰厚奖励。",
      link: "/news/2"
    },
    {
      title: "武道智评与国家武术协会达成战略合作",
      date: "2025年4月28日",
      summary: "武道智评平台与国家武术协会正式签署战略合作协议，双方将共同推进武术科技发展，为武术爱好者提供更专业的技术支持和学习资源。",
      link: "/news/3"
    },
    {
      title: "新增五种武术流派的专业分析支持",
      date: "2025年4月15日",
      summary: "武道智评平台现已支持咏春拳、八卦掌、形意拳、八极拳和太极拳五种主流武术流派的专业分析和评估，为不同流派的武术爱好者提供针对性的动作指导。",
      link: "/news/4"
    },
    {
      title: "武术教练线上认证课程开放报名",
      date: "2025年4月5日",
      summary: "武道智评平台推出武术教练线上认证课程，通过学习和考核的教练将获得平台认证资格，可以在平台上提供专业指导服务并获得相应收益。",
      link: "/news/5"
    }
  ];
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <GradientTitle as="h2">
            最新动态
          </GradientTitle>
          
          <div className="flex space-x-2">
            <button 
              onClick={scrollLeft}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={scrollRight}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div 
          className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide snap-x"
          ref={scrollContainerRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newsItems.map((item, index) => (
            <motion.div 
              key={index}
              className="min-w-[300px] md:min-w-[350px] snap-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <NewsCard {...item} />
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/news"
            className="inline-flex items-center text-xtalpi-indigo font-medium hover:underline"
          >
            查看全部动态
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
