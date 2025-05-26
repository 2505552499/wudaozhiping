import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, message, Descriptions, Divider, Row, Col, Statistic } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined, UploadOutlined, TrophyOutlined, CalendarOutlined, BookOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import api from '../api';

const UserProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    phone: '',
    avatar: '',
    role: 'user',
    created_at: '',
    last_login: ''
  });
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    enrolledCourses: 0,
    forumPosts: 0
  });

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // 从localStorage获取基本信息
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      
      setUserInfo(prev => ({
        ...prev,
        username: username || '',
        role: role || 'user'
      }));

      // 这里可以调用API获取更详细的用户信息
      // const response = await api.get('/api/user/profile');
      // setUserInfo(response.data);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      message.error('获取用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // 获取用户统计数据
      // const response = await api.get('/api/user/stats');
      // setStats(response.data);
      
      // 模拟数据
      setStats({
        totalAppointments: 5,
        completedAppointments: 3,
        enrolledCourses: 2,
        forumPosts: 8
      });
    } catch (error) {
      console.error('获取用户统计失败:', error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue(userInfo);
  };

  const handleSave = async (values) => {
    try {
      setLoading(true);
      // 这里调用API更新用户信息
      // await api.put('/api/user/profile', values);
      
      setUserInfo(prev => ({ ...prev, ...values }));
      setEditing(false);
      message.success('个人信息更新成功');
    } catch (error) {
      console.error('更新用户信息失败:', error);
      message.error('更新用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'done') {
      message.success('头像上传成功');
      setUserInfo(prev => ({ ...prev, avatar: info.file.response.url }));
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return '管理员';
      case 'coach':
        return '教练';
      default:
        return '普通用户';
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          {/* 用户基本信息 */}
          <Col xs={24} lg={8}>
            <Card title="个人信息" extra={
              !editing ? (
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                  编辑
                </Button>
              ) : null
            }>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar
                  size={100}
                  src={userInfo.avatar}
                  icon={<UserOutlined />}
                  style={{ marginBottom: 16 }}
                />
                {editing && (
                  <Upload
                    name="avatar"
                    action="/api/upload/avatar"
                    headers={{
                      authorization: `Bearer ${localStorage.getItem('token')}`,
                    }}
                    onChange={handleAvatarUpload}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />} size="small">
                      更换头像
                    </Button>
                  </Upload>
                )}
              </div>

              {editing ? (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSave}
                  initialValues={userInfo}
                >
                  <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="手机号"
                    rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                      保存
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                      取消
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
                  <Descriptions.Item label="角色">{getRoleText(userInfo.role)}</Descriptions.Item>
                  <Descriptions.Item label="邮箱">{userInfo.email || '未设置'}</Descriptions.Item>
                  <Descriptions.Item label="手机号">{userInfo.phone || '未设置'}</Descriptions.Item>
                </Descriptions>
              )}
            </Card>
          </Col>

          {/* 用户统计 */}
          <Col xs={24} lg={16}>
            <Card title="我的统计">
              <Row gutter={16}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="总预约数"
                    value={stats.totalAppointments}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="完成预约"
                    value={stats.completedAppointments}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="报名课程"
                    value={stats.enrolledCourses}
                    prefix={<BookOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="论坛发帖"
                    value={stats.forumPosts}
                    prefix={<EditOutlined />}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="快速操作" style={{ marginTop: 24 }}>
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Button type="primary" block onClick={() => window.location.href = '/coach-appointment'}>
                    预约教练
                  </Button>
                </Col>
                <Col xs={24} sm={8}>
                  <Button block onClick={() => window.location.href = '/courses'}>
                    浏览课程
                  </Button>
                </Col>
                <Col xs={24} sm={8}>
                  <Button block onClick={() => window.location.href = '/forum'}>
                    访问论坛
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default UserProfile;
