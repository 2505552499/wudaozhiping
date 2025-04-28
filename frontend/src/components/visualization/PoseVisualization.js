import React, { useState, useEffect, useRef } from 'react';
import { Card, Spin, Alert, Typography } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const PoseVisualization = ({ poseName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keypoints, setKeypoints] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchPoseData = async () => {
      if (!poseName) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/pose_keypoints/${poseName}`);
        if (response.data.success) {
          setKeypoints(response.data.keypoints);
        } else {
          setError(response.data.message || '获取姿势关键点数据失败');
        }
      } catch (err) {
        setError('获取姿势关键点数据时出错：' + (err.message || '未知错误'));
        console.error('获取姿势关键点数据时出错：', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPoseData();
  }, [poseName]);

  useEffect(() => {
    if (!keypoints || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制连接线
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    
    keypoints.connections.forEach(connection => {
      const [index1, index2] = connection;
      const point1 = keypoints.keypoints[index1];
      const point2 = keypoints.keypoints[index2];
      
      if (point1 && point2) {
        ctx.beginPath();
        ctx.moveTo(point1[0], point1[1]);
        ctx.lineTo(point2[0], point2[1]);
        ctx.stroke();
      }
    });
    
    // 绘制关键点
    ctx.fillStyle = 'red';
    keypoints.keypoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
      ctx.fill();
    });
    
  }, [keypoints]);

  if (loading) {
    return <Spin tip="加载数据中..." />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="pose-visualization">
      <Title level={4}>{poseName}姿态图解</Title>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <canvas 
            ref={canvasRef} 
            width={640} 
            height={480} 
            style={{ 
              border: '1px solid #d9d9d9', 
              backgroundColor: '#f5f5f5',
              maxWidth: '100%'
            }}
          />
          <div style={{ marginTop: 10 }}>
            <Typography.Text>
              {poseName}姿态二维映射图解
            </Typography.Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PoseVisualization;
