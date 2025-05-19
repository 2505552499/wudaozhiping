import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GradientButton from '../ui/GradientButton';

// 导航菜单项数据
const menuItems = [
  {
    title: '首页',
    path: '/',
    children: []
  },
  {
    title: '智能分析服务',
    path: '#',
    children: [
      { title: '图像分析', path: '/image-analysis' },
      { title: '视频分析', path: '/video-analysis' },
      { title: '实时分析', path: '/camera-analysis' },
      { title: '动作辅导', path: '/action-guidance' }
    ]
  },
  {
    title: '教练资源',
    path: '#',
    children: [
      { title: '预约教练', path: '/coach-appointment' },
      { title: '教练团队', path: '/coach-team' },
      { title: '线下指导', path: '/offline-guidance' }
    ]
  },
  {
    title: '课程中心',
    path: '#',
    children: [
      { title: '精品课程', path: '/courses' },
      { title: '入门教学', path: '/beginner-courses' },
      { title: '进阶训练', path: '/advanced-courses' },
      { title: '专业技巧', path: '/professional-skills' }
    ]
  },
  {
    title: '武友社区',
    path: '/forum',
    children: []
  },
  {
    title: '关于我们',
    path: '/about',
    children: []
  }
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
  
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-xtalpi-dark-blue/95 shadow-lg' : 'bg-gradient-to-r from-xtalpi-dark-blue to-blue-900'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <img 
                src="/logo.png" 
                alt="武道智评" 
                className="h-8 mr-2" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/120x40?text=武道智评';
                }}
              />
              <span className="text-white font-bold text-xl hidden md:block">武道智评</span>
            </div>
          </Link>
          
          {/* 桌面端导航菜单 */}
          <nav className="hidden md:flex space-x-1 lg:space-x-4">
            {menuItems.map((item, index) => (
              <div 
                key={index}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Link 
                  to={item.children.length === 0 ? item.path : '#'}
                  className={`px-3 py-2 rounded-md text-sm lg:text-base font-medium text-white hover:text-xtalpi-cyan transition-colors relative ${activeMenu === index ? 'text-xtalpi-cyan' : ''}`}
                  onClick={item.children.length > 0 ? (e) => e.preventDefault() : undefined}
                >
                  {item.title}
                  {item.children.length > 0 && (
                    <span className="ml-1">▾</span>
                  )}
                </Link>
                
                {/* 下拉菜单 */}
                {item.children.length > 0 && activeMenu === index && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 transform opacity-100 scale-100 transition-all duration-200">
                    {item.children.map((child, childIndex) => (
                      <Link
                        key={childIndex}
                        to={child.path}
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-xtalpi-indigo hover:text-white transition-colors"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          {/* 桌面端登录/注册按钮 */}
          <div className="hidden md:flex items-center space-x-2">
            <GradientButton 
              variant="outline"
              className="text-sm"
              onClick={() => window.location.href = '/login'}
            >
              登录
            </GradientButton>
            <GradientButton 
              className="text-sm"
              onClick={() => window.location.href = '/register'}
            >
              注册
            </GradientButton>
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-white p-2"
              aria-label="菜单"
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
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-xtalpi-indigo hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <div>
                    <button
                      className="flex justify-between items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-xtalpi-indigo hover:text-white"
                      onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                    >
                      <span>{item.title}</span>
                      <span>{activeMenu === index ? '▴' : '▾'}</span>
                    </button>
                    
                    {activeMenu === index && (
                      <div className="pl-4 pr-2 py-1 space-y-1 bg-xtalpi-indigo/20 rounded-md mt-1">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            to={child.path}
                            className="block px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-xtalpi-indigo hover:text-white"
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
                <GradientButton 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.location.href = '/login';
                    setIsMobileMenuOpen(false);
                  }}
                >
                  登录
                </GradientButton>
                <GradientButton 
                  className="w-full"
                  onClick={() => {
                    window.location.href = '/register';
                    setIsMobileMenuOpen(false);
                  }}
                >
                  注册
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
