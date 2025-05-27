import React from 'react';
import { Dropdown, Button, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { key: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
    { key: 'en-US', label: 'English', flag: '🇺🇸' }
  ];

  const handleLanguageChange = (key) => {
    i18n.changeLanguage(key);
    localStorage.setItem('language', key);
  };

  const currentLanguage = languages.find(lang => lang.key === i18n.language) || languages[0];

  const items = languages.map(lang => ({
    key: lang.key,
    label: (
      <Space>
        <span style={{ fontSize: '16px' }}>{lang.flag}</span>
        <span>{lang.label}</span>
      </Space>
    ),
    onClick: () => handleLanguageChange(lang.key)
  }));

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button 
        type="text" 
        icon={<GlobalOutlined />}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '4px 12px',
          height: 'auto'
        }}
      >
        <Space>
          <span style={{ fontSize: '16px' }}>{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.label}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;