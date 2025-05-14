import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layout, Typography, List, Card, Button, Tag, Space, 
  Pagination, Spin, message, Row, Col, Avatar 
} from 'antd';
import { 
  LikeOutlined, EyeOutlined, CommentOutlined, 
  PlusOutlined, ClockCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { forumAPI } from '../api';
import MainLayout from '../components/MainLayout';

const { Title, Text } = Typography;
const { Content } = Layout;

const ForumList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  // 获取帖子列表
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await forumAPI.getPosts(page, pageSize);
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
    fetchPosts();
  }, [fetchPosts]);

  // 处理分页变化
  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // 处理创建帖子按钮点击
  const handleCreatePost = () => {
    navigate('/forum/create');
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
    <MainLayout selectedKey="forum">
      <Content className="site-layout-content" style={{ padding: '0 50px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 0' }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
            <Col>
              <Title level={2}>武友论坛</Title>
              <Text type="secondary">交流武术心得，分享习武体验</Text>
            </Col>
            <Col>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleCreatePost}
              >
                发布帖子
              </Button>
            </Col>
          </Row>

          <Spin spinning={loading}>
            <List
              grid={{ gutter: 16, column: 1 }}
              dataSource={posts}
              renderItem={(post) => (
                <List.Item>
                  <Card 
                    hoverable 
                    style={{ width: '100%' }}
                    onClick={() => navigate(`/forum/post/${post.id}`)}
                  >
                    <Title level={4}>{post.title}</Title>
                    <div style={{ marginBottom: 12 }}>
                      <Space>
                        <Avatar size="small">{post.author.charAt(0).toUpperCase()}</Avatar>
                        <Text type="secondary">{post.author}</Text>
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
                    <div style={{ marginTop: 12 }}>
                      <Space>
                        <Text type="secondary">
                          <LikeOutlined style={{ marginRight: 4 }} />
                          {post.likes || 0}
                        </Text>
                        <Text type="secondary">
                          <CommentOutlined style={{ marginRight: 4 }} />
                          {post.comment_count || 0}
                        </Text>
                        <Text type="secondary">
                          <EyeOutlined style={{ marginRight: 4 }} />
                          {post.views || 0}
                        </Text>
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
        </div>
      </Content>
    </MainLayout>
  );
};

export default ForumList;
