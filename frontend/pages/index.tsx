import React from 'react';
import Head from 'next/head';
import MainLayout from '../components/layout/MainLayout';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import ServicesSection from '../components/home/ServicesSection';
import FeaturesSection from '../components/home/FeaturesSection';
import NewsSection from '../components/home/NewsSection';
import { motion } from 'framer-motion';
import GradientButton from '../components/ui/GradientButton';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <Head>
        <title>u6b66u9053u667au8bc4 - u667au80fdu6b66u672fu59ffu6001u5206u6790u7cfbu7edf</title>
        <meta name="description" content="u6b66u9053u667au8bc4u5e73u53f0u5229u7528u5148u8fdbu7684u8ba1u7b97u673au89c6u89c9u548cu4ebau5de5u667au80fdu6280u672fuff0cu4e3au6b66u672fu7231u597du8005u548cu6559u7ec3u63d0u4f9bu7cbeu51c6u7684u59ffu6001u5206u6790u4e0eu4e13u4e1au8bc4u4ef7" />
        <meta name="keywords" content="u6b66u672f,u59ffu6001u5206u6790,AI,u4ebau5de5u667au80fd,u52a8u4f5cu8bc4u4f30" />
      </Head>
      
      {/* u82f1u96c4u533au57df */}
      <HeroSection />
      
      {/* u6570u636eu7edfu8ba1 */}
      <StatsSection />
      
      {/* u670du52a1u5185u5bb9 */}
      <ServicesSection />
      
      {/* u6280u672fu7279u70b9 */}
      <FeaturesSection />
      
      {/* u6700u65b0u52a8u6001 */}
      <NewsSection />
      
      {/* u884cu52a8u53f7u53ec */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            u5f00u59cbu60a8u7684u6b66u672fu7cbeu8fdbu4e4bu65c5
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            u65e0u8bbau60a8u662fu6b66u672fu521du5b66u8005u8fd8u662fu6709u7ecfu9a8cu7684u7231u597du8005uff0cu6b66u9053u667au8bc4u5e73u53f0u90fdu80fdu4e3au60a8u63d0u4f9bu4e13u4e1au7684u52a8u4f5cu5206u6790u548cu5efau8baeuff0c
            u5e2eu52a9u60a8u66f4u5febu5730u638cu63e1u6280u5de7uff0cu63d0u9ad8u6280u672fu6c34u5e73
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GradientButton 
              className="px-8 py-3 text-lg bg-white text-xtalpi-indigo hover:bg-gray-100"
              onClick={() => window.location.href = '/login'}
            >
              u7acbu5373u52a0u5165
            </GradientButton>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
