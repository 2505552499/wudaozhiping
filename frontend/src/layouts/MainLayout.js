import React, { useState, useEffect } from 'react';
import { Layout, Menu, Badge, Avatar, Dropdown, message } from 'antd';
import { 
  UserOutlined, 
  HomeOutlined, 
  CalendarOutlined, 
  MessageOutlined, 
  LogoutOutlined, 
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  // 获取用户信息和未读消息数
  useEffect(() => {
    // 从本地存储获取用户信息
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    if (username) {
      // 设置当前用户信息
      setCurrentUser({
        name: username,
        role: role || 'user'
      });
      console.log('已设置用户信息:', username, role);
    } else {
      console.log('未找到用户信息');
    }

    // 获取未读消息数量
    fetchUnreadMessagesCount();
  }, []);

  // 获取未读消息数量
  const fetchUnreadMessagesCount = async () => {
    try {
      // 模拟API调用
      setTimeout(() => {
        setUnreadMessages(5); // 假设有5条未读消息
      }, 1000);
    } catch (error) {
      console.error('获取未读消息数量失败', error);
    }
  };

  // 处理用户菜单点击
  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      // 处理登出
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      message.success('已成功退出登录');
      setCurrentUser(null);
      navigate('/login');
    } else if (key === 'profile') {
      navigate('/profile');
    } else if (key === 'settings') {
      navigate('/settings');
    }
  };

  // 用户下拉菜单
  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        个人资料
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        position: 'fixed', 
        zIndex: 1, 
        width: '100%', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          武道智评
        </div>
        
        <Menu 
          theme="dark" 
          mode="horizontal" 
          selectedKeys={[location.pathname]} 
          style={{ flex: 1, marginLeft: 30 }}
        >
          <Menu.Item key="/" icon={<HomeOutlined />} onClick={() => navigate('/')}>
            首页
          </Menu.Item>
          <Menu.Item key="/coach-appointment" icon={<CalendarOutlined />} onClick={() => navigate('/coach-appointment')}>
            教练预约
          </Menu.Item>
          <Menu.Item 
            key="/messages" 
            icon={
              <Badge count={unreadMessages} size="small">
                <MessageOutlined />
              </Badge>
            } 
            onClick={() => navigate('/messages')}
          >
            消息中心
          </Menu.Item>
        </Menu>
        
        <div>
          {currentUser ? (
            <Dropdown overlay={userMenu} trigger={['click']}>
              <div style={{ cursor: 'pointer', color: 'white' }}>
                <Avatar icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>{currentUser.name || '用户'}</span>
              </div>
            </Dropdown>
          ) : (
            <div>
              <span 
                style={{ color: 'white', cursor: 'pointer' }} 
                onClick={() => navigate('/login')}
              >
                登录
              </span>
              <span style={{ color: 'white', margin: '0 8px' }}>|</span>
              <span 
                style={{ color: 'white', cursor: 'pointer' }} 
                onClick={() => navigate('/register')}
              >
                注册
              </span>
            </div>
          )}
        </div>
      </Header>
      
      <Content style={{ marginTop: 64 }}>
        {children}
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        武道智评 ©{new Date().getFullYear()} 创建
      </Footer>
    </Layout>
  );
}

export default MainLayout;
