import React from 'react';
import { useRouter } from 'next/router';
import { Globe } from 'lucide-react';

const LocaleSwitcher: React.FC = () => {
  const router = useRouter();
  const { pathname, asPath, query, locale } = router;
  
  const switchLocale = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="flex items-center space-x-1">
      <Globe className="w-4 h-4 text-gray-600" />
      <button
        onClick={() => switchLocale('zh')}
        className={`px-2 py-1 text-sm rounded transition-colors ${locale === 'zh' ? 'text-xtalpi-indigo font-medium' : 'text-gray-600 hover:text-xtalpi-indigo'}`}
        aria-label="切换到中文"
      >
        中
      </button>
      <span className="text-gray-300">|</span>
      <button
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 text-sm rounded transition-colors ${locale === 'en' ? 'text-xtalpi-indigo font-medium' : 'text-gray-600 hover:text-xtalpi-indigo'}`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
};

export default LocaleSwitcher;
