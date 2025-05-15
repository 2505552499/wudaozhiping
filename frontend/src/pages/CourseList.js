import React, { useState, useEffect } from 'react';
import { 
  Layout, Typography, Card, Row, Col, Button, Select, 
  Tag, Divider, Spin, Empty, Tabs, message, Space
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { ReadOutlined, PlusOutlined } from '@ant-design/icons';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 课程类型选项
const courseTypes = [
  { key: 'all', label: '全部课程' },
  { key: '公开课', label: '公开课' },
  { key: '私人课程', label: '私人课程' },
  { key: '太极精品班', label: '太极精品班' },
  { key: '防身术精品班', label: '防身术精品班' }
];

function CourseList() {
  const navigate = useNavigate();
  
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // 加载课程数据
  const fetchCourses = async (type = null) => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/courses`;
      if (type && type !== 'all') {
        url += `?type=${encodeURIComponent(type)}`;
      }
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        setCourses(response.data.data);
      } else {
        message.error(response.data.message || '获取课程数据失败');
      }
    } catch (error) {
      console.error('获取课程数据出错:', error);
      message.error('获取课程数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    fetchCourses();
    
    // 检查是否为管理员
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
  }, []);
  
  // 切换标签页
  const handleTabChange = (key) => {
    setActiveTab(key);
    fetchCourses(key === 'all' ? null : key);
  };
  
  // 查看课程详情
  const viewCourseDetail = (courseId) => {
    navigate(`/courses/${courseId}`);
  };
  
  // 渲染课程卡片
  const renderCourseCard = (course) => {
    return (
      <Col xs={24} sm={12} md={8} lg={6} key={course.id} style={{ marginBottom: 16 }}>
        <Card
          hoverable
          cover={
            <div style={{ height: 200, overflow: 'hidden' }}>
              <img 
                alt={course.title} 
                src={course.cover_image || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22400%22%20viewBox%3D%220%200%20600%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22600%22%20height%3D%22400%22%20fill%3D%22%235470c6%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%22200%22%20fill%3D%22%23ffffff%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2236%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E%E8%AF%BE%E7%A8%8B%E5%9B%BE%E7%89%87%3C%2Ftext%3E%3C%2Fsvg%3E'} 
                style={{ width: '100%', objectFit: 'cover' }}
              />
            </div>
          }
          actions={[
            <Button type="primary" onClick={() => viewCourseDetail(course.id)}>
              查看详情
            </Button>
          ]}
        >
          <Card.Meta
            title={course.title}
            description={
              <div>
                <Tag color="blue">{course.type}</Tag>
                <Tag color="green">{course.status}</Tag>
                <Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: 8 }}>
                  {course.description}
                </Paragraph>
                <div style={{ marginTop: 8 }}>
                  <Text type="danger" strong>¥{course.price}</Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    {course.duration} {course.date_range ? `(${course.date_range})` : ''}
                  </Text>
                </div>
              </div>
            }
          />
        </Card>
      </Col>
    );
  };
  
  return (
    <MainLayout>
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Title level={2}>精品课程</Title>
            {isAdmin && (
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => navigate('/admin/courses')}
                >
                  课程管理
                </Button>
              </Space>
            )}
          </div>
          <Divider />
          
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            {courseTypes.map(type => (
              <TabPane tab={type.label} key={type.key}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: 50 }}>
                    <Spin size="large" />
                  </div>
                ) : courses.length > 0 ? (
                  <Row gutter={16}>
                    {courses.map(course => renderCourseCard(course))}
                  </Row>
                ) : (
                  <Empty description="暂无课程" />
                )}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </Content>
    </MainLayout>
  );
}

export default CourseList;
