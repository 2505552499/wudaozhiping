import React from 'react';
import { Row, Col, Card, Button, Statistic } from 'antd';
import { FileImageOutlined, VideoCameraOutlined, CameraOutlined, BookOutlined, TeamOutlined, ReadOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainLayout from '../components/MainLayout';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || t('common.guest');

  const featureCards = [
    {
      title: t('dashboard.features.imageAnalysis.title'),
      icon: <FileImageOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      description: t('dashboard.features.imageAnalysis.description'),
      route: '/image-analysis',
      color: '#e6f7ff',
    },
    {
      title: t('dashboard.features.videoAnalysis.title'),
      icon: <VideoCameraOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      description: t('dashboard.features.videoAnalysis.description'),
      route: '/video-analysis',
      color: '#f6ffed',
    },
    {
      title: t('dashboard.features.cameraAnalysis.title'),
      icon: <CameraOutlined style={{ fontSize: 48, color: '#fa8c16' }} />,
      description: t('dashboard.features.cameraAnalysis.description'),
      route: '/camera-analysis',
      color: '#fff7e6',
    },
    {
      title: t('dashboard.features.premiumCourses.title'),
      icon: <ReadOutlined style={{ fontSize: 48, color: '#f5222d' }} />,
      description: t('dashboard.features.premiumCourses.description'),
      route: '/courses',
      color: '#fff1f0',
    },
    {
      title: t('dashboard.features.knowledgeBase.title'),
      icon: <BookOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
      description: t('dashboard.features.knowledgeBase.description'),
      route: '/knowledge-base',
      color: '#f9f0ff',
    },
    {
      title: t('dashboard.features.coachAppointment.title'),
      icon: <TeamOutlined style={{ fontSize: 48, color: '#eb2f96' }} />,
      description: t('dashboard.features.coachAppointment.description'),
      route: '/coach-appointment',
      color: '#fff0f6',
    },
    {
      title: t('dashboard.features.forum.title'),
      icon: <TrophyOutlined style={{ fontSize: 48, color: '#faad14' }} />,
      description: t('dashboard.features.forum.description'),
      route: '/forum',
      color: '#fffbe6',
    },
  ];

  return (
    <MainLayout>
      <div style={{ padding: '20px 0' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <h1 style={{ fontSize: 28, marginBottom: 16 }}>{t('dashboard.welcome', { username })}</h1>
              <p style={{ fontSize: 16 }}>
                {t('dashboard.description')}
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
                  {t('dashboard.startUsing')}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title={t('dashboard.systemOverview')} bordered={false}>
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic title={t('dashboard.stats.supportedMoves')} value={10} suffix={t('dashboard.stats.movesUnit')} />
                </Col>
                <Col span={6}>
                  <Statistic title={t('dashboard.stats.accuracy')} value={95.8} suffix={t('dashboard.stats.accuracyUnit')} />
                </Col>
                <Col span={6}>
                  <Statistic title={t('dashboard.stats.responseTime')} value={0.8} suffix={t('dashboard.stats.timeUnit')} />
                </Col>
                <Col span={6}>
                  <Statistic title={t('dashboard.stats.systemVersion')} value="1.0.0" />
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
