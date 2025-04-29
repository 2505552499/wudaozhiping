import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Tag, Space, Card, Tabs, Typography, Row, Col, Popconfirm } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import { adminAPI } from '../api';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const AdminAppointmentReview = () => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [rejectedAppointments, setRejectedAppointments] = useState([]);
  const [revokedAppointments, setRevokedAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  // 获取预约列表
  const fetchAppointments = async (status = 'pending') => {
    setLoading(true);
    try {
      let response;
      if (status === 'pending') {
        response = await adminAPI.getPendingAppointments();
      } else if (status === 'approved') {
        response = await adminAPI.getApprovedAppointments();
      } else if (status === 'rejected') {
        response = await adminAPI.getRejectedAppointments();
      } else if (status === 'revoked') {
        response = await adminAPI.getRevokedAppointments();
      }
      
      if (response.data?.success) {
        if (status === 'pending') {
          setPendingAppointments(response.data.appointments);
        } else if (status === 'approved') {
          setApprovedAppointments(response.data.appointments);
        } else if (status === 'rejected') {
          setRejectedAppointments(response.data.appointments);
        } else if (status === 'revoked') {
          setRevokedAppointments(response.data.appointments);
        }
      } else {
        message.error('获取预约列表失败');
      }
    } catch (error) {
      console.error('获取预约列表出错:', error);
      message.error('获取预约列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchAppointments('pending');
    fetchAppointments('approved');
    fetchAppointments('rejected');
    fetchAppointments('revoked');
  }, []);

  // 处理Tab切换
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 打开审核模态框
  const showReviewModal = (appointment) => {
    setCurrentAppointment(appointment);
    setReviewModal(true);
  };

  // 关闭审核模态框
  const closeReviewModal = () => {
    setCurrentAppointment(null);
    setRejectReason('');
    setReviewModal(false);
  };

  // 审核预约
  const handleReview = async (action) => {
    if (!currentAppointment) return;

    try {
      const response = await adminAPI.reviewAppointment(
        currentAppointment.id,
        action,
        action === 'reject' ? rejectReason : ''
      );

      if (response.data?.success) {
        message.success(action === 'approve' ? '预约已通过审核' : '预约已拒绝');
        closeReviewModal();
        // 刷新列表
        fetchAppointments('pending');
        fetchAppointments('approved');
        fetchAppointments('rejected');
      } else {
        message.error(response.data?.message || '操作失败');
      }
    } catch (error) {
      console.error('审核预约出错:', error);
      message.error('操作失败');
    }
  };
  
  // 撤销预约（软删除）
  const handleRevokeAppointment = async (appointmentId) => {
    try {
      const response = await adminAPI.revokeAppointment(appointmentId);
      
      if (response.data?.success) {
        message.success('预约已成功撤销');
        // 刷新所有列表
        fetchAppointments('pending');
        fetchAppointments('approved');
        fetchAppointments('rejected');
        fetchAppointments('revoked'); // 添加刷新已撤销列表
      } else {
        message.error(response.data?.message || '撤销失败');
      }
    } catch (error) {
      console.error('撤销预约出错:', error);
      message.error('撤销失败：' + (error.response?.data?.message || '未知错误'));
    }
  };

  // 删除预约（真实删除）
  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await adminAPI.deleteAppointment(appointmentId);
      
      if (response.data?.success) {
        message.success('预约已成功删除');
        // 刷新所有列表
        fetchAppointments('pending');
        fetchAppointments('approved');
        fetchAppointments('rejected');
        fetchAppointments('revoked'); // 添加刷新已撤销列表
      } else {
        message.error(response.data?.message || '删除失败');
      }
    } catch (error) {
      console.error('删除预约出错:', error);
      message.error('删除失败：' + (error.response?.data?.message || '未知错误'));
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '教练姓名',
      dataIndex: 'coach_name',
      key: 'coach_name',
    },
    {
      title: '技能',
      dataIndex: 'skill',
      key: 'skill',
      render: (skill) => <Tag color="blue">{skill}</Tag>
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '状态',
      key: 'approval_status',
      dataIndex: 'approval_status',
      render: (status) => {
        let color = 'default';
        let icon = null;
        let text = '未知';

        if (status === 'pending') {
          color = 'warning';
          icon = <ClockCircleOutlined />;
          text = '待审核';
        } else if (status === 'approved') {
          color = 'success';
          icon = <CheckCircleOutlined />;
          text = '已通过';
        } else if (status === 'rejected') {
          color = 'error';
          icon = <CloseCircleOutlined />;
          text = '已拒绝';
        }

        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.approval_status === 'pending' && (
            <Button
              type="primary"
              size="small"
              onClick={() => showReviewModal(record)}
            >
              审核
            </Button>
          )}
          
          {/* 待审核或已通过的预约显示撤销按钮 */}
          {(record.approval_status === 'pending' || record.approval_status === 'approved') && (
            <Popconfirm
              title="确定要撤销此预约记录吗？"
              description="撤销后将不向用户展示此预约，但记录保留在系统中"
              onConfirm={() => handleRevokeAppointment(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                撤销
              </Button>
            </Popconfirm>
          )}
          
          {/* 已拒绝或已撤销的预约显示删除按钮 */}
          {(record.approval_status === 'rejected' || record.approval_status === 'revoked') && (
            <Popconfirm
              title="确定要删除此预约记录吗？"
              description="删除后将无法恢复，记录将从系统中完全移除"
              onConfirm={() => handleDeleteAppointment(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                删除
              </Button>
            </Popconfirm>
          )}
          
          {record.approval_status !== 'pending' && (
            <Button type="default" onClick={() => showReviewModal(record)}>
              查看详情
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <MainLayout selectedKey="admin-review">
      <div style={{ padding: '20px' }}>
        <Title level={2}>教练预约审核</Title>
        <Text type="secondary" style={{ marginBottom: '20px', display: 'block' }}>
          审核教练发布的预约信息，确保信息准确无误后才能显示给用户
        </Text>

        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane 
            tab={
              <span>
                <ClockCircleOutlined />
                待审核 
                {pendingAppointments.length > 0 && 
                  <Tag color="red" style={{ marginLeft: 8 }}>{pendingAppointments.length}</Tag>
                }
              </span>
            } 
            key="pending"
          >
            <Table 
              columns={columns} 
              dataSource={pendingAppointments} 
              rowKey="id" 
              loading={loading && activeTab === 'pending'}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane 
            tab={
              <span>
                <CheckCircleOutlined />
                已通过
              </span>
            } 
            key="approved"
          >
            <Table 
              columns={columns} 
              dataSource={approvedAppointments} 
              rowKey="id" 
              loading={loading && activeTab === 'approved'}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane 
            tab={
              <span>
                <CloseCircleOutlined />
                已拒绝
              </span>
            } 
            key="rejected"
          >
            <Table 
              columns={columns} 
              dataSource={rejectedAppointments} 
              rowKey="id" 
              loading={loading && activeTab === 'rejected'}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane 
            tab={
              <span>
                <DeleteOutlined />
                已撤销
              </span>
            } 
            key="revoked"
          >
            <Table 
              columns={columns} 
              dataSource={revokedAppointments} 
              rowKey="id" 
              loading={loading && activeTab === 'revoked'}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>

        {/* 审核模态框 */}
        <Modal
          title="预约审核"
          open={reviewModal}
          onCancel={closeReviewModal}
          footer={null}
        >
          {currentAppointment && (
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>教练姓名:</Text> {currentAppointment.coach_name}
                </Col>
                <Col span={12}>
                  <Text strong>技能:</Text> <Tag color="blue">{currentAppointment.skill}</Tag>
                </Col>
                <Col span={12}>
                  <Text strong>日期:</Text> {currentAppointment.date}
                </Col>
                <Col span={12}>
                  <Text strong>时间:</Text> {currentAppointment.time}
                </Col>
                <Col span={24}>
                  <Text strong>地点:</Text> {currentAppointment.location}
                </Col>
                <Col span={24}>
                  <Text strong>状态:</Text> {' '}
                  {currentAppointment.approval_status === 'pending' && <Tag color="warning">待审核</Tag>}
                  {currentAppointment.approval_status === 'approved' && <Tag color="success">已通过</Tag>}
                  {currentAppointment.approval_status === 'rejected' && <Tag color="error">已拒绝</Tag>}
                </Col>
                {currentAppointment.approval_status === 'rejected' && currentAppointment.rejection_reason && (
                  <Col span={24}>
                    <Text strong>拒绝原因:</Text> {currentAppointment.rejection_reason}
                  </Col>
                )}
                {currentAppointment.approval_status === 'pending' && (
                  <>
                    <Col span={24}>
                      <Text strong>拒绝原因:</Text>
                      <textarea
                        style={{ width: '100%', marginTop: '8px', padding: '8px' }}
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="请输入拒绝原因（可选）"
                      />
                    </Col>
                    <Col span={24} style={{ textAlign: 'right', marginTop: '16px' }}>
                      <Button onClick={closeReviewModal} style={{ marginRight: 8 }}>
                        取消
                      </Button>
                      <Button 
                        danger 
                        style={{ marginRight: 8 }} 
                        onClick={() => handleReview('reject')}
                      >
                        拒绝
                      </Button>
                      <Button 
                        type="primary" 
                        onClick={() => handleReview('approve')}
                      >
                        通过
                      </Button>
                    </Col>
                  </>
                )}
                {currentAppointment.approval_status !== 'pending' && (
                  <Col span={24} style={{ textAlign: 'right', marginTop: '16px' }}>
                    <Button onClick={closeReviewModal}>
                      关闭
                    </Button>
                  </Col>
                )}
              </Row>
            </Card>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default AdminAppointmentReview;
