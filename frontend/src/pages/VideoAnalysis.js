import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Button, Select, Card, Spin, Tabs, 
  message, Row, Col, Divider, List, Tag, Progress, Timeline 
} from 'antd';
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import AngleDataVisualization from '../components/visualization/AngleDataVisualization';
import VideoAnnotation from '../components/VideoAnnotation';

const { Option } = Select;
const { TabPane } = Tabs;

const VideoAnalysis = () => {
  const [file, setFile] = useState(null);
  const [posture, setPosture] = useState('弓步冲拳');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [poses, setPoses] = useState([]);
  const [fileList, setFileList] = useState([]); // 新增：用于跟踪上传文件列表
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const videoRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false); // 判断当前用户是否为管理员
  const [activeTab, setActiveTab] = useState('1'); // 当前活动的标签页

  useEffect(() => {
    // Fetch available poses
    const fetchPoses = async () => {
      try {
        const response = await axios.get('/api/poses');
        if (response.data.success) {
          setPoses(response.data.poses);
        }
      } catch (error) {
        console.error('Error fetching poses:', error);
        message.error('获取姿势列表失败');
      }
    };

    // 检查用户角色
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (response.data.success) {
            setIsAdmin(response.data.user.role === 'admin');
          }
        }
      } catch (error) {
        console.error('检查用户角色失败:', error);
      }
    };

    fetchPoses();
    checkUserRole();
  }, []);

  // 完全重写文件上传处理函数
  const handleFileChange = (info) => {
    console.log('File change event:', info);
    
    // 更新文件列表状态
    setFileList(info.fileList.slice(-1)); // 只保留最新的一个文件
    
    // 当有文件被选择时
    if (info.fileList.length > 0) {
      const latestFile = info.fileList[info.fileList.length - 1];
      console.log('Latest file:', latestFile);
      
      // 设置文件状态
      if (latestFile.originFileObj) {
        setFile(latestFile.originFileObj);
        
        // 生成一个临时的唯一ID作为视频ID
        const tempVideoId = `video_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        setVideoId(tempVideoId);
        
        // 创建视频URL用于播放
        const videoURL = URL.createObjectURL(latestFile.originFileObj);
        setVideoUrl(videoURL);
        
        message.success(`文件 "${latestFile.name}" 已选择`);
      }
    } else {
      // 当没有文件时
      setFile(null);
      setVideoUrl('');
      setVideoId('');
    }
  };

  const handlePostureChange = (value) => {
    setPosture(value);
  };

  const handleAnalyze = async () => {
    // 检查文件是否存在
    if (!file) {
      message.warning('请先上传视频文件');
      return;
    }
    
    setAnalyzing(true);
    setLoading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('video', file);
      formData.append('posture', posture);

      // 添加调试信息
      console.log('Sending video analysis request with:', { fileName: file.name, fileSize: file.size, posture });

      // Send request to backend
      const response = await axios.post('/api/analysis/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 添加调试信息
      console.log('Received response:', response.data);

      if (response.data.success) {
        // 修复这里：直接使用response.data而不是results字段
        setResult({
          average_score: response.data.average_score,
          frame_scores: response.data.frame_scores,
          key_frames: response.data.key_frames,
          feedback: response.data.feedback,
          angle_data: response.data.angle_data // 添加角度数据
        });
        message.success('分析完成');
      } else {
        message.error(response.data.message || '分析失败');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      message.error(error.response?.data?.message || '分析请求失败');
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#52c41a';
    if (score >= 6) return '#faad14';
    return '#f5222d';
  };

  const handleAnnotationSelected = (timestamp) => {
    // 当用户点击批注时，跳转到对应时间点
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp / 1000;
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <MainLayout>
      <Card title="武术动作视频分析" bordered={false}>
        <p>
          您可以上传武术动作视频进行分析，系统将自动识别视频中的动作姿态序列，并提供评分和改进建议。
        </p>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card title="上传视频" bordered={false}>
              <Upload
                name="video"
                listType="picture"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // 阻止自动上传
                accept="video/*"
              >
                <Button icon={<UploadOutlined />}>选择视频文件</Button>
              </Upload>

              {videoUrl && (
                <div style={{ marginTop: 16 }}>
                  <video 
                    ref={videoRef} 
                    src={videoUrl} 
                    controls 
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              <Divider />

              <Select
                placeholder="选择标准姿势"
                style={{ width: '100%', marginBottom: 16 }}
                value={posture}
                onChange={handlePostureChange}
              >
                {poses.map(pose => (
                  <Option key={pose} value={pose}>{pose}</Option>
                ))}
              </Select>

              <Button 
                type="primary" 
                onClick={handleAnalyze} 
                disabled={!file || analyzing} 
                loading={analyzing}
                block
              >
                开始分析
              </Button>
            </Card>
          </Col>

          <Col xs={24} md={16}>
            {loading ? (
              <Card bordered={false}>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Spin size="large" />
                  <p style={{ marginTop: 16 }}>正在分析视频，请稍候...</p>
                </div>
              </Card>
            ) : (
              <Card bordered={false}>
                <Tabs activeKey={activeTab} onChange={handleTabChange}>
                  <TabPane tab="分析结果" key="1">
                    {result ? (
                      <div>
                        <Progress 
                          percent={result.average_score * 10} 
                          status="active" 
                          strokeColor={getScoreColor(result.average_score)}
                        />

                        <Tag 
                          color={getScoreColor(result.average_score)} 
                          style={{ fontSize: 16, padding: '4px 8px', margin: '8px 0' }}
                        >
                          {result.feedback.level}
                        </Tag>

                        <Divider>评价与建议</Divider>

                        <List
                          className="feedback-list"
                          itemLayout="horizontal"
                          dataSource={result.feedback.suggestions}
                          renderItem={item => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  result.average_score >= 8 
                                    ? <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} /> 
                                    : <CloseCircleOutlined style={{ color: '#f5222d', fontSize: 18 }} />
                                }
                                description={item}
                              />
                            </List.Item>
                          )}
                        />
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <p>请上传视频并点击"开始分析"按钮</p>
                      </div>
                    )}
                  </TabPane>
                  <TabPane tab="批注" key="2">
                    {videoUrl ? (
                      <VideoAnnotation 
                        videoUrl={videoUrl}
                        videoId={videoId}
                        videoRef={videoRef}
                        isAdmin={isAdmin}
                        onAnnotationSelected={handleAnnotationSelected}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <p>请先上传视频文件</p>
                      </div>
                    )}
                  </TabPane>
                </Tabs>
              </Card>
            )}
          </Col>
        </Row>

        {result && result.key_frames && result.key_frames.length > 0 && (
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="关键帧分析" bordered={false}>
                <Row gutter={[16, 16]}>
                  {result.key_frames.map((frame, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={index}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={`关键帧 ${index + 1}`}
                            src={`data:image/jpeg;base64,${frame.image}`}
                          />
                        }
                      >
                        <Card.Meta
                          title={`关键帧 ${index + 1}`}
                          description={
                            <>
                              <p>时间: {frame.time.toFixed(2)}秒</p>
                              <p>评分: {frame.score.toFixed(1)}</p>
                            </>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        )}

        {result && result.frame_scores && result.frame_scores.length > 0 && (
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="动作评分时间线" bordered={false}>
                <Timeline mode="alternate">
                  {result.frame_scores
                    .filter((_, i) => i % 5 === 0) // Show every 5th frame to avoid clutter
                    .map((frame, index) => (
                      <Timeline.Item
                        key={index}
                        color={getScoreColor(frame.score)}
                        dot={<PlayCircleOutlined />}
                      >
                        <p>时间: {frame.time.toFixed(2)}秒</p>
                        <p>评分: {frame.score.toFixed(1)}</p>
                      </Timeline.Item>
                    ))}
                </Timeline>
              </Card>
            </Col>
          </Row>
        )}

        {result && result.angle_data && (
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="角度数据可视化" bordered={false}>
                <AngleDataVisualization data={result.angle_data} />
              </Card>
            </Col>
          </Row>
        )}
      </Card>
    </MainLayout>
  );
};

export default VideoAnalysis;
