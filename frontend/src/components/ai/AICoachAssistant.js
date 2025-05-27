import React, { useState, useEffect } from 'react';
import { Card, Button, Spin, Alert, Progress, Tag, Timeline, Divider } from 'antd';
import { 
  BrainOutlined, 
  TrophyOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const AICoachAssistant = ({ analysisResult, userProfile, onSuggestionClick }) => {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [personalizedPlan, setPersonalizedPlan] = useState(null);

  useEffect(() => {
    if (analysisResult) {
      generateAISuggestions();
    }
  }, [analysisResult]);

  const generateAISuggestions = async () => {
    setIsLoading(true);
    try {
      // 模拟AI分析过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiSuggestions = analyzeAndGenerateSuggestions(analysisResult, userProfile);
      setSuggestions(aiSuggestions.suggestions);
      setPersonalizedPlan(aiSuggestions.plan);
    } catch (error) {
      console.error('AI建议生成失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeAndGenerateSuggestions = (result, profile) => {
    const score = result.average_score || result.score || 0;
    const posture = result.posture || '弓步冲拳';
    const userLevel = profile?.level || 'beginner';
    
    const suggestions = [];
    const plan = {
      currentLevel: userLevel,
      targetLevel: getNextLevel(userLevel),
      estimatedTime: '2-4周',
      milestones: []
    };

    // 基于分数生成建议
    if (score < 6) {
      suggestions.push({
        type: 'critical',
        priority: 'high',
        title: '基础姿势纠正',
        description: '您的动作存在明显偏差，建议从基础姿势开始练习',
        icon: <ExclamationCircleOutlined />,
        color: 'red',
        actions: [
          { text: '观看基础教程', type: 'video', url: '/courses/basic-posture' },
          { text: '预约教练指导', type: 'appointment', url: '/coach-appointment' }
        ],
        estimatedTime: '1-2周'
      });

      plan.milestones.push(
        { week: 1, goal: '掌握基本站姿', status: 'pending' },
        { week: 2, goal: '练习基础动作', status: 'pending' },
        { week: 3, goal: '提高动作稳定性', status: 'pending' }
      );
    } else if (score < 8) {
      suggestions.push({
        type: 'improvement',
        priority: 'medium',
        title: '动作细节优化',
        description: '整体动作不错，可以关注细节的完善和流畅性',
        icon: <StarOutlined />,
        color: 'orange',
        actions: [
          { text: '进阶技巧课程', type: 'course', url: '/courses/advanced-techniques' },
          { text: '加入练习小组', type: 'community', url: '/forum/practice-groups' }
        ],
        estimatedTime: '2-3周'
      });

      plan.milestones.push(
        { week: 1, goal: '提高动作精确度', status: 'pending' },
        { week: 2, goal: '增强动作连贯性', status: 'pending' },
        { week: 3, goal: '掌握变化技巧', status: 'pending' }
      );
    } else {
      suggestions.push({
        type: 'advanced',
        priority: 'low',
        title: '高级技巧挑战',
        description: '您的动作已经很标准，可以尝试更高难度的技巧和组合',
        icon: <TrophyOutlined />,
        color: 'green',
        actions: [
          { text: '大师级课程', type: 'course', url: '/courses/master-class' },
          { text: '参加比赛', type: 'competition', url: '/competitions' }
        ],
        estimatedTime: '持续提升'
      });

      plan.milestones.push(
        { week: 1, goal: '学习高级组合', status: 'pending' },
        { week: 2, goal: '提升表现力', status: 'pending' },
        { week: 3, goal: '创新动作变化', status: 'pending' }
      );
    }

    // 基于具体动作类型的建议
    if (posture === '弓步冲拳') {
      suggestions.push({
        type: 'specific',
        priority: 'medium',
        title: '弓步冲拳专项训练',
        description: '针对弓步冲拳的专项练习建议',
        icon: <CheckCircleOutlined />,
        color: 'blue',
        actions: [
          { text: '弓步稳定性训练', type: 'exercise', url: '/exercises/bow-stance' },
          { text: '出拳力量练习', type: 'exercise', url: '/exercises/punch-power' }
        ],
        estimatedTime: '1周'
      });
    }

    return { suggestions, plan };
  };

  const getNextLevel = (currentLevel) => {
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : 'master';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const handleActionClick = (action) => {
    onSuggestionClick?.(action);
    // 根据action类型执行不同操作
    switch (action.type) {
      case 'video':
      case 'course':
        window.open(action.url, '_blank');
        break;
      case 'appointment':
        window.location.href = action.url;
        break;
      default:
        console.log('执行动作:', action);
    }
  };

  if (isLoading) {
    return (
      <Card className="ai-coach-assistant">
        <div className="text-center py-8">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">AI教练正在分析您的动作...</p>
          <div className="mt-2">
            <Progress percent={Math.random() * 100} status="active" showInfo={false} />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="ai-coach-assistant space-y-6">
      {/* AI教练建议卡片 */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <BrainOutlined className="text-blue-500" />
            <span>AI教练建议</span>
          </div>
        }
        className="shadow-lg"
      >
        {suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-${suggestion.color}-500`}>
                      {suggestion.icon}
                    </span>
                    <h4 className="font-semibold">{suggestion.title}</h4>
                    <Tag color={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority === 'high' ? '高优先级' : 
                       suggestion.priority === 'medium' ? '中优先级' : '低优先级'}
                    </Tag>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <ClockCircleOutlined />
                    <span>{suggestion.estimatedTime}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3">{suggestion.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {suggestion.actions.map((action, actionIndex) => (
                    <Button
                      key={actionIndex}
                      type={actionIndex === 0 ? 'primary' : 'default'}
                      size="small"
                      onClick={() => handleActionClick(action)}
                    >
                      {action.text}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Alert
            message="暂无建议"
            description="请先进行动作分析以获取AI教练建议"
            type="info"
            showIcon
          />
        )}
      </Card>

      {/* 个性化学习计划 */}
      {personalizedPlan && (
        <Card 
          title="个性化学习计划"
          className="shadow-lg"
        >
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span>当前水平: <Tag color="blue">{personalizedPlan.currentLevel}</Tag></span>
              <span>目标水平: <Tag color="green">{personalizedPlan.targetLevel}</Tag></span>
            </div>
            <div className="text-sm text-gray-600">
              预计学习时间: {personalizedPlan.estimatedTime}
            </div>
          </div>

          <Divider />

          <Timeline>
            {personalizedPlan.milestones.map((milestone, index) => (
              <Timeline.Item
                key={index}
                color={milestone.status === 'completed' ? 'green' : 'blue'}
                dot={milestone.status === 'completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
              >
                <div>
                  <strong>第{milestone.week}周</strong>
                  <p className="text-gray-600">{milestone.goal}</p>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      )}
    </div>
  );
};

export default AICoachAssistant;
