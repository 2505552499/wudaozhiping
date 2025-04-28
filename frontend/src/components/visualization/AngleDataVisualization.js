import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Tabs, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const { Title } = Typography;
const { TabPane } = Tabs;

const AngleDataVisualization = ({ poseName, angleData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localAngleData, setLocalAngleData] = useState({
    practitioner: [],
    master: []
  });

  useEffect(() => {
    // 如果提供了外部角度数据，直接使用
    if (angleData && (angleData.practitioner_angles || angleData.master_angles)) {
      const formattedPractitionerData = (angleData.practitioner_angles || []).map(item => ({
        name: item.joint.replace('夹角为', ''),
        angle: item.angle
      }));
      
      const formattedMasterData = (angleData.master_angles || []).map(item => ({
        name: item.joint.replace('夹角为', ''),
        angle: item.angle
      }));
      
      setLocalAngleData({
        practitioner: formattedPractitionerData,
        master: formattedMasterData
      });
      return;
    }
    
    // 否则，从API获取数据
    const fetchAngleData = async () => {
      if (!poseName) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/angles/${poseName}`);
        if (response.data.success) {
          // 转换数据格式以适合图表使用
          const formattedPractitionerData = response.data.practitioner_angles.map(item => ({
            name: item.joint.replace('夹角为', ''),
            angle: item.angle
          }));
          
          const formattedMasterData = response.data.master_angles.map(item => ({
            name: item.joint.replace('夹角为', ''),
            angle: item.angle
          }));
          
          setLocalAngleData({
            practitioner: formattedPractitionerData,
            master: formattedMasterData
          });
        } else {
          setError(response.data.message || '获取角度数据失败');
        }
      } catch (err) {
        setError('获取角度数据时出错：' + (err.message || '未知错误'));
        console.error('获取角度数据时出错：', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAngleData();
  }, [poseName, angleData]);

  const renderBarChart = (data, title, color) => (
    <Card title={title} style={{ marginBottom: 16 }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis domain={[0, 180]} />
          <Tooltip formatter={(value) => [`${value.toFixed(2)}°`, '角度']} />
          <Legend />
          <Bar dataKey="angle" fill={color} name="角度" unit="°" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );

  if (loading) {
    return <Spin tip="加载数据中..." />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  // 如果没有数据，显示提示信息
  if (localAngleData.practitioner.length === 0 && localAngleData.master.length === 0) {
    return <Alert type="info" message="暂无角度数据，请先进行姿势分析" />;
  }

  return (
    <div className="angle-data-visualization">
      <Title level={4}>{poseName || ''}关节角度数据</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="习武者角度数据" key="1">
          {renderBarChart(localAngleData.practitioner, '习武者关节角度数据可视化', '#1890ff')}
        </TabPane>
        <TabPane tab="传承人角度数据" key="2">
          {renderBarChart(localAngleData.master, '传承人关节角度数据可视化', '#52c41a')}
        </TabPane>
        <TabPane tab="对比分析" key="3">
          <Card title="角度数据对比分析">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={localAngleData.practitioner.map((item, index) => ({
                  name: item.name,
                  习武者: item.angle,
                  传承人: localAngleData.master[index]?.angle || 0
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis domain={[0, 180]} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)}°`, '角度']} />
                <Legend />
                <Bar dataKey="习武者" fill="#1890ff" name="习武者角度" unit="°" />
                <Bar dataKey="传承人" fill="#52c41a" name="传承人角度" unit="°" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AngleDataVisualization;
