import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Steps, Typography, List, Progress, Alert, Tabs } from 'antd';
import { PlayCircleOutlined, BookOutlined, CheckCircleOutlined, ArrowLeftOutlined, TrophyOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;

const CourseStudy = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [userProgress, setUserProgress] = useState({});

  // 所有课程数据
  const allCourses = {
    // 入门课程
    1: {
      id: 1,
      title: '武术基本功入门',
      instructor: '李师傅',
      duration: '4周',
      lessons: 16,
      level: '零基础',
      category: '基本功',
      description: '从零开始学习武术基本功，包括站桩、基本步法、手型等基础动作。',
      price: 0,
      outline: [
        {
          week: 1,
          title: '武术基础认知',
          lessons: [
            { title: '武术历史与文化', duration: '15分钟', videoUrl: '/videos/lesson1.mp4' },
            { title: '基本礼仪与规范', duration: '10分钟', videoUrl: '/videos/lesson2.mp4' },
            { title: '身体准备与热身', duration: '20分钟', videoUrl: '/videos/lesson3.mp4' },
            { title: '基本站姿练习', duration: '25分钟', videoUrl: '/videos/lesson4.mp4' }
          ]
        },
        {
          week: 2,
          title: '基本手型与步法',
          lessons: [
            { title: '拳、掌、勾手型', duration: '30分钟', videoUrl: '/videos/lesson5.mp4' },
            { title: '弓步、马步、虚步', duration: '35分钟', videoUrl: '/videos/lesson6.mp4' },
            { title: '手型与步法结合', duration: '40分钟', videoUrl: '/videos/lesson7.mp4' },
            { title: '基本协调性训练', duration: '30分钟', videoUrl: '/videos/lesson8.mp4' }
          ]
        },
        {
          week: 3,
          title: '基本动作组合',
          lessons: [
            { title: '冲拳与推掌', duration: '35分钟', videoUrl: '/videos/lesson9.mp4' },
            { title: '踢腿与摆腿', duration: '40分钟', videoUrl: '/videos/lesson10.mp4' },
            { title: '转身与跳跃', duration: '30分钟', videoUrl: '/videos/lesson11.mp4' },
            { title: '动作连贯性练习', duration: '45分钟', videoUrl: '/videos/lesson12.mp4' }
          ]
        },
        {
          week: 4,
          title: '综合练习与考核',
          lessons: [
            { title: '基本功综合练习', duration: '50分钟', videoUrl: '/videos/lesson13.mp4' },
            { title: '动作标准性检查', duration: '30分钟', videoUrl: '/videos/lesson14.mp4' },
            { title: '学习成果展示', duration: '25分钟', videoUrl: '/videos/lesson15.mp4' },
            { title: '下阶段学习规划', duration: '20分钟', videoUrl: '/videos/lesson16.mp4' }
          ]
        }
      ]
    },
    2: {
      id: 2,
      title: '太极拳24式入门',
      instructor: '王师傅',
      duration: '6周',
      lessons: 24,
      level: '初级',
      category: '太极拳',
      description: '学习太极拳24式，掌握太极拳的基本动作和呼吸方法。',
      price: 99,
      outline: [
        {
          week: 1,
          title: '太极拳基础',
          lessons: [
            { title: '太极拳理论基础', duration: '20分钟', videoUrl: '/videos/taiji1.mp4' },
            { title: '基本站桩与呼吸', duration: '25分钟', videoUrl: '/videos/taiji2.mp4' },
            { title: '起势与收势', duration: '15分钟', videoUrl: '/videos/taiji3.mp4' },
            { title: '野马分鬃', duration: '30分钟', videoUrl: '/videos/taiji4.mp4' }
          ]
        },
        {
          week: 2,
          title: '基础动作练习',
          lessons: [
            { title: '白鹤亮翅', duration: '25分钟', videoUrl: '/videos/taiji5.mp4' },
            { title: '搂膝拗步', duration: '30分钟', videoUrl: '/videos/taiji6.mp4' },
            { title: '手挥琵琶', duration: '20分钟', videoUrl: '/videos/taiji7.mp4' },
            { title: '左右倒卷肱', duration: '35分钟', videoUrl: '/videos/taiji8.mp4' }
          ]
        }
        // 可以继续添加更多周的内容
      ]
    },
    3: {
      id: 3,
      title: '少林基本拳法',
      instructor: '张师傅',
      duration: '5周',
      lessons: 20,
      level: '初级',
      category: '少林拳',
      description: '学习少林拳的基本拳法，体验少林武术的刚猛有力。',
      price: 129,
      outline: [
        {
          week: 1,
          title: '少林拳基础',
          lessons: [
            { title: '少林武术文化', duration: '20分钟', videoUrl: '/videos/shaolin1.mp4' },
            { title: '基本功训练', duration: '30分钟', videoUrl: '/videos/shaolin2.mp4' },
            { title: '拳法基础', duration: '25分钟', videoUrl: '/videos/shaolin3.mp4' },
            { title: '步法练习', duration: '35分钟', videoUrl: '/videos/shaolin4.mp4' }
          ]
        }
        // 可以继续添加更多周的内容
      ]
    },
    // 进阶课程 (对应AdvancedCourses页面的课程)
    // 注意：这里的ID需要加上偏移量，因为入门课程占用了1-3
    101: {
      id: 101,
      title: '太极拳推手技法',
      instructor: '李大师',
      duration: '8周',
      lessons: 32,
      level: '中级',
      category: '太极拳',
      description: '深入学习太极拳推手技法，掌握听劲、化劲、发劲的精髓。',
      price: 299,
      outline: [
        {
          week: 1,
          title: '推手基础',
          lessons: [
            { title: '推手基本姿势与步法', duration: '30分钟', videoUrl: '/videos/tuishou1.mp4' },
            { title: '单推手练习方法', duration: '35分钟', videoUrl: '/videos/tuishou2.mp4' },
            { title: '双推手基础技法', duration: '40分钟', videoUrl: '/videos/tuishou3.mp4' },
            { title: '推手中的听劲训练', duration: '45分钟', videoUrl: '/videos/tuishou4.mp4' }
          ]
        },
        {
          week: 2,
          title: '化劲技法',
          lessons: [
            { title: '化劲的基本原理', duration: '35分钟', videoUrl: '/videos/tuishou5.mp4' },
            { title: '圆化与直化技法', duration: '40分钟', videoUrl: '/videos/tuishou6.mp4' },
            { title: '上化下化的运用', duration: '45分钟', videoUrl: '/videos/tuishou7.mp4' },
            { title: '化劲与步法配合', duration: '40分钟', videoUrl: '/videos/tuishou8.mp4' }
          ]
        }
      ]
    },
    102: {
      id: 102,
      title: '咏春拳黏手训练',
      instructor: '王师傅',
      duration: '6周',
      lessons: 24,
      level: '中级',
      category: '咏春拳',
      description: '学习咏春拳黏手技法，提升近身格斗能力和反应速度。',
      price: 259,
      outline: [
        {
          week: 1,
          title: '黏手基础',
          lessons: [
            { title: '黏手基本手法', duration: '25分钟', videoUrl: '/videos/chishou1.mp4' },
            { title: '单黏手练习', duration: '30分钟', videoUrl: '/videos/chishou2.mp4' },
            { title: '双黏手入门', duration: '35分钟', videoUrl: '/videos/chishou3.mp4' },
            { title: '黏手中的感知训练', duration: '40分钟', videoUrl: '/videos/chishou4.mp4' }
          ]
        },
        {
          week: 2,
          title: '黏手技法',
          lessons: [
            { title: '拍、按、摊、膀手法', duration: '35分钟', videoUrl: '/videos/chishou5.mp4' },
            { title: '黏手中的进攻技巧', duration: '40分钟', videoUrl: '/videos/chishou6.mp4' },
            { title: '黏手防守要领', duration: '30分钟', videoUrl: '/videos/chishou7.mp4' },
            { title: '黏手与步法配合', duration: '35分钟', videoUrl: '/videos/chishou8.mp4' }
          ]
        }
      ]
    },
    103: {
      id: 103,
      title: '少林七十二绝技',
      instructor: '释德扬',
      duration: '12周',
      lessons: 48,
      level: '高级',
      category: '少林功夫',
      description: '学习少林寺传统七十二绝技中的精选功法，挑战武术极限。',
      price: 599,
      outline: [
        {
          week: 1,
          title: '硬功绝技',
          lessons: [
            { title: '铁头功基础训练', duration: '45分钟', videoUrl: '/videos/shaolin72_1.mp4' },
            { title: '铁臂功练习方法', duration: '50分钟', videoUrl: '/videos/shaolin72_2.mp4' },
            { title: '铁腿功训练要领', duration: '45分钟', videoUrl: '/videos/shaolin72_3.mp4' },
            { title: '硬功安全注意事项', duration: '30分钟', videoUrl: '/videos/shaolin72_4.mp4' }
          ]
        },
        {
          week: 2,
          title: '轻功绝技',
          lessons: [
            { title: '梯云纵基础', duration: '40分钟', videoUrl: '/videos/shaolin72_5.mp4' },
            { title: '草上飞练习', duration: '45分钟', videoUrl: '/videos/shaolin72_6.mp4' },
            { title: '轻功理论与实践', duration: '35分钟', videoUrl: '/videos/shaolin72_7.mp4' },
            { title: '轻功安全训练', duration: '30分钟', videoUrl: '/videos/shaolin72_8.mp4' }
          ]
        }
      ]
    },
    104: {
      id: 104,
      title: '形意拳五行拳精进',
      instructor: '郭师傅',
      duration: '10周',
      lessons: 40,
      level: '中高级',
      category: '形意拳',
      description: '深入学习形意拳五行拳法，掌握劈、崩、钻、炮、横的精髓。',
      price: 399,
      outline: [
        {
          week: 1,
          title: '五行拳基础',
          lessons: [
            { title: '五行拳理论基础', duration: '30分钟', videoUrl: '/videos/xinyi1.mp4' },
            { title: '劈拳精要', duration: '35分钟', videoUrl: '/videos/xinyi2.mp4' },
            { title: '崩拳要领', duration: '35分钟', videoUrl: '/videos/xinyi3.mp4' },
            { title: '钻拳技法', duration: '40分钟', videoUrl: '/videos/xinyi4.mp4' }
          ]
        },
        {
          week: 2,
          title: '五行拳进阶',
          lessons: [
            { title: '炮拳威力', duration: '40分钟', videoUrl: '/videos/xinyi5.mp4' },
            { title: '横拳技巧', duration: '35分钟', videoUrl: '/videos/xinyi6.mp4' },
            { title: '五行相生相克', duration: '45分钟', videoUrl: '/videos/xinyi7.mp4' },
            { title: '五行拳连环', duration: '50分钟', videoUrl: '/videos/xinyi8.mp4' }
          ]
        }
      ]
    },
    // 专业技巧
    6: {
      id: 6,
      title: '实战格斗技法',
      instructor: '李军教练',
      duration: '12周',
      lessons: 48,
      level: '专业级',
      category: '实战技击',
      description: '综合各门派实战技法，培养真正的格斗能力。',
      price: 899,
      outline: [
        {
          week: 1,
          title: '格斗基础',
          lessons: [
            { title: '距离感培养', duration: '45分钟', videoUrl: '/videos/combat1.mp4' },
            { title: '时机把握', duration: '50分钟', videoUrl: '/videos/combat2.mp4' },
            { title: '反应训练', duration: '40分钟', videoUrl: '/videos/combat3.mp4' },
            { title: '体能强化', duration: '60分钟', videoUrl: '/videos/combat4.mp4' }
          ]
        }
      ]
    }
  };

  useEffect(() => {
    // 加载课程数据
    const courseData = allCourses[parseInt(courseId)];
    if (courseData) {
      setCourse(courseData);
    }

    // 加载用户进度
    const savedProgress = localStorage.getItem('courseStudyProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setUserProgress(progress);
      setCompletedLessons(progress[courseId]?.completedLessons || []);
      setCurrentLesson(progress[courseId]?.currentLesson || 0);
    }
  }, [courseId]);

  const markLessonComplete = (lessonIndex) => {
    const newCompletedLessons = [...completedLessons];
    if (!newCompletedLessons.includes(lessonIndex)) {
      newCompletedLessons.push(lessonIndex);
      setCompletedLessons(newCompletedLessons);

      // 更新进度到localStorage
      const newProgress = {
        ...userProgress,
        [courseId]: {
          ...userProgress[courseId],
          completedLessons: newCompletedLessons,
          currentLesson: Math.max(currentLesson, lessonIndex + 1),
          progress: Math.round((newCompletedLessons.length / course.lessons) * 100)
        }
      };
      setUserProgress(newProgress);
      localStorage.setItem('courseStudyProgress', JSON.stringify(newProgress));
    }
  };

  const goToLesson = (lessonIndex) => {
    setCurrentLesson(lessonIndex);
  };

  const getCurrentLessonData = () => {
    if (!course) return null;

    let lessonCount = 0;
    for (const week of course.outline) {
      for (const lesson of week.lessons) {
        if (lessonCount === currentLesson) {
          return { ...lesson, weekTitle: week.title };
        }
        lessonCount++;
      }
    }
    return null;
  };

  const getAllLessons = () => {
    if (!course) return [];

    const allLessons = [];
    for (const week of course.outline) {
      for (const lesson of week.lessons) {
        allLessons.push({ ...lesson, weekTitle: week.title });
      }
    }
    return allLessons;
  };

  const getProgressPercentage = () => {
    if (!course) return 0;
    return Math.round((completedLessons.length / course.lessons) * 100);
  };

  const getBackUrl = () => {
    if (!course) return '/beginner-courses';
    const courseIdNum = parseInt(courseId);
    if (courseIdNum <= 3) return '/beginner-courses';
    if (courseIdNum >= 101 && courseIdNum <= 104) return '/advanced-courses';
    return '/professional-skills';
  };

  if (!course) {
    return (
      <MainLayout>
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <Alert
            message="课程未找到"
            description="抱歉，您访问的课程不存在或已被删除。"
            type="error"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate(getBackUrl())}>
                返回课程列表
              </Button>
            }
          />
        </div>
      </MainLayout>
    );
  }

  const currentLessonData = getCurrentLessonData();
  const allLessons = getAllLessons();

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        {/* 课程头部信息 */}
        <Card style={{ marginBottom: 16 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(getBackUrl())}
                style={{ marginRight: 16 }}
              >
                返回课程列表
              </Button>
              <Title level={3} style={{ display: 'inline', margin: 0 }}>
                {course.title}
              </Title>
            </Col>
            <Col>
              <div style={{ textAlign: 'right' }}>
                <Text type="secondary">学习进度</Text>
                <Progress
                  percent={getProgressPercentage()}
                  style={{ width: 200, marginTop: 4 }}
                />
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={16}>
          {/* 左侧课程列表 */}
          <Col xs={24} lg={8}>
            <Card title="课程目录" style={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
              {course.outline.map((week, weekIndex) => (
                <div key={weekIndex} style={{ marginBottom: 16 }}>
                  <Title level={5}>{week.title}</Title>
                  <List
                    size="small"
                    dataSource={week.lessons}
                    renderItem={(lesson, lessonIndex) => {
                      const globalLessonIndex = course.outline
                        .slice(0, weekIndex)
                        .reduce((acc, w) => acc + w.lessons.length, 0) + lessonIndex;

                      const isCompleted = completedLessons.includes(globalLessonIndex);
                      const isCurrent = currentLesson === globalLessonIndex;

                      return (
                        <List.Item
                          style={{
                            cursor: 'pointer',
                            padding: '8px 12px',
                            backgroundColor: isCurrent ? '#e6f7ff' : 'transparent',
                            border: isCurrent ? '1px solid #1890ff' : '1px solid transparent',
                            borderRadius: 4,
                            marginBottom: 4
                          }}
                          onClick={() => goToLesson(globalLessonIndex)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            {isCompleted ? (
                              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                            ) : (
                              <PlayCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: isCurrent ? 'bold' : 'normal' }}>
                                {lesson.title}
                              </div>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {lesson.duration}
                              </Text>
                            </div>
                          </div>
                        </List.Item>
                      );
                    }}
                  />
                </div>
              ))}
            </Card>
          </Col>

          {/* 右侧视频播放区域 */}
          <Col xs={24} lg={16}>
            <Card>
              {currentLessonData ? (
                <div>
                  <Title level={4}>{currentLessonData.title}</Title>
                  <Text type="secondary">{currentLessonData.weekTitle} · {currentLessonData.duration}</Text>

                  {/* 视频播放器占位 */}
                  <div
                    style={{
                      width: '100%',
                      height: 400,
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 16,
                      marginBottom: 16,
                      border: '1px dashed #d9d9d9',
                      borderRadius: 8
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <PlayCircleOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 8 }} />
                      <div>视频播放器</div>
                      <Text type="secondary">视频文件: {currentLessonData.videoUrl}</Text>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<CheckCircleOutlined />}
                      onClick={() => markLessonComplete(currentLesson)}
                      disabled={completedLessons.includes(currentLesson)}
                    >
                      {completedLessons.includes(currentLesson) ? '已完成' : '标记为已完成'}
                    </Button>
                  </div>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Button
                        block
                        disabled={currentLesson === 0}
                        onClick={() => goToLesson(currentLesson - 1)}
                      >
                        上一课
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        block
                        type="primary"
                        disabled={currentLesson >= allLessons.length - 1}
                        onClick={() => goToLesson(currentLesson + 1)}
                      >
                        下一课
                      </Button>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <BookOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                  <Title level={4} type="secondary">选择一个课程开始学习</Title>
                </div>
              )}
            </Card>

            {/* 课程完成提示 */}
            {getProgressPercentage() === 100 && (
              <Card style={{ marginTop: 16, textAlign: 'center' }}>
                <TrophyOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
                <Title level={3}>恭喜完成课程！</Title>
                <Paragraph>
                  您已经完成了《{course.title}》的全部学习内容。
                  继续努力，探索更多高级课程吧！
                </Paragraph>
                <Button type="primary" size="large" onClick={() => navigate('/advanced-courses')}>
                  查看进阶课程
                </Button>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default CourseStudy;
