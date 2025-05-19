import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Dropdown, Avatar, Badge } from 'antd';
import { 
  UserOutlined, 
  BellOutlined, 
  LogoutOutlined,
  MessageOutlined,
  HomeOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  CameraOutlined,
  BookOutlined,
  SettingOutlined,
  TeamOutlined,
  CommentOutlined,
  FormOutlined,
  ReadOutlined
} from '@ant-design/icons';
import LocaleSwitcher from '../ui/LocaleSwitcher';
import GradientButton from '../ui/GradientButton';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [username, setUsername] = useState('u6e38u5ba2');
  const [role, setRole] = useState('user');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // u83b7u53d6u7528u6237u4fe1u606f
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedRole) {
      setRole(storedRole);
    }
    
    // u76d1u542cu6edau52a8u4e8bu4ef6uff0cu5b9eu73b0u5bfcu822au680fu80ccu666fu6548u679cu53d8u5316
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // u5904u7406u767bu51fa
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    router.push('/login');
  };

  // u7528u6237u4e0bu62c9u83dcu5355
  const userMenu = [
    { key: 'username', label: username, icon: <UserOutlined />, disabled: true },
    { key: 'role', label: role === 'coach' ? 'u6559u7ec3u5458' : 'u666eu901au7528u6237', icon: role === 'coach' ? <TeamOutlined /> : <UserOutlined />, disabled: true },
    { type: 'divider' },
    { 
      key: 'messages', 
      label: (
        <span>
          u6d88u606fu4e2du5fc3
          {unreadMessages > 0 && (
            <Badge count={unreadMessages} style={{ marginLeft: 8 }} />
          )}
        </span>
      ), 
      icon: <MessageOutlined />, 
      onClick: () => router.push('/messages')
    },
    { type: 'divider' },
    { key: 'logout', label: 'u9000u51fau767bu5f55', icon: <LogoutOutlined />, onClick: handleLogout },
  ];

  // u6839u636eu7528u6237u89d2u8272u751fu6210u5bfcu822au83dcu5355
  const navItems = [
    { key: '/', label: 'u9996u9875', icon: <HomeOutlined /> },
    { key: '/image-analysis', label: 'u56feu50cfu5206u6790', icon: <FileImageOutlined /> },
    { key: '/video-analysis', label: 'u89c6u9891u5206u6790', icon: <VideoCameraOutlined /> },
    { key: '/camera-analysis', label: 'u6444u50cfu5934u5206u6790', icon: <CameraOutlined /> },
    { key: '/knowledge-base', label: 'u6b66u672fu77e5u8bc6u5e93', icon: <BookOutlined /> },
    { key: '/courses', label: 'u7cbeu54c1u8bfeu7a0b', icon: <ReadOutlined /> },
    { 
      key: 'forum', 
      label: 'u6b66u53cbu8bbau575b', 
      icon: <CommentOutlined />,
      children: [
        { key: '/forum', label: 'u8bbau575bu9996u9875' },
        { key: '/forum/create', label: 'u53d1u5e03u5e16u5b50' },
        { key: '/forum/my-posts', label: 'u6211u7684u5e16u5b50' }
      ]
    }
  ];

  // u6839u636eu89d2u8272u6dfbu52a0u7279u6b8au83dcu5355
  if (role === 'admin') {
    navItems.push({ key: '/admin-review', label: 'u9884u7ea6u5ba1u6838', icon: <TeamOutlined /> });
    navItems.push({ key: '/admin/courses', label: 'u8bfeu7a0bu7ba1u7406', icon: <ReadOutlined /> });
    navItems.push({ key: '/admin/enrollments', label: 'u62a5u540du7ba1u7406', icon: <TeamOutlined /> });
    navItems.push({ key: '/forum/review', label: 'u8bbau575bu5ba1u6838', icon: <FormOutlined /> });
  } else if (role === 'coach') {
    navItems.push({ key: '/coach-dashboard', label: 'u6559u7ec3u7ba1u7406', icon: <TeamOutlined /> });
    navItems.push({ key: '/coach-appointment-create', label: 'u53d1u5e03u9884u7ea6', icon: <MessageOutlined /> });
  } else {
    navItems.push({ key: '/coach-appointment', label: 'u6559u7ec3u9884u7ea6', icon: <TeamOutlined /> });
  }

  navItems.push({ key: '/settings', label: 'u5e2eu52a9u4e0eu8bbeu7f6e', icon: <SettingOutlined /> });

  return (
    <div className="min-h-screen flex flex-col">
      {/* u5bfcu822au6761 - XtalPiu98ceu683cu900fu660eu6e10u53d8 */}
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-2xl">
                <span className={`transition-colors duration-300 ${scrolled ? 'text-xtalpi-dark-blue' : 'text-white'}`}>
                  u6b66u9053u667au8bc4
                </span>
              </Link>
            </div>
            
            {/* u684cu9762u5bfcu822a */}
            <nav className="hidden md:flex space-x-1 items-center">
              {navItems.map((item) => {
                if (item.children) {
                  // u4e0bu62c9u83dcu5355
                  return (
                    <Dropdown 
                      key={item.key}
                      menu={{ items: item.children.map(child => ({ key: child.key, label: <Link href={child.key}>{child.label}</Link> })) }}
                      placement="bottomCenter"
                    >
                      <div 
                        className={`px-4 py-2 cursor-pointer flex items-center ${scrolled ? 'text-gray-700 hover:text-xtalpi-indigo' : 'text-white hover:text-xtalpi-cyan'} transition-colors`}
                      >
                        {item.icon && <span className="mr-1">{item.icon}</span>}
                        {item.label}
                      </div>
                    </Dropdown>
                  );
                }
                
                // u666eu901au83dcu5355u9879
                return (
                  <Link href={item.key} key={item.key}>
                    <div 
                      className={`px-4 py-2 flex items-center ${router.pathname === item.key ? 'font-medium' : ''} ${scrolled ? 'text-gray-700 hover:text-xtalpi-indigo' : 'text-white hover:text-xtalpi-cyan'} transition-colors`}
                    >
                      {item.icon && <span className="mr-1">{item.icon}</span>}
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>
            
            {/* u53f3u4fa7u529fu80fdu533a */}
            <div className="flex items-center space-x-2">
              <LocaleSwitcher />
              
              <button 
                type="button" 
                className={`p-2 rounded-full relative ${scrolled ? 'text-gray-700 hover:text-xtalpi-indigo' : 'text-white hover:text-xtalpi-cyan'} transition-colors`}
                onClick={() => router.push('/messages')}
              >
                {unreadMessages > 0 ? (
                  <Badge count={unreadMessages} size="small">
                    <BellOutlined style={{ fontSize: 18 }} />
                  </Badge>
                ) : (
                  <BellOutlined style={{ fontSize: 18 }} />
                )}
              </button>
              
              <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Avatar icon={<UserOutlined />} />
                  <span className={`hidden sm:block transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                    {username}
                  </span>
                </div>
              </Dropdown>
              
              {/* u79fbu52a8u7aefu83dcu5355u6309u94ae */}
              <button 
                type="button"
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <div className={`w-6 h-0.5 mb-1.5 transition-colors ${scrolled ? 'bg-gray-700' : 'bg-white'}`}></div>
                <div className={`w-6 h-0.5 mb-1.5 transition-colors ${scrolled ? 'bg-gray-700' : 'bg-white'}`}></div>
                <div className={`w-6 h-0.5 transition-colors ${scrolled ? 'bg-gray-700' : 'bg-white'}`}></div>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* u79fbu52a8u7aefu83dcu5355 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-white md:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 flex justify-between items-center border-b">
              <div className="font-bold text-xl text-xtalpi-indigo">u6b66u9053u667au8bc4</div>
              <button 
                type="button"
                className="p-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4">
              {navItems.map((item) => {
                if (item.children) {
                  return (
                    <div key={item.key} className="mb-4">
                      <div className="font-medium text-gray-800 mb-2 flex items-center">
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.label}
                      </div>
                      <div className="pl-6 space-y-2">
                        {item.children.map(child => (
                          <Link 
                            href={child.key} 
                            key={child.key}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div className="text-gray-600 hover:text-xtalpi-indigo">
                              {child.label}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                
                return (
                  <Link 
                    href={item.key} 
                    key={item.key}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="py-3 flex items-center text-gray-800 hover:text-xtalpi-indigo">
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="flex-grow">
        {children}
      </main>
      
      {/* u9875u811a - XtalPiu6df1u8272u98ceu683c */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">u6b66u9053u667au8bc4</h3>
              <p className="text-gray-400">u667au80fdu59ffu6001u5206u6790u7cfbu7edfuff0cu4e13u6ce8u6b66u672fu52a8u4f5cu8bc4u4ef7</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">u6838u5fc3u529fu80fd</h4>
              <ul className="space-y-2">
                <li><Link href="/image-analysis" className="text-gray-400 hover:text-white">u56feu50cfu5206u6790</Link></li>
                <li><Link href="/video-analysis" className="text-gray-400 hover:text-white">u89c6u9891u5206u6790</Link></li>
                <li><Link href="/camera-analysis" className="text-gray-400 hover:text-white">u6444u50cfu5934u5206u6790</Link></li>
                <li><Link href="/knowledge-base" className="text-gray-400 hover:text-white">u6b66u672fu77e5u8bc6u5e93</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">u793eu533a</h4>
              <ul className="space-y-2">
                <li><Link href="/forum" className="text-gray-400 hover:text-white">u6b66u53cbu8bbau575b</Link></li>
                <li><Link href="/coach-appointment" className="text-gray-400 hover:text-white">u6559u7ec3u9884u7ea6</Link></li>
                <li><Link href="/courses" className="text-gray-400 hover:text-white">u7cbeu54c1u8bfeu7a0b</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">u5173u4e8eu6211u4eec</h4>
              <ul className="space-y-2">
                <li><Link href="/settings" className="text-gray-400 hover:text-white">u5e2eu52a9u4e0eu8bbeu7f6e</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white">u8054u7cfbu6211u4eec</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>u6b66u9053u667au8bc4 {new Date().getFullYear()} u667au80fdu59ffu6001u5206u6790u7cfbu7edf - u4fddu7559u6240u6709u6743u5229</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
