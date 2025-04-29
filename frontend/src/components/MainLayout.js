import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, message, Badge } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  CameraOutlined,
  BookOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  MessageOutlined,
  BellOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import { messageAPI } from '../api';

const { Header, Content, Footer } = Layout;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('游客');
  const [role, setRole] = useState('user');
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedRole) {
      setRole(storedRole);
    }
    
    // 获取未读消息数量
    fetchUnreadMessages();
    
    // 每30秒检查一次新消息
    const messageInterval = setInterval(fetchUnreadMessages, 30000);
    
    // 添加自定义事件监听器，当消息已读状态变化时更新未读消息计数
    const handleUnreadMessagesChanged = () => {
      fetchUnreadMessages();
    };
    
    window.addEventListener('unreadMessagesChanged', handleUnreadMessagesChanged);
    
    return () => {
      clearInterval(messageInterval);
      window.removeEventListener('unreadMessagesChanged', handleUnreadMessagesChanged);
    };
  }, []);
  
  // 获取未读消息数量
  const fetchUnreadMessages = async () => {
    try {
      const response = await messageAPI.getUserMessages();
      if (response.data.success) {
        // 只统计发给当前用户且未读的消息
        const currentUser = localStorage.getItem('username');
        const unreadCount = response.data.messages.filter(
          msg => msg.receiver_id === currentUser && !msg.read
        ).length;
        setUnreadMessages(unreadCount);
      }
    } catch (error) {
      console.error('获取未读消息失败:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    message.success('已成功退出登录');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'username',
      disabled: true,
      icon: <UserOutlined />,
      label: username
    },
    {
      key: 'role',
      disabled: true,
      icon: role === 'coach' ? <TeamOutlined /> : <UserOutlined />,
      label: role === 'coach' ? '教练员' : '普通用户'
    },
    {
      type: 'divider'
    },
    {
      key: 'messages',
      icon: <MessageOutlined />,
      label: (
        <span>
          消息中心
          {unreadMessages > 0 && (
            <Badge count={unreadMessages} style={{ marginLeft: 8 }} />
          )}
        </span>
      ),
      onClick: () => navigate('/messages')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ];

  // 根据用户角色生成不同的菜单项
  const getMenuItems = () => {
    const commonItems = [
      {
        key: '/',
        icon: <HomeOutlined />,
        label: '首页',
      },
      {
        key: '/image-analysis',
        icon: <FileImageOutlined />,
        label: '图像分析',
      },
      {
        key: '/video-analysis',
        icon: <VideoCameraOutlined />,
        label: '视频分析',
      },
      {
        key: '/camera-analysis',
        icon: <CameraOutlined />,
        label: '摄像头分析',
      },
      {
        key: '/knowledge-base',
        icon: <BookOutlined />,
        label: '武术知识库',
      }
    ];
    
    // 管理员特有的菜单项
    if (role === 'admin') {
      commonItems.push({
        key: '/admin-review',
        icon: <TeamOutlined />,
        label: '预约审核',
      });
    }
    // 教练特有的菜单项
    else if (role === 'coach') {
      commonItems.push({
        key: '/coach-dashboard',
        icon: <TeamOutlined />,
        label: '教练管理',
      });
      commonItems.push({
        key: '/coach-appointment-create',
        icon: <MessageOutlined />,
        label: '发布预约',
      });
    } 
    // 普通用户特有的菜单项
    else {
      commonItems.push({
        key: '/coach-appointment',
        icon: <TeamOutlined />,
        label: '教练预约',
      });
    }
    
    // 通用设置菜单项
    commonItems.push({
      key: '/settings',
      icon: <SettingOutlined />,
      label: '帮助与设置',
    });
    
    return commonItems;
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo">武道智评</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
          onClick={e => navigate(e.key)}
          style={{ flex: 1 }}
        />
        <Button 
          type="text" 
          icon={
            <Badge count={unreadMessages} size="small">
              <BellOutlined style={{ color: 'white', fontSize: 16 }} />
            </Badge>
          } 
          onClick={() => navigate('/messages')}
          style={{ marginRight: 8 }}
        />
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Button type="text" style={{ color: 'white' }}>
            <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
            {username}
          </Button>
        </Dropdown>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content" style={{ margin: '16px 0' }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        武道智评 {new Date().getFullYear()} 智能姿态分析系统
      </Footer>
    </Layout>
  );
};

// 添加 PropTypes 验证
MainLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default MainLayout;
