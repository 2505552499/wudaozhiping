import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Steps, Typography, List, Tag, Modal, Progress, Alert } from 'antd';
import { PlayCircleOutlined, BookOutlined, TrophyOutlined, EyeOutlined, CheckCircleOutlined, BulbOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const ActionGuidance = () => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [userProgress, setUserProgress] = useState({});

  // 武术动作数据
  const martialArtsActions = [
    {
      id: 1,
      name: '马步冲拳',
      category: '基本功',
      difficulty: '初级',
      description: '马步冲拳是武术基本功之一，主要训练下盘稳定性和拳法力量。',
      keyPoints: [
        '双脚分开与肩同宽，脚尖向前',
        '下蹲至大腿与地面平行',
        '背部挺直，重心下沉',
        '双拳置于腰间，拳心向上',
        '交替出拳，拳心向下'
      ],
      steps: [
        {
          title: '准备姿势',
          description: '双脚分开站立，调整呼吸',
          tips: '保持身体放松，精神集中'
        },
        {
          title: '下蹲马步',
          description: '慢慢下蹲至标准马步姿势',
          tips: '膝盖不要超过脚尖，保持平衡'
        },
        {
          title: '拳法练习',
          description: '在马步基础上练习冲拳动作',
          tips: '出拳要有力，收拳要快'
        },
        {
          title: '组合练习',
          description: '连续进行马步冲拳组合',
          tips: '保持节奏，注意呼吸配合'
        }
      ],
      commonMistakes: [
        '马步不够低，重心不稳',
        '出拳时身体前倾',
        '拳法不够有力',
        '呼吸不配合动作'
      ],
      trainingTips: [
        '每天练习15-20分钟',
        '循序渐进增加练习时间',
        '注意动作标准性',
        '配合呼吸练习'
      ]
    },
    {
      id: 2,
      name: '弓步推掌',
      category: '基本功',
      difficulty: '初级',
      description: '弓步推掌结合了步法和掌法，是太极拳和形意拳的基础动作。',
      keyPoints: [
        '前腿弓，后腿蹬',
        '重心前移，身体正直',
        '双掌从胸前推出',
        '掌心向前，手指向上',
        '动作连贯流畅'
      ],
      steps: [
        {
          title: '起势准备',
          description: '自然站立，双手下垂',
          tips: '放松身体，调整呼吸'
        },
        {
          title: '弓步下蹲',
          description: '一腿向前迈步成弓步',
          tips: '前腿弓，后腿蹬直'
        },
        {
          title: '推掌动作',
          description: '双掌从胸前向前推出',
          tips: '掌法要柔中带刚'
        },
        {
          title: '收势还原',
          description: '收掌回到起始位置',
          tips: '动作要缓慢连贯'
        }
      ],
      commonMistakes: [
        '弓步不够标准',
        '推掌时肩膀紧张',
        '重心分配不当',
        '动作过于僵硬'
      ],
      trainingTips: [
        '先练好弓步再加掌法',
        '注意身体协调性',
        '保持动作流畅',
        '配合意念练习'
      ]
    },
    {
      id: 3,
      name: '虚步亮掌',
      category: '太极拳',
      difficulty: '中级',
      description: '虚步亮掌是太极拳的经典动作，体现了虚实变化的太极理念。',
      keyPoints: [
        '虚步轻灵，实腿稳固',
        '掌法舒展，意念集中',
        '虚实分明，重心稳定',
        '动作缓慢，呼吸自然',
        '上下相随，内外合一'
      ],
      steps: [
        {
          title: '调整重心',
          description: '将重心移至一腿，另腿虚点',
          tips: '虚腿只是轻点地面'
        },
        {
          title: '起掌动作',
          description: '双掌缓慢上提至胸前',
          tips: '保持掌型圆润'
        },
        {
          title: '亮掌展示',
          description: '一掌向前亮出，一掌护胸',
          tips: '掌法要有神韵'
        },
        {
          title: '虚实转换',
          description: '练习虚实腿的转换',
          tips: '转换要自然流畅'
        }
      ],
      commonMistakes: [
        '虚步不够轻灵',
        '掌法缺乏神韵',
        '重心摇摆不定',
        '动作过于急躁'
      ],
      trainingTips: [
        '重点练习虚实转换',
        '培养太极意念',
        '注重动作质量',
        '配合太极呼吸法'
      ]
    }
  ];

  useEffect(() => {
    // 加载用户学习进度
    const savedProgress = localStorage.getItem('actionGuidanceProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '初级':
        return 'green';
      case '中级':
        return 'orange';
      case '高级':
        return 'red';
      default:
        return 'blue';
    }
  };

  const openActionDetail = (action) => {
    setSelectedAction(action);
    setCurrentStep(0);
    setModalVisible(true);
  };

  const nextStep = () => {
    if (currentStep < selectedAction.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const markAsCompleted = (actionId) => {
    const newProgress = {
      ...userProgress,
      [actionId]: {
        completed: true,
        completedAt: new Date().toISOString(),
        progress: 100
      }
    };
    setUserProgress(newProgress);
    localStorage.setItem('actionGuidanceProgress', JSON.stringify(newProgress));
  };

  const getActionProgress = (actionId) => {
    return userProgress[actionId]?.progress || 0;
  };

  const isActionCompleted = (actionId) => {
    return userProgress[actionId]?.completed || false;
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>
            <BulbOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            动作辅导
          </Title>
          <Paragraph>
            通过系统化的动作指导，帮助您掌握标准的武术动作。每个动作都包含详细的步骤说明、
            关键要点、常见错误和训练建议，让您的武术学习更加高效。
          </Paragraph>

          <Alert
            message="学习建议"
            description="建议您先从基本功开始学习，循序渐进。每个动作都要反复练习，确保动作标准后再进入下一个动作的学习。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Row gutter={[16, 16]}>
            {martialArtsActions.map((action) => (
              <Col xs={24} sm={12} lg={8} key={action.id}>
                <Card
                  hoverable
                  cover={
                    <div style={{ 
                      height: 200, 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <TrophyOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                        <div style={{ fontSize: 18, fontWeight: 'bold' }}>{action.name}</div>
                      </div>
                    </div>
                  }
                  actions={[
                    <Button 
                      type="primary" 
                      icon={<EyeOutlined />}
                      onClick={() => openActionDetail(action)}
                    >
                      查看详情
                    </Button>,
                    isActionCompleted(action.id) ? (
                      <Button icon={<CheckCircleOutlined />} disabled>
                        已完成
                      </Button>
                    ) : (
                      <Button 
                        icon={<PlayCircleOutlined />}
                        onClick={() => openActionDetail(action)}
                      >
                        开始学习
                      </Button>
                    )
                  ]}
                >
                  <Card.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{action.name}</span>
                        <Tag color={getDifficultyColor(action.difficulty)}>
                          {action.difficulty}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <p><BookOutlined /> {action.category}</p>
                        <p style={{ fontSize: 12, color: '#666' }}>{action.description}</p>
                        {getActionProgress(action.id) > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">学习进度:</Text>
                            <Progress 
                              percent={getActionProgress(action.id)} 
                              size="small" 
                              style={{ marginTop: 4 }}
                            />
                          </div>
                        )}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* 动作详情模态框 */}
        <Modal
          title={selectedAction?.name}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={800}
          footer={[
            <Button key="prev" onClick={prevStep} disabled={currentStep === 0}>
              上一步
            </Button>,
            <Button key="next" type="primary" onClick={nextStep} disabled={currentStep === selectedAction?.steps.length - 1}>
              下一步
            </Button>,
            <Button 
              key="complete" 
              type="primary" 
              onClick={() => {
                markAsCompleted(selectedAction.id);
                setModalVisible(false);
              }}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              标记完成
            </Button>
          ]}
        >
          {selectedAction && (
            <div>
              <Steps current={currentStep} style={{ marginBottom: 24 }}>
                {selectedAction.steps.map((step, index) => (
                  <Step key={index} title={step.title} />
                ))}
              </Steps>

              <Card title={selectedAction.steps[currentStep]?.title} style={{ marginBottom: 16 }}>
                <Paragraph>{selectedAction.steps[currentStep]?.description}</Paragraph>
                <Alert
                  message="练习要点"
                  description={selectedAction.steps[currentStep]?.tips}
                  type="success"
                  showIcon
                />
              </Card>

              <Row gutter={16}>
                <Col span={12}>
                  <Card title="关键要点" size="small">
                    <List
                      size="small"
                      dataSource={selectedAction.keyPoints}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Text>{index + 1}. {item}</Text>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="常见错误" size="small">
                    <List
                      size="small"
                      dataSource={selectedAction.commonMistakes}
                      renderItem={(item, index) => (
                        <List.Item>
                          <Text type="danger">{index + 1}. {item}</Text>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>

              <Card title="训练建议" size="small" style={{ marginTop: 16 }}>
                <List
                  size="small"
                  dataSource={selectedAction.trainingTips}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Text type="secondary">{index + 1}. {item}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default ActionGuidance;
