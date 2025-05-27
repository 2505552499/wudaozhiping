import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons';
import GradientButton from '../ui/GradientButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { StyledButton } from '../ui/DesignSystem';

const Navbar = () => {
  const { t } = useTranslation();

  // 导航菜单项数据
  const menuItems = [
    {
      title: t('nav.home'),
      path: '/',
      children: []
    },
    {
      title: t('home.services.smartAnalysis.title'),
      path: '#',
      children: [
        { title: t('nav.imageAnalysis'), path: '/image-analysis' },
        { title: t('nav.videoAnalysis'), path: '/video-analysis' },
        { title: t('nav.cameraAnalysis'), path: '/camera-analysis' },
        { title: t('home.services.smartAnalysis.items.actionGuidance'), path: '/action-guidance' }
      ]
    },
    {
      title: t('home.services.coachResources.title'),
      path: '#',
      children: [
        { title: t('nav.appointments'), path: '/coach-appointment' },
        { title: t('coaches.title'), path: '/coach-team' },
        { title: t('home.services.coachResources.items.offlineTraining'), path: '/offline-guidance' }
      ]
    },
    {
      title: t('home.services.courseCenter.title'),
      path: '#',
      children: [
        { title: t('nav.courses'), path: '/courses' },
        { title: t('home.services.courseCenter.items.beginnerCourses'), path: '/beginner-courses' },
        { title: t('home.services.courseCenter.items.advancedTechniques'), path: '/advanced-courses' },
        { title: t('home.services.courseCenter.items.professionalSkills'), path: '/professional-skills' }
      ]
    },
    {
      title: t('nav.forum'),
      path: '/forum',
      children: []
    },
    {
      title: t('nav.about'),
      path: '/about',
      children: []
    }
  ];
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // 处理页面滚动时导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // 检查用户登录状态
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');

      if (token && storedUsername) {
        setIsAuthenticated(true);
        setUsername(storedUsername);
      }
    };

    checkAuthStatus();

    // 监听登录状态变化
    window.addEventListener('storage', checkAuthStatus);
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  // 处理鼠标悬停时显示下拉菜单
  const handleMouseEnter = (index) => {
    setActiveMenu(index);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  // 切换移动端菜单
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // 清除本地存储的认证信息
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // 更新状态
    setIsAuthenticated(false);
    setUsername('');

    // 重定向到首页
    window.location.href = '/';
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-2xl shadow-2xl border-b border-gray-200/20'
          : 'bg-gradient-to-b from-gray-900/50 to-transparent backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center group">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 group-hover:shadow-lg transition-all duration-300">
                  <span className="text-white font-bold text-lg">武</span>
                </div>
                <span className={`font-bold text-xl hidden md:block transition-colors duration-300 ${
                  scrolled ? 'text-gray-800' : 'text-white'
                }`}>
                  武道智评
                </span>
              </div>
            </Link>
          </motion.div>

          {/* 桌面端导航菜单 */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-6">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={item.children.length === 0 ? item.path : '#'}
                  className={`
                    relative px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition-all duration-300
                    ${scrolled
                      ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      : 'text-white hover:text-blue-200 hover:bg-white/10'
                    }
                    ${activeMenu === index ? (scrolled ? 'text-blue-600 bg-blue-50' : 'text-blue-200 bg-white/10') : ''}
                  `}
                  onClick={item.children.length > 0 ? (e) => e.preventDefault() : undefined}
                >
                  {item.title}
                  {item.children.length > 0 && (
                    <motion.span
                      className="ml-1 inline-block"
                      animate={{ rotate: activeMenu === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▾
                    </motion.span>
                  )}

                  {/* 悬停下划线 */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>

                {/* 下拉菜单 */}
                <AnimatePresence>
                  {item.children.length > 0 && activeMenu === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-gray-200/50"
                    >
                      {item.children.map((child, childIndex) => (
                        <motion.div
                          key={childIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: childIndex * 0.05 }}
                        >
                          <Link
                            to={child.path}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl mx-2"
                          >
                            {child.title}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* 登录/注册按钮或用户信息 */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
                      ${scrolled
                        ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        : 'text-white hover:text-blue-200 hover:bg-white/10'
                      }
                    `}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-white text-sm" />
                    </div>
                    <span>{username}</span>
                    <motion.span
                      className="text-xs"
                      animate={{ rotate: 0 }}
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▾
                    </motion.span>
                  </motion.button>

                  <div className="absolute right-0 z-50 w-56 mt-2 origin-top-right bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 border border-gray-200/50">
                    <div className="py-2">
                      <Link to="/user-profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl mx-2">
                        <UserOutlined />
                        {t('nav.dashboard')}
                      </Link>
                      <Link to="/my-courses" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl mx-2">
                        <SettingOutlined />
                        {t('profile.courses')}
                      </Link>
                      <Link to="/my-appointments" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl mx-2">
                        <SettingOutlined />
                        {t('profile.appointments')}
                      </Link>
                      <div className="border-t border-gray-200 my-2 mx-2"></div>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 rounded-xl mx-2">
                        <LogoutOutlined />
                        {t('common.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-5 py-2.5 rounded-xl font-medium transition-all duration-300
                    ${scrolled
                      ? 'border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50'
                      : 'border border-white/30 text-white hover:bg-white/10 hover:border-white/50'
                    }
                  `}
                  onClick={() => window.location.href = '/login'}
                >
                  {t('common.login')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-5 py-2.5 rounded-xl font-medium transition-all duration-300
                    ${scrolled
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 border border-white/20'
                    }
                  `}
                  onClick={() => window.location.href = '/register'}
                >
                  {t('common.register')}
                </motion.button>
              </div>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label={t('nav.menu')}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-xtalpi-dark-blue/95 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item, index) => (
              <div key={index} className="py-1">
                {item.children.length === 0 ? (
                  <Link
                    to={item.path}
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-500/10 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <div>
                    <button
                      className="flex justify-between items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-500/10 hover:text-white"
                      onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                    >
                      <span>{item.title}</span>
                      <span>{activeMenu === index ? '▴' : '▾'}</span>
                    </button>

                    {activeMenu === index && (
                      <div className="pl-4 pr-2 py-1 space-y-1 bg-primary-500/10 rounded-md mt-1">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            to={child.path}
                            className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-500/10 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 pb-3 border-t border-white/20">
              <div className="flex justify-center items-center flex-col space-y-2">
                <LanguageSwitcher />
                {isAuthenticated ? (
                  <>
                    <div className="text-white text-center mb-2">
                      {t('common.welcome', { name: username })}
                    </div>
                    <Link
                      to="/user-profile"
                      className="block w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <GradientButton variant="outline" className="w-full">
                        {t('nav.dashboard')}
                      </GradientButton>
                    </Link>
                    <Link
                      to="/my-courses"
                      className="block w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <GradientButton variant="outline" className="w-full">
                        {t('profile.courses')}
                      </GradientButton>
                    </Link>
                    <GradientButton
                      variant="outline"
                      className="w-full text-red-500 border-red-500 hover:bg-red-500"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {t('common.logout')}
                    </GradientButton>
                  </>
                ) : (
                  <>
                    <GradientButton
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        window.location.href = '/login';
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {t('common.login')}
                    </GradientButton>
                    <GradientButton
                      className="w-full"
                      onClick={() => {
                        window.location.href = '/register';
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {t('common.register')}
                    </GradientButton>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Navbar;
