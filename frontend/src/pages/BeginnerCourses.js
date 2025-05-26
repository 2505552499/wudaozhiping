import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Tag, Progress, Typography, List, Modal, Steps, Alert } from 'antd';
import { PlayCircleOutlined, BookOutlined, ClockCircleOutlined, UserOutlined, TrophyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const BeginnerCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userProgress, setUserProgress] = useState({});

  // 入门课程数据
  const beginnerCourses = [
    {
      id: 1,
      title: '武术基本功入门',
      instructor: '李师傅',
      duration: '4周',
      lessons: 16,
      level: '零基础',
      category: '基本功',
      description: '从零开始学习武术基本功，包括站桩、基本步法、手型等基础动作。',
      thumbnail: '/img/basic-kungfu.jpg',
      price: 0, // 免费课程
      features: [
        '零基础友好',
        '循序渐进',
        '基础扎实',
        '免费学习'
      ],
      outline: [
        {
          week: 1,
          title: '武术基础认知',
          lessons: [
            '武术历史与文化',
            '基本礼仪与规范',
            '身体准备与热身',
            '基本站姿练习'
          ]
        },
        {
          week: 2,
          title: '基本手型与步法',
          lessons: [
            '拳、掌、勾手型',
            '弓步、马步、虚步',
            '手型与步法结合',
            '基本协调性训练'
          ]
        },
        {
          week: 3,
          title: '基本动作组合',
          lessons: [
            '冲拳与推掌',
            '踢腿与摆腿',
            '转身与跳跃',
            '动作连贯性练习'
          ]
        },
        {
          week: 4,
          title: '综合练习与考核',
          lessons: [
            '基本功综合练习',
            '动作标准性检查',
            '学习成果展示',
            '下阶段学习规划'
          ]
        }
      ],
      requirements: [
        '无武术基础要求',
        '身体健康，无运动禁忌',
        '有学习武术的兴趣和决心',
        '能够坚持练习'
      ],
      benefits: [
        '建立正确的武术基础',
        '提高身体协调性',
        '增强体质和柔韧性',
        '培养武术兴趣'
      ]
    },
    {
      id: 2,
      title: '太极拳24式入门',
      instructor: '王师傅',
      duration: '6周',
      lessons: 24,
      level: '初级',
      category: '太极拳',
      description: '学习太极拳24式，掌握太极拳的基本动作和呼吸方法。',
      thumbnail: '/img/taiji-24.jpg',
      price: 99,
      features: [
        '经典套路',
        '养生健身',
        '动作优美',
        '易学易练'
      ],
      outline: [
        {
          week: 1,
          title: '太极拳基础',
          lessons: [
            '太极拳理论基础',
            '基本站桩与呼吸',
            '起势与收势',
            '野马分鬃'
          ]
        },
        {
          week: 2,
          title: '基础动作练习',
          lessons: [
            '白鹤亮翅',
            '搂膝拗步',
            '手挥琵琶',
            '左右倒卷肱'
          ]
        },
        {
          week: 3,
          title: '进阶动作学习',
          lessons: [
            '左揽雀尾',
            '右揽雀尾',
            '单鞭',
            '云手'
          ]
        },
        {
          week: 4,
          title: '套路连贯练习',
          lessons: [
            '高探马',
            '右蹬脚',
            '双峰贯耳',
            '转身左蹬脚'
          ]
        },
        {
          week: 5,
          title: '完整套路学习',
          lessons: [
            '左下势独立',
            '右下势独立',
            '左右穿梭',
            '海底针'
          ]
        },
        {
          week: 6,
          title: '套路完善与提高',
          lessons: [
            '闪通臂',
            '转身搬拦捶',
            '如封似闭',
            '十字手收势'
          ]
        }
      ],
      requirements: [
        '有一定的武术基础更佳',
        '身体协调性良好',
        '能够静心学习',
        '有耐心和毅力'
      ],
      benefits: [
        '掌握太极拳24式',
        '改善身体平衡性',
        '调节身心状态',
        '提升气质修养'
      ]
    },
    {
      id: 3,
      title: '少林基本拳法',
      instructor: '张师傅',
      duration: '5周',
      lessons: 20,
      level: '初级',
      category: '少林拳',
      description: '学习少林拳的基本拳法，体验少林武术的刚猛有力。',
      thumbnail: '/img/shaolin-basic.jpg',
      price: 129,
      features: [
        '传统武术',
        '刚猛有力',
        '实用性强',
        '文化底蕴'
      ],
      outline: [
        {
          week: 1,
          title: '少林拳基础',
          lessons: [
            '少林武术文化',
            '基本功训练',
            '拳法基础',
            '步法练习'
          ]
        },
        {
          week: 2,
          title: '基本拳法',
          lessons: [
            '直拳与勾拳',
            '摆拳与劈拳',
            '拳法组合',
            '力量训练'
          ]
        },
        {
          week: 3,
          title: '腿法入门',
          lessons: [
            '正踢腿',
            '侧踢腿',
            '弹腿',
            '腿法组合'
          ]
        },
        {
          week: 4,
          title: '拳腿结合',
          lessons: [
            '拳腿配合',
            '进退步法',
            '攻防转换',
            '实战应用'
          ]
        },
        {
          week: 5,
          title: '套路学习',
          lessons: [
            '小洪拳第一段',
            '小洪拳第二段',
            '套路连贯练习',
            '动作规范化'
          ]
        }
      ],
      requirements: [
        '身体素质良好',
        '能承受一定强度训练',
        '有武术学习兴趣',
        '年龄16-50岁'
      ],
      benefits: [
        '增强身体力量',
        '提高反应速度',
        '学会基本防身',
        '体验传统文化'
      ]
    }
  ];

  useEffect(() => {
    // 加载用户学习进度
    const savedProgress = localStorage.getItem('beginnerCoursesProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const getCourseProgress = (courseId) => {
    return userProgress[courseId]?.progress || 0;
  };

  const isCourseEnrolled = (courseId) => {
    return userProgress[courseId]?.enrolled || false;
  };

  const enrollCourse = (courseId) => {
    const newProgress = {
      ...userProgress,
      [courseId]: {
        enrolled: true,
        progress: 0,
        enrolledAt: new Date().toISOString()
      }
    };
    setUserProgress(newProgress);
    localStorage.setItem('beginnerCoursesProgress', JSON.stringify(newProgress));
  };

  const showCourseDetail = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  const startLearning = (courseId) => {
    if (!isCourseEnrolled(courseId)) {
      enrollCourse(courseId);
    }
    // 跳转到课程学习页面
    window.location.href = `/course-study/${courseId}`;
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>
            <BookOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            入门教学
          </Title>
          <Paragraph>
            专为武术初学者设计的入门课程，从基础开始，循序渐进。
            无论您是完全的新手还是想要巩固基础，这里都有适合您的课程。
          </Paragraph>

          <Alert
            message="学习建议"
            description="建议从武术基本功开始学习，打好基础后再选择具体的武术门类。每个课程都有详细的学习计划，请按照进度学习。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Row gutter={[16, 16]}>
            {beginnerCourses.map((course) => (
              <Col xs={24} sm={12} lg={8} key={course.id}>
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
                        <BookOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                        <div style={{ fontSize: 16, fontWeight: 'bold' }}>{course.category}</div>
                      </div>
                    </div>
                  }
                  actions={[
                    <Button type="link" onClick={() => showCourseDetail(course)}>
                      查看详情
                    </Button>,
                    isCourseEnrolled(course.id) ? (
                      <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => startLearning(course.id)}>
                        继续学习
                      </Button>
                    ) : (
                      <Button type="primary" onClick={() => startLearning(course.id)}>
                        {course.price === 0 ? '免费学习' : '立即报名'}
                      </Button>
                    )
                  ]}
                >
                  <Card.Meta
                    title={
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
                          {course.title}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Tag color="blue">{course.level}</Tag>
                          {course.price === 0 ? (
                            <Tag color="green">免费</Tag>
                          ) : (
                            <Text type="danger" style={{ fontSize: 16, fontWeight: 'bold' }}>
                              ¥{course.price}
                            </Text>
                          )}
                        </div>
                      </div>
                    }
                    description={
                      <div>
                        <p style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                          {course.description}
                        </p>
                        <div style={{ marginBottom: 8 }}>
                          <UserOutlined style={{ marginRight: 4 }} />
                          <Text>{course.instructor}</Text>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          <Text>{course.duration} · {course.lessons}课时</Text>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          {course.features.map(feature => (
                            <Tag key={feature} size="small" style={{ margin: 2 }}>
                              {feature}
                            </Tag>
                          ))}
                        </div>
                        {isCourseEnrolled(course.id) && (
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">学习进度:</Text>
                            <Progress
                              percent={getCourseProgress(course.id)}
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

        {/* 课程详情模态框 */}
        <Modal
          title={selectedCourse?.title}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={800}
          footer={[
            <Button key="cancel" onClick={() => setModalVisible(false)}>
              关闭
            </Button>,
            <Button
              key="enroll"
              type="primary"
              onClick={() => {
                startLearning(selectedCourse.id);
                setModalVisible(false);
              }}
            >
              {isCourseEnrolled(selectedCourse?.id) ? '继续学习' :
               (selectedCourse?.price === 0 ? '免费学习' : '立即报名')}
            </Button>
          ]}
        >
          {selectedCourse && (
            <div>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Text strong>讲师：</Text>{selectedCourse.instructor}
                </Col>
                <Col span={12}>
                  <Text strong>课程时长：</Text>{selectedCourse.duration}
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Text strong>课时数量：</Text>{selectedCourse.lessons}课时
                </Col>
                <Col span={12}>
                  <Text strong>难度等级：</Text>
                  <Tag color="blue">{selectedCourse.level}</Tag>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Text strong>课程分类：</Text>{selectedCourse.category}
                </Col>
                <Col span={12}>
                  <Text strong>课程价格：</Text>
                  {selectedCourse.price === 0 ? (
                    <Tag color="green">免费</Tag>
                  ) : (
                    <Text type="danger" style={{ fontSize: 16, fontWeight: 'bold' }}>
                      ¥{selectedCourse.price}
                    </Text>
                  )}
                </Col>
              </Row>

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>课程描述</Title>
                <Paragraph>{selectedCourse.description}</Paragraph>
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>课程大纲</Title>
                <Steps direction="vertical" size="small" current={-1}>
                  {selectedCourse.outline.map((week, index) => (
                    <Step
                      key={index}
                      title={`第${week.week}周：${week.title}`}
                      description={
                        <List
                          size="small"
                          dataSource={week.lessons}
                          renderItem={(lesson, lessonIndex) => (
                            <List.Item style={{ padding: '4px 0' }}>
                              <Text>{lessonIndex + 1}. {lesson}</Text>
                            </List.Item>
                          )}
                        />
                      }
                    />
                  ))}
                </Steps>
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Title level={4}>学习要求</Title>
                  <List
                    size="small"
                    dataSource={selectedCourse.requirements}
                    renderItem={(item, index) => (
                      <List.Item>
                        <Text>{index + 1}. {item}</Text>
                      </List.Item>
                    )}
                  />
                </Col>
                <Col span={12}>
                  <Title level={4}>学习收益</Title>
                  <List
                    size="small"
                    dataSource={selectedCourse.benefits}
                    renderItem={(item, index) => (
                      <List.Item>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                        <Text>{item}</Text>
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default BeginnerCourses;
