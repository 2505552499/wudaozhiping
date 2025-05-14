import React, { useState, useEffect } from 'react';
import { 
  Layout, Typography, Table, Button, Space, Modal, Form, 
  Input, InputNumber, Select, message, Tabs, Upload, Divider,
  Popconfirm, Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import MainLayout from '../layouts/MainLayout';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 课程类型选项
const courseTypes = [
  { value: '公开课', label: '公开课' },
  { value: '私人课程', label: '私人课程' },
  { value: '太极精品班', label: '太极精品班' },
  { value: '防身术精品班', label: '防身术精品班' }
];

function AdminCourseManagement() {
  const navigate = useNavigate();
  // 简化认证逻辑，使用localStorage检查token
  const isAuthenticated = !!localStorage.getItem('token');
  // 模拟用户信息，实际项目中应从后端获取或解析JWT
  const user = { is_admin: true };
  
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();
  
  // 检查是否为管理员
  useEffect(() => {
    if (!isAuthenticated) {
      message.error('请先登录');
      navigate('/login');
      return;
    }
    
    // 这里简化了管理员检查，实际项目中应从后端验证权限
    // 如果需要严格检查，可以调用后端API验证当前用户是否为管理员
  }, [isAuthenticated, navigate]);
  
  // 加载课程数据
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/courses`);
      
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
    if (isAuthenticated) {
      fetchCourses();
    }
  }, [isAuthenticated]);
  
  // 打开创建/编辑模态框
  const showCreateEditModal = (course = null) => {
    setEditingCourse(course);
    
    if (course) {
      // 编辑现有课程
      form.setFieldsValue({
        title: course.title,
        type: course.type,
        price: course.price,
        duration: course.duration,
        date_range: course.date_range,
        description: course.description,
        content: course.content ? course.content.join('\n') : '',
        benefits: course.benefits ? course.benefits.join('\n') : '',
        target_audience: course.target_audience,
        location: course.location,
        max_participants: course.max_participants,
        cover_image: course.cover_image
      });
    } else {
      // 创建新课程
      form.resetFields();
    }
    
    setShowModal(true);
  };
  
  // 关闭模态框
  const handleCancel = () => {
    setShowModal(false);
    setEditingCourse(null);
    form.resetFields();
  };
  
  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理多行文本转数组
      if (values.content) {
        values.content = values.content.split('\n').filter(line => line.trim());
      }
      
      if (values.benefits) {
        values.benefits = values.benefits.split('\n').filter(line => line.trim());
      }
      
      // 创建或更新课程
      const url = editingCourse 
        ? `${API_BASE_URL}/api/admin/courses/${editingCourse.id}`
        : `${API_BASE_URL}/api/admin/courses`;
      
      const method = editingCourse ? 'put' : 'post';
      
      const response = await axios({
        method,
        url,
        data: values,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        message.success(editingCourse ? '课程更新成功' : '课程创建成功');
        handleCancel();
        fetchCourses();
      } else {
        message.error(response.data.message || (editingCourse ? '更新课程失败' : '创建课程失败'));
      }
    } catch (error) {
      console.error('提交表单出错:', error);
      if (error.response && error.response.status === 403) {
        message.error('权限不足，请确认您是管理员');
      } else {
        message.error('操作失败，请稍后重试');
      }
    }
  };
  
  // 删除课程
  const handleDelete = async (courseId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/admin/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        message.success('课程删除成功');
        fetchCourses();
      } else {
        message.error(response.data.message || '删除课程失败');
      }
    } catch (error) {
      console.error('删除课程出错:', error);
      if (error.response && error.response.status === 403) {
        message.error('权限不足，请确认您是管理员');
      } else {
        message.error('删除失败，请稍后重试');
      }
    }
  };
  
  // 表格列定义
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a onClick={() => navigate(`/courses/${record.id}`)}>{text}</a>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color="blue">{type}</Tag>
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: '日期',
      dataIndex: 'date_range',
      key: 'date_range'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === '已满') {
          color = 'orange';
        } else if (status === '已结束') {
          color = 'red';
        }
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: '报名人数',
      key: 'participants',
      render: (_, record) => `${record.current_participants}/${record.max_participants}`
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showCreateEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个课程吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];
  
  return (
    <MainLayout>
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Title level={2}>课程管理</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showCreateEditModal()}
            >
              添加课程
            </Button>
          </div>
          
          <Table 
            columns={columns} 
            dataSource={courses} 
            rowKey="id" 
            loading={loading}
          />
        </div>
      </Content>
      
      {/* 创建/编辑课程模态框 */}
      <Modal
        title={editingCourse ? '编辑课程' : '添加课程'}
        open={showModal}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={800}
        okText={editingCourse ? '更新' : '创建'}
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="请输入课程名称" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="课程类型"
            rules={[{ required: true, message: '请选择课程类型' }]}
          >
            <Select placeholder="请选择课程类型">
              {courseTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="price"
            label="课程价格"
            rules={[{ required: true, message: '请输入课程价格' }]}
          >
            <InputNumber 
              min={0} 
              placeholder="请输入课程价格" 
              addonBefore="¥"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="duration"
            label="课程时长"
            rules={[{ required: true, message: '请输入课程时长' }]}
          >
            <Input placeholder="例如：12天、3小时等" />
          </Form.Item>
          
          <Form.Item
            name="date_range"
            label="日期范围"
          >
            <Input placeholder="例如：7.23-8.2" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="课程描述"
            rules={[{ required: true, message: '请输入课程描述' }]}
          >
            <TextArea rows={4} placeholder="请输入课程描述" />
          </Form.Item>
          
          <Form.Item
            name="content"
            label="课程内容"
            extra="每行一项内容"
          >
            <TextArea rows={4} placeholder="请输入课程内容，每行一项" />
          </Form.Item>
          
          <Form.Item
            name="benefits"
            label="赠送内容"
            extra="每行一项内容"
          >
            <TextArea rows={4} placeholder="请输入赠送内容，每行一项" />
          </Form.Item>
          
          <Form.Item
            name="target_audience"
            label="适合人群"
          >
            <TextArea rows={2} placeholder="请描述适合参加本课程的人群" />
          </Form.Item>
          
          <Form.Item
            name="location"
            label="课程地点"
          >
            <Input placeholder="请输入课程地点" />
          </Form.Item>
          
          <Form.Item
            name="max_participants"
            label="最大报名人数"
          >
            <InputNumber min={1} placeholder="请输入最大报名人数" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="cover_image"
            label="封面图片"
          >
            <Input placeholder="请输入封面图片URL" />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
}

export default AdminCourseManagement;
