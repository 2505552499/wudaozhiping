import React, { useState, useEffect } from 'react';
import { Layout, Typography, Tabs, List, Avatar, Tag, Button, Modal, Form, Input, message, Badge, Divider, Space, Empty } from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined,
  CheckOutlined,
  CloseOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { appointmentAPI } from '../api';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const CoachDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [publishedAppointments, setPublishedAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishedLoading, setPublishedLoading] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [messageForm] = Form.useForm();
  const navigate = useNavigate();
  
  // 检查用户是否为教练
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'coach') {
      message.error('您没有权限访问此页面');
      navigate('/');
    }
  }, [navigate]);

  // 获取教练的所有预约
  const fetchCoachAppointments = async () => {
    setLoading(true);
    try {
      // 这里需要后端提供一个API来获取教练的所有预约
      const response = await appointmentAPI.getCoachAppointments();
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('获取预约列表失败:', error);
      message.error('获取预约列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 获取教练发布的预约信息和审核状态
  const fetchPublishedAppointments = async () => {
    setPublishedLoading(true);
    try {
      const response = await appointmentAPI.getCoachPublishedAppointments();
      if (response.data.success) {
        setPublishedAppointments(response.data.published_appointments || []);
      } else {
        message.error(response.data.message || '获取发布的预约信息失败');
      }
    } catch (error) {
      console.error('获取发布的预约信息失败:', error);
      message.error('获取发布的预约信息失败，请稍后重试');
    } finally {
      setPublishedLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchCoachAppointments();
    fetchPublishedAppointments();
  }, []);

  // 确认预约
  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const response = await appointmentAPI.updateAppointmentStatus(appointmentId, 'confirmed');
      if (response.data.success) {
        message.success('预约已确认');
        fetchCoachAppointments();
      } else {
        message.error(response.data.message || '操作失败，请稍后重试');
      }
    } catch (error) {
      console.error('确认预约失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };

  // 拒绝预约
  const handleRejectAppointment = async (appointmentId) => {
    try {
      const response = await appointmentAPI.updateAppointmentStatus(appointmentId, 'rejected');
      if (response.data.success) {
        message.success('预约已拒绝');
        fetchCoachAppointments();
      } else {
        message.error(response.data.message || '操作失败，请稍后重试');
      }
    } catch (error) {
      console.error('拒绝预约失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };

  // 完成预约
  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const response = await appointmentAPI.updateAppointmentStatus(appointmentId, 'completed');
      if (response.data.success) {
        message.success('预约已标记为完成');
        fetchCoachAppointments();
      } else {
        message.error(response.data.message || '操作失败，请稍后重试');
      }
    } catch (error) {
      console.error('完成预约失败:', error);
      message.error('操作失败，请稍后重试');
    }
  };

  // 打开消息模态框
  const openMessageModal = (appointment) => {
    setSelectedAppointment(appointment);
    setMessageModal(true);
    messageForm.resetFields();
  };

  // 关闭消息模态框
  const closeMessageModal = () => {
    setMessageModal(false);
    setSelectedAppointment(null);
    messageForm.resetFields();
  };

  // 发送消息
  const handleSendMessage = async (values) => {
    try {
      // 这里需要后端提供一个API来发送消息
      const response = await appointmentAPI.sendMessage({
        receiver_id: selectedAppointment.user_id,
        content: values.message,
        appointment_id: selectedAppointment.id
      });
      
      if (response.data.success) {
        message.success('消息发送成功');
        closeMessageModal();
      } else {
        message.error(response.data.message || '发送失败，请稍后重试');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送失败，请稍后重试');
    }
  };

  // 跳转到资料管理页面
  const goToProfilePage = () => {
    navigate('/coach-profile');
  };

  // 获取预约状态显示文本
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'confirmed':
        return '已确认';
      case 'cancelled':
        return '已取消';
      case 'rejected':
        return '已拒绝';
      case 'completed':
        return '已完成';
      default:
        return '未知状态';
    }
  };

  // 获取审核状态显示文本
  const getApprovalStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '待审核';
      case 'approved':
        return '已通过';
      case 'rejected':
        return '已拒绝';
      default:
        return '未知状态';
    }
  };

  // 获取预约状态标签颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'processing';
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'default';
      case 'rejected':
        return 'error';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  // 获取审核状态标签颜色
  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'processing';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  // 渲染预约列表项
  const renderAppointmentItem = (appointment) => {
    // 安全地获取用户头像，如果不存在则使用默认头像
    const userAvatar = appointment.user && appointment.user.avatar ? appointment.user.avatar : null;
    // 安全地获取用户名，如果不存在则使用用户ID
    const userName = appointment.user && appointment.user.name ? appointment.user.name : appointment.user_id;
    
    return (
      <List.Item
        key={appointment.id}
        actions={[
          appointment.status === 'pending' && (
            <Button 
              type="primary" 
              icon={<CheckOutlined />} 
              onClick={() => handleConfirmAppointment(appointment.id)}
              style={{ marginRight: 8 }}
            >
              确认
            </Button>
          ),
          appointment.status === 'pending' && (
            <Button 
              danger 
              icon={<CloseOutlined />} 
              onClick={() => handleRejectAppointment(appointment.id)}
              style={{ marginRight: 8 }}
            >
              拒绝
            </Button>
          ),
          appointment.status === 'confirmed' && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              onClick={() => handleCompleteAppointment(appointment.id)}
              style={{ marginRight: 8 }}
            >
              完成
            </Button>
          ),
          (appointment.status === 'pending' || appointment.status === 'confirmed') && (
            <Button 
              icon={<MessageOutlined />} 
              onClick={() => openMessageModal(appointment)}
            >
              发消息
            </Button>
          )
        ].filter(Boolean)}
      >
        <List.Item.Meta
          avatar={<Avatar icon={<UserOutlined />} src={userAvatar} />}
          title={
            <Space>
              <Text strong>{userName}</Text>
              <Tag color={getStatusColor(appointment.status)}>
                {getStatusText(appointment.status)}
              </Tag>
            </Space>
          }
          description={
            <>
              <div>
                <CalendarOutlined style={{ marginRight: 8 }} />
                <Text type="secondary">日期: {appointment.date}</Text>
              </div>
              <div>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                <Text type="secondary">时间: {appointment.time}，时长: {appointment.duration || 1}小时</Text>
              </div>
              {appointment.location && (
                <div>
                  <EnvironmentOutlined style={{ marginRight: 8 }} />
                  <Text type="secondary">地点: {appointment.location}</Text>
                </div>
              )}
              <div>
                <Text type="secondary">项目: </Text>
                <Tag color="blue">{appointment.training_type || appointment.skill}</Tag>
              </div>
            </>
          }
        />
      </List.Item>
    );
  };

  // 渲染教练发布的预约信息列表项
  const renderPublishedAppointmentItem = (appointment) => {
    return (
      <List.Item>
        <List.Item.Meta
          title={
            <Space>
              <span>{appointment.skill}</span>
              <Tag color={getApprovalStatusColor(appointment.approval_status)}>
                {getApprovalStatusText(appointment.approval_status)}
              </Tag>
            </Space>
          }
          description={
            <>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">电话: </Text>
                <Text>{appointment.phone}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">地点: </Text>
                <Text>{appointment.location}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary">价格: </Text>
                <Text strong style={{ color: 'red' }}>{appointment.price}元/小时</Text>
              </div>
              {appointment.notes && (
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">备注: </Text>
                  <Text>{appointment.notes}</Text>
                </div>
              )}
              {appointment.approval_status === 'rejected' && appointment.rejection_reason && (
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" strong style={{ color: '#ff4d4f' }}>拒绝理由: </Text>
                  <Text type="danger">{appointment.rejection_reason}</Text>
                </div>
              )}
              {appointment.review_time && (
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">审核时间: </Text>
                  <Text>{appointment.review_time}</Text>
                </div>
              )}
              <div>
                <Text type="secondary">发布时间: </Text>
                <Text>{appointment.created_at}</Text>
              </div>
            </>
          }
        />
      </List.Item>
    );
  };

  return (
    <MainLayout>
      <Content style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Title level={2}>教练管理中心</Title>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={goToProfilePage}
          >
            编辑个人资料
          </Button>
        </div>
        
        <Tabs defaultActiveKey="pending">
          <TabPane 
            tab={
              <Badge count={appointments.filter(a => a.status === 'pending').length} offset={[10, 0]}>
                待处理预约
              </Badge>
            } 
            key="pending"
          >
            <List
              loading={loading}
              itemLayout="horizontal"
              dataSource={appointments.filter(a => a.status === 'pending')}
              renderItem={renderAppointmentItem}
              locale={{ emptyText: <Empty description="暂无待处理预约" /> }}
            />
          </TabPane>
          
          <TabPane tab="已确认预约" key="confirmed">
            <List
              loading={loading}
              itemLayout="horizontal"
              dataSource={appointments.filter(a => a.status === 'confirmed')}
              renderItem={renderAppointmentItem}
              locale={{ emptyText: <Empty description="暂无已确认预约" /> }}
            />
          </TabPane>
          
          <TabPane tab="已完成预约" key="completed">
            <List
              loading={loading}
              itemLayout="horizontal"
              dataSource={appointments.filter(a => a.status === 'completed')}
              renderItem={renderAppointmentItem}
              locale={{ emptyText: <Empty description="暂无已完成预约" /> }}
            />
          </TabPane>
          
          <TabPane tab="已取消/拒绝预约" key="cancelled">
            <List
              loading={loading}
              itemLayout="horizontal"
              dataSource={appointments.filter(a => a.status === 'cancelled' || a.status === 'rejected')}
              renderItem={renderAppointmentItem}
              locale={{ emptyText: <Empty description="暂无已取消/拒绝预约" /> }}
            />
          </TabPane>
          
          <TabPane tab="我发布的预约" key="published">
            <List
              loading={publishedLoading}
              itemLayout="horizontal"
              dataSource={publishedAppointments}
              renderItem={renderPublishedAppointmentItem}
              locale={{ emptyText: <Empty description="暂无发布的预约信息" /> }}
            />
          </TabPane>
        </Tabs>
        
        {/* 发送消息模态框 */}
        <Modal
          title="发送消息"
          visible={messageModal}
          onCancel={closeMessageModal}
          footer={null}
        >
          {selectedAppointment && (
            <Form form={messageForm} onFinish={handleSendMessage} layout="vertical">
              <div style={{ marginBottom: 16 }}>
                <Text strong>发送给: </Text>
                <Text>{selectedAppointment.user ? selectedAppointment.user.name : selectedAppointment.user_id}</Text>
              </div>
              
              <Divider />
              
              <Form.Item
                name="message"
                label="消息内容"
                rules={[{ required: true, message: '请输入消息内容' }]}
              >
                <TextArea rows={4} placeholder="请输入消息内容" />
              </Form.Item>
              
              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button onClick={closeMessageModal}>取消</Button>
                  <Button type="primary" htmlType="submit">发送</Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Modal>
      </Content>
    </MainLayout>
  );
};

export default CoachDashboard;
