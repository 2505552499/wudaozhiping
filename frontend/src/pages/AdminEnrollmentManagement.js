import React, { useState, useEffect } from 'react';
import { 
  Layout, Typography, Table, Tag, Button, Space, 
  message, Modal, Select, Input, Card, Statistic, Row, Col, Divider 
} from 'antd';
import { SearchOutlined, FilterOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { API_BASE_URL } from '../config';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

function AdminEnrollmentManagement() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [statistics, setStatistics] = useState({
    total: 0,
    registered: 0,
    paid: 0,
    cancelled: 0
  });
  
  // 加载报名数据
  const loadEnrollments = async (courseId = '') => {
    setLoading(true);
    try {
      let url = `${API_BASE_URL}/api/admin/enrollments`;
      if (courseId) {
        url = `${API_BASE_URL}/api/admin/courses/${courseId}/enrollments`;
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          status: statusFilter,
          username: searchText
        }
      });
      
      if (response.data.success) {
        if (courseId) {
          setEnrollments(response.data.data.enrollments);
          // 更新统计信息
          const enrollmentData = response.data.data.enrollments;
          updateStatistics(enrollmentData);
        } else {
          setEnrollments(response.data.data);
          // 更新统计信息
          updateStatistics(response.data.data);
        }
      } else {
        message.error(response.data.message || '加载报名数据失败');
      }
    } catch (error) {
      console.error('加载报名数据出错:', error);
      if (error.response && error.response.status === 403) {
        message.error('权限不足，请确认您是管理员');
        navigate('/login');
      } else {
        message.error('加载报名数据失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 加载课程数据
  const loadCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setCourses(response.data.data);
      } else {
        message.error(response.data.message || '加载课程数据失败');
      }
    } catch (error) {
      console.error('加载课程数据出错:', error);
      message.error('加载课程数据失败，请稍后重试');
    }
  };
  
  // 更新报名状态
  const updateEnrollmentStatus = async (enrollmentId, newStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/enrollments/${enrollmentId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        message.success('报名状态更新成功');
        // 重新加载数据
        loadEnrollments(selectedCourse);
      } else {
        message.error(response.data.message || '更新报名状态失败');
      }
    } catch (error) {
      console.error('更新报名状态出错:', error);
      message.error('更新报名状态失败，请稍后重试');
    }
  };
  
  // 确认更新报名状态
  const confirmUpdateStatus = (enrollmentId, currentStatus, newStatus) => {
    let confirmMessage = '';
    
    if (newStatus === '已付款') {
      confirmMessage = '确认该学员已完成付款？';
    } else if (newStatus === '已取消') {
      confirmMessage = '确认取消该学员的报名？这将减少课程的报名人数。';
    }
    
    Modal.confirm({
      title: '确认操作',
      content: confirmMessage,
      okText: '确认',
      cancelText: '取消',
      onOk: () => updateEnrollmentStatus(enrollmentId, newStatus)
    });
  };
  
  // 更新统计信息
  const updateStatistics = (data) => {
    const stats = {
      total: data.length,
      registered: data.filter(e => e.status === '已报名').length,
      paid: data.filter(e => e.status === '已付款').length,
      cancelled: data.filter(e => e.status === '已取消').length
    };
    setStatistics(stats);
  };
  
  // 处理课程选择变化
  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    loadEnrollments(value);
  };
  
  // 处理状态筛选变化
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    // 重新加载数据
    setTimeout(() => {
      loadEnrollments(selectedCourse);
    }, 100);
  };
  
  // 处理搜索
  const handleSearch = () => {
    loadEnrollments(selectedCourse);
  };
  
  // 初始化
  useEffect(() => {
    loadCourses();
    loadEnrollments();
  }, []);
  
  // 表格列定义
  const columns = [
    {
      title: '报名ID',
      dataIndex: 'id',
      key: 'id',
      ellipsis: true,
      width: 100
    },
    {
      title: '课程名称',
      dataIndex: 'course_title',
      key: 'course_title',
    },
    {
      title: '学员',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: price => `¥${price}`
    },
    {
      title: '报名日期',
      dataIndex: 'enrollment_date',
      key: 'enrollment_date',
      sorter: (a, b) => new Date(a.enrollment_date) - new Date(b.enrollment_date)
    },
    {
      title: '付款方式',
      dataIndex: 'payment_method',
      key: 'payment_method',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'blue';
        if (status === '已付款') {
          color = 'green';
        } else if (status === '已取消') {
          color = 'red';
        }
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === '已报名' && (
            <>
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckCircleOutlined />}
                onClick={() => confirmUpdateStatus(record.id, record.status, '已付款')}
              >
                标记已付款
              </Button>
              <Button 
                danger 
                size="small" 
                icon={<CloseCircleOutlined />}
                onClick={() => confirmUpdateStatus(record.id, record.status, '已取消')}
              >
                取消报名
              </Button>
            </>
          )}
          {record.status === '已付款' && (
            <Button 
              danger 
              size="small" 
              icon={<CloseCircleOutlined />}
              onClick={() => confirmUpdateStatus(record.id, record.status, '已取消')}
            >
              取消报名
            </Button>
          )}
          {record.status === '已取消' && (
            <Button 
              type="primary" 
              size="small" 
              icon={<CheckCircleOutlined />}
              onClick={() => confirmUpdateStatus(record.id, record.status, '已报名')}
            >
              恢复报名
            </Button>
          )}
        </Space>
      )
    }
  ];
  
  return (
    <MainLayout>
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Title level={2}>课程报名管理</Title>
          
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总报名人数"
                  value={statistics.total}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已报名"
                  value={statistics.registered}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已付款"
                  value={statistics.paid}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已取消"
                  value={statistics.cancelled}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>
          
          <div style={{ marginBottom: 16 }}>
            <Space size="large">
              <div>
                <Text strong>选择课程：</Text>
                <Select
                  style={{ width: 300 }}
                  placeholder="选择课程查看报名情况"
                  onChange={handleCourseChange}
                  allowClear
                >
                  {courses.map(course => (
                    <Option key={course.id} value={course.id}>
                      {course.title}
                    </Option>
                  ))}
                </Select>
              </div>
              
              <div>
                <Text strong>状态筛选：</Text>
                <Select
                  style={{ width: 120 }}
                  placeholder="状态"
                  onChange={handleStatusFilterChange}
                  allowClear
                >
                  <Option value="已报名">已报名</Option>
                  <Option value="已付款">已付款</Option>
                  <Option value="已取消">已取消</Option>
                </Select>
              </div>
              
              <div>
                <Input
                  placeholder="搜索学员"
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  style={{ width: 200 }}
                  prefix={<SearchOutlined />}
                  onPressEnter={handleSearch}
                />
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  onClick={handleSearch}
                  style={{ marginLeft: 8 }}
                >
                  搜索
                </Button>
              </div>
            </Space>
          </div>
          
          <Divider />
          
          <Table
            columns={columns}
            dataSource={enrollments}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Content>
    </MainLayout>
  );
}

export default AdminEnrollmentManagement;
