import React from 'react';
import { Card, Row, Col, Typography, Timeline, Statistic, Avatar, Tag } from 'antd';
import { TrophyOutlined, TeamOutlined, GlobalOutlined, HeartOutlined, RocketOutlined, BulbOutlined, SafetyOutlined, StarOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';

const { Title, Paragraph, Text } = Typography;

const AboutUs = () => {
  // 团队成员数据
  const teamMembers = [
    {
      name: '张武道',
      position: '创始人 & CEO',
      avatar: '/img/team/ceo.jpg',
      description: '武术世家出身，致力于传统武术的现代化传承',
      expertise: ['太极拳', '企业管理', '武术教育']
    },
    {
      name: '李技术',
      position: '技术总监',
      avatar: '/img/team/cto.jpg',
      description: '人工智能专家，专注于计算机视觉和动作识别',
      expertise: ['AI算法', '计算机视觉', '深度学习']
    },
    {
      name: '王教练',
      position: '教学总监',
      avatar: '/img/team/coach.jpg',
      description: '国家级武术教练，拥有20年教学经验',
      expertise: ['武术教学', '课程设计', '教练培训']
    },
    {
      name: '陈产品',
      position: '产品总监',
      avatar: '/img/team/product.jpg',
      description: '用户体验专家，致力于打造最佳学习体验',
      expertise: ['产品设计', '用户体验', '市场分析']
    }
  ];

  // 发展历程
  const milestones = [
    {
      year: '2020',
      title: '公司成立',
      description: '琪武智创科技有限公司正式成立，开始武术智能化教学的探索'
    },
    {
      year: '2021',
      title: '技术突破',
      description: '成功开发出武术动作识别算法，准确率达到95%以上'
    },
    {
      year: '2022',
      title: '平台上线',
      description: '琪武智创平台正式上线，首批用户突破1万人'
    },
    {
      year: '2023',
      title: '快速发展',
      description: '用户规模突破10万，合作教练超过500名'
    },
    {
      year: '2024',
      title: '全面升级',
      description: '推出AI智能教练，开启武术教育新时代'
    }
  ];

  // 核心价值观
  const values = [
    {
      icon: <HeartOutlined style={{ fontSize: 32, color: '#f5222d' }} />,
      title: '传承文化',
      description: '致力于传统武术文化的保护、传承和发扬'
    },
    {
      icon: <BulbOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      title: '创新科技',
      description: '运用最新科技手段，让武术学习更加高效便捷'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      title: '安全第一',
      description: '确保每一位学员的训练安全，科学合理的教学方法'
    },
    {
      icon: <StarOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      title: '追求卓越',
      description: '不断追求技术和服务的卓越，为用户创造最大价值'
    }
  ];

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        {/* 公司简介 */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={1}>
              <TrophyOutlined style={{ color: '#1890ff', marginRight: 16 }} />
              琪武智创
            </Title>
            <Title level={3} type="secondary">
              传承武术文化，创新教学方式
            </Title>
          </div>

          <Row gutter={32} align="middle">
            <Col xs={24} lg={12}>
              <div style={{
                height: 300,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <TrophyOutlined style={{ fontSize: 80, marginBottom: 16 }} />
                  <Title level={2} style={{ color: 'white', margin: 0 }}>
                    琪武智创
                  </Title>
                </div>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <Title level={3}>关于我们</Title>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                琪武智创是一家专注于武术智能化教学的科技公司。我们结合传统武术文化与现代人工智能技术，
                为武术爱好者提供专业、便捷、高效的学习平台。
              </Paragraph>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                通过计算机视觉和深度学习技术，我们开发了智能动作识别系统，能够实时分析用户的武术动作，
                提供精准的指导建议。同时，我们汇聚了众多武术名师，为用户提供线上线下相结合的教学服务。
              </Paragraph>
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                我们的使命是让每个人都能轻松学习武术，传承中华武术文化，让传统武术在新时代焕发新的活力。
              </Paragraph>
            </Col>
          </Row>
        </Card>

        {/* 数据统计 */}
        <Card title="平台数据" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col xs={12} sm={6}>
              <Statistic
                title="注册用户"
                value={150000}
                suffix="+"
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="专业教练"
                value={800}
                suffix="+"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="课程数量"
                value={2000}
                suffix="+"
                prefix={<RocketOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col xs={12} sm={6}>
              <Statistic
                title="覆盖城市"
                value={200}
                suffix="+"
                prefix={<GlobalOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
          </Row>
        </Card>

        {/* 核心价值观 */}
        <Card title="核心价值观" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            {values.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <div style={{ textAlign: 'center', padding: 16 }}>
                  {value.icon}
                  <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
                    {value.title}
                  </Title>
                  <Text type="secondary">{value.description}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        {/* 团队介绍 */}
        <Card title="核心团队" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            {teamMembers.map((member, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card hoverable>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <Avatar size={80} src={member.avatar} icon={<TeamOutlined />} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ marginBottom: 4 }}>
                      {member.name}
                    </Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                      {member.position}
                    </Text>
                    <Paragraph style={{ fontSize: 12, marginBottom: 12 }}>
                      {member.description}
                    </Paragraph>
                    <div>
                      {member.expertise.map(skill => (
                        <Tag key={skill} size="small" style={{ margin: 2 }}>
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* 发展历程 */}
        <Card title="发展历程">
          <Timeline mode="left">
            {milestones.map((milestone, index) => (
              <Timeline.Item
                key={index}
                label={<Text strong style={{ fontSize: 16 }}>{milestone.year}</Text>}
                dot={<TrophyOutlined style={{ fontSize: 16 }} />}
              >
                <Title level={4}>{milestone.title}</Title>
                <Paragraph>{milestone.description}</Paragraph>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>

        {/* 联系我们 */}
        <Card title="联系我们" style={{ marginTop: 24 }}>
          <Row gutter={32}>
            <Col xs={24} lg={12}>
              <Title level={4}>公司信息</Title>
              <Paragraph>
                <Text strong>公司名称：</Text>琪武智创科技有限公司<br />
                <Text strong>成立时间：</Text>2020年<br />
                <Text strong>公司地址：</Text>北京市海淀区中关村科技园<br />
                <Text strong>联系电话：</Text>400-888-9999<br />
                <Text strong>客服邮箱：</Text>service@wudaozhiping.com<br />
                <Text strong>商务合作：</Text>business@wudaozhiping.com
              </Paragraph>
            </Col>
            <Col xs={24} lg={12}>
              <Title level={4}>加入我们</Title>
              <Paragraph>
                我们正在寻找志同道合的伙伴，如果您：
              </Paragraph>
              <ul>
                <li>热爱武术文化，认同我们的使命</li>
                <li>具备相关专业技能和经验</li>
                <li>有创新精神和团队合作意识</li>
                <li>愿意为武术教育事业贡献力量</li>
              </ul>
              <Paragraph>
                欢迎发送简历至：<Text code>hr@wudaozhiping.com</Text>
              </Paragraph>
            </Col>
          </Row>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
