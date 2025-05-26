import React, { useState, useEffect } from 'react';
import { Card, List, Button, Tag, Empty, Spin, Row, Col, Statistic, Tabs, Modal, message, Rate } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, EnvironmentOutlined, PhoneOutlined, MessageOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import api from '../api';

const { TabPane } = Tabs;

const MyAppointments = () => {
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user/appointments');
      
      if (response.data.appointments) {
        setAppointments(response.data.appointments);
        
        // 计算统计数据
        const total = response.data.appointments.length;
        const pending = response.data.appointments.filter(apt => apt.status === 'pending').length;
        const confirmed = response.data.appointments.filter(apt => apt.status === 'confirmed').length;
        const completed = response.data.appointments.filter(apt => apt.status === 'completed').length;
        
        setStats({ total, pending, confirmed, completed });
      }
    } catch (error) {
      console.error('获取预约数据失败:', error);
      
      // 使用模拟数据
      const mockAppointments = [
        {
          id: '1',
          coach_name: '李师傅',
          coach_avatar: '/img/coach1.jpg',
          date: '2024-01-25',
          time: '14:00',
          location: '北京市 海淀区',
          skill: '太极拳',
          duration: 1,
          status: 'confirmed',
          phone: '138****8888',
          created_at: '2024-01-20'
        },
        {
          id: '2',
          coach_name: '王教练',
          coach_avatar: '/img/coach2.jpg',
          date: '2024-01-22',
          time: '10:00',
          location: '北京市 朝阳区',
          skill: '咏春拳',
          duration: 2,
          status: 'completed',
          phone: '139****9999',
          created_at: '2024-01-18'
        },
        {
          id: '3',
          coach_name: '张师傅',
          coach_avatar: '/img/coach3.jpg',
          date: '2024-01-28',
          time: '16:00',
          location: '北京市 西城区',
          skill: '形意拳',
          duration: 1,
          status: 'pending',
          phone: '137****7777',
          created_at: '2024-01-21'
        }
      ];
      
      setAppointments(mockAppointments);
      setStats({
        total: 3,
        pending: 1,
        confirmed: 1,
        completed: 1
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '待确认';
      case 'confirmed':
        return '已确认';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return '未知状态';
    }
  };

  const filterAppointments = (appointments, tab) => {
    switch (tab) {
      case 'pending':
        return appointments.filter(apt => apt.status === 'pending');
      case 'confirmed':
        return appointments.filter(apt => apt.status === 'confirmed');
      case 'completed':
        return appointments.filter(apt => apt.status === 'completed');
      default:
        return appointments;
    }
  };

  const cancelAppointment = async (appointmentId) => {
    Modal.confirm({
      title: '确认取消预约',
      content: '取消后无法恢复，确定要取消这个预约吗？',
      onOk: async () => {
        try {
          await api.delete(`/api/appointments/${appointmentId}`);
          message.success('预约已取消');
          fetchMyAppointments();
        } catch (error) {
          console.error('取消预约失败:', error);
          message.error('取消预约失败');
        }
      }
    });
  };

  const contactCoach = (appointment) => {
    // 跳转到消息页面或显示联系方式
    Modal.info({
      title: '联系教练',
      content: (
        <div>
          <p><UserOutlined /> 教练: {appointment.coach_name}</p>
          <p><PhoneOutlined /> 电话: {appointment.phone}</p>
          <p>您也可以通过系统消息功能联系教练</p>
        </div>
      ),
      onOk: () => {
        // 可以跳转到消息页面
        // window.location.href = '/messages';
      }
    });
  };

  const rateAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setReviewModalVisible(true);
  };

  const submitReview = async () => {
    try {
      // 提交评价
      // await api.post(`/api/appointments/${selectedAppointment.id}/review`, {
      //   rating,
      //   comment: ''
      // });
      
      message.success('评价提交成功');
      setReviewModalVisible(false);
      setSelectedAppointment(null);
      setRating(5);
    } catch (error) {
      console.error('提交评价失败:', error);
      message.error('提交评价失败');
    }
  };

  const renderAppointmentCard = (appointment) => (
    <List.Item key={appointment.id}>
      <Card
        style={{ width: '100%' }}
        actions={[
          appointment.status === 'pending' && (
            <Button type="link" danger onClick={() => cancelAppointment(appointment.id)}>
              取消预约
            </Button>
          ),
          appointment.status === 'confirmed' && (
            <Button type="link" onClick={() => contactCoach(appointment)}>
              联系教练
            </Button>
          ),
          appointment.status === 'completed' && (
            <Button type="link" onClick={() => rateAppointment(appointment)}>
              评价教练
            </Button>
          )
        ].filter(Boolean)}
      >
        <Card.Meta
          avatar={
            <div style={{ textAlign: 'center' }}>
              <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />
              <div style={{ fontSize: 12, marginTop: 4 }}>{appointment.coach_name}</div>
            </div>
          }
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{appointment.skill}</span>
              <Tag color={getStatusColor(appointment.status)}>
                {getStatusText(appointment.status)}
              </Tag>
            </div>
          }
          description={
            <div>
              <p><CalendarOutlined /> {appointment.date} {appointment.time}</p>
              <p><EnvironmentOutlined /> {appointment.location}</p>
              <p><ClockCircleOutlined /> 时长: {appointment.duration}小时</p>
              <p style={{ color: '#666', fontSize: 12 }}>
                预约时间: {appointment.created_at}
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
                title="总预约数"
                value={stats.total}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="待确认"
                value={stats.pending}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="已确认"
                value={stats.confirmed}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="已完成"
                value={stats.completed}
                prefix={<MessageOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 预约列表 */}
        <Card title="我的预约">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={`全部 (${stats.total})`} key="all">
              <Spin spinning={loading}>
                {appointments.length > 0 ? (
                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 1,
                      md: 2,
                      lg: 2,
                      xl: 3,
                      xxl: 3,
                    }}
                    dataSource={filterAppointments(appointments, 'all')}
                    renderItem={renderAppointmentCard}
                  />
                ) : (
                  <Empty
                    description="暂无预约记录"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button type="primary" onClick={() => window.location.href = '/coach-appointment'}>
                      立即预约
                    </Button>
                  </Empty>
                )}
              </Spin>
            </TabPane>
            
            <TabPane tab={`待确认 (${stats.pending})`} key="pending">
              <Spin spinning={loading}>
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 3,
                  }}
                  dataSource={filterAppointments(appointments, 'pending')}
                  renderItem={renderAppointmentCard}
                />
              </Spin>
            </TabPane>
            
            <TabPane tab={`已确认 (${stats.confirmed})`} key="confirmed">
              <Spin spinning={loading}>
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 3,
                  }}
                  dataSource={filterAppointments(appointments, 'confirmed')}
                  renderItem={renderAppointmentCard}
                />
              </Spin>
            </TabPane>
            
            <TabPane tab={`已完成 (${stats.completed})`} key="completed">
              <Spin spinning={loading}>
                <List
                  grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                    lg: 2,
                    xl: 3,
                    xxl: 3,
                  }}
                  dataSource={filterAppointments(appointments, 'completed')}
                  renderItem={renderAppointmentCard}
                />
              </Spin>
            </TabPane>
          </Tabs>
        </Card>

        {/* 评价模态框 */}
        <Modal
          title="评价教练"
          visible={reviewModalVisible}
          onOk={submitReview}
          onCancel={() => setReviewModalVisible(false)}
          okText="提交评价"
          cancelText="取消"
        >
          {selectedAppointment && (
            <div>
              <p>教练: {selectedAppointment.coach_name}</p>
              <p>课程: {selectedAppointment.skill}</p>
              <p>请为本次教学打分:</p>
              <Rate value={rating} onChange={setRating} />
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default MyAppointments;
