import React, { useState, useEffect } from 'react';
import { 
  Upload, Button, Select, Card, Spin, 
  message, Row, Col, Divider, List, Tag, Progress, Timeline 
} from 'antd';
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import AngleDataVisualization from '../components/visualization/AngleDataVisualization';

const { Option } = Select;

const VideoAnalysis = () => {
  const [file, setFile] = useState(null);
  const [posture, setPosture] = useState('弓步冲拳');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [poses, setPoses] = useState([]);
  const [fileList, setFileList] = useState([]); // 新增：用于跟踪上传文件列表

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

    fetchPoses();
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
        message.success(`文件 "${latestFile.name}" 已选择`);
      }
    } else {
      // 当没有文件时
      setFile(null);
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

  return (
    <MainLayout>
      <Card title="武术动作视频分析" bordered={false}>
        <p>
          您可以上传武术动作视频进行分析，系统将自动识别视频中的动作姿态序列，并提供评分和改进建议。
        </p>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="上传视频" bordered={false}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ marginRight: 8 }}>选择动作类型:</label>
                <Select
                  value={posture}
                  onChange={handlePostureChange}
                  style={{ width: 200 }}
                >
                  {poses.map(pose => (
                    <Option key={pose} value={pose}>{pose}</Option>
                  ))}
                </Select>
              </div>

              <Upload
                name="video"
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleFileChange}
                accept="video/*"
                fileList={fileList} // 新增：使用受控的文件列表
              >
                <Button icon={<UploadOutlined />}>选择视频</Button>
              </Upload>

              <div style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  onClick={handleAnalyze}
                  loading={analyzing}
                  disabled={!file} // 恢复禁用条件，但确保文件状态正确设置
                >
                  开始分析
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            {loading ? (
              <div className="loading-container">
                <Spin size="large" tip="正在分析视频..." />
              </div>
            ) : result ? (
              <Card title="分析结果" bordered={false}>
                <div className="result-container">
                  <div 
                    className="score-display" 
                    style={{ color: getScoreColor(result.average_score) }}
                  >
                    {result.average_score.toFixed(1)}
                    <span style={{ fontSize: '0.5em', marginLeft: 8 }}>/ 10</span>
                  </div>

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
              </Card>
            ) : (
              <Card title="分析结果" bordered={false}>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p>请上传视频并点击"开始分析"按钮</p>
                </div>
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
