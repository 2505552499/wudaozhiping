import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Tag, Progress, Typography, List, Modal, Alert, Rate } from 'antd';
import { PlayCircleOutlined, TrophyOutlined, ClockCircleOutlined, UserOutlined, StarOutlined, LockOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';

const { Title, Paragraph, Text } = Typography;

const AdvancedCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userProgress, setUserProgress] = useState({});

  // 进阶课程数据
  const advancedCourses = [
    {
      id: 1,
      title: '太极拳推手技法',
      instructor: '李大师',
      duration: '8周',
      lessons: 32,
      level: '中级',
      category: '太极拳',
      difficulty: 4,
      description: '深入学习太极拳推手技法，掌握听劲、化劲、发劲的精髓。',
      thumbnail: '/img/taiji-tuishou.jpg',
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      studentCount: 156,
      prerequisites: ['太极拳24式', '太极拳基础理论'],
      features: [
        '实战技法',
        '内功修炼',
        '师父亲授',
        '小班教学'
      ],
      highlights: [
        '国家级太极拳大师亲自授课',
        '传统推手技法完整传授',
        '理论与实践相结合',
        '个性化指导纠正'
      ],
      courseContent: [
        {
          module: '推手基础',
          lessons: [
            '推手基本姿势与步法',
            '单推手练习方法',
            '双推手基础技法',
            '推手中的听劲训练'
          ]
        },
        {
          module: '化劲技法',
          lessons: [
            '化劲的基本原理',
            '圆化与直化技法',
            '上化下化的运用',
            '化劲与步法配合'
          ]
        },
        {
          module: '发劲技法',
          lessons: [
            '发劲的时机把握',
            '螺旋劲的运用',
            '寸劲与长劲',
            '发劲与呼吸配合'
          ]
        },
        {
          module: '实战应用',
          lessons: [
            '推手实战技巧',
            '常见问题解决',
            '推手比赛规则',
            '推手文化与礼仪'
          ]
        }
      ],
      requirements: [
        '已掌握太极拳基础套路',
        '有一定的太极拳理论基础',
        '身体协调性良好',
        '能够理解内家拳理念'
      ],
      benefits: [
        '掌握太极推手精髓',
        '提升内功修为',
        '增强实战能力',
        '深入理解太极文化'
      ]
    },
    {
      id: 2,
      title: '咏春拳黏手训练',
      instructor: '王师傅',
      duration: '6周',
      lessons: 24,
      level: '中级',
      category: '咏春拳',
      difficulty: 4,
      description: '学习咏春拳黏手技法，提升近身格斗能力和反应速度。',
      thumbnail: '/img/wingchun-chishou.jpg',
      price: 259,
      originalPrice: 329,
      rating: 4.7,
      studentCount: 89,
      prerequisites: ['咏春拳基础套路', '小念头'],
      features: [
        '实战导向',
        '反应训练',
        '技击精髓',
        '传统正宗'
      ],
      highlights: [
        '正宗叶问系咏春拳传承',
        '黏手技法系统教学',
        '实战应用重点训练',
        '个人技能快速提升'
      ],
      courseContent: [
        {
          module: '黏手基础',
          lessons: [
            '黏手基本手法',
            '单黏手练习',
            '双黏手入门',
            '黏手中的感知训练'
          ]
        },
        {
          module: '黏手技法',
          lessons: [
            '拍、按、摊、膀手法',
            '黏手中的进攻技巧',
            '黏手防守要领',
            '黏手与步法配合'
          ]
        },
        {
          module: '实战应用',
          lessons: [
            '黏手实战技巧',
            '近身格斗应用',
            '反应速度训练',
            '实战模拟练习'
          ]
        }
      ],
      requirements: [
        '掌握咏春拳基础套路',
        '有一定的武术基础',
        '反应能力较好',
        '能承受对抗训练'
      ],
      benefits: [
        '提升近身格斗能力',
        '增强反应速度',
        '掌握实用防身技能',
        '体验传统武术精髓'
      ]
    },
    {
      id: 3,
      title: '少林七十二绝技',
      instructor: '释德扬',
      duration: '12周',
      lessons: 48,
      level: '高级',
      category: '少林功夫',
      difficulty: 5,
      description: '学习少林寺传统七十二绝技中的精选功法，挑战武术极限。',
      thumbnail: '/img/shaolin-72.jpg',
      price: 599,
      originalPrice: 799,
      rating: 4.9,
      studentCount: 45,
      prerequisites: ['少林基础拳法', '少林内功', '武术基本功扎实'],
      features: [
        '传统绝技',
        '高难度',
        '少林正宗',
        '限额招生'
      ],
      highlights: [
        '少林寺武僧亲自传授',
        '传统七十二绝技精选',
        '高强度专业训练',
        '武术境界质的飞跃'
      ],
      courseContent: [
        {
          module: '硬功绝技',
          lessons: [
            '铁头功基础训练',
            '铁臂功练习方法',
            '铁腿功训练要领',
            '硬功安全注意事项'
          ]
        },
        {
          module: '轻功绝技',
          lessons: [
            '梯云纵基础',
            '草上飞练习',
            '轻功理论与实践',
            '轻功安全训练'
          ]
        },
        {
          module: '内功绝技',
          lessons: [
            '易筋经修炼',
            '洗髓经要领',
            '内功与外功结合',
            '内功境界提升'
          ]
        },
        {
          module: '器械绝技',
          lessons: [
            '少林棍法精要',
            '少林刀法绝技',
            '少林剑法要诀',
            '器械与拳法结合'
          ]
        }
      ],
      requirements: [
        '有扎实的武术基础',
        '身体素质优秀',
        '意志力坚强',
        '能承受高强度训练',
        '年龄18-35岁'
      ],
      benefits: [
        '掌握传统武术绝技',
        '大幅提升武术水平',
        '增强身体素质',
        '体验少林文化精髓'
      ]
    },
    {
      id: 4,
      title: '形意拳五行拳精进',
      instructor: '郭师傅',
      duration: '10周',
      lessons: 40,
      level: '中高级',
      category: '形意拳',
      difficulty: 4,
      description: '深入学习形意拳五行拳法，掌握劈、崩、钻、炮、横的精髓。',
      thumbnail: '/img/xinyi-wuxing.jpg',
      price: 399,
      originalPrice: 499,
      rating: 4.6,
      studentCount: 67,
      prerequisites: ['形意拳基础', '三体式站桩'],
      features: [
        '传统内家拳',
        '五行理论',
        '实战威力',
        '文化内涵'
      ],
      highlights: [
        '形意拳名家传承',
        '五行拳法完整体系',
        '理论实践并重',
        '传统文化深度解读'
      ],
      courseContent: [
        {
          module: '五行拳基础',
          lessons: [
            '五行拳理论基础',
            '劈拳精要',
            '崩拳要领',
            '钻拳技法'
          ]
        },
        {
          module: '五行拳进阶',
          lessons: [
            '炮拳威力',
            '横拳技巧',
            '五行相生相克',
            '五行拳连环'
          ]
        },
        {
          module: '实战应用',
          lessons: [
            '五行拳实战技法',
            '五行拳与步法',
            '五行拳对练',
            '实战模拟训练'
          ]
        }
      ],
      requirements: [
        '有形意拳基础',
        '理解内家拳理念',
        '身体协调性好',
        '有一定文化素养'
      ],
      benefits: [
        '掌握五行拳精髓',
        '提升内功修为',
        '增强实战能力',
        '深入理解传统文化'
      ]
    }
  ];

  useEffect(() => {
    // 加载用户学习进度
    const savedProgress = localStorage.getItem('advancedCoursesProgress');
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

  const canEnrollCourse = (course) => {
    // 检查是否满足前置条件
    // 这里简化处理，实际应该检查用户是否完成了前置课程
    return true;
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
    localStorage.setItem('advancedCoursesProgress', JSON.stringify(newProgress));
  };

  const showCourseDetail = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  const startLearning = (courseId) => {
    if (!isCourseEnrolled(courseId)) {
      enrollCourse(courseId);
    }
    // 跳转到课程学习页面，使用映射后的ID
    const mappedCourseId = courseId + 100; // 1->101, 2->102, 3->103, 4->104
    window.location.href = `/course-study/${mappedCourseId}`;
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

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>
            <TrophyOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            进阶训练
          </Title>
          <Paragraph>
            为有一定武术基础的学员设计的进阶课程，深入学习各门派的精髓技法。
            这些课程要求更高的基础和更强的训练强度，适合追求武术精进的学员。
          </Paragraph>

          <Alert
            message="重要提醒"
            description="进阶课程需要一定的武术基础，请确保您已经掌握相关的前置技能。部分高难度课程可能存在一定风险，请在专业指导下练习。"
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Row gutter={[16, 16]}>
            {advancedCourses.map((course) => (
              <Col xs={24} sm={12} lg={8} key={course.id}>
                <Card
                  hoverable
                  cover={
                    <div style={{
                      height: 200,
                      background: 'linear-gradient(135deg, #fa8c16 0%, #faad14 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      position: 'relative'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <TrophyOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                        <div style={{ fontSize: 16, fontWeight: 'bold' }}>{course.category}</div>
                      </div>
                      {!canEnrollCourse(course) && (
                        <div style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(0,0,0,0.6)',
                          padding: '4px 8px',
                          borderRadius: 4
                        }}>
                          <LockOutlined />
                        </div>
                      )}
                    </div>
                  }
                  actions={[
                    <Button type="link" onClick={() => showCourseDetail(course)}>
                      查看详情
                    </Button>,
                    canEnrollCourse(course) ? (
                      isCourseEnrolled(course.id) ? (
                        <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => startLearning(course.id)}>
                          继续学习
                        </Button>
                      ) : (
                        <Button type="primary" onClick={() => startLearning(course.id)}>
                          立即报名
                        </Button>
                      )
                    ) : (
                      <Button disabled icon={<LockOutlined />}>
                        需要前置课程
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
                          <div>
                            <Tag color="orange">{course.level}</Tag>
                            <span style={{ marginLeft: 4 }}>
                              {getDifficultyStars(course.difficulty)}
                            </span>
                          </div>
                          <div>
                            {course.originalPrice && (
                              <Text delete type="secondary" style={{ fontSize: 12, marginRight: 4 }}>
                                ¥{course.originalPrice}
                              </Text>
                            )}
                            <Text type="danger" style={{ fontSize: 16, fontWeight: 'bold' }}>
                              ¥{course.price}
                            </Text>
                          </div>
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
                          <Rate disabled defaultValue={course.rating} allowHalf size="small" />
                          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                            {course.rating} ({course.studentCount}人学习)
                          </Text>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          {course.features.map(feature => (
                            <Tag key={feature} size="small" style={{ margin: 2 }}>
                              {feature}
                            </Tag>
                          ))}
                        </div>
                        {course.prerequisites.length > 0 && (
                          <div style={{ marginBottom: 8 }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              前置要求: {course.prerequisites.join(', ')}
                            </Text>
                          </div>
                        )}
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
            canEnrollCourse(selectedCourse) ? (
              <Button
                key="enroll"
                type="primary"
                onClick={() => {
                  startLearning(selectedCourse.id);
                  setModalVisible(false);
                }}
              >
                {isCourseEnrolled(selectedCourse?.id) ? '继续学习' : '立即报名'}
              </Button>
            ) : (
              <Button key="locked" disabled icon={<LockOutlined />}>
                需要完成前置课程
              </Button>
            )
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
                  <Tag color="orange">{selectedCourse.level}</Tag>
                  {getDifficultyStars(selectedCourse.difficulty)}
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Text strong>学员评价：</Text>
                  <Rate disabled defaultValue={selectedCourse.rating} allowHalf size="small" />
                  <Text style={{ marginLeft: 8 }}>{selectedCourse.rating}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>学习人数：</Text>{selectedCourse.studentCount}人
                </Col>
              </Row>

              {selectedCourse.prerequisites.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Title level={4}>前置要求</Title>
                  <List
                    size="small"
                    dataSource={selectedCourse.prerequisites}
                    renderItem={(item, index) => (
                      <List.Item>
                        <Text>{index + 1}. {item}</Text>
                      </List.Item>
                    )}
                  />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>课程亮点</Title>
                <List
                  size="small"
                  dataSource={selectedCourse.highlights}
                  renderItem={(item, index) => (
                    <List.Item>
                      <StarOutlined style={{ color: '#faad14', marginRight: 4 }} />
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>课程内容</Title>
                {selectedCourse.courseContent.map((module, index) => (
                  <Card key={index} size="small" style={{ marginBottom: 8 }}>
                    <Title level={5}>{module.module}</Title>
                    <List
                      size="small"
                      dataSource={module.lessons}
                      renderItem={(lesson, lessonIndex) => (
                        <List.Item style={{ padding: '4px 0' }}>
                          <Text>{lessonIndex + 1}. {lesson}</Text>
                        </List.Item>
                      )}
                    />
                  </Card>
                ))}
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
                        <TrophyOutlined style={{ color: '#faad14', marginRight: 4 }} />
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

export default AdvancedCourses;
