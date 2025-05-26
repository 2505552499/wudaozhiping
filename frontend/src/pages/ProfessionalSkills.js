import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Tag, Typography, List, Modal, Alert, Rate, Tabs, Badge } from 'antd';
import { TrophyOutlined, ClockCircleOutlined, UserOutlined, StarOutlined, CrownOutlined, FireOutlined, LockOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';

const { Title, Paragraph, Text } = Typography;

const ProfessionalSkills = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('combat');
  const [userProgress, setUserProgress] = useState({});

  // 专业技巧数据
  const professionalSkills = {
    combat: [
      {
        id: 1,
        title: '实战格斗技法',
        instructor: '李军教练',
        duration: '12周',
        level: '专业级',
        category: '实战技击',
        difficulty: 5,
        description: '综合各门派实战技法，培养真正的格斗能力。',
        price: 899,
        rating: 4.9,
        studentCount: 23,
        isVip: true,
        features: ['实战导向', '综合技法', '专业指导', 'VIP专享'],
        prerequisites: ['至少掌握一门武术', '有对抗训练经验', '身体素质优秀'],
        highlights: [
          '前特种兵格斗教官亲授',
          '真实格斗场景模拟',
          '多种武术技法融合',
          '心理素质强化训练'
        ],
        modules: [
          {
            name: '格斗基础',
            skills: ['距离感培养', '时机把握', '反应训练', '体能强化']
          },
          {
            name: '攻击技法',
            skills: ['拳法组合', '腿法运用', '摔法技巧', '关节技']
          },
          {
            name: '防守技法',
            skills: ['格挡技巧', '闪避步法', '反击时机', '地面防守']
          },
          {
            name: '实战应用',
            skills: ['多人对战', '器械对抗', '环境利用', '心理战术']
          }
        ]
      },
      {
        id: 2,
        title: '传统武器精通',
        instructor: '张武师',
        duration: '16周',
        level: '大师级',
        category: '器械专精',
        difficulty: 5,
        description: '深入学习传统武器的使用技法，成为器械大师。',
        price: 1299,
        rating: 4.8,
        studentCount: 15,
        isVip: true,
        features: ['传统器械', '大师传承', '文化内涵', '限额招生'],
        prerequisites: ['扎实的武术基础', '器械基础训练', '文化素养良好'],
        highlights: [
          '传统武器制作工艺',
          '古代兵器实战技法',
          '武器文化深度解读',
          '个人专属器械定制'
        ],
        modules: [
          {
            name: '刀剑类',
            skills: ['单刀技法', '双刀技法', '剑法精要', '刀剑对练']
          },
          {
            name: '棍棒类',
            skills: ['长棍技法', '短棍应用', '双节棍', '三节棍']
          },
          {
            name: '软兵器',
            skills: ['九节鞭', '流星锤', '绳镖', '软鞭技法']
          },
          {
            name: '暗器类',
            skills: ['飞镖技法', '袖箭使用', '暗器防御', '暗器制作']
          }
        ]
      }
    ],
    performance: [
      {
        id: 3,
        title: '武术表演艺术',
        instructor: '陈艺老师',
        duration: '10周',
        level: '专业级',
        category: '表演艺术',
        difficulty: 4,
        description: '学习武术表演技巧，提升舞台表现力和艺术感染力。',
        price: 699,
        rating: 4.7,
        studentCount: 34,
        isVip: false,
        features: ['艺术表演', '舞台技巧', '创意编排', '专业指导'],
        prerequisites: ['武术基础扎实', '形体协调性好', '有表演欲望'],
        highlights: [
          '专业舞台表演技巧',
          '武术动作艺术化处理',
          '音乐与动作完美结合',
          '个人风格培养'
        ],
        modules: [
          {
            name: '表演基础',
            skills: ['舞台意识', '表情管理', '气质培养', '观众互动']
          },
          {
            name: '动作设计',
            skills: ['动作美化', '节奏控制', '空间利用', '创意编排']
          },
          {
            name: '音乐配合',
            skills: ['音乐理解', '节拍把握', '情感表达', '音武合一']
          },
          {
            name: '舞台实践',
            skills: ['舞台表演', '灯光配合', '服装搭配', '现场应变']
          }
        ]
      },
      {
        id: 4,
        title: '影视武术指导',
        instructor: '王导演',
        duration: '14周',
        level: '大师级',
        category: '影视武术',
        difficulty: 5,
        description: '学习影视武术指导技能，掌握镜头前的武术表现。',
        price: 1599,
        rating: 4.9,
        studentCount: 12,
        isVip: true,
        features: ['影视专业', '导演技巧', '镜头语言', '行业内幕'],
        prerequisites: ['丰富的武术经验', '表演基础', '创意思维'],
        highlights: [
          '知名武术指导亲授',
          '真实影视项目参与',
          '镜头前武术技巧',
          '行业资源对接'
        ],
        modules: [
          {
            name: '镜头武术',
            skills: ['镜头感培养', '动作设计', '安全保护', '特效配合']
          },
          {
            name: '指导技巧',
            skills: ['演员指导', '动作编排', '现场调度', '问题解决']
          },
          {
            name: '项目实践',
            skills: ['剧本分析', '动作设计', '拍摄配合', '后期配合']
          }
        ]
      }
    ],
    coaching: [
      {
        id: 5,
        title: '武术教练认证',
        instructor: '国家体育总局',
        duration: '20周',
        level: '认证级',
        category: '教练培训',
        difficulty: 4,
        description: '获得国家认可的武术教练资格，开启教练生涯。',
        price: 2999,
        rating: 4.8,
        studentCount: 67,
        isVip: false,
        features: ['官方认证', '就业保障', '系统培训', '终身受益'],
        prerequisites: ['武术技能扎实', '教学意愿强烈', '品德良好'],
        highlights: [
          '国家体育总局认证',
          '完整的教学体系',
          '实习机会提供',
          '就业推荐服务'
        ],
        modules: [
          {
            name: '教学理论',
            skills: ['教育心理学', '运动生理学', '教学方法', '课程设计']
          },
          {
            name: '技能传授',
            skills: ['动作示范', '错误纠正', '进度安排', '个性化指导']
          },
          {
            name: '安全管理',
            skills: ['运动安全', '伤病预防', '急救知识', '风险控制']
          },
          {
            name: '职业发展',
            skills: ['职业规划', '市场营销', '学员管理', '持续学习']
          }
        ]
      },
      {
        id: 6,
        title: '青少年武术教学',
        instructor: '刘老师',
        duration: '8周',
        level: '专业级',
        category: '青少年教育',
        difficulty: 3,
        description: '专门针对青少年的武术教学方法和技巧。',
        price: 599,
        rating: 4.6,
        studentCount: 89,
        isVip: false,
        features: ['青少年专项', '教育心理', '趣味教学', '家长沟通'],
        prerequisites: ['有教学经验', '喜欢孩子', '耐心细致'],
        highlights: [
          '青少年心理特点分析',
          '趣味化教学方法',
          '家校沟通技巧',
          '安全教学保障'
        ],
        modules: [
          {
            name: '青少年特点',
            skills: ['心理特点', '生理特点', '学习特点', '兴趣培养']
          },
          {
            name: '教学方法',
            skills: ['游戏化教学', '激励机制', '分层教学', '个性化指导']
          },
          {
            name: '安全教育',
            skills: ['安全意识', '保护措施', '应急处理', '家长沟通']
          }
        ]
      }
    ]
  };

  useEffect(() => {
    // 加载用户学习进度
    const savedProgress = localStorage.getItem('professionalSkillsProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const isSkillUnlocked = (skill) => {
    // 检查是否满足前置条件
    // 这里简化处理，VIP技能需要特殊权限
    if (!skill) return false;
    if (skill.isVip) {
      const userRole = localStorage.getItem('role');
      return userRole === 'vip' || userRole === 'admin';
    }
    return true;
  };

  const isSkillEnrolled = (skillId) => {
    return userProgress[skillId]?.enrolled || false;
  };

  const enrollSkill = (skillId) => {
    const newProgress = {
      ...userProgress,
      [skillId]: {
        enrolled: true,
        progress: 0,
        enrolledAt: new Date().toISOString()
      }
    };
    setUserProgress(newProgress);
    localStorage.setItem('professionalSkillsProgress', JSON.stringify(newProgress));
  };

  const showSkillDetail = (skill) => {
    setSelectedSkill(skill);
    setModalVisible(true);
  };

  const startLearning = (skillId) => {
    if (!isSkillEnrolled(skillId)) {
      enrollSkill(skillId);
    }
    // 跳转到技能学习页面
    window.location.href = `/course-study/${skillId}`;
  };

  const getDifficultyStars = (difficulty) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarOutlined
        key={index}
        style={{
          color: index < difficulty ? '#faad14' : '#d9d9d9',
          fontSize: 12
        }}
      />
    ));
  };

  const renderSkillCard = (skill) => (
    <Col xs={24} sm={12} lg={8} key={skill.id}>
      <Card
        hoverable
        cover={
          <div style={{
            height: 200,
            background: skill.isVip
              ? 'linear-gradient(135deg, #722ed1 0%, #eb2f96 100%)'
              : 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center' }}>
              {skill.isVip ? (
                <CrownOutlined style={{ fontSize: 48, marginBottom: 8 }} />
              ) : (
                <TrophyOutlined style={{ fontSize: 48, marginBottom: 8 }} />
              )}
              <div style={{ fontSize: 16, fontWeight: 'bold' }}>{skill.category}</div>
            </div>
            {skill.isVip && (
              <Badge.Ribbon text="VIP" color="gold" />
            )}
            {!isSkillUnlocked(skill) && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <LockOutlined style={{ fontSize: 32 }} />
              </div>
            )}
          </div>
        }
        actions={[
          <Button type="link" onClick={() => showSkillDetail(skill)}>
            查看详情
          </Button>,
          isSkillUnlocked(skill) ? (
            isSkillEnrolled(skill.id) ? (
              <Button type="primary" onClick={() => startLearning(skill.id)}>
                继续学习
              </Button>
            ) : (
              <Button type="primary" onClick={() => startLearning(skill.id)}>
                立即报名
              </Button>
            )
          ) : (
            <Button disabled icon={<LockOutlined />}>
              {skill.isVip ? 'VIP专享' : '暂未开放'}
            </Button>
          )
        ]}
      >
        <Card.Meta
          title={
            <div>
              <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
                {skill.title}
                {skill.isVip && <CrownOutlined style={{ color: '#faad14', marginLeft: 4 }} />}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Tag color={skill.isVip ? 'purple' : 'blue'}>{skill.level}</Tag>
                  <span style={{ marginLeft: 4 }}>
                    {getDifficultyStars(skill.difficulty)}
                  </span>
                </div>
                <Text type="danger" style={{ fontSize: 16, fontWeight: 'bold' }}>
                  ¥{skill.price}
                </Text>
              </div>
            </div>
          }
          description={
            <div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                {skill.description}
              </p>
              <div style={{ marginBottom: 8 }}>
                <UserOutlined style={{ marginRight: 4 }} />
                <Text>{skill.instructor}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                <Text>{skill.duration}</Text>
              </div>
              <div style={{ marginBottom: 8 }}>
                <Rate disabled defaultValue={skill.rating} allowHalf size="small" />
                <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                  {skill.rating} ({skill.studentCount}人学习)
                </Text>
              </div>
              <div>
                {skill.features.map(feature => (
                  <Tag key={feature} size="small" style={{ margin: 2 }}>
                    {feature}
                  </Tag>
                ))}
              </div>
            </div>
          }
        />
      </Card>
    </Col>
  );

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>
            <CrownOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            专业技巧
          </Title>
          <Paragraph>
            为武术专业人士和高级学员设计的专业技能课程。涵盖实战格斗、表演艺术、
            教练培训等多个专业方向，助您在武术道路上达到更高境界。
          </Paragraph>

          <Alert
            message="专业提醒"
            description="专业技巧课程要求较高的武术基础和专业素养。部分VIP课程需要特殊权限。请根据自身情况选择合适的课程。"
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'combat',
                label: (
                  <span>
                    <FireOutlined />
                    实战技击
                  </span>
                ),
                children: (
                  <Row gutter={[16, 16]}>
                    {professionalSkills.combat.map(renderSkillCard)}
                  </Row>
                )
              },
              {
                key: 'performance',
                label: (
                  <span>
                    <StarOutlined />
                    表演艺术
                  </span>
                ),
                children: (
                  <Row gutter={[16, 16]}>
                    {professionalSkills.performance.map(renderSkillCard)}
                  </Row>
                )
              },
              {
                key: 'coaching',
                label: (
                  <span>
                    <TrophyOutlined />
                    教练培训
                  </span>
                ),
                children: (
                  <Row gutter={[16, 16]}>
                    {professionalSkills.coaching.map(renderSkillCard)}
                  </Row>
                )
              }
            ]}
          />
        </Card>

        {/* 技能详情模态框 */}
        <Modal
          title={
            <span>
              {selectedSkill?.title}
              {selectedSkill?.isVip && <CrownOutlined style={{ color: '#faad14', marginLeft: 8 }} />}
            </span>
          }
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={800}
          footer={[
            <Button key="cancel" onClick={() => setModalVisible(false)}>
              关闭
            </Button>,
            selectedSkill && isSkillUnlocked(selectedSkill) ? (
              <Button
                key="enroll"
                type="primary"
                onClick={() => {
                  startLearning(selectedSkill.id);
                  setModalVisible(false);
                }}
              >
                {isSkillEnrolled(selectedSkill?.id) ? '继续学习' : '立即报名'}
              </Button>
            ) : selectedSkill ? (
              <Button key="locked" disabled icon={<LockOutlined />}>
                {selectedSkill?.isVip ? 'VIP专享' : '暂未开放'}
              </Button>
            ) : null
          ]}
        >
          {selectedSkill && (
            <div>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Text strong>讲师：</Text>{selectedSkill.instructor}
                </Col>
                <Col span={12}>
                  <Text strong>课程时长：</Text>{selectedSkill.duration}
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Text strong>难度等级：</Text>
                  <Tag color={selectedSkill.isVip ? 'purple' : 'blue'}>{selectedSkill.level}</Tag>
                  {getDifficultyStars(selectedSkill.difficulty)}
                </Col>
                <Col span={12}>
                  <Text strong>学员评价：</Text>
                  <Rate disabled defaultValue={selectedSkill.rating} allowHalf size="small" />
                  <Text style={{ marginLeft: 8 }}>{selectedSkill.rating}</Text>
                </Col>
              </Row>

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>前置要求</Title>
                <List
                  size="small"
                  dataSource={selectedSkill.prerequisites}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Text>{index + 1}. {item}</Text>
                    </List.Item>
                  )}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>课程亮点</Title>
                <List
                  size="small"
                  dataSource={selectedSkill.highlights}
                  renderItem={(item, index) => (
                    <List.Item>
                      <StarOutlined style={{ color: '#faad14', marginRight: 4 }} />
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>学习模块</Title>
                {selectedSkill.modules.map((module, index) => (
                  <Card key={index} size="small" style={{ marginBottom: 8 }}>
                    <Title level={5}>{module.name}</Title>
                    <div>
                      {module.skills.map(skill => (
                        <Tag key={skill} style={{ margin: 2 }}>{skill}</Tag>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default ProfessionalSkills;
