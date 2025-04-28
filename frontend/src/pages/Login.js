import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tabs, Card, message, Radio } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const { TabPane } = Tabs;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/login`, values);
      
      if (response.data.success) {
        // Store the token, username and role
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        
        message.success(response.data.message);
        
        // 根据角色导航到不同页面
        if (response.data.role === 'coach') {
          navigate('/coach-dashboard');
        } else {
          navigate('/');
        }
      } else {
        message.error(response.data.message || '登录失败');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // 从表单值中移除confirmPassword
      const { confirmPassword, ...registerData } = values;
      
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/register`, registerData);
      
      if (response.data.success) {
        // Store the token, username and role
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        
        message.success(response.data.message);
        
        // 根据角色导航到不同页面
        if (response.data.role === 'coach') {
          navigate('/coach-dashboard');
        } else {
          navigate('/');
        }
      } else {
        message.error(response.data.message || '注册失败');
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error.response?.data?.message || '注册失败，请检查输入');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/login`, { username: 'guest', password: 'guest' });
      
      if (response.data.success) {
        // Store the token, username and role
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        
        message.success('游客登录成功');
        navigate('/');
      } else {
        message.error(response.data.message || '游客登录失败');
      }
    } catch (error) {
      console.error('Guest login error:', error);
      message.error('游客登录失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card 
        style={{ width: 400 }}
        title={
          <div style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', color: '#c62828' }}>
            武道智评
          </div>
        }
        headStyle={{ borderBottom: '2px solid #c62828' }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
          <TabPane tab="用户登录" key="login">
            <Form
              name="login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名" 
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="密码"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="login-form-button" 
                  loading={loading}
                  size="large"
                  block
                >
                  登录
                </Button>
              </Form.Item>
              
              <Form.Item>
                <Button 
                  onClick={handleGuestLogin} 
                  loading={loading}
                  size="large"
                  block
                >
                  游客模式
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="用户注册" key="register">
            <Form
              name="register"
              className="login-form"
              onFinish={handleRegister}
              initialValues={{ role: 'user' }}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名!' },
                  { min: 4, max: 20, message: '用户名长度必须在4-20个字符之间!' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名 (4-20位字母数字)" 
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码!' },
                  { min: 8, message: '密码长度至少为8个字符!' }
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="密码 (至少8位)"
                  size="large"
                />
              </Form.Item>
              
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致!'));
                    },
                  }),
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="确认密码"
                  size="large"
                />
              </Form.Item>
              
              <Form.Item name="role" label="注册身份">
                <Radio.Group>
                  <Radio value="user">
                    <UserOutlined /> 普通用户
                  </Radio>
                  <Radio value="coach">
                    <TeamOutlined /> 教练员
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="login-form-button" 
                  loading={loading}
                  size="large"
                  block
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
