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
  EditOutlined,
  VideoCameraOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import appointmentAPI from '../api/appointmentAPI';
import TrainingVideoList from '../components/TrainingVideoList';
import axios from 'axios';
import { API_BASE_URL } from '../config';

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

  // 训练视频相关状态
  const [pendingVideos, setPendingVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [allVideosLoading, setAllVideosLoading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoRefreshTrigger, setVideoRefreshTrigger] = useState(0);

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

  // 获取待标注的训练视频
  const fetchPendingVideos = async () => {
    setVideosLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/training-videos/coach/pending`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setPendingVideos(response.data.videos || []);
      } else {
        message.error(response.data.message || '获取待标注视频失败');
      }
    } catch (error) {
      console.error('获取待标注视频失败:', error);
      message.error('获取待标注视频失败，请稍后重试');
    } finally {
      setVideosLoading(false);
    }
  };

  // 获取所有训练视频
  const fetchAllVideos = async () => {
    setAllVideosLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/training-videos/coach/all`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAllVideos(response.data.videos || []);
      } else {
        message.error(response.data.message || '获取训练视频失败');
      }
    } catch (error) {
      console.error('获取训练视频失败:', error);
      message.error('获取训练视频失败，请稍后重试');
    } finally {
      setAllVideosLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchCoachAppointments();
    fetchPublishedAppointments();
    fetchPendingVideos();
    fetchAllVideos();
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

  // 训练视频相关处理函数
  const handleViewVideo = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  const handleVideoAnnotationUpdate = () => {
    setVideoRefreshTrigger(prev => prev + 1);
    fetchPendingVideos(); // 刷新待标注视频列表
    fetchAllVideos(); // 刷新所有视频列表
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

  // 渲染训练视频列表项（待标注）
  const renderVideoItem = (video) => {
    const formatTime = (timestamp) => {
      return new Date(timestamp * 1000).toLocaleString();
    };

    return (
      <List.Item
        key={video.id}
        actions={[
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewVideo(video)}
          >
            查看并标注
          </Button>
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar icon={<VideoCameraOutlined />} />}
          title={
            <Space>
              <Text strong>{video.original_filename}</Text>
              <Tag color="orange">待标注</Tag>
            </Space>
          }
          description={
            <>
              <div>
                <Text type="secondary">学员: </Text>
                <Text>{video.appointment_info?.user_name || video.appointment_info?.user_id || '未知学员'}</Text>
              </div>
              <div>
                <Text type="secondary">预约日期: </Text>
                <Text>{video.appointment_info?.date || '未知日期'}</Text>
              </div>
              <div>
                <Text type="secondary">训练项目: </Text>
                <Tag color="blue">{video.appointment_info?.skill || '未知项目'}</Tag>
              </div>
              <div>
                <Text type="secondary">上传时间: </Text>
                <Text>{formatTime(video.upload_time)}</Text>
              </div>
              {video.description && (
                <div>
                  <Text type="secondary">视频描述: </Text>
                  <Text>{video.description}</Text>
                </div>
              )}
            </>
          }
        />
      </List.Item>
    );
  };

  // 渲染所有训练视频列表项
  const renderAllVideoItem = (video) => {
    const formatTime = (timestamp) => {
      return new Date(timestamp * 1000).toLocaleString();
    };

    const getStatusTag = (status) => {
      switch (status) {
        case 'pending':
          return <Tag color="orange">待标注</Tag>;
        case 'annotated':
          return <Tag color="blue">已标注</Tag>;
        case 'published':
          return <Tag color="green">已发布</Tag>;
        default:
          return <Tag color="default">未知状态</Tag>;
      }
    };

    const getActionButton = (video) => {
      if (video.annotation_status === 'pending') {
        return (
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewVideo(video)}
          >
            查看并标注
          </Button>
        );
      } else {
        return (
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewVideo(video)}
          >
            查看详情
          </Button>
        );
      }
    };

    return (
      <List.Item
        key={video.id}
        actions={[getActionButton(video)]}
      >
        <List.Item.Meta
          avatar={<Avatar icon={<VideoCameraOutlined />} />}
          title={
            <Space>
              <Text strong>{video.original_filename}</Text>
              {getStatusTag(video.annotation_status)}
            </Space>
          }
          description={
            <>
              <div>
                <Text type="secondary">学员: </Text>
                <Text>{video.appointment_info?.user_name || video.appointment_info?.user_id || '未知学员'}</Text>
              </div>
              <div>
                <Text type="secondary">预约日期: </Text>
                <Text>{video.appointment_info?.date || '未知日期'}</Text>
              </div>
              <div>
                <Text type="secondary">训练项目: </Text>
                <Tag color="blue">{video.appointment_info?.skill || '未知项目'}</Tag>
              </div>
              <div>
                <Text type="secondary">上传时间: </Text>
                <Text>{formatTime(video.upload_time)}</Text>
              </div>
              {video.annotation_status === 'published' && video.coach_score && (
                <div>
                  <Text type="secondary">评分: </Text>
                  <Text strong style={{ color: '#1890ff' }}>{video.coach_score}/5</Text>
                </div>
              )}
              {video.description && (
                <div>
                  <Text type="secondary">视频描述: </Text>
                  <Text>{video.description}</Text>
                </div>
              )}
            </>
          }
        />
      </List.Item>
    );
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

          <TabPane
            tab={
              <Badge count={pendingVideos.length} offset={[10, 0]}>
                <VideoCameraOutlined style={{ marginRight: 4 }} />
                待标注视频
              </Badge>
            }
            key="pending-videos"
          >
            <List
              loading={videosLoading}
              itemLayout="horizontal"
              dataSource={pendingVideos}
              renderItem={renderVideoItem}
              locale={{ emptyText: <Empty description="暂无待标注的训练视频" /> }}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <VideoCameraOutlined style={{ marginRight: 4 }} />
                所有训练视频
              </span>
            }
            key="all-videos"
          >
            <List
              loading={allVideosLoading}
              itemLayout="horizontal"
              dataSource={allVideos}
              renderItem={renderAllVideoItem}
              locale={{ emptyText: <Empty description="暂无训练视频" /> }}
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

        {/* 训练视频查看和标注模态框 */}
        <Modal
          title="训练视频标注"
          open={showVideoModal}
          onCancel={closeVideoModal}
          footer={null}
          width={1200}
          destroyOnClose
        >
          {selectedVideo && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <h4>视频信息</h4>
                <p>文件名: {selectedVideo.original_filename}</p>
                <p>学员: {selectedVideo.appointment_info?.user_name || '未知学员'}</p>
                <p>预约日期: {selectedVideo.appointment_info?.date || '未知日期'}</p>
                <p>训练项目: {selectedVideo.appointment_info?.skill || '未知项目'}</p>
                {selectedVideo.description && (
                  <p>视频描述: {selectedVideo.description}</p>
                )}
              </div>

              <TrainingVideoList
                appointmentId={selectedVideo.appointment_id}
                userRole="coach"
                refreshTrigger={videoRefreshTrigger}
              />
            </div>
          )}
        </Modal>
      </Content>
    </MainLayout>
  );
};

export default CoachDashboard;
