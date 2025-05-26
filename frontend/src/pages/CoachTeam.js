import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Tag, Button, Rate, Modal, Descriptions, Divider, Typography, Input, Select } from 'antd';
import { UserOutlined, TrophyOutlined, CalendarOutlined, EnvironmentOutlined, PhoneOutlined, StarOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const CoachTeam = () => {
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // 模拟教练数据
  const mockCoaches = [
    {
      id: 1,
      name: '李师傅',
      avatar: '/img/coach1.jpg',
      title: '太极拳大师',
      experience: 25,
      rating: 4.9,
      reviewCount: 156,
      skills: ['太极拳', '八卦掌', '形意拳'],
      location: '北京市',
      price: 200,
      description: '李师傅从事太极拳教学25年，师承陈式太极拳传人，擅长太极拳、八卦掌、形意拳等内家拳法。教学风格严谨细致，注重基本功训练。',
      achievements: [
        '全国太极拳比赛金牌获得者',
        '国家级太极拳教练',
        '陈式太极拳第十二代传人',
        '北京市武术协会理事'
      ],
      specialties: [
        '太极拳基础入门',
        '太极拳推手技法',
        '太极拳养生功法',
        '内家拳理论教学'
      ],
      schedule: '周一至周五 9:00-17:00',
      phone: '138****8888'
    },
    {
      id: 2,
      name: '王教练',
      avatar: '/img/coach2.jpg',
      title: '咏春拳专家',
      experience: 18,
      rating: 4.8,
      reviewCount: 89,
      skills: ['咏春拳', '截拳道', '自由搏击'],
      location: '上海市',
      price: 180,
      description: '王教练专精咏春拳和现代搏击技术，曾在多项武术比赛中获奖。教学注重实战应用，适合想要学习防身技能的学员。',
      achievements: [
        '全国咏春拳锦标赛冠军',
        '国际武术联合会认证教练',
        '上海市武术队前队员',
        '多次国际比赛获奖者'
      ],
      specialties: [
        '咏春拳基础套路',
        '咏春拳实战技法',
        '现代防身术',
        '搏击体能训练'
      ],
      schedule: '周二至周日 10:00-18:00',
      phone: '139****9999'
    },
    {
      id: 3,
      name: '张师傅',
      avatar: '/img/coach3.jpg',
      title: '少林拳传承人',
      experience: 30,
      rating: 4.9,
      reviewCount: 203,
      skills: ['少林拳', '南拳', '器械'],
      location: '河南省',
      price: 150,
      description: '张师傅是少林寺俗家弟子，精通少林拳法和各种传统器械。教学经验丰富，学生遍布海内外。',
      achievements: [
        '少林寺俗家弟子',
        '全国武术套路冠军',
        '河南省武术协会副主席',
        '国际武术文化传播大使'
      ],
      specialties: [
        '少林基本功',
        '少林拳套路',
        '传统器械',
        '武术文化教学'
      ],
      schedule: '全天候教学',
      phone: '137****7777'
    },
    {
      id: 4,
      name: '陈教练',
      avatar: '/img/coach4.jpg',
      title: '散打冠军',
      experience: 15,
      rating: 4.7,
      reviewCount: 67,
      skills: ['散打', '拳击', '跆拳道'],
      location: '广东省',
      price: 220,
      description: '陈教练是前国家散打队成员，多次获得全国散打冠军。现专注于散打和现代搏击教学，培养了众多优秀学员。',
      achievements: [
        '全国散打锦标赛三连冠',
        '亚洲散打锦标赛金牌',
        '国家一级散打教练',
        '广东省散打队总教练'
      ],
      specialties: [
        '散打基础技法',
        '散打实战训练',
        '搏击体能提升',
        '比赛技战术指导'
      ],
      schedule: '周一至周六 8:00-20:00',
      phone: '135****5555'
    }
  ];

  useEffect(() => {
    setCoaches(mockCoaches);
    setFilteredCoaches(mockCoaches);
  }, []);

  // 获取所有技能选项
  const getAllSkills = () => {
    const skills = new Set();
    coaches.forEach(coach => {
      coach.skills.forEach(skill => skills.add(skill));
    });
    return Array.from(skills);
  };

  // 获取所有城市选项
  const getAllCities = () => {
    const cities = new Set();
    coaches.forEach(coach => {
      cities.add(coach.location);
    });
    return Array.from(cities);
  };

  // 筛选教练
  const filterCoaches = () => {
    let filtered = coaches;

    if (searchText) {
      filtered = filtered.filter(coach =>
        coach.name.includes(searchText) ||
        coach.title.includes(searchText) ||
        coach.description.includes(searchText)
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter(coach =>
        coach.skills.includes(selectedSkill)
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(coach =>
        coach.location.includes(selectedCity)
      );
    }

    setFilteredCoaches(filtered);
  };

  useEffect(() => {
    filterCoaches();
  }, [searchText, selectedSkill, selectedCity, coaches]);

  const showCoachDetail = (coach) => {
    setSelectedCoach(coach);
    setModalVisible(true);
  };

  const bookAppointment = (coach) => {
    // 跳转到预约页面，并传递教练信息
    window.location.href = `/coach-appointment?coachId=${coach.id}`;
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>
            <TrophyOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            教练团队
          </Title>
          <Paragraph>
            我们拥有一支经验丰富、技艺精湛的教练团队。每位教练都经过严格筛选，
            具备深厚的武术功底和丰富的教学经验，致力于为学员提供最专业的指导。
          </Paragraph>

          {/* 筛选区域 */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Search
                placeholder="搜索教练姓名或专长"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="选择武术类型"
                value={selectedSkill}
                onChange={setSelectedSkill}
                style={{ width: '100%' }}
                allowClear
              >
                {getAllSkills().map(skill => (
                  <Option key={skill} value={skill}>{skill}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="选择地区"
                value={selectedCity}
                onChange={setSelectedCity}
                style={{ width: '100%' }}
                allowClear
              >
                {getAllCities().map(city => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* 教练列表 */}
          <Row gutter={[16, 16]}>
            {filteredCoaches.map((coach) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={coach.id}>
                <Card
                  hoverable
                  cover={
                    <div style={{
                      height: 200,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Avatar size={80} src={coach.avatar} icon={<UserOutlined />} />
                    </div>
                  }
                  actions={[
                    <Button type="link" onClick={() => showCoachDetail(coach)}>
                      查看详情
                    </Button>,
                    <Button type="primary" onClick={() => bookAppointment(coach)}>
                      立即预约
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 'bold' }}>{coach.name}</div>
                        <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{coach.title}</div>
                      </div>
                    }
                    description={
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: 8 }}>
                          <Rate disabled defaultValue={coach.rating} allowHalf />
                          <Text type="secondary" style={{ marginLeft: 8 }}>
                            {coach.rating} ({coach.reviewCount}评价)
                          </Text>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          {coach.skills.slice(0, 2).map(skill => (
                            <Tag key={skill} color="blue" style={{ margin: 2 }}>
                              {skill}
                            </Tag>
                          ))}
                          {coach.skills.length > 2 && (
                            <Tag color="default" style={{ margin: 2 }}>
                              +{coach.skills.length - 2}
                            </Tag>
                          )}
                        </div>
                        <div style={{ color: '#666' }}>
                          <EnvironmentOutlined /> {coach.location}
                        </div>
                        <div style={{ color: '#666', marginTop: 4 }}>
                          经验: {coach.experience}年
                        </div>
                        <div style={{ color: '#f50', marginTop: 4, fontSize: 16, fontWeight: 'bold' }}>
                          ¥{coach.price}/小时
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* 教练详情模态框 */}
        <Modal
          title={selectedCoach?.name}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          width={800}
          footer={[
            <Button key="cancel" onClick={() => setModalVisible(false)}>
              关闭
            </Button>,
            <Button key="book" type="primary" onClick={() => bookAppointment(selectedCoach)}>
              立即预约
            </Button>
          ]}
        >
          {selectedCoach && (
            <div>
              <Row gutter={16}>
                <Col span={8} style={{ textAlign: 'center' }}>
                  <Avatar size={120} src={selectedCoach.avatar} icon={<UserOutlined />} />
                  <div style={{ marginTop: 16 }}>
                    <Rate disabled defaultValue={selectedCoach.rating} allowHalf />
                    <div style={{ marginTop: 8 }}>
                      <Text strong>{selectedCoach.rating}</Text>
                      <Text type="secondary"> ({selectedCoach.reviewCount}评价)</Text>
                    </div>
                  </div>
                </Col>
                <Col span={16}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="职称">{selectedCoach.title}</Descriptions.Item>
                    <Descriptions.Item label="教学经验">{selectedCoach.experience}年</Descriptions.Item>
                    <Descriptions.Item label="所在地区">{selectedCoach.location}</Descriptions.Item>
                    <Descriptions.Item label="课时费用">¥{selectedCoach.price}/小时</Descriptions.Item>
                    <Descriptions.Item label="授课时间">{selectedCoach.schedule}</Descriptions.Item>
                    <Descriptions.Item label="联系电话">{selectedCoach.phone}</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>

              <Divider />

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>专长技能</Title>
                {selectedCoach.skills.map(skill => (
                  <Tag key={skill} color="blue" style={{ margin: 4 }}>
                    {skill}
                  </Tag>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <Title level={4}>教练简介</Title>
                <Paragraph>{selectedCoach.description}</Paragraph>
              </div>

              <Row gutter={16}>
                <Col span={12}>
                  <Title level={4}>主要成就</Title>
                  <ul>
                    {selectedCoach.achievements.map((achievement, index) => (
                      <li key={index} style={{ marginBottom: 4 }}>
                        <StarOutlined style={{ color: '#faad14', marginRight: 4 }} />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </Col>
                <Col span={12}>
                  <Title level={4}>教学特色</Title>
                  <ul>
                    {selectedCoach.specialties.map((specialty, index) => (
                      <li key={index} style={{ marginBottom: 4 }}>
                        <TrophyOutlined style={{ color: '#1890ff', marginRight: 4 }} />
                        {specialty}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default CoachTeam;
