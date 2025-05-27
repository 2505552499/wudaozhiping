import { useState } from 'react';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = ({ scrolled = false }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { key: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
    { key: 'en-US', label: 'English', flag: '🇺🇸' }
  ];

  const handleLanguageChange = (key) => {
    i18n.changeLanguage(key);
    localStorage.setItem('language', key);
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.key === i18n.language) || languages[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
          ${scrolled
            ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
            : 'text-white hover:text-blue-200 hover:bg-white/10'
          }
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <GlobalOutlined className="text-base" />
        <span className="hidden sm:inline">{currentLanguage.label}</span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <motion.span
          className="ml-1 inline-block text-xs"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▾
        </motion.span>

        {/* 悬停下划线 */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200/20 backdrop-blur-xl z-50 overflow-hidden"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.key}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                className={`
                  w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center gap-3
                  ${i18n.language === lang.key
                    ? 'text-blue-600 bg-blue-50 font-medium'
                    : 'text-gray-700 hover:text-blue-600'
                  }
                `}
                onClick={() => handleLanguageChange(lang.key)}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                {i18n.language === lang.key && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-blue-600 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 点击外部关闭菜单 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;