import React from 'react';
import { Row, Col, Card, Button, Statistic } from 'antd';
import { FileImageOutlined, VideoCameraOutlined, CameraOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

const Dashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '游客';

  const featureCards = [
    {
      title: '图像分析',
      icon: <FileImageOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      description: '上传武术动作图片，系统将自动识别动作姿态，并提供评分和改进建议。',
      route: '/image-analysis',
      color: '#e6f7ff',
    },
    {
      title: '视频分析',
      icon: <VideoCameraOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      description: '上传武术动作视频，系统将分析整个动作序列，提供全面评估。',
      route: '/video-analysis',
      color: '#f6ffed',
    },
    {
      title: '摄像头分析',
      icon: <CameraOutlined style={{ fontSize: 48, color: '#fa8c16' }} />,
      description: '通过摄像头实时采集动作，立即分析评估您的武术姿态，提供及时反馈。',
      route: '/camera-analysis',
      color: '#fff7e6',
    },
    {
      title: '武术知识库',
      icon: <BookOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
      description: '浏览各种武术动作的标准姿势、要点和技巧，提高您的武术水平。',
      route: '/knowledge-base',
      color: '#f9f0ff',
    },
    {
      title: '教练预约',
      icon: <TeamOutlined style={{ fontSize: 48, color: '#eb2f96' }} />,
      description: '预约专业武术教练进行一对一指导，提升训练效果，获得个性化指导。',
      route: '/coach-appointment',
      color: '#fff0f6',
    },
  ];

  return (
    <MainLayout>
      <div style={{ padding: '20px 0' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <h1 style={{ fontSize: 28, marginBottom: 16 }}>欢迎使用武道智评系统，{username}！</h1>
              <p style={{ fontSize: 16 }}>
                武道智评是一款专业的武术姿态分析系统，通过先进的计算机视觉技术，帮助您提升武术技能。
                选择下方功能开始您的武术之旅！
              </p>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {featureCards.map((card, index) => (
            <Col xs={24} sm={12} lg={index === 4 ? 24 : 6} key={index}>
              <Card
                hoverable
                style={{ 
                  height: '100%', 
                  backgroundColor: card.color,
                  borderRadius: 8,
                  overflow: 'hidden'
                }}
                bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  {card.icon}
                  <h2 style={{ marginTop: 8 }}>{card.title}</h2>
                </div>
                <p style={{ flex: 1 }}>{card.description}</p>
                <Button 
                  type="primary" 
                  size="large" 
                  block
                  onClick={() => navigate(card.route)}
                >
                  开始使用
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="系统概览" bordered={false}>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic title="支持的武术动作" value={10} suffix="种" />
                </Col>
                <Col span={6}>
                  <Statistic title="分析精度" value={95.8} suffix="%" />
                </Col>
                <Col span={6}>
                  <Statistic title="响应时间" value={0.8} suffix="秒" />
                </Col>
                <Col span={6}>
                  <Statistic title="系统版本" value="1.0.0" />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
