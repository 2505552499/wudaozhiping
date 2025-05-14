import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layout, Typography, List, Card, Button, Modal, 
  Form, Input, Spin, message, Space, Divider, Tag, Pagination
} from 'antd';
import { 
  CheckCircleOutlined, CloseCircleOutlined, 
  ExclamationCircleOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { forumAPI } from '../api';
import MainLayout from '../components/MainLayout';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { TextArea } = Input;
const { confirm } = Modal;

const ForumReview = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // 获取待审核的帖子列表
  const fetchPendingPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await forumAPI.getPendingPosts(page, pageSize);
      if (response.data.success) {
        setPosts(response.data.posts);
        setTotal(response.data.total);
      } else {
        message.error(response.data.message || '获取待审核帖子列表失败');
      }
    } catch (error) {
      console.error('获取待审核帖子列表出错:', error);
      message.error('获取待审核帖子列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // 页面加载时获取待审核的帖子列表
  useEffect(() => {
    fetchPendingPosts();
  }, [fetchPendingPosts]);

  // 处理分页变化
  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // 处理审核通过
  const handleApprove = (postId) => {
    confirm({
      title: '确认审核通过',
      icon: <ExclamationCircleOutlined />,
      content: '确定要通过这篇帖子吗？通过后将对所有用户可见。',
      onOk: async () => {
        setReviewLoading(true);
        try {
          const response = await forumAPI.reviewPost(postId, 'approve');
          if (response.data.success) {
            message.success('帖子已审核通过');
            // 重新获取待审核的帖子列表
            fetchPendingPosts();
          } else {
            message.error(response.data.message || '审核操作失败');
          }
        } catch (error) {
          console.error('审核帖子出错:', error);
          message.error('审核操作失败，请稍后重试');
        } finally {
          setReviewLoading(false);
        }
      },
    });
  };

  // 处理打开拒绝模态框
  const handleOpenRejectModal = (postId) => {
    setCurrentPostId(postId);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  // 处理关闭拒绝模态框
  const handleCloseRejectModal = () => {
    setRejectModalVisible(false);
    setCurrentPostId(null);
    setRejectReason('');
  };

  // 处理提交拒绝
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      message.error('请输入拒绝原因');
      return;
    }

    setReviewLoading(true);
    try {
      const response = await forumAPI.reviewPost(currentPostId, 'reject', rejectReason);
      if (response.data.success) {
        message.success('帖子已拒绝');
        setRejectModalVisible(false);
        // 重新获取待审核的帖子列表
        fetchPendingPosts();
      } else {
        message.error(response.data.message || '审核操作失败');
      }
    } catch (error) {
      console.error('审核帖子出错:', error);
      message.error('审核操作失败，请稍后重试');
    } finally {
      setReviewLoading(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout selectedKey="admin">
      <Content className="site-layout-content" style={{ padding: '0 50px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 0' }}>
          <Title level={2}>帖子审核管理</Title>
          <Text type="secondary" style={{ marginBottom: 20, display: 'block' }}>
            审核用户发布的帖子，通过后将对所有用户可见
          </Text>

          <Spin spinning={loading}>
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={posts}
              locale={{ emptyText: '暂无待审核的帖子' }}
              renderItem={(post) => (
                <List.Item>
                  <Card style={{ width: '100%' }}>
                    <Title level={4}>{post.title}</Title>
                    
                    <div style={{ marginBottom: 12 }}>
                      <Space>
                        <Text strong>作者: {post.author}</Text>
                        <Text type="secondary">
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          发布时间: {formatDate(post.created_at)}
                        </Text>
                      </Space>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <Space>
                        {post.tags && post.tags.map((tag, index) => (
                          <Tag key={index} color="blue">{tag}</Tag>
                        ))}
                      </Space>
                    </div>
                    
                    <Divider />
                    
                    <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                      {post.content}
                    </Paragraph>
                    
                    <Divider />
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Space>
                        <Button 
                          type="primary" 
                          icon={<CheckCircleOutlined />} 
                          onClick={() => handleApprove(post.id)}
                          loading={reviewLoading && currentPostId === post.id}
                        >
                          通过
                        </Button>
                        <Button 
                          danger 
                          icon={<CloseCircleOutlined />} 
                          onClick={() => handleOpenRejectModal(post.id)}
                        >
                          拒绝
                        </Button>
                      </Space>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </Spin>

          {total > 0 && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
              />
            </div>
          )}

          {/* 拒绝原因模态框 */}
          <Modal
            title="拒绝帖子"
            open={rejectModalVisible}
            onOk={handleReject}
            onCancel={handleCloseRejectModal}
            confirmLoading={reviewLoading}
          >
            <Form layout="vertical">
              <Form.Item
                label="拒绝原因"
                required
                rules={[{ required: true, message: '请输入拒绝原因' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="请输入拒绝原因，将通知给发帖用户"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
    </MainLayout>
  );
};

export default ForumReview;
