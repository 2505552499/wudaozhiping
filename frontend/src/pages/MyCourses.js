import React, { useState, useEffect } from 'react';
import { Card, List, Button, Progress, Tag, Empty, Spin, Row, Col, Statistic, Tabs } from 'antd';
import { PlayCircleOutlined, BookOutlined, ClockCircleOutlined, CheckCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import api from '../api';

const { TabPane } = Tabs;

const MyCourses = () => {
  const [loading, setLoading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('enrolled');
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    totalCompleted: 0,
    totalHours: 0,
    averageProgress: 0
  });

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      // 这里调用API获取用户的课程数据
      // const response = await api.get('/api/user/courses');
      
      // 模拟数据
      const mockEnrolledCourses = [
        {
          id: 1,
          title: '太极拳基础入门',
          instructor: '李师傅',
          progress: 65,
          totalLessons: 20,
          completedLessons: 13,
          duration: '2小时',
          level: '初级',
          category: '太极拳',
          enrollDate: '2024-01-15',
          lastStudied: '2024-01-20',
          thumbnail: '/img/taiji-basic.jpg'
        },
        {
          id: 2,
          title: '咏春拳实战技巧',
          instructor: '王教练',
          progress: 30,
          totalLessons: 15,
          completedLessons: 5,
          duration: '1.5小时',
          level: '中级',
          category: '咏春拳',
          enrollDate: '2024-01-10',
          lastStudied: '2024-01-18',
          thumbnail: '/img/wingchun-combat.jpg'
        }
      ];

      const mockCompletedCourses = [
        {
          id: 3,
          title: '武术基本功训练',
          instructor: '张师傅',
          progress: 100,
          totalLessons: 10,
          completedLessons: 10,
          duration: '1小时',
          level: '初级',
          category: '基本功',
          enrollDate: '2023-12-01',
          completedDate: '2023-12-25',
          certificate: true,
          thumbnail: '/img/basic-training.jpg'
        }
      ];

      setEnrolledCourses(mockEnrolledCourses);
      setCompletedCourses(mockCompletedCourses);

      // 计算统计数据
      const totalEnrolled = mockEnrolledCourses.length;
      const totalCompleted = mockCompletedCourses.length;
      const totalHours = (mockEnrolledCourses.length + mockCompletedCourses.length) * 1.5; // 假设平均1.5小时
      const averageProgress = mockEnrolledCourses.reduce((sum, course) => sum + course.progress, 0) / mockEnrolledCourses.length || 0;

      setStats({
        totalEnrolled,
        totalCompleted,
        totalHours,
        averageProgress: Math.round(averageProgress)
      });

    } catch (error) {
      console.error('获取课程数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case '初级':
        return 'green';
      case '中级':
        return 'orange';
      case '高级':
        return 'red';
      default:
        return 'blue';
    }
  };

  const continueLearning = (courseId) => {
    // 跳转到课程学习页面
    window.location.href = `/courses/${courseId}`;
  };

  const downloadCertificate = (courseId) => {
    // 下载证书逻辑
    console.log('下载证书:', courseId);
  };

  const renderCourseCard = (course, isCompleted = false) => (
    <List.Item key={course.id}>
      <Card
        hoverable
        style={{ width: '100%' }}
        cover={
          <div style={{ height: 200, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </div>
        }
        actions={[
          isCompleted ? (
            course.certificate ? (
              <Button type="primary" icon={<TrophyOutlined />} onClick={() => downloadCertificate(course.id)}>
                下载证书
              </Button>
            ) : (
              <Button disabled>已完成</Button>
            )
          ) : (
            <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => continueLearning(course.id)}>
              继续学习
            </Button>
          )
        ]}
      >
        <Card.Meta
          title={course.title}
          description={
            <div>
              <p>讲师: {course.instructor}</p>
              <p>
                <Tag color={getLevelColor(course.level)}>{course.level}</Tag>
                <Tag>{course.category}</Tag>
              </p>
              {!isCompleted && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>学习进度</span>
                    <span>{course.completedLessons}/{course.totalLessons} 课时</span>
                  </div>
                  <Progress percent={course.progress} size="small" />
                </div>
              )}
              <p style={{ marginTop: 8, color: '#666' }}>
                <ClockCircleOutlined /> {course.duration} | 
                {isCompleted ? ` 完成于: ${course.completedDate}` : ` 最后学习: ${course.lastStudied}`}
              </p>
            </div>
          }
        />
      </Card>
    </List.Item>
  );

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="在学课程"
                value={stats.totalEnrolled}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="已完成"
                value={stats.totalCompleted}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="学习时长"
                value={stats.totalHours}
                suffix="小时"
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="平均进度"
                value={stats.averageProgress}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 课程列表 */}
        <Card title="我的课程">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`在学课程 (${enrolledCourses.length})`} key="enrolled">
              <Spin spinning={loading}>
                {enrolledCourses.length > 0 ? (
                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 2,
                      md: 2,
                      lg: 3,
                      xl: 3,
                      xxl: 4,
                    }}
                    dataSource={enrolledCourses}
                    renderItem={(course) => renderCourseCard(course, false)}
                  />
                ) : (
                  <Empty
                    description="暂无在学课程"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button type="primary" onClick={() => window.location.href = '/courses'}>
                      浏览课程
                    </Button>
                  </Empty>
                )}
              </Spin>
            </TabPane>
            
            <TabPane tab={`已完成 (${completedCourses.length})`} key="completed">
              <Spin spinning={loading}>
                {completedCourses.length > 0 ? (
                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 2,
                      md: 2,
                      lg: 3,
                      xl: 3,
                      xxl: 4,
                    }}
                    dataSource={completedCourses}
                    renderItem={(course) => renderCourseCard(course, true)}
                  />
                ) : (
                  <Empty
                    description="暂无已完成课程"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </Spin>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MyCourses;
