import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import GradientTitle from '../components/ui/GradientTitle';
import GradientButton from '../components/ui/GradientButton';

const I18nDemo = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-dark-bg text-white p-8">
      <div className="container mx-auto max-w-4xl">
        {/* 页头 */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold">{t('home.hero.title')}</h1>
          <LanguageSwitcher />
        </div>

        {/* 当前语言信息 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <p className="text-lg mb-2">
            <strong>当前语言 / Current Language:</strong> {i18n.language}
          </p>
          <p className="text-sm text-gray-400">
            切换语言查看效果 / Switch language to see the effect
          </p>
        </div>

        {/* 示例文本展示 */}
        <div className="space-y-8">
          {/* Hero 部分 */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-primary-500">Hero Section</h2>
            <GradientTitle as="h3" className="mb-4">
              {t('home.hero.subtitle')}
            </GradientTitle>
            <p className="text-gray-300 mb-4">{t('home.hero.description')}</p>
            <div className="flex gap-4">
              <GradientButton>{t('home.hero.startNow')}</GradientButton>
              <GradientButton variant="outline">{t('home.hero.learnMore')}</GradientButton>
            </div>
          </section>

          {/* 导航菜单 */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-primary-500">Navigation</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 p-3 rounded">{t('nav.home')}</div>
              <div className="bg-gray-700 p-3 rounded">{t('nav.courses')}</div>
              <div className="bg-gray-700 p-3 rounded">{t('nav.coaches')}</div>
              <div className="bg-gray-700 p-3 rounded">{t('nav.analysis')}</div>
              <div className="bg-gray-700 p-3 rounded">{t('nav.forum')}</div>
              <div className="bg-gray-700 p-3 rounded">{t('nav.about')}</div>
            </div>
          </section>

          {/* 通用按钮 */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-primary-500">Common Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-primary-500 rounded hover:bg-primary-600">
                {t('common.login')}
              </button>
              <button className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">
                {t('common.register')}
              </button>
              <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
                {t('common.submit')}
              </button>
              <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">
                {t('common.cancel')}
              </button>
            </div>
          </section>

          {/* 功能特性 */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-primary-500">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2 text-accent">
                  {t('home.features.imageAnalysis.title')}
                </h3>
                <p className="text-gray-300">
                  {t('home.features.imageAnalysis.description')}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-accent">
                  {t('home.features.videoAnalysis.title')}
                </h3>
                <p className="text-gray-300">
                  {t('home.features.videoAnalysis.description')}
                </p>
              </div>
            </div>
          </section>

          {/* 统计数据 */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-primary-500">Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-accent">10k+</div>
                <div className="text-gray-400">{t('home.stats.users')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">98%</div>
                <div className="text-gray-400">{t('home.stats.accuracy')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">50+</div>
                <div className="text-gray-400">{t('home.stats.coaches')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">100万+</div>
                <div className="text-gray-400">{t('home.stats.analyses')}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default I18nDemo;