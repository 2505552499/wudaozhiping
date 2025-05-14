import React, { useState, useEffect } from 'react';
import { 
  Layout, Typography, Card, Row, Col, Button, Steps, 
  Tag, Divider, Spin, Empty, Descriptions, Timeline, message, Modal
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  // 简化认证逻辑，使用localStorage检查token
  const isAuthenticated = !!localStorage.getItem('token');
  
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userEnrollment, setUserEnrollment] = useState(null);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  
  // 加载课程详情
  const fetchCourseDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/courses/${courseId}`);
      
      if (response.data.success) {
        setCourse(response.data.data);
      } else {
        message.error(response.data.message || '获取课程详情失败');
      }
    } catch (error) {
      console.error('获取课程详情出错:', error);
      message.error('获取课程详情失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 检查用户是否已报名
  const checkUserEnrollment = async () => {
    if (!isAuthenticated) return;
    
    setCheckingEnrollment(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/courses/${courseId}/check-enrollment`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success && response.data.enrolled) {
        setUserEnrollment(response.data.enrollment);
      }
    } catch (error) {
      console.error('检查报名状态出错:', error);
    } finally {
      setCheckingEnrollment(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
      checkUserEnrollment();
    }
  }, [courseId]);
  
  // 报名课程
  const handleEnroll = async () => {
    // 检查是否已登录
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    setEnrollLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        message.success('课程报名成功');
        
        // 准备报名成功页面所需的数据
        const enrollmentData = {
          courseId: courseId,
          courseTitle: course.title,
          price: course.price,
          dateRange: course.date_range,
          location: course.location
        };
        
        // 跳转到报名成功页面
        navigate('/enrollment-success', { state: { enrollmentData } });
      } else {
        message.error(response.data.message || '课程报名失败');
      }
    } catch (error) {
      console.error('课程报名出错:', error);
      if (error.response && error.response.status === 403) {
        message.error('权限不足，请先登录');
        setShowLoginModal(true);
      } else {
        message.error('课程报名失败，请稍后重试');
      }
    } finally {
      setEnrollLoading(false);
    }
  };
  
  // 跳转到登录页面
  const goToLogin = () => {
    setShowLoginModal(false);
    navigate('/login', { state: { from: `/courses/${courseId}` } });
  };
  
  // 渲染日程安排
  const renderSchedule = () => {
    if (!course || !course.daily_schedule || course.daily_schedule.length === 0) {
      return <Empty description="暂无日程安排" />;
    }
    
    return (
      <Timeline mode="left">
        {course.daily_schedule.map((day, index) => (
          <Timeline.Item key={index} label={day.day}>
            <Card title={day.title} size="small" style={{ marginBottom: 16 }}>
              <p><strong>上午：</strong>{day.morning}</p>
              <p><strong>下午：</strong>{day.afternoon}</p>
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  };
  
  if (loading) {
    return (
      <MainLayout>
        <Content style={{ padding: '0 50px', marginTop: 20 }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280, textAlign: 'center' }}>
            <Spin size="large" />
          </div>
        </Content>
      </MainLayout>
    );
  }
  
  if (!course) {
    return (
      <MainLayout>
        <Content style={{ padding: '0 50px', marginTop: 20 }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Empty description="未找到课程信息" />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="primary" onClick={() => navigate('/courses')}>
                返回课程列表
              </Button>
            </div>
          </div>
        </Content>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={16}>
              <div>
                <Title level={2}>{course.title}</Title>
                <div>
                  <Tag color="blue">{course.type}</Tag>
                  <Tag color={course.status === '开放报名' ? 'green' : 'orange'}>
                    {course.status}
                  </Tag>
                </div>
                
                <Divider orientation="left">课程介绍</Divider>
                <Paragraph>{course.description}</Paragraph>
                
                <Divider orientation="left">课程内容</Divider>
                {course.content && course.content.length > 0 ? (
                  <ul>
                    {course.content.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <Empty description="暂无课程内容" />
                )}
                
                <Divider orientation="left">赠送内容</Divider>
                {course.benefits && course.benefits.length > 0 ? (
                  <ul>
                    {course.benefits.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <Empty description="暂无赠送内容" />
                )}
                
                <Divider orientation="left">适合人群</Divider>
                <Paragraph>{course.target_audience || '无限制'}</Paragraph>
                
                {course.contraindications && (
                  <>
                    <Divider orientation="left">禁忌人群</Divider>
                    <Paragraph>{course.contraindications}</Paragraph>
                  </>
                )}
                
                <Divider orientation="left">课程日程</Divider>
                {renderSchedule()}
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <Card title="课程信息" bordered={false}>
                <Descriptions column={1}>
                  <Descriptions.Item label="课程费用">
                    <Text type="danger" strong style={{ fontSize: 20 }}>
                      ¥{course.price}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="课程时长">
                    {course.duration}
                  </Descriptions.Item>
                  {course.date_range && (
                    <Descriptions.Item label="日期">
                      {course.date_range}
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="课程地点">
                    {course.location || '待定'}
                  </Descriptions.Item>
                  <Descriptions.Item label="报名人数">
                    {course.current_participants}/{course.max_participants}
                  </Descriptions.Item>
                </Descriptions>
                
                <div style={{ marginTop: 16 }}>
                  {userEnrollment ? (
                    <div>
                      <Tag color="green" style={{ fontSize: 16, padding: '5px 10px', marginBottom: 10 }}>
                        您已报名此课程 - {userEnrollment.status}
                      </Tag>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="报名时间">
                          {userEnrollment.enrollment_date}
                        </Descriptions.Item>
                        <Descriptions.Item label="付款方式">
                          {userEnrollment.payment_method}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  ) : (
                    <Button 
                      type="primary" 
                      block 
                      size="large"
                      loading={enrollLoading || checkingEnrollment}
                      disabled={course.status !== '开放报名'}
                      onClick={handleEnroll}
                    >
                      {course.status === '开放报名' ? '立即报名' : '报名已结束'}
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      
      {/* 登录提示模态框 */}
      <Modal
        title="需要登录"
        open={showLoginModal}
        onCancel={() => setShowLoginModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowLoginModal(false)}>
            取消
          </Button>,
          <Button key="login" type="primary" onClick={goToLogin}>
            去登录
          </Button>
        ]}
      >
        <p>您需要登录后才能报名课程。</p>
      </Modal>
    </MainLayout>
  );
}

export default CourseDetail;
