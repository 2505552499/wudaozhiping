import React, { useState, useEffect } from 'react';
import { 
  Layout, Typography, Card, Row, Col, Button, Tag, 
  Avatar, Rate, Modal, Form, DatePicker, TimePicker, 
  message, Spin, Divider, Space, Select, Input
} from 'antd';
import {
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import MainLayout from '../components/MainLayout';
import { coachAPI, appointmentAPI } from '../api';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CoachDetail = () => {
  const { coachId } = useParams();
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [appointmentForm] = Form.useForm();
  const [messageForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  // 获取教练详情
  useEffect(() => {
    const fetchCoachDetail = async () => {
      setLoading(true);
      try {
        const response = await coachAPI.getCoachDetail(coachId);
        if (response.data?.success) {
          setCoach(response.data.coach);
        } else {
          message.error('获取教练信息失败');
          navigate('/coach-appointment');
        }
      } catch (error) {
        console.error('获取教练信息失败:', error);
        message.error('获取教练信息失败，请稍后重试');
        navigate('/coach-appointment');
      } finally {
        setLoading(false);
      }
    };

    if (coachId) {
      fetchCoachDetail();
    }
  }, [coachId, navigate]);

  // 打开预约模态框
  const openAppointmentModal = () => {
    setShowAppointmentModal(true);
    appointmentForm.resetFields();
  };

  // 关闭预约模态框
  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    appointmentForm.resetFields();
  };

  // 打开发送消息模态框
  const openMessageModal = () => {
    setShowMessageModal(true);
    messageForm.resetFields();
  };

  // 关闭发送消息模态框
  const closeMessageModal = () => {
    setShowMessageModal(false);
    messageForm.resetFields();
  };

  // 提交预约
  const handleSubmitAppointment = async (values) => {
    if (!coach) return;
    
    setSubmitting(true);
    try {
      const appointmentData = {
        coach_id: coach.id,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        location: coach.location?.full_address || `${coach.location?.city} ${coach.location?.district}`,
        skill: values.skill || coach.skills[0]
      };
      
      const response = await appointmentAPI.createAppointment(appointmentData);
      
      if (response.data?.success) {
        message.success('预约创建成功');
        closeAppointmentModal();
      } else {
        message.error(response.data?.message || '预约失败，请稍后重试');
      }
    } catch (error) {
      console.error('预约失败:', error);
      message.error('预约失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 发送消息
  const handleSendMessage = async (values) => {
    if (!coach) return;
    
    setSubmitting(true);
    try {
      const messageData = {
        receiver_id: coach.id,
        content: values.message
      };
      
      const response = await appointmentAPI.sendMessage(messageData);
      
      if (response.data?.success) {
        message.success('消息发送成功');
        closeMessageModal();
      } else {
        message.error(response.data?.message || '发送失败，请稍后重试');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Content style={{ padding: '24px', textAlign: 'center' }}>
          <Spin size="large" />
        </Content>
      </MainLayout>
    );
  }

  if (!coach) {
    return (
      <MainLayout>
        <Content style={{ padding: '24px', textAlign: 'center' }}>
          <Title level={3}>未找到教练信息</Title>
          <Button type="primary" onClick={() => navigate('/coach-appointment')}>
            返回教练列表
          </Button>
        </Content>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Content style={{ padding: '24px' }}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8} md={6} style={{ textAlign: 'center' }}>
              <Avatar 
                src={coach.avatar} 
                icon={<UserOutlined />} 
                size={120} 
                style={{ marginBottom: 16 }}
              />
              <Title level={3} style={{ margin: '8px 0' }}>
                {coach.name}
              </Title>
              <Rate disabled defaultValue={coach.rating || 4} />
              <div style={{ marginTop: 16 }}>
                <Space>
                  <Button 
                    type="primary" 
                    size="large" 
                    onClick={openAppointmentModal}
                    style={{ width: '100%' }}
                  >
                    立即预约
                  </Button>
                </Space>
              </div>
              <div style={{ marginTop: 16 }}>
                <Space>
                  <Button icon={<MessageOutlined />} onClick={openMessageModal}>
                    发消息
                  </Button>
                  <Button icon={<PhoneOutlined />}>
                    打电话
                  </Button>
                </Space>
              </div>
            </Col>
            
            <Col xs={24} sm={16} md={18}>
              <Card title="基本信息" size="small" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <p><UserOutlined /> 性别: {coach.gender === 'male' ? '男' : '女'}</p>
                    <p><EnvironmentOutlined /> 地区: {coach.location?.city} {coach.location?.district}</p>
                  </Col>
                  <Col span={12}>
                    <p>所属院校: {coach.school}</p>
                    <p>技术等级: {coach.technical_level}</p>
                  </Col>
                </Row>
              </Card>
              
              <Card title="培训项目" size="small" style={{ marginBottom: 16 }}>
                <div>
                  {coach.skills?.map(skill => (
                    <Tag key={skill} color="blue" style={{ margin: '0 8px 8px 0' }}>
                      {skill}
                    </Tag>
                  ))}
                </div>
              </Card>
              
              <Card title="教练介绍" size="small" style={{ marginBottom: 16 }}>
                <Paragraph>{coach.description}</Paragraph>
              </Card>
              
              <Card title="认证信息" size="small">
                <p>
                  <CheckCircleOutlined style={{ color: 'green' }} /> 
                  {coach.certification || '国际武术联合会认证教练'}
                </p>
              </Card>
              
              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Text type="secondary">价格: </Text>
                <Text strong style={{ color: 'red', fontSize: 24 }}>
                  {coach.price}元/小时
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
        
        {/* 预约模态框 */}
        <Modal
          title="预约教练"
          open={showAppointmentModal}
          onCancel={closeAppointmentModal}
          footer={null}
          destroyOnClose
        >
          <Form
            form={appointmentForm}
            layout="vertical"
            onFinish={handleSubmitAppointment}
          >
            <Form.Item
              name="date"
              label="预约日期"
              rules={[{ required: true, message: '请选择预约日期' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                placeholder="选择日期"
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current < moment().startOf('day')}
              />
            </Form.Item>
            
            <Form.Item
              name="time"
              label="预约时间"
              rules={[{ required: true, message: '请选择预约时间' }]}
            >
              <TimePicker 
                style={{ width: '100%' }} 
                placeholder="选择时间"
                format="HH:mm"
                minuteStep={15}
              />
            </Form.Item>
            
            <Form.Item
              name="skill"
              label="训练项目"
              initialValue={coach.skills?.[0]}
            >
              <Select placeholder="选择训练项目">
                {coach.skills?.map(skill => (
                  <Option key={skill} value={skill}>{skill}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Divider />
            
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Button onClick={closeAppointmentModal} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                确认预约
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        
        {/* 发送消息模态框 */}
        <Modal
          title="发送消息"
          open={showMessageModal}
          onCancel={closeMessageModal}
          footer={null}
          destroyOnClose
        >
          <Form
            form={messageForm}
            layout="vertical"
            onFinish={handleSendMessage}
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong>发送给: </Text>
              <Text>{coach.name}</Text>
            </div>
            
            <Form.Item
              name="message"
              label="消息内容"
              rules={[{ required: true, message: '请输入消息内容' }]}
            >
              <TextArea rows={4} placeholder="请输入消息内容" />
            </Form.Item>
            
            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Button onClick={closeMessageModal} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                发送
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </MainLayout>
  );
};

export default CoachDetail;
