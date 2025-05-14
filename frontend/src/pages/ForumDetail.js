import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layout, Typography, Card, Button, Tag, Space, 
  Spin, message, Avatar, Divider, Form,
  Input, List, Tooltip
} from 'antd';
import { 
  LikeOutlined, LikeFilled, EyeOutlined, 
  ClockCircleOutlined, UserOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { forumAPI } from '../api';
import MainLayout from '../components/MainLayout';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { TextArea } = Input;

// 自定义评论组件，替代 Ant Design 的 Comment 组件
const CommentItem = ({ author, avatar, content, datetime, actions }) => {
  return (
    <div style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }}>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <div style={{ marginRight: 12 }}>{avatar}</div>
        <div>
          <div style={{ fontWeight: 'bold' }}>{author}</div>
          <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>{datetime}</div>
        </div>
      </div>
      <div style={{ marginLeft: 48, marginBottom: 8 }}>{content}</div>
      {actions && (
        <div style={{ marginLeft: 48 }}>
          {actions.map((action, index) => (
            <span key={index} style={{ marginRight: 12 }}>{action}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const ForumDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  // 获取帖子详情
  const fetchPostDetail = useCallback(async () => {
    setLoading(true);
    try {
      console.log('正在获取帖子详情，帖子ID:', postId);
      const response = await forumAPI.getPostDetail(postId);
      console.log('帖子详情响应:', response);
      if (response.data.success) {
        setPost(response.data.post);
      } else {
        message.error(response.data.message || '获取帖子详情失败');
      }
    } catch (error) {
      console.error('获取帖子详情出错:', error);
      message.error('获取帖子详情失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // 页面加载时获取帖子详情
  useEffect(() => {
    if (postId) {
      fetchPostDetail();
    }
  }, [postId, fetchPostDetail]);

  // 处理提交评论
  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      message.error('评论内容不能为空');
      return;
    }

    setSubmitting(true);
    try {
      const response = await forumAPI.addComment(postId, commentContent);
      if (response.data.success) {
        message.success('评论发布成功');
        setCommentContent('');
        // 重新获取帖子详情以更新评论列表
        fetchPostDetail();
      } else {
        message.error(response.data.message || '发布评论失败');
      }
    } catch (error) {
      console.error('发布评论出错:', error);
      message.error('发布评论失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理点赞帖子
  const handleLikePost = async () => {
    if (liked) return;
    
    try {
      console.log('点赞帖子:', postId);
      const response = await forumAPI.likePost(postId);
      console.log('点赞响应:', response);
      
      if (response.data.success) {
        setLiked(true);
        setPost({
          ...post,
          likes: (post.likes || 0) + 1
        });
        message.success('点赞成功');
      } else {
        message.error(response.data.message || '点赞失败');
      }
    } catch (error) {
      console.error('点赞帖子出错:', error);
      message.error('点赞失败，请稍后重试');
    }
  };

  // 处理点赞评论
  const handleLikeComment = async (commentId, index) => {
    try {
      console.log('点赞评论:', commentId, index);
      const response = await forumAPI.likeComment(commentId);
      console.log('评论点赞响应:', response);
      
      if (response.data.success) {
        // 更新评论点赞数
        const updatedComments = [...post.comments];
        updatedComments[index] = {
          ...updatedComments[index],
          likes: (updatedComments[index].likes || 0) + 1,
          liked: true
        };
        
        setPost({
          ...post,
          comments: updatedComments
        });
        
        message.success('点赞成功');
      } else {
        message.error(response.data.message || '点赞失败');
      }
    } catch (error) {
      console.error('点赞评论出错:', error);
      message.error('点赞失败，请稍后重试');
    }
  };

  // 返回论坛列表
  const handleBack = () => {
    navigate('/forum');
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
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 0' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ marginBottom: 16 }}
          >
            返回论坛
          </Button>

          <Spin spinning={loading}>
            {post && (
              <>
                <Card>
                  <Title level={2}>{post.title}</Title>
                  
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Avatar icon={<UserOutlined />} />
                      <Text strong>{post.author}</Text>
                      <Text type="secondary">
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {formatDate(post.created_at)}
                      </Text>
                    </Space>
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      {post.tags && post.tags.map((tag, index) => (
                        <Tag key={index} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                  </div>
                  
                  <Divider />
                  
                  <Paragraph style={{ fontSize: 16, whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </Paragraph>
                  
                  <Divider />
                  
                  <div>
                    <Space>
                      <Button 
                        type="text" 
                        icon={liked ? <LikeFilled /> : <LikeOutlined />} 
                        onClick={handleLikePost}
                        disabled={liked}
                      >
                        点赞 ({post.likes || 0})
                      </Button>
                      
                      <Text type="secondary">
                        <EyeOutlined style={{ marginRight: 4 }} />
                        浏览 {post.views || 0}
                      </Text>
                    </Space>
                  </div>
                </Card>

                <Card style={{ marginTop: 24 }}>
                  <Title level={4}>评论 ({post.comments ? post.comments.length : 0})</Title>
                  
                  <Form onFinish={handleSubmitComment}>
                    <Form.Item name="comment" rules={[{ required: true, message: '评论内容不能为空' }]}>
                      <TextArea 
                        rows={4} 
                        placeholder="写下你的评论..." 
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        maxLength={500}
                        showCount
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button 
                        htmlType="submit" 
                        loading={submitting} 
                        type="primary"
                      >
                        发表评论
                      </Button>
                    </Form.Item>
                  </Form>

                  {post.comments && post.comments.length > 0 ? (
                    <List
                      dataSource={post.comments}
                      header={`${post.comments.length} 条评论`}
                      itemLayout="horizontal"
                      renderItem={(comment, index) => (
                        <CommentItem
                          author={comment.author}
                          avatar={<Avatar>{comment.author.charAt(0).toUpperCase()}</Avatar>}
                          content={comment.content}
                          datetime={
                            <Tooltip title={formatDate(comment.created_at)}>
                              <span>{formatDate(comment.created_at)}</span>
                            </Tooltip>
                          }
                          actions={[
                            <Tooltip key="comment-like" title="点赞">
                              <span onClick={() => !comment.liked && handleLikeComment(comment.id, index)}>
                                {comment.liked ? <LikeFilled /> : <LikeOutlined />}
                                <span className="comment-action">{comment.likes || 0}</span>
                              </span>
                            </Tooltip>
                          ]}
                        />
                      )}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <Text type="secondary">暂无评论，快来发表第一条评论吧！</Text>
                    </div>
                  )}
                </Card>
              </>
            )}
          </Spin>
        </div>
      </Content>
    </MainLayout>
  );
};

export default ForumDetail;
