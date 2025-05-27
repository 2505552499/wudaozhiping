import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Tag, Avatar, Rate, Skeleton } from 'antd';
import {
  BookOutlined,
  UserOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const PersonalizedRecommendations = ({ userId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState({
    courses: [],
    coaches: [],
    posts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockRecommendations = generateMockRecommendations();
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('获取推荐失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecommendations = () => {
    return {
      courses: [
        {
          id: 1,
          title: '太极基础入门课程',
          instructor: '李师傅',
          rating: 4.8,
          students: 1234,
          price: 299,
          duration: '8周',
          level: '初级',
          tags: ['太极', '基础', '养生'],
          thumbnail: '/img/course-taiji.jpg',
          matchReason: '基于您的分析结果，推荐从太极基础开始'
        },
        {
          id: 2,
          title: '防身术实战技巧',
          instructor: '王教练',
          rating: 4.9,
          students: 856,
          price: 399,
          duration: '6周',
          level: '中级',
          tags: ['防身术', '实战', '技巧'],
          thumbnail: '/img/course-defense.jpg',
          matchReason: '您对实用技巧感兴趣，这门课程很适合'
        },
        {
          id: 3,
          title: '武术基本功强化',
          instructor: '张大师',
          rating: 4.7,
          students: 2341,
          price: 199,
          duration: '4周',
          level: '初级',
          tags: ['基本功', '力量', '柔韧'],
          thumbnail: '/img/course-basics.jpg',
          matchReason: '根据您的动作分析，建议加强基本功训练'
        }
      ],
      coaches: [
        {
          id: 1,
          name: '李明师傅',
          specialties: ['太极拳', '八卦掌', '养生功'],
          experience: 15,
          rating: 4.9,
          location: '北京市朝阳区',
          price: 200,
          avatar: '/img/coach-li.jpg',
          students: 156,
          matchReason: '专长与您的学习目标高度匹配'
        },
        {
          id: 2,
          name: '王教练',
          specialties: ['散打', '防身术', '体能训练'],
          experience: 12,
          rating: 4.8,
          location: '北京市海淀区',
          price: 180,
          avatar: '/img/coach-wang.jpg',
          students: 89,
          matchReason: '距离您较近，时间安排灵活'
        },
        {
          id: 3,
          name: '张大师',
          specialties: ['传统武术', '基本功', '内功心法'],
          experience: 20,
          rating: 5.0,
          location: '北京市西城区',
          price: 300,
          avatar: '/img/coach-zhang.jpg',
          students: 234,
          matchReason: '经验丰富，适合系统性学习'
        }
      ],
      posts: [
        {
          id: 1,
          title: '太极拳练习中的常见错误及纠正方法',
          author: '太极爱好者',
          likes: 156,
          comments: 23,
          views: 1234,
          tags: ['太极', '技巧', '纠错'],
          excerpt: '在太极拳的练习过程中，初学者经常会犯一些典型的错误...',
          matchReason: '与您最近的练习内容相关'
        },
        {
          id: 2,
          title: '如何在家进行有效的武术基本功训练',
          author: '武术教练小王',
          likes: 89,
          comments: 15,
          views: 567,
          tags: ['基本功', '居家训练', '效率'],
          excerpt: '疫情期间，很多武术爱好者只能在家练习，如何保证训练效果...',
          matchReason: '适合您当前的训练环境'
        },
        {
          id: 3,
          title: '武术动作分析：弓步冲拳的要点解析',
          author: '分析专家',
          likes: 234,
          comments: 45,
          views: 2341,
          tags: ['动作分析', '弓步冲拳', '技术'],
          excerpt: '弓步冲拳是武术中的基础动作，看似简单但包含很多技术要点...',
          matchReason: '与您最近分析的动作相同'
        }
      ]
    };
  };

  const RecommendedCourses = ({ courses }) => (
    <Card
      title={
        <div className="flex items-center gap-2">
          <BookOutlined className="text-blue-500" />
          <span>推荐课程</span>
        </div>
      }
      extra={<Button type="link" onClick={() => navigate('/courses')}>查看更多</Button>}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => navigate(`/courses/${course.id}`)}>
              <div className="flex gap-3">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">{course.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span>{course.instructor}</span>
                    <Rate disabled defaultValue={course.rating} size="small" />
                    <span>({course.students}人)</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size="small" color="blue">{course.level}</Tag>
                    <Tag size="small">{course.duration}</Tag>
                    <span className="text-red-500 font-semibold text-sm">¥{course.price}</span>
                  </div>
                  <p className="text-xs text-gray-600">{course.matchReason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  const RecommendedCoaches = ({ coaches }) => (
    <Card
      title={
        <div className="flex items-center gap-2">
          <UserOutlined className="text-green-500" />
          <span>推荐教练</span>
        </div>
      }
      extra={<Button type="link" onClick={() => navigate('/coach-team')}>查看更多</Button>}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        <div className="space-y-4">
          {coaches.map(coach => (
            <div key={coach.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => navigate(`/coach/${coach.id}`)}>
              <div className="flex gap-3">
                <Avatar size={48} src={coach.avatar} icon={<UserOutlined />} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{coach.name}</h4>
                    <span className="text-red-500 font-semibold text-sm">¥{coach.price}/课时</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Rate disabled defaultValue={coach.rating} size="small" />
                    <span>{coach.experience}年经验</span>
                    <span>{coach.students}学员</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <EnvironmentOutlined />
                    <span>{coach.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {coach.specialties.slice(0, 3).map((specialty, index) => (
                      <Tag key={index} size="small">{specialty}</Tag>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">{coach.matchReason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  const RecommendedPosts = ({ posts }) => (
    <Card
      title={
        <div className="flex items-center gap-2">
          <MessageOutlined className="text-purple-500" />
          <span>推荐帖子</span>
        </div>
      }
      extra={<Button type="link" onClick={() => navigate('/forum')}>查看更多</Button>}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => navigate(`/forum/post/${post.id}`)}>
              <h4 className="font-semibold text-sm mb-2 line-clamp-2">{post.title}</h4>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>by {post.author}</span>
                <div className="flex items-center gap-3">
                  <span>👍 {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>👁 {post.views}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.map((tag, index) => (
                  <Tag key={index} size="small" color="blue">{tag}</Tag>
                ))}
              </div>
              <p className="text-xs text-gray-600">{post.matchReason}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">为您推荐</h2>
          <p className="text-gray-600">基于您的学习历史和兴趣偏好，为您精心挑选</p>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <RecommendedCourses courses={recommendations.courses} />
          </Col>
          <Col xs={24} lg={8}>
            <RecommendedCoaches coaches={recommendations.coaches} />
          </Col>
          <Col xs={24} lg={8}>
            <RecommendedPosts posts={recommendations.posts} />
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default PersonalizedRecommendations;
