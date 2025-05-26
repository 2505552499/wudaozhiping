import React, { useState, useEffect } from 'react';
import { List, Card, Button, Tag, message, Modal, Rate, Typography, Divider, Empty } from 'antd';
import { 
  PlayCircleOutlined, 
  EyeOutlined, 
  DeleteOutlined, 
  StarOutlined,
  CommentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import VideoAnnotation from './VideoAnnotation';

const { Text, Paragraph } = Typography;

const TrainingVideoList = ({ appointmentId, userRole, refreshTrigger }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // 获取训练视频列表
  const fetchVideos = async () => {
    if (!appointmentId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/training-videos/appointment/${appointmentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setVideos(response.data.videos || []);
      } else {
        message.error(response.data.message || '获取训练视频失败');
      }
    } catch (error) {
      console.error('获取训练视频失败:', error);
      if (error.response?.status !== 403) {
        message.error('获取训练视频失败');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [appointmentId, refreshTrigger]);

  // 删除训练视频
  const handleDeleteVideo = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_BASE_URL}/api/training-videos/${videoId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        message.success('训练视频删除成功');
        fetchVideos(); // 刷新列表
      } else {
        message.error(response.data.message || '删除失败');
      }
    } catch (error) {
      console.error('删除训练视频失败:', error);
      message.error('删除失败，请稍后重试');
    }
  };

  // 查看视频详情
  const handleViewVideo = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  // 获取状态标签
  const getStatusTag = (video) => {
    const status = video.annotation_status;
    const published = video.annotation_published;

    if (status === 'pending') {
      return <Tag color="orange">待标注</Tag>;
    } else if (status === 'annotated' && !published) {
      return <Tag color="blue">已标注</Tag>;
    } else if (status === 'published' || published) {
      return <Tag color="green">已发布</Tag>;
    }
    return <Tag color="default">未知状态</Tag>;
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // 渲染视频项
  const renderVideoItem = (video) => {
    const canDelete = userRole === 'user' && video.user_id === localStorage.getItem('username');
    const canView = true; // 所有相关用户都可以查看
    const showScore = video.annotation_published && video.coach_score !== null;
    const showFeedback = video.annotation_published && video.coach_feedback;

    return (
      <List.Item key={video.id}>
        <Card
          style={{ width: '100%' }}
          actions={[
            canView && (
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleViewVideo(video)}
              >
                查看详情
              </Button>
            ),
            canDelete && (
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  Modal.confirm({
                    title: '确认删除',
                    content: '确定要删除这个训练视频吗？删除后无法恢复。',
                    onOk: () => handleDeleteVideo(video.id),
                  });
                }}
              >
                删除
              </Button>
            ),
          ].filter(Boolean)}
        >
          <Card.Meta
            avatar={<PlayCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{video.original_filename}</span>
                {getStatusTag(video)}
              </div>
            }
            description={
              <div>
                <div style={{ marginBottom: 8 }}>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  <Text type="secondary">上传时间: {formatTime(video.upload_time)}</Text>
                </div>
                
                {video.description && (
                  <div style={{ marginBottom: 8 }}>
                    <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                      {video.description}
                    </Paragraph>
                  </div>
                )}

                {showScore && (
                  <div style={{ marginBottom: 8 }}>
                    <StarOutlined style={{ marginRight: 4, color: '#faad14' }} />
                    <Text strong>教练评分: </Text>
                    <Rate disabled value={video.coach_score} style={{ fontSize: '14px' }} />
                    <Text style={{ marginLeft: 8 }}>({video.coach_score}/5)</Text>
                  </div>
                )}

                {showFeedback && (
                  <div>
                    <CommentOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                    <Text strong>教练反馈: </Text>
                    <Paragraph ellipsis={{ rows: 2, expandable: true }}>
                      {video.coach_feedback}
                    </Paragraph>
                  </div>
                )}
              </div>
            }
          />
        </Card>
      </List.Item>
    );
  };

  return (
    <div>
      <List
        loading={loading}
        dataSource={videos}
        renderItem={renderVideoItem}
        locale={{
          emptyText: (
            <Empty
              description="暂无训练视频"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />

      {/* 视频详情模态框 */}
      <Modal
        title="训练视频详情"
        open={showVideoModal}
        onCancel={() => {
          setShowVideoModal(false);
          setSelectedVideo(null);
        }}
        footer={null}
        width={1000}
        destroyOnClose
      >
        {selectedVideo && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>文件名: </Text>
              <Text>{selectedVideo.original_filename}</Text>
              <Divider type="vertical" />
              <Text strong>上传时间: </Text>
              <Text>{formatTime(selectedVideo.upload_time)}</Text>
              <Divider type="vertical" />
              {getStatusTag(selectedVideo)}
            </div>

            {selectedVideo.description && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>视频描述: </Text>
                <Paragraph>{selectedVideo.description}</Paragraph>
              </div>
            )}

            {/* 视频播放和标注组件 */}
            <VideoAnnotation
              videoId={selectedVideo.filename}
              videoUrl={`${API_BASE_URL}/uploads/training_videos/${selectedVideo.filename}`}
              isCoach={userRole === 'coach'}
              trainingVideoId={selectedVideo.id}
              onAnnotationUpdate={fetchVideos}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrainingVideoList;
