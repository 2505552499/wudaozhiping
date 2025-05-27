import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Progress, Timeline, Badge, Statistic, Tag, Button } from 'antd';
import { 
  TrophyOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  StarOutlined,
  FireOutlined,
  TargetOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const LearningProgressTracker = ({ userId }) => {
  const { t } = useTranslation();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProgressData();
    }
  }, [userId]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockProgressData();
      setProgressData(mockData);
    } catch (error) {
      console.error('获取进度数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockProgressData = () => {
    return {
      overview: {
        totalLearningTime: 156, // 小时
        coursesCompleted: 8,
        currentStreak: 15, // 连续学习天数
        skillLevel: 'intermediate',
        overallProgress: 68
      },
      skills: [
        { skill: '基本功', current: 85, target: 90 },
        { skill: '太极拳', current: 72, target: 85 },
        { skill: '防身术', current: 45, target: 70 },
        { skill: '柔韧性', current: 78, target: 85 },
        { skill: '力量', current: 65, target: 80 },
        { skill: '协调性', current: 80, target: 90 }
      ],
      radarData: [
        { subject: '基本功', A: 85, B: 90, fullMark: 100 },
        { subject: '太极拳', A: 72, B: 85, fullMark: 100 },
        { subject: '防身术', A: 45, B: 70, fullMark: 100 },
        { subject: '柔韧性', A: 78, B: 85, fullMark: 100 },
        { subject: '力量', A: 65, B: 80, fullMark: 100 },
        { subject: '协调性', A: 80, B: 90, fullMark: 100 }
      ],
      scoreHistory: [
        { date: '2024-01', score: 6.2 },
        { date: '2024-02', score: 6.8 },
        { date: '2024-03', score: 7.1 },
        { date: '2024-04', score: 7.5 },
        { date: '2024-05', score: 7.8 },
        { date: '2024-06', score: 8.2 }
      ],
      timeline: [
        {
          date: '2024-06-15',
          type: 'achievement',
          title: '获得"坚持学习"徽章',
          description: '连续学习15天',
          icon: <TrophyOutlined />,
          color: 'gold'
        },
        {
          date: '2024-06-10',
          type: 'course',
          title: '完成太极基础课程',
          description: '课程评分：4.8/5.0',
          icon: <CheckCircleOutlined />,
          color: 'green'
        },
        {
          date: '2024-06-05',
          type: 'analysis',
          title: '动作分析得分提升',
          description: '弓步冲拳：7.2 → 8.1',
          icon: <RiseOutlined />,
          color: 'blue'
        },
        {
          date: '2024-05-28',
          type: 'milestone',
          title: '达成学习里程碑',
          description: '累计学习时间达到150小时',
          icon: <StarOutlined />,
          color: 'purple'
        }
      ],
      achievements: [
        { id: 1, name: '初学者', description: '完成第一次动作分析', earned: true, date: '2024-01-15' },
        { id: 2, name: '坚持学习', description: '连续学习15天', earned: true, date: '2024-06-15' },
        { id: 3, name: '进步神速', description: '单月分数提升超过1分', earned: true, date: '2024-03-20' },
        { id: 4, name: '课程达人', description: '完成5门课程', earned: true, date: '2024-05-10' },
        { id: 5, name: '社区活跃', description: '在论坛发布10个帖子', earned: false, progress: 7 },
        { id: 6, name: '大师之路', description: '所有技能达到高级水平', earned: false, progress: 3 }
      ],
      goals: [
        { id: 1, title: '太极拳技能提升到85分', current: 72, target: 85, deadline: '2024-08-01' },
        { id: 2, title: '完成防身术进阶课程', current: 2, target: 6, deadline: '2024-07-15' },
        { id: 3, title: '连续学习30天', current: 15, target: 30, deadline: '2024-07-01' }
      ]
    };
  };

  if (loading || !progressData) {
    return <Card loading={loading} />;
  }

  const { overview, skills, radarData, scoreHistory, timeline, achievements, goals } = progressData;

  return (
    <div className="learning-progress-tracker space-y-6">
      {/* 概览统计 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="学习时长"
              value={overview.totalLearningTime}
              suffix="小时"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="完成课程"
              value={overview.coursesCompleted}
              suffix="门"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="连续学习"
              value={overview.currentStreak}
              suffix="天"
              prefix={<FireOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="整体进度"
              value={overview.overallProgress}
              suffix="%"
              prefix={<TargetOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 技能雷达图 */}
        <Col xs={24} lg={12}>
          <Card title="技能分析" className="h-full">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="当前水平"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Radar
                  name="目标水平"
                  dataKey="B"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.1}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 分数趋势图 */}
        <Col xs={24} lg={12}>
          <Card title="分数趋势" className="h-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 技能进度条 */}
      <Card title="技能详情">
        <Row gutter={[16, 16]}>
          {skills.map((skill, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{skill.skill}</span>
                  <span className="text-sm text-gray-500">{skill.current}/{skill.target}</span>
                </div>
                <Progress 
                  percent={(skill.current / skill.target) * 100} 
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  showInfo={false}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* 学习时间线 */}
        <Col xs={24} lg={12}>
          <Card title="学习时间线" className="h-full">
            <Timeline>
              {timeline.map((event, index) => (
                <Timeline.Item
                  key={index}
                  color={event.color}
                  dot={event.icon}
                >
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <strong className="text-sm">{event.title}</strong>
                      <span className="text-xs text-gray-500">{event.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-0">{event.description}</p>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>

        {/* 成就徽章 */}
        <Col xs={24} lg={12}>
          <Card title="成就徽章" className="h-full">
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg border ${
                    achievement.earned 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      status={achievement.earned ? "success" : "default"} 
                    />
                    <span className={`font-medium text-sm ${
                      achievement.earned ? 'text-yellow-700' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                  {achievement.earned ? (
                    <Tag size="small" color="gold">已获得</Tag>
                  ) : (
                    <div>
                      <Progress 
                        percent={(achievement.progress / 10) * 100} 
                        size="small" 
                        showInfo={false}
                      />
                      <span className="text-xs text-gray-500">
                        {achievement.progress}/10
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 学习目标 */}
      <Card title="学习目标">
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{goal.title}</h4>
                <Tag color="blue">截止: {goal.deadline}</Tag>
              </div>
              <div className="mb-2">
                <Progress 
                  percent={(goal.current / goal.target) * 100}
                  format={() => `${goal.current}/${goal.target}`}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  还需努力 {goal.target - goal.current} 个单位
                </span>
                <Button size="small" type="primary" ghost>
                  查看详情
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default LearningProgressTracker;
