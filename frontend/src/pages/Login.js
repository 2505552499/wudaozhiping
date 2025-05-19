import React, { useState, useEffect } from 'react';
import { Form, Input, Tabs, message, Radio, Card } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import GradientButton from '../components/ui/GradientButton';

const { TabPane } = Tabs;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  useEffect(() => {
    // 检查用户是否已登录
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
        // 存储令牌、用户名和角色
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        
        // 设置默认授权头
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
        // 存储令牌、用户名和角色
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        
        // 设置默认授权头
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
        // 存储令牌、用户名和角色
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        
        // 设置默认授权头
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black to-xtalpi-dark-blue py-12 px-4 sm:px-6 lg:px-8">
      {/* 背景装饰 */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-xtalpi-purple rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-xtalpi-indigo rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      {/* 返回首页按钮 */}
      <Link to="/" className="absolute top-8 left-8 flex items-center text-white hover:text-xtalpi-cyan transition-colors">
        <ArrowLeftOutlined className="mr-2" />
        <span>返回首页</span>
      </Link>
      
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-xtalpi-indigo via-xtalpi-purple to-xtalpi-cyan bg-clip-text text-transparent mb-4">
            武道智评平台
          </h1>
          <p className="text-gray-200 text-lg">专业的武术动作分析与评估系统</p>
        </div>
        
        <Card className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl overflow-hidden">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            className="login-tabs"
            centered
            tabBarStyle={{ borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}
          >
            <TabPane tab={<span className="text-white">用户登录</span>} key="login">
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
                    prefix={<UserOutlined className="text-gray-400" />} 
                    placeholder="用户名" 
                    size="large"
                    className="bg-white border-gray-300 rounded-lg py-2"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码!' }]}
                >
                  <Input
                    prefix={<LockOutlined className="text-gray-400" />}
                    type="password"
                    placeholder="密码"
                    size="large"
                    className="bg-white border-gray-300 rounded-lg py-2"
                  />
                </Form.Item>

                <Form.Item>
                  <GradientButton 
                    htmlType="submit" 
                    className="w-full py-2 text-white" 
                    loading={loading}
                  >
                    登录
                  </GradientButton>
                </Form.Item>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/70 hover:text-white transition-colors cursor-pointer text-sm">
                    忘记密码？
                  </span>
                  <span 
                    onClick={handleGuestLogin}
                    className="text-xtalpi-cyan hover:text-white transition-colors cursor-pointer text-sm"
                  >
                    游客模式
                  </span>
                </div>
              </Form>
            </TabPane>
            
            <TabPane tab={<span className="text-white">用户注册</span>} key="register">
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
                    prefix={<UserOutlined className="text-gray-400" />} 
                    placeholder="用户名 (4-20位字母数字)" 
                    size="large"
                    className="bg-white border-gray-300 rounded-lg py-2"
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
                    prefix={<LockOutlined className="text-gray-400" />}
                    type="password"
                    placeholder="密码 (至少8位)"
                    size="large"
                    className="bg-white border-gray-300 rounded-lg py-2"
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
                    prefix={<LockOutlined className="text-gray-400" />}
                    type="password"
                    placeholder="确认密码"
                    size="large"
                    className="bg-white border-gray-300 rounded-lg py-2"
                  />
                </Form.Item>
                
                <Form.Item name="role" label={<span className="text-white">注册身份</span>}>
                  <Radio.Group className="flex justify-around bg-white/30 p-3 rounded-lg border border-white/30">
                    <Radio value="user" className="text-white font-medium hover:text-xtalpi-cyan">
                      <UserOutlined className="mr-1" /> 普通用户
                    </Radio>
                    <Radio value="coach" className="text-white font-medium hover:text-xtalpi-cyan">
                      <TeamOutlined className="mr-1" /> 教练员
                    </Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item>
                  <GradientButton 
                    htmlType="submit" 
                    className="w-full py-2 text-white" 
                    loading={loading}
                  >
                    注册
                  </GradientButton>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
          <div className="text-center mt-4 text-white/80 text-sm">
            注册即表示您同意我们的 <Link to="/terms" className="text-xtalpi-cyan hover:text-white">服务条款</Link> 和 <Link to="/privacy" className="text-xtalpi-cyan hover:text-white">隐私政策</Link>
          </div>
        </Card>
        
        <div className="text-center mt-8 text-white/70 text-sm">
          © {new Date().getFullYear()} 武道智评科技有限公司. 保留所有权利.
        </div>
      </div>
    </div>
  );
};

export default Login;
