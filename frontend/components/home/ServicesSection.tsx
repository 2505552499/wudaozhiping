import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import GradientTitle from '../ui/GradientTitle';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, link, delay = 0 }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 hover:translate-y-[-8px] group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay }}
    >
      <Link href={link}>
        <div className="p-6">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple flex items-center justify-center mb-4">
            <div className="text-white text-2xl">{icon}</div>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-xtalpi-indigo transition-colors">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

const ServicesSection: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    {
      title: t('home.services.imageAnalysis.title'),
      description: t('home.services.imageAnalysis.description'),
      icon: "📷",
      link: "/image-analysis"
    },
    {
      title: t('home.services.videoAnalysis.title'),
      description: t('home.services.videoAnalysis.description'),
      icon: "🎬",
      link: "/video-analysis"
    },
    {
      title: t('home.services.realtimeAnalysis.title'),
      description: t('home.services.realtimeAnalysis.description'),
      icon: "📹",
      link: "/camera-analysis"
    },
    {
      title: t('home.services.professionalCoach.title'),
      description: t('home.services.professionalCoach.description'),
      icon: "👨‍🏫",
      link: "/coach-appointment"
    },
    {
      title: t('home.services.premiumCourses.title'),
      description: t('home.services.premiumCourses.description'),
      icon: "📚",
      link: "/courses"
    },
    {
      title: t('home.services.martialArtsForum.title'),
      description: t('home.services.martialArtsForum.description'),
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
          {t('home.services.sectionTitle')}
        </GradientTitle>

        <motion.p
          className="text-gray-600 text-lg max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {t('home.services.sectionDescription')}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              link={service.link}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
