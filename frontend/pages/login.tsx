import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Form, Input, Checkbox, message } from 'antd';
import GradientButton from '../components/ui/GradientButton';
import LocaleSwitcher from '../components/ui/LocaleSwitcher';

const Login: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      // 实际项目需替换为真正的API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟成功登录
      localStorage.setItem('token', 'sample-token');
      localStorage.setItem('username', values.username);
      localStorage.setItem('role', 'user');
      
      message.success('登录成功');
      router.push('/');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>登录 - 武道智评</title>
        <meta name="description" content="登录武道智评平台，体验专业的武术动作分析与评估" />
      </Head>
      
      <div className="min-h-screen flex">
        {/* 左侧登录表单 */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* 顶部导航 */}
            <div className="flex justify-between items-center mb-10">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-gray-800">武道智评</span>
              </Link>
              <LocaleSwitcher />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-2 text-gray-800">欢迎回来</h1>
              <p className="text-gray-600 mb-8">请登录您的账户，继续您的武术分析之旅</p>
              
              <Form
                form={form}
                layout="vertical"
                onFinish={handleLogin}
                autoComplete="off"
              >
                <Form.Item
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: '请输入您的用户名' }]}
                >
                  <Input size="large" placeholder="请输入用户名" className="rounded-lg" />
                </Form.Item>
                
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[{ required: true, message: '请输入您的密码' }]}
                >
                  <Input.Password size="large" placeholder="请输入密码" className="rounded-lg" />
                </Form.Item>
                
                <div className="flex justify-between items-center mb-6">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>记住我</Checkbox>
                  </Form.Item>
                  
                  <Link href="/forgot-password" className="text-xtalpi-indigo hover:underline text-sm">
                    忘记密码？
                  </Link>
                </div>
                
                <Form.Item>
                  <GradientButton 
                    className="w-full py-3 text-lg"
                    onClick={() => form.submit()}
                  >
                    {loading ? '登录中...' : '登录'}
                  </GradientButton>
                </Form.Item>
                
                <div className="text-center mt-4">
                  <span className="text-gray-600">还没有账户？</span>
                  <Link href="/register" className="text-xtalpi-indigo hover:underline ml-2">
                    立即注册
                  </Link>
                </div>
              </Form>
            </motion.div>
          </div>
        </div>
        
        {/* 右侧装饰图 */}
        <div className="hidden md:block md:w-1/2 relative bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-white blur-3xl opacity-30"></div>
            <div className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full bg-white blur-3xl opacity-20"></div>
          </div>
          
          <div className="relative h-full flex flex-col justify-center items-center p-12 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center max-w-md"
            >
              <h2 className="text-3xl font-bold mb-6">智能武术分析平台</h2>
              <p className="text-lg mb-8">
                专业的武术姿态评估和分析系统，帮助您实现技术突破，提升武术水平
              </p>
              
              <div className="flex justify-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center w-28">
                  <div className="text-2xl font-bold">5000+</div>
                  <div className="text-sm">活跃用户</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center w-28">
                  <div className="text-2xl font-bold">15K+</div>
                  <div className="text-sm">动作分析</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center w-28">
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-sm">专业教练</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
