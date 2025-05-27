import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

// 引入语言资源文件
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

const resources = {
  'zh-CN': {
    translation: zhCN
  },
  'en-US': {
    translation: enUS
  }
};

i18n
  .use(HttpApi) // 用于加载远程翻译文件
  .use(LanguageDetector) // 自动检测用户语言
  .use(initReactI18next) // 将i18n传递给react-i18next
  .init({
    resources,
    lng: 'zh-CN', // 默认语言
    fallbackLng: 'zh-CN', // 备用语言
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false // React已经默认转义了
    },
    
    react: {
      useSuspense: false // 关闭Suspense模式
    }
  });

export default i18n;