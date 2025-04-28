import React, { useState, useEffect, useRef } from 'react';
import { 
  Button, Select, Card, Spin, 
  message, Row, Col, Progress, Alert, Space
} from 'antd';
import { 
  CameraOutlined, 
  PauseCircleOutlined, 
  PlayCircleOutlined,
  CameraFilled
} from '@ant-design/icons';
import axios from 'axios';
import Webcam from 'react-webcam';
import MainLayout from '../components/MainLayout';
import AngleDataVisualization from '../components/visualization/AngleDataVisualization';
import config from '../config';

const { Option } = Select;

const CameraAnalysis = () => {
  const webcamRef = useRef(null);
  const [posture, setPosture] = useState('弓步冲拳');
  const [cameraActive, setCameraActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [poses, setPoses] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [processedImage, setProcessedImage] = useState(null);
  const [analysisInterval, setAnalysisInterval] = useState(null);
  const [snapshotResult, setSnapshotResult] = useState(null);

  useEffect(() => {
    // Fetch available poses
    const fetchPoses = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/poses`);
        if (response.data.success) {
          setPoses(response.data.poses);
        }
      } catch (error) {
        console.error('Error fetching poses:', error);
        message.error('获取姿势列表失败');
      }
    };

    fetchPoses();

    // Clean up on unmount
    return () => {
      if (analysisInterval) {
        clearInterval(analysisInterval);
      }
    };
  }, [analysisInterval]);

  const handlePostureChange = (value) => {
    setPosture(value);
  };

  const startCamera = () => {
    setCameraActive(true);
  };

  const stopCamera = () => {
    setCameraActive(false);
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisInterval(null);
    }
    setAnalyzing(false);
    setProcessedImage(null);
  };

  const captureFrame = async () => {
    if (!webcamRef.current) {
      message.error('摄像头未准备好');
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      message.error('无法捕获图像');
      return;
    }

    try {
      // 显示加载状态
      setProcessedImage(null); // 清除之前的图像，避免显示旧结果
      
      // 添加调试信息
      console.log('发送摄像头分析请求...');
      
      // 发送base64图像数据到后端
      const response = await axios.post(`${config.API_BASE_URL}/api/analysis/camera`, {
        image: imageSrc,
        posture: posture
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 增加超时时间到15秒
      });

      // 添加调试信息
      console.log('收到摄像头分析响应:', response.data);

      if (response.data.success) {
        setCurrentScore(response.data.score);
        setProcessedImage(response.data.image);
        
        // 添加角度数据处理
        if (response.data.angle_data) {
          setResult({
            score: response.data.score,
            feedback: response.data.feedback,
            angle_data: response.data.angle_data
          });
        }
      } else {
        console.error('Analysis failed:', response.data.message);
        message.error('分析失败: ' + response.data.message);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      // 尝试重新连接
      if (error.message.includes('timeout') || error.message.includes('Network Error')) {
        message.warning('网络连接超时，将在下次自动重试');
      }
    }
  };

  const startAnalysis = () => {
    if (!cameraActive) {
      message.warning('请先启动摄像头');
      return;
    }

    setAnalyzing(true);
    // 降低分析频率，从1秒改为3秒，减轻服务器负担并改善用户体验
    const interval = setInterval(() => {
      captureFrame();
    }, 3000); // 每3秒分析一次
    setAnalysisInterval(interval);
    
    // 立即进行一次分析
    captureFrame();
  };

  const stopAnalysis = () => {
    if (analysisInterval) {
      clearInterval(analysisInterval);
      setAnalysisInterval(null);
    }
    setAnalyzing(false);
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

  const getScoreFeedback = (score, pose) => {
    if (pose === '弓步冲拳') {
      if (score >= 8) {
        return '动作标准！保持良好的弓步姿势和有力的冲拳。';
      } else if (score >= 6) {
        return '姿势较好，但仍有提升空间：重心可以更加前倾，拳头收紧，手臂伸展更有力。';
      } else {
        return '弓步不够稳定，前腿弯曲不足，拳头位置过低。前腿膝盖应在脚尖上方，拳头应与肩同高。';
      }
    } else if (pose === '猛虎出洞') {
      if (score >= 8) {
        return '动作有力！虎爪姿态标准，冲击力十足。';
      } else if (score >= 6) {
        return '虎爪形态较好，但力量感不足：增强前冲的爆发力，虎爪姿势更加紧凑。';
      } else {
        return '虎爪姿势不够标准，站立不稳。虎爪五指张开，指尖用力，手臂伸展更有力。';
      }
    } else {
      if (score >= 8) {
        return '动作标准！继续保持这种良好的姿势。';
      } else if (score >= 6) {
        return '姿势基本正确，但细节需要改进，关节角度接近标准，继续练习。';
      } else {
        return '姿势基本形态需要调整，关节角度与标准姿势差异较大，建议参考标准姿势图片进行练习。';
      }
    }
  };

  const captureAndAnalyzeSnapshot = async () => {
    if (!webcamRef.current) {
      message.error('摄像头未准备好');
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      message.error('无法捕获图像');
      return;
    }

    // 显示加载状态
    message.loading('正在分析截图...', 0);

    // Convert base64 to blob
    const byteString = atob(imageSrc.split(',')[1]);
    const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], "snapshot.jpg", { type: "image/jpeg" });

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('posture', posture);

      // 使用图像分析API而不是摄像头帧分析API
      const response = await axios.post(`${config.API_BASE_URL}/api/analysis/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 关闭加载消息
      message.destroy();

      if (response.data.success) {
        setSnapshotResult({
          score: response.data.score,
          feedback: response.data.feedback,
          processedImage: response.data.image_path && (response.data.image_path.startsWith('data:') 
            ? response.data.image_path 
            : `${config.API_BASE_URL}/${response.data.image_path}`),
          angle_data: response.data.angle_data // 添加角度数据
        });
        message.success('截图分析完成');
      } else {
        message.error(`分析失败: ${response.data.message}`);
      }
    } catch (error) {
      // 关闭加载消息
      message.destroy();
      console.error('Snapshot analysis error:', error);
      message.error('截图分析出错，请重试');
    }
  };

  return (
    <MainLayout>
      <Card title="实时摄像头动作分析" bordered={false}>
        <p>
          系统将通过摄像头实时采集您的动作，并立即分析评估您的武术姿态，提供及时反馈。
        </p>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="摄像头控制" bordered={false}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ marginRight: 8 }}>选择动作类型:</label>
                <Select
                  value={posture}
                  onChange={handlePostureChange}
                  style={{ width: 200 }}
                  disabled={analyzing}
                >
                  {poses.map(pose => (
                    <Option key={pose} value={pose}>{pose}</Option>
                  ))}
                </Select>
              </div>

              <div className="camera-container">
                {cameraActive ? (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="webcam"
                    mirrored={true}
                  />
                ) : (
                  <div 
                    style={{ 
                      width: '100%', 
                      height: 300, 
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 8
                    }}
                  >
                    <CameraFilled style={{ fontSize: 48, color: '#bfbfbf' }} />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center', gap: '16px' }}>
                {!cameraActive ? (
                  <Button 
                    type="primary" 
                    icon={<CameraOutlined />} 
                    onClick={startCamera}
                  >
                    启动摄像头
                  </Button>
                ) : (
                  <>
                    <Button 
                      danger 
                      icon={<CameraOutlined />} 
                      onClick={stopCamera}
                    >
                      关闭摄像头
                    </Button>
                    
                    {!analyzing ? (
                      <Button 
                        type="primary" 
                        icon={<PlayCircleOutlined />} 
                        onClick={startAnalysis}
                      >
                        开始分析
                      </Button>
                    ) : (
                      <Button 
                        danger 
                        icon={<PauseCircleOutlined />} 
                        onClick={stopAnalysis}
                      >
                        停止分析
                      </Button>
                    )}
                    
                    <Button 
                      type="primary" 
                      icon={<CameraFilled />} 
                      onClick={captureAndAnalyzeSnapshot}
                    >
                      截图分析
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="实时分析结果" bordered={false}>
              {analyzing ? (
                <div className="result-container">
                  <div 
                    className="score-display" 
                    style={{ color: getScoreColor(currentScore) }}
                  >
                    {currentScore.toFixed(1)}
                    <span style={{ fontSize: '0.5em', marginLeft: 8 }}>/ 10</span>
                  </div>

                  <Progress 
                    type="circle"
                    percent={currentScore * 10}
                    width={120}
                    format={() => (
                      <span style={{ fontSize: 24, color: getScoreColor(currentScore) }}>
                        {currentScore.toFixed(1)}
                      </span>
                    )}
                    strokeColor={getScoreColor(currentScore)}
                  />
                  
                  <div style={{ marginTop: 16 }}>
                    <Alert
                      message={getScoreLevel(currentScore)}
                      description={getScoreFeedback(currentScore, posture)}
                      type={currentScore >= 8 ? "success" : currentScore >= 6 ? "warning" : "error"}
                      showIcon
                    />
                  </div>

                  {result && result.angle_data && (
                    <div style={{ marginTop: 16 }}>
                      <AngleDataVisualization angleData={result.angle_data} poseName={posture} />
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p>请启动摄像头并点击"开始分析"按钮</p>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {processedImage && (
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="处理后的图像" bordered={false}>
                <div style={{ textAlign: 'center' }}>
                  <img 
                    src={processedImage} 
                    alt="Processed" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '500px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '4px'
                    }} 
                  />
                  <p style={{ marginTop: 8, color: '#888' }}>
                    每3秒自动更新一次分析结果
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {snapshotResult && (
          <Card title="截图分析结果" bordered={false} style={{ marginTop: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                {snapshotResult.processedImage && (
                  <img 
                    src={snapshotResult.processedImage} 
                    alt="Processed snapshot" 
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                  />
                )}
              </Col>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 16 }}>
                  <h3>评分: {snapshotResult.score.toFixed(1)} / 10</h3>
                  <Progress 
                    percent={snapshotResult.score * 10} 
                    status={snapshotResult.score >= 6 ? "success" : "exception"} 
                    strokeColor={getScoreColor(snapshotResult.score)}
                  />
                </div>
                
                <Alert
                  message={`评价等级: ${getScoreLevel(snapshotResult.score)}`}
                  description={
                    <div>
                      <h4>反馈建议:</h4>
                      <ul>
                        {snapshotResult.feedback && snapshotResult.feedback.suggestions && 
                          snapshotResult.feedback.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))
                        }
                      </ul>
                    </div>
                  }
                  type={snapshotResult.score >= 8 ? "success" : snapshotResult.score >= 6 ? "warning" : "error"}
                  showIcon
                />
                
                {snapshotResult.angle_data && (
                  <AngleDataVisualization angleData={snapshotResult.angle_data} />
                )}
              </Col>
            </Row>
          </Card>
        )}
      </Card>
    </MainLayout>
  );
};

export default CameraAnalysis;
