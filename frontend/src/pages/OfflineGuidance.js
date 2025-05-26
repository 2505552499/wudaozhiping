import React, { useState } from 'react';
import { Card, Row, Col, Button, Steps, Typography, Tag, Modal, Form, Input, Select, DatePicker, TimePicker, message } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MainLayout from '../components/MainLayout';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const OfflineGuidance = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [form] = Form.useForm();

  // 线下指导服务类型
  const offlineServices = [
    {
      id: 1,
      title: '一对一私教课程',
      description: '专业教练一对一指导，针对性强，效果显著',
      features: [
        '个性化教学方案',
        '动作纠正指导',
        '实时反馈调整',
        '灵活时间安排'
      ],
      duration: '1-2小时/次',
      price: '200-500元/小时',
      suitable: '初学者、有特定需求的学员',
      locations: ['教练工作室', '学员家中', '公园场地', '健身房']
    },
    {
      id: 2,
      title: '小班集体课程',
      description: '3-8人小班教学，互动性强，性价比高',
      features: [
        '同伴学习氛围',
        '互动练习机会',
        '成本相对较低',
        '固定时间安排'
      ],
      duration: '1.5-2小时/次',
      price: '80-150元/人/次',
      suitable: '有一定基础的学员',
      locations: ['武术馆', '社区活动中心', '公园场地']
    },
    {
      id: 3,
      title: '企业团建课程',
      description: '为企业定制的武术体验课程，增强团队凝聚力',
      features: [
        '团队协作训练',
        '压力释放活动',
        '文化体验项目',
        '定制化方案'
      ],
      duration: '2-4小时',
      price: '面议',
      suitable: '企业团队、组织机构',
      locations: ['企业内部', '度假村', '培训基地']
    },
    {
      id: 4,
      title: '比赛集训营',
      description: '针对比赛的专业集训，提升竞技水平',
      features: [
        '专业技术指导',
        '体能强化训练',
        '心理素质培养',
        '实战模拟练习'
      ],
      duration: '3-7天',
      price: '1000-3000元/人',
      suitable: '有比赛需求的学员',
      locations: ['专业训练基地', '武术学校']
    }
  ];

  // 预约流程步骤
  const bookingSteps = [
    {
      title: '选择服务',
      description: '选择适合的线下指导服务类型'
    },
    {
      title: '填写信息',
      description: '填写个人信息和具体需求'
    },
    {
      title: '确认预约',
      description: '确认时间地点，完成预约'
    },
    {
      title: '等待确认',
      description: '等待教练确认并安排具体事宜'
    }
  ];

  // 城市和地区数据
  const cityData = {
    '北京市': ['海淀区', '朝阳区', '西城区', '东城区', '丰台区'],
    '上海市': ['浦东新区', '黄浦区', '静安区', '徐汇区', '长宁区'],
    '广州市': ['天河区', '越秀区', '海珠区', '荔湾区', '白云区'],
    '深圳市': ['南山区', '福田区', '罗湖区', '宝安区', '龙岗区']
  };

  const openBookingModal = (service) => {
    setSelectedService(service);
    setBookingModalVisible(true);
    setCurrentStep(1);
  };

  const handleBookingSubmit = async (values) => {
    try {
      // 这里调用API提交预约信息
      console.log('预约信息:', { ...values, serviceId: selectedService.id });

      message.success('预约提交成功！我们会尽快联系您确认具体安排。');
      setBookingModalVisible(false);
      setCurrentStep(0);
      form.resetFields();
    } catch (error) {
      console.error('提交预约失败:', error);
      message.error('提交预约失败，请稍后重试');
    }
  };

  const getServiceIcon = (serviceId) => {
    switch (serviceId) {
      case 1:
        return <TeamOutlined style={{ fontSize: 48, color: '#1890ff' }} />;
      case 2:
        return <CalendarOutlined style={{ fontSize: 48, color: '#52c41a' }} />;
      case 3:
        return <EnvironmentOutlined style={{ fontSize: 48, color: '#fa8c16' }} />;
      case 4:
        return <CheckCircleOutlined style={{ fontSize: 48, color: '#722ed1' }} />;
      default:
        return <TeamOutlined style={{ fontSize: 48, color: '#1890ff' }} />;
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>
            <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            线下指导
          </Title>
          <Paragraph>
            我们提供多种形式的线下武术指导服务，从一对一私教到团体课程，
            满足不同学员的需求。专业教练面对面指导，让您的武术学习更加高效。
          </Paragraph>

          {/* 预约流程 */}
          <Card title="预约流程" style={{ marginBottom: 24 }}>
            <Steps current={currentStep}>
              {bookingSteps.map((step, index) => (
                <Step key={index} title={step.title} description={step.description} />
              ))}
            </Steps>
          </Card>

          {/* 服务类型 */}
          <Title level={3} style={{ marginBottom: 16 }}>服务类型</Title>
          <Row gutter={[16, 16]}>
            {offlineServices.map((service) => (
              <Col xs={24} sm={12} lg={12} xl={6} key={service.id}>
                <Card
                  hoverable
                  cover={
                    <div style={{
                      height: 150,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      {getServiceIcon(service.id)}
                    </div>
                  }
                  actions={[
                    <Button type="primary" onClick={() => openBookingModal(service)}>
                      立即预约
                    </Button>
                  ]}
                >
                  <Card.Meta
                    title={service.title}
                    description={
                      <div>
                        <Paragraph style={{ fontSize: 12, marginBottom: 8 }}>
                          {service.description}
                        </Paragraph>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>时长：</Text>
                          <Text>{service.duration}</Text>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>价格：</Text>
                          <Text type="danger">{service.price}</Text>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>适合：</Text>
                          <Text>{service.suitable}</Text>
                        </div>
                        <div>
                          <Text strong>特色：</Text>
                          <div style={{ marginTop: 4 }}>
                            {service.features.slice(0, 2).map((feature, index) => (
                              <Tag key={index} size="small" style={{ margin: 2 }}>
                                {feature}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* 服务优势 */}
          <Card title="服务优势" style={{ marginTop: 24 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: 16 }}>
                  <TeamOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
                  <Title level={4}>专业教练</Title>
                  <Text type="secondary">经验丰富的专业教练团队</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: 16 }}>
                  <EnvironmentOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }} />
                  <Title level={4}>灵活地点</Title>
                  <Text type="secondary">多种场地选择，就近安排</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: 16 }}>
                  <CalendarOutlined style={{ fontSize: 32, color: '#fa8c16', marginBottom: 8 }} />
                  <Title level={4}>时间灵活</Title>
                  <Text type="secondary">根据您的时间安排课程</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div style={{ textAlign: 'center', padding: 16 }}>
                  <CheckCircleOutlined style={{ fontSize: 32, color: '#722ed1', marginBottom: 8 }} />
                  <Title level={4}>效果保证</Title>
                  <Text type="secondary">个性化指导，学习效果显著</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Card>

        {/* 预约模态框 */}
        <Modal
          title={`预约 - ${selectedService?.title}`}
          visible={bookingModalVisible}
          onCancel={() => {
            setBookingModalVisible(false);
            setCurrentStep(0);
            form.resetFields();
          }}
          width={600}
          footer={null}
        >
          {selectedService && (
            <div>
              <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f9f9f9' }}>
                <Row>
                  <Col span={12}>
                    <Text strong>服务类型：</Text>{selectedService.title}
                  </Col>
                  <Col span={12}>
                    <Text strong>价格：</Text><Text type="danger">{selectedService.price}</Text>
                  </Col>
                </Row>
                <Row style={{ marginTop: 8 }}>
                  <Col span={12}>
                    <Text strong>时长：</Text>{selectedService.duration}
                  </Col>
                  <Col span={12}>
                    <Text strong>适合：</Text>{selectedService.suitable}
                  </Col>
                </Row>
              </Card>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleBookingSubmit}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label="姓名"
                      rules={[{ required: true, message: '请输入您的姓名' }]}
                    >
                      <Input placeholder="请输入您的姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="phone"
                      label="联系电话"
                      rules={[
                        { required: true, message: '请输入联系电话' },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
                      ]}
                    >
                      <Input placeholder="请输入联系电话" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="city"
                      label="所在城市"
                      rules={[{ required: true, message: '请选择所在城市' }]}
                    >
                      <Select placeholder="请选择城市">
                        {Object.keys(cityData).map(city => (
                          <Option key={city} value={city}>{city}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="district"
                      label="所在地区"
                      rules={[{ required: true, message: '请选择所在地区' }]}
                    >
                      <Select placeholder="请选择地区">
                        {form.getFieldValue('city') && cityData[form.getFieldValue('city')]?.map(district => (
                          <Option key={district} value={district}>{district}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="preferredDate"
                      label="期望日期"
                      rules={[{ required: true, message: '请选择期望日期' }]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="preferredTime"
                      label="期望时间"
                      rules={[{ required: true, message: '请选择期望时间' }]}
                    >
                      <TimePicker
                        style={{ width: '100%' }}
                        format="HH:mm"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="location"
                  label="期望地点"
                  rules={[{ required: true, message: '请选择期望地点' }]}
                >
                  <Select placeholder="请选择期望地点">
                    {selectedService.locations.map(location => (
                      <Option key={location} value={location}>{location}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="requirements"
                  label="具体需求"
                >
                  <TextArea
                    rows={3}
                    placeholder="请描述您的具体需求、武术基础、学习目标等"
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    提交预约
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default OfflineGuidance;
