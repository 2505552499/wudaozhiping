import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layout, Typography, List, Card, Tag, Space, 
  Pagination, Spin, message, Badge, Tooltip
} from 'antd';
import { 
  LikeOutlined, EyeOutlined, CommentOutlined, 
  ClockCircleOutlined, CheckCircleOutlined,
  CloseCircleOutlined, HourglassOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { forumAPI } from '../api';
import MainLayout from '../components/MainLayout';

const { Title, Text } = Typography;
const { Content } = Layout;

const ForumMyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 获取用户帖子列表
  const fetchUserPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await forumAPI.getUserPosts(page, pageSize);
      if (response.data.success) {
        setPosts(response.data.posts);
        setTotal(response.data.total);
      } else {
        message.error(response.data.message || '获取帖子列表失败');
      }
    } catch (error) {
      console.error('获取帖子列表出错:', error);
      message.error('获取帖子列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // 页面加载时获取帖子列表
  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  // 处理分页变化
  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
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

  // 获取帖子状态标签
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <Tooltip title="已审核通过">
            <Badge 
              status="success" 
              text={<Text type="success"><CheckCircleOutlined /> 已通过</Text>} 
            />
          </Tooltip>
        );
      case 'rejected':
        return (
          <Tooltip title="审核未通过">
            <Badge 
              status="error" 
              text={<Text type="danger"><CloseCircleOutlined /> 未通过</Text>} 
            />
          </Tooltip>
        );
      case 'pending':
      default:
        return (
          <Tooltip title="等待审核">
            <Badge 
              status="processing" 
              text={<Text type="warning"><HourglassOutlined /> 审核中</Text>} 
            />
          </Tooltip>
        );
    }
  };

  return (
    <MainLayout selectedKey="forum">
      <Content className="site-layout-content" style={{ padding: '0 50px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 0' }}>
          <Title level={2}>我的帖子</Title>
          <Text type="secondary" style={{ marginBottom: 20, display: 'block' }}>
            查看您发布的所有帖子及其审核状态
          </Text>

          <Spin spinning={loading}>
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={posts}
              locale={{ emptyText: '您还没有发布过帖子' }}
              renderItem={(post) => (
                <List.Item>
                  <Card hoverable style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Link to={`/forum/post/${post.id}`}>
                        <Title level={4}>{post.title}</Title>
                      </Link>
                      <div>{getStatusBadge(post.status)}</div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <Space>
                        <Text type="secondary">
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {formatDate(post.created_at)}
                        </Text>
                      </Space>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <Text ellipsis={{ rows: 2 }}>
                        {post.content.length > 150 
                          ? post.content.substring(0, 150) + '...' 
                          : post.content}
                      </Text>
                    </div>
                    
                    <div>
                      <Space>
                        {post.tags && post.tags.map((tag, index) => (
                          <Tag key={index} color="blue">{tag}</Tag>
                        ))}
                      </Space>
                    </div>
                    
                    {post.status === 'approved' && (
                      <div style={{ marginTop: 12 }}>
                        <Space>
                          <Text type="secondary">
                            <LikeOutlined style={{ marginRight: 4 }} />
                            {post.likes || 0}
                          </Text>
                          <Text type="secondary">
                            <CommentOutlined style={{ marginRight: 4 }} />
                            {post.comments ? post.comments.length : 0}
                          </Text>
                          <Text type="secondary">
                            <EyeOutlined style={{ marginRight: 4 }} />
                            {post.views || 0}
                          </Text>
                        </Space>
                      </div>
                    )}
                    
                    {post.status === 'rejected' && post.reject_reason && (
                      <div style={{ marginTop: 12, padding: 10, backgroundColor: '#fff2f0', borderRadius: 4 }}>
                        <Text type="danger">拒绝原因: {post.reject_reason}</Text>
                      </div>
                    )}
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
        </div>
      </Content>
    </MainLayout>
  );
};

export default ForumMyPosts;
