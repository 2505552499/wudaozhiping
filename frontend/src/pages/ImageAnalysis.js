import React, { useState, useEffect } from 'react';
import { 
  Upload, Button, Select, Card, Spin, 
  message, Row, Col, Divider, List, Tag, Progress, Tabs 
} from 'antd';
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import AngleDataVisualization from '../components/visualization/AngleDataVisualization';
import PoseVisualization from '../components/visualization/PoseVisualization';
import config from '../config';

const { Option } = Select;
const { TabPane } = Tabs;

const ImageAnalysis = () => {
  const [file, setFile] = useState(null);
  const [posture, setPosture] = useState('弓步冲拳');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [poses, setPoses] = useState([
    '弓步冲拳', '猛虎出洞', '五花坐山',
    '滚身冲拳', '猿猴纳肘', '马步推掌',
    '并步崩拳', '狮子张嘴', '马步扣床',
    '罗汉张掌'
  ]);

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
        // Use default poses if API call fails
      }
    };

    fetchPoses();
  }, []);

  const handleFileChange = (info) => {
    console.log('File info:', info);
    if (info.file && info.file.originFileObj) {
      setFile(info.file.originFileObj);
      message.success(`${info.file.name} 上传成功`);
    } else if (info.fileList && info.fileList.length > 0 && info.fileList[0].originFileObj) {
      setFile(info.fileList[0].originFileObj);
      message.success(`${info.fileList[0].name} 上传成功`);
    } else {
      console.error('无法获取文件对象:', info);
      message.error('文件上传失败，请重试');
    }
  };

  const handlePostureChange = (value) => {
    setPosture(value);
  };

  const handleAnalyze = async () => {
    if (!file) {
      message.warning('请先上传图片');
      return;
    }

    setAnalyzing(true);
    setLoading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('posture', posture);

      // Send request to backend
      const response = await axios.post('/api/analysis/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      if (response.data.success) {
        setResult({
          score: response.data.score,
          image_path: response.data.image_path,
          feedback: response.data.feedback,
          angle_data: response.data.angle_data
        });
        message.success('分析完成');
      } else {
        message.error(response.data.message || '分析失败');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      if (error.response) {
        console.log('Error response:', error.response);
        message.error(error.response.data?.message || '分析请求失败');
      } else if (error.request) {
        console.log('Error request:', error.request);
        message.error('服务器未响应，请检查网络连接');
      } else {
        console.log('Error message:', error.message);
        message.error('请求配置错误: ' + error.message);
      }
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

  const getScoreLevel = (score) => {
    if (score >= 8) return '优秀';
    if (score >= 6) return '良好';
    return '需要改进';
  };

  return (
    <MainLayout>
      <Card title="武术动作图像分析" bordered={false}>
        <p>
          您可以上传武术动作图片进行分析，系统将自动识别动作姿态，并提供评分和改进建议。
        </p>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="上传图片" bordered={false}>
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
                name="image"
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
                onChange={handleFileChange}
              >
                <Button icon={<UploadOutlined />}>选择图片</Button>
              </Upload>

              <div style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  onClick={handleAnalyze}
                  loading={analyzing}
                  disabled={false}
                >
                  开始分析
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            {loading ? (
              <div className="loading-container">
                <Spin size="large" tip="正在分析图像..." />
              </div>
            ) : result ? (
              <Card title="分析结果" bordered={false}>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="评分与建议" key="1">
                    <div className="result-container">
                      <div 
                        className="score-display" 
                        style={{ 
                          color: getScoreColor(result.score),
                          fontSize: '2.5em',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          margin: '16px 0'
                        }}
                      >
                        {result.score.toFixed(1)}
                        <span style={{ fontSize: '0.5em', marginLeft: 8 }}>/ 10</span>
                      </div>

                      <Progress 
                        percent={result.score * 10} 
                        status="active" 
                        strokeColor={getScoreColor(result.score)}
                      />

                      <Tag 
                        color={getScoreColor(result.score)} 
                        style={{ fontSize: 16, padding: '4px 8px', margin: '8px 0' }}
                      >
                        {getScoreLevel(result.score)}
                      </Tag>

                      <Divider>评价与建议</Divider>

                      <List
                        className="feedback-list"
                        itemLayout="horizontal"
                        dataSource={result.feedback.suggestions || []}
                        renderItem={item => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                result.score >= 6 ? 
                                <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                                <CloseCircleOutlined style={{ color: '#f5222d' }} />
                              }
                              description={item}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </TabPane>
                  
                  <TabPane tab="姿势图像" key="2">
                    <div style={{ textAlign: 'center' }}>
                      {result.image_path && (
                        <img 
                          src={result.image_path.startsWith('data:') ? result.image_path : `${config.API_BASE_URL}/${result.image_path}`} 
                          alt="分析结果" 
                          style={{ maxWidth: '100%', maxHeight: '400px' }} 
                        />
                      )}
                    </div>
                  </TabPane>
                  
                  <TabPane tab="角度数据" key="3">
                    <AngleDataVisualization 
                      poseName={posture} 
                      angleData={result.angle_data}
                    />
                  </TabPane>
                </Tabs>
              </Card>
            ) : (
              <Card title="分析结果" bordered={false}>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p>请上传图片并点击"开始分析"按钮</p>
                </div>
              </Card>
            )}
          </Col>
        </Row>

        {result && (
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="处理后的图像" bordered={false}>
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={result.image_path && (result.image_path.startsWith('data:') ? result.image_path : `${config.API_BASE_URL}/${result.image_path}`)}
                    alt="Processed"
                    className="pose-image"
                    style={{ maxWidth: '100%', maxHeight: 500 }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Card>
    </MainLayout>
  );
};

export default ImageAnalysis;
