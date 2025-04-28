import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, List, Typography, Tabs, Collapse, Tag, Spin, message 
} from 'antd';
import { BookOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import MainLayout from '../components/MainLayout';
import AngleDataVisualization from '../components/visualization/AngleDataVisualization';
import PoseVisualization from '../components/visualization/PoseVisualization';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const KnowledgeBase = () => {
  const [poses, setPoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPose, setSelectedPose] = useState(null);
  const [poseDetails, setPoseDetails] = useState({});

  useEffect(() => {
    // Fetch available poses
    const fetchPoses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/poses');
        if (response.data.success) {
          setPoses(response.data.poses);
          if (response.data.poses.length > 0) {
            setSelectedPose(response.data.poses[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching poses:', error);
        message.error('获取姿势列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPoses();
  }, []);

  useEffect(() => {
    // Fetch details for the selected pose
    const fetchPoseDetails = async () => {
      if (!selectedPose) return;

      try {
        setLoading(true);
        const response = await axios.get(`/api/poses/${selectedPose}`);
        if (response.data.success) {
          setPoseDetails(prevDetails => ({
            ...prevDetails,
            [selectedPose]: response.data.pose
          }));
        }
      } catch (error) {
        console.error(`Error fetching details for ${selectedPose}:`, error);
        message.error(`获取${selectedPose}详情失败`);
      } finally {
        setLoading(false);
      }
    };

    if (selectedPose && !poseDetails[selectedPose]) {
      fetchPoseDetails();
    }
  }, [selectedPose, poseDetails]);

  const handlePoseSelect = (pose) => {
    setSelectedPose(pose);
  };

  // Fallback pose details if API doesn't return data
  const getFallbackPoseDetails = (poseName) => {
    const fallbackDetails = {
      '弓步冲拳': {
        name: '弓步冲拳',
        description: '弓步冲拳是武术中最基本的招式之一，要求前腿弯曲，后腿伸直，上身挺直，拳头有力向前冲出。',
        key_points: ['前腿膝盖应在脚尖上方', '拳头应与肩同高', '后腿需绷直', '重心应在前腿'],
        history: '弓步冲拳是中国传统武术中最基础的招式之一，几乎所有流派都包含这一动作。它不仅是基本功训练的重要部分，也是实战中常用的进攻技术。',
        benefits: '练习弓步冲拳可以锻炼腿部力量，提高身体稳定性，增强上肢爆发力，改善身体协调性。'
      },
      '猛虎出洞': {
        name: '猛虎出洞',
        description: '猛虎出洞是武术中的一种攻击招式，模仿猛虎出洞扑食的动作，要求双手成虎爪状，有力向前推出。',
        key_points: ['虎爪五指张开，指尖用力', '手臂伸展有力', '步伐稳健有力', '身体重心保持稳定'],
        history: '猛虎出洞源自传统武术中的虎形拳，模仿猛虎扑食的动作特点。虎形拳在中国武术中有着悠久的历史，以刚猛、有力著称。',
        benefits: '练习猛虎出洞可以增强手指力量，提高上肢爆发力，锻炼腰腹力量，提高身体协调性。'
      },
      '五花坐山': {
        name: '五花坐山',
        description: '五花坐山是一种稳定的坐姿招式，上身保持挺直，手臂做五花环绕动作，下肢稳固盘坐。',
        key_points: ['下肢稳固盘坐', '上身保持挺直', '手臂动作协调', '呼吸与动作结合'],
        history: '五花坐山源自传统武术中的坐功练习，是内功修炼的重要部分。这一招式在少林、武当等多个流派中都有体现，是稳定内气的重要方法。',
        benefits: '练习五花坐山可以增强核心稳定性，改善呼吸控制，提高内气运行，增强身体协调性。'
      }
    };

    return fallbackDetails[poseName] || {
      name: poseName,
      description: `${poseName}是中国传统武术中的经典招式之一。`,
      key_points: ['保持正确的姿势', '动作协调有力', '呼吸均匀'],
      history: '该招式有着悠久的历史传承。',
      benefits: '练习该招式有助于提高身体协调性和力量。'
    };
  };

  const getCurrentPoseDetails = () => {
    if (!selectedPose) return null;
    return poseDetails[selectedPose] || getFallbackPoseDetails(selectedPose);
  };

  const currentPoseDetails = getCurrentPoseDetails();

  return (
    <MainLayout>
      <Card title="武术知识库" bordered={false}>
        <p>
          浏览各种武术动作的标准姿势、要点和技巧，提高您的武术水平。
        </p>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card title="武术招式列表" bordered={false}>
              {loading && !poses.length ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Spin />
                </div>
              ) : (
                <List
                  itemLayout="horizontal"
                  dataSource={poses}
                  renderItem={item => (
                    <List.Item 
                      onClick={() => handlePoseSelect(item)}
                      style={{ 
                        cursor: 'pointer',
                        backgroundColor: selectedPose === item ? '#f0f0f0' : 'transparent',
                        padding: '8px',
                        borderRadius: '4px'
                      }}
                    >
                      <List.Item.Meta
                        avatar={<BookOutlined style={{ fontSize: 20, color: '#c62828' }} />}
                        title={item}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>

          <Col xs={24} md={16}>
            {loading && !currentPoseDetails ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
              </div>
            ) : currentPoseDetails ? (
              <Card 
                title={currentPoseDetails.name} 
                bordered={false}
                className="knowledge-card"
              >
                <Tabs defaultActiveKey="1">
                  <TabPane tab="基本介绍" key="1">
                    <Typography>
                      <Title level={4}>动作描述</Title>
                      <Paragraph>{currentPoseDetails.description}</Paragraph>
                      
                      <Title level={4}>关键要点</Title>
                      <List
                        itemLayout="horizontal"
                        dataSource={currentPoseDetails.key_points}
                        renderItem={item => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                              description={item}
                            />
                          </List.Item>
                        )}
                      />
                    </Typography>
                  </TabPane>
                  
                  <TabPane tab="历史渊源" key="2">
                    <Typography>
                      <Paragraph>{currentPoseDetails.history || `${currentPoseDetails.name}有着悠久的历史传承。`}</Paragraph>
                    </Typography>
                  </TabPane>
                  
                  <TabPane tab="练习益处" key="3">
                    <Typography>
                      <Paragraph>{currentPoseDetails.benefits || `练习${currentPoseDetails.name}有助于提高身体协调性和力量。`}</Paragraph>
                      
                      <Collapse ghost>
                        <Panel header="身体益处" key="1">
                          <p>增强肌肉力量和耐力</p>
                          <p>提高身体协调性和平衡能力</p>
                          <p>增强心肺功能</p>
                        </Panel>
                        <Panel header="精神益处" key="2">
                          <p>提高专注力和注意力</p>
                          <p>缓解压力和焦虑</p>
                          <p>培养耐心和毅力</p>
                        </Panel>
                      </Collapse>
                    </Typography>
                  </TabPane>
                  
                  <TabPane tab="角度数据" key="4">
                    <AngleDataVisualization poseName={selectedPose} />
                  </TabPane>
                  
                  <TabPane tab="姿势图解" key="5">
                    <PoseVisualization poseName={selectedPose} />
                  </TabPane>
                </Tabs>
              </Card>
            ) : (
              <Card bordered={false}>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p>请从左侧选择一个武术招式查看详情</p>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </Card>
    </MainLayout>
  );
};

export default KnowledgeBase;
