import React, { useState, useEffect } from 'react';
import { 
  Layout, Typography, Card, Row, Col, Button, Select, 
  Input, Tag, Avatar, Rate, Modal, Form, DatePicker, 
  TimePicker, message, Tabs, List, Badge, Divider, Space, Empty
} from 'antd';
import { 
  EnvironmentOutlined, FilterOutlined, UserOutlined, 
  CalendarOutlined, ClockCircleOutlined, MessageOutlined, 
  PhoneOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { coachAPI, appointmentAPI } from '../api';
import MainLayout from '../components/MainLayout';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const CoachAppointment = () => {
  // 状态管理
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showCoachDetailModal, setShowCoachDetailModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [filters, setFilters] = useState({
    city: '',
    district: '',
    skill: ''
  });

  // 表单实例
  const [form] = Form.useForm();
  const [messageForm] = Form.useForm();

  // 技能选项
  const skillOptions = [
    // 传统太极
    '杨氏太极拳', '陈氏太极拳', '吴氏太极拳', '武氏太极拳', '孙氏太极拳', '和氏太极拳',
    '太极剑', '太极刀', '太极枪', '太极扇',
    // 传统武术
    '形意拳', '八卦掌', '八极拳', '通臂拳', '螳螂拳', '咏春拳', '洪拳', '少林拳',
    // 健身气功
    '八段锦', '易筋经', '五禽戏', '六字诀', '导引养生功十二法', '大舞',
    // 现代武术
    '长拳', '南拳', '刀术', '剑术', '棍术', '枪术', '对练',
    // 其他体育项目
    '田径', '篮球', '足球', '羽毛球', '游泳', '体适能', '中小学体育', '跆拳道', '瑜伽'
  ];

  // 获取教练列表
  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const response = await coachAPI.getAllCoaches();
      setCoaches(response.data.coaches);
      setFilteredCoaches(response.data.coaches);
    } catch (error) {
      console.error('获取教练列表失败:', error);
      message.error('获取教练列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取城市列表
  const fetchCities = async () => {
    try {
      const response = await coachAPI.getCities();
      setCities(response.data.cities);
    } catch (error) {
      console.error('获取城市列表失败:', error);
    }
  };

  // 获取区域列表
  const fetchDistricts = async (city) => {
    if (!city) {
      setDistricts([]);
      return;
    }
    
    try {
      const response = await coachAPI.getDistricts(city);
      setDistricts(response.data.districts);
    } catch (error) {
      console.error('获取区域列表失败:', error);
    }
  };

  // 获取用户预约列表
  const fetchAppointments = async () => {
    setAppointmentLoading(true);
    try {
      const response = await appointmentAPI.getUserAppointments();
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('获取预约列表失败:', error);
      message.error('获取预约列表失败，请稍后重试');
    } finally {
      setAppointmentLoading(false);
    }
  };

  // 筛选教练
  const handleFilterCoaches = () => {
    const filtered = coaches.filter(coach => {
      // 筛选城市
      if (filters.city && coach.location.city !== filters.city) {
        return false;
      }
      
      // 筛选区域
      if (filters.district && !coach.location.districts.includes(filters.district)) {
        return false;
      }
      
      // 筛选技能
      if (filters.skill && !coach.skills.includes(filters.skill)) {
        return false;
      }
      
      return true;
    });
    
    setFilteredCoaches(filtered);
  };

  // 重置筛选条件
  const handleResetFilters = () => {
    setFilters({
      city: '',
      district: '',
      skill: ''
    });
    setFilteredCoaches(coaches);
  };

  // 处理城市变更
  const handleCityChange = (value) => {
    setFilters({
      ...filters,
      city: value,
      district: '' // 重置区域
    });
    fetchDistricts(value);
  };

  // 处理区域变更
  const handleDistrictChange = (value) => {
    setFilters({
      ...filters,
      district: value
    });
  };

  // 处理技能变更
  const handleSkillChange = (value) => {
    setFilters({
      ...filters,
      skill: value
    });
  };

  // 打开预约模态框
  const openAppointmentModal = (coach) => {
    setSelectedCoach(coach);
    setShowAppointmentModal(true);
    form.resetFields();
  };

  // 关闭预约模态框
  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedCoach(null);
    form.resetFields();
  };

  // 打开教练详情模态框
  const openCoachDetailModal = (coach) => {
    setSelectedCoach(coach);
    setShowCoachDetailModal(true);
  };

  // 关闭教练详情模态框
  const closeCoachDetailModal = () => {
    setShowCoachDetailModal(false);
  };

  // 打开发送消息模态框
  const openMessageModal = () => {
    setShowMessageModal(true);
    messageForm.resetFields();
  };

  // 关闭发送消息模态框
  const closeMessageModal = () => {
    setShowMessageModal(false);
    messageForm.resetFields();
  };

  // 发送消息给教练
  const handleSendMessage = async (values) => {
    try {
      const response = await appointmentAPI.sendMessage({
        receiver_id: selectedCoach.id,
        content: values.message
      });
      
      if (response.data.success) {
        message.success('消息发送成功');
        closeMessageModal();
      } else {
        message.error(response.data.message || '发送失败');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送消息失败，请稍后重试');
    }
  };

  // 提交预约
  const handleSubmitAppointment = async (values) => {
    try {
      const appointmentData = {
        coach_id: selectedCoach.id,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        location: selectedCoach.location.city + ' ' + selectedCoach.location.districts[0], // 使用教练的位置
        skill: values.training_type, // 将training_type映射到skill
        duration: values.duration // 添加duration字段，虽然后端不要求，但前端可能需要
      };
      
      console.log('提交预约数据:', appointmentData); // 添加日志
      
      const response = await appointmentAPI.createAppointment(appointmentData);
      
      if (response.data.success) {
        message.success('预约提交成功，等待教练确认');
        closeAppointmentModal();
        // 刷新预约列表
        fetchAppointments();
      } else {
        message.error(response.data.message || '预约失败');
      }
    } catch (error) {
      console.error('提交预约失败:', error);
      message.error('提交预约失败，请稍后重试');
    }
  };

  // 取消预约
  const handleCancelAppointment = (appointmentId) => {
    Modal.confirm({
      title: '确认取消预约',
      content: '您确定要取消这个预约吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await appointmentAPI.cancelAppointment(appointmentId);
          
          if (response.data.success) {
            message.success('预约已取消');
            // 刷新预约列表
            fetchAppointments();
          } else {
            message.error(response.data.message || '取消预约失败');
          }
        } catch (error) {
          console.error('取消预约失败:', error);
          message.error('取消预约失败，请稍后重试');
        }
      }
    });
  };

  // 初始化数据
  useEffect(() => {
    fetchCoaches();
    fetchCities();
    fetchAppointments();
  }, []);

  // 筛选条件变更时更新教练列表
  useEffect(() => {
    handleFilterCoaches();
  }, [filters]);

  // 获取预约状态显示文本
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '等待确认';
      case 'confirmed':
        return '已确认';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      case 'rejected':
        return '已拒绝';
      default:
        return '未知状态';
    }
  };

  // 获取预约状态标签颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'confirmed':
        return 'green';
      case 'completed':
        return 'blue';
      case 'cancelled':
        return 'red';
      case 'rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  // 渲染教练卡片
  const renderCoachCard = (coach) => (
    <Col xs={24} sm={12} md={8} lg={6} key={coach.id}>
      <Card
        hoverable
        cover={
          <div style={{ padding: '20px 0', textAlign: 'center', background: '#f5f5f5' }}>
            <Avatar src={coach.avatar} size={100} />
          </div>
        }
        actions={[
          <Button 
            type="link" 
            onClick={() => openCoachDetailModal(coach)}
          >
            查看详情
          </Button>,
          <Button 
            type="primary" 
            onClick={() => openAppointmentModal(coach)}
          >
            立即预约
          </Button>
        ]}
      >
        <Card.Meta
          title={
            <div>
              {coach.name}
              <Rate 
                disabled 
                defaultValue={coach.rating} 
                style={{ fontSize: 12, marginLeft: 8 }} 
              />
            </div>
          }
          description={
            <>
              <p>
                <EnvironmentOutlined /> {coach.location.city} {coach.location.districts[0]}
              </p>
              <p>
                {coach.skills.slice(0, 3).map(skill => (
                  <Tag key={skill} color="blue" style={{ marginBottom: 4 }}>{skill}</Tag>
                ))}
                {coach.skills.length > 3 && <Tag>...</Tag>}
              </p>
              <div style={{ color: 'red', fontWeight: 'bold', marginTop: 8 }}>
                {coach.price}元/小时
              </div>
            </>
          }
        />
      </Card>
    </Col>
  );

  // 渲染预约列表项
  const renderAppointmentItem = (appointment) => (
    <List.Item
      key={appointment.id}
      actions={[
        appointment.status === 'pending' && (
          <Button 
            danger 
            onClick={() => handleCancelAppointment(appointment.id)}
          >
            取消预约
          </Button>
        )
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={
          <div>
            <span>{appointment.coach_name || '未知教练'}</span>
            <Tag 
              color={getStatusColor(appointment.status)} 
              style={{ marginLeft: 8 }}
            >
              {getStatusText(appointment.status)}
            </Tag>
          </div>
        }
        description={
          <>
            <p>
              <CalendarOutlined style={{ marginRight: 8 }} />
              预约日期: {appointment.date}
            </p>
            <p>
              <ClockCircleOutlined style={{ marginRight: 8 }} />
              预约时间: {appointment.time}
              {appointment.duration && `，时长: ${appointment.duration}小时`}
            </p>
            <p>
              训练项目: {appointment.skill || '未指定'}
            </p>
          </>
        }
      />
    </List.Item>
  );

  return (
    <MainLayout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>教练预约</Title>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="预约教练" key="1">
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={6} md={5} lg={4}>
                  <Select
                    placeholder="选择城市"
                    style={{ width: '100%' }}
                    value={filters.city}
                    onChange={handleCityChange}
                    allowClear
                  >
                    {cities.map(city => (
                      <Option key={city} value={city}>{city}</Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={6} md={5} lg={4}>
                  <Select
                    placeholder="选择区域"
                    style={{ width: '100%' }}
                    value={filters.district}
                    onChange={handleDistrictChange}
                    disabled={!filters.city}
                    allowClear
                  >
                    {districts.map(district => (
                      <Option key={district} value={district}>{district}</Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={6} md={5} lg={4}>
                  <Select
                    placeholder="训练项目"
                    style={{ width: '100%' }}
                    value={filters.skill}
                    onChange={handleSkillChange}
                    allowClear
                  >
                    {skillOptions.map(skill => (
                      <Option key={skill} value={skill}>{skill}</Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={6} md={9} lg={12}>
                  <Button 
                    type="primary" 
                    icon={<FilterOutlined />} 
                    onClick={handleFilterCoaches}
                    style={{ marginRight: 8 }}
                  >
                    筛选
                  </Button>
                  <Button onClick={handleResetFilters}>重置</Button>
                </Col>
              </Row>
            </Card>
            
            <Row gutter={[16, 16]}>
              {loading ? (
                <Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div>加载中...</div>
                </Col>
              ) : filteredCoaches.length > 0 ? (
                filteredCoaches.map(coach => renderCoachCard(coach))
              ) : (
                <Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Empty description="暂无符合条件的教练" />
                </Col>
              )}
            </Row>
          </TabPane>
          
          <TabPane 
            tab={
              <Badge count={appointments.filter(a => a.status === 'pending').length} offset={[10, 0]}>
                我的预约
              </Badge>
            } 
            key="2"
          >
            <List
              loading={appointmentLoading}
              itemLayout="horizontal"
              dataSource={appointments}
              renderItem={renderAppointmentItem}
              pagination={{
                pageSize: 5,
                showTotal: total => `共 ${total} 条预约`
              }}
              locale={{ emptyText: <Empty description="暂无预约记录" /> }}
            />
          </TabPane>
        </Tabs>

        {/* 预约模态框 */}
        <Modal
          title="预约教练"
          visible={showAppointmentModal}
          onCancel={closeAppointmentModal}
          footer={null}
        >
          {selectedCoach && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar src={selectedCoach.avatar} size={64} />
                <Title level={4} style={{ marginTop: 8, marginBottom: 0 }}>
                  {selectedCoach.name}
                </Title>
                <Rate disabled defaultValue={selectedCoach.rating} style={{ fontSize: 12 }} />
              </div>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmitAppointment}
              >
                <Form.Item
                  name="date"
                  label="预约日期"
                  rules={[{ required: true, message: '请选择预约日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="time"
                  label="预约时间"
                  rules={[{ required: true, message: '请选择预约时间' }]}
                >
                  <TimePicker format="HH:mm" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="duration"
                  label="训练时长(小时)"
                  rules={[{ required: true, message: '请选择训练时长' }]}
                >
                  <Select placeholder="请选择训练时长">
                    <Option value={1}>1小时</Option>
                    <Option value={1.5}>1.5小时</Option>
                    <Option value={2}>2小时</Option>
                    <Option value={3}>3小时</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="training_type"
                  label="训练项目"
                  rules={[{ required: true, message: '请选择训练项目' }]}
                >
                  <Select placeholder="请选择训练项目">
                    {selectedCoach.skills.map(skill => (
                      <Option key={skill} value={skill}>{skill}</Option>
                    ))}
                  </Select>
                </Form.Item>

                <Divider />

                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Text type="secondary">价格: </Text>
                  <Text strong style={{ color: 'red', fontSize: 18 }}>
                    {selectedCoach.price}元/小时
                  </Text>
                </div>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                  <Space>
                    <Button onClick={closeAppointmentModal}>取消</Button>
                    <Button type="primary" htmlType="submit">
                      提交预约单
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </>
          )}
        </Modal>

        {/* 教练详情模态框 */}
        <Modal
          title="教练详情"
          visible={showCoachDetailModal}
          onCancel={closeCoachDetailModal}
          footer={[
            <Button key="back" onClick={closeCoachDetailModal}>
              关闭
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              onClick={() => {
                closeCoachDetailModal();
                openAppointmentModal(selectedCoach);
              }}
            >
              立即预约
            </Button>,
          ]}
          width={600}
        >
          {selectedCoach && (
            <div className="coach-detail">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Avatar src={selectedCoach.avatar} size={100} />
                <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
                  {selectedCoach.name}
                </Title>
                <Rate disabled defaultValue={selectedCoach.rating} />
              </div>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title="基本信息" size="small">
                    <p><UserOutlined /> 性别: {selectedCoach.gender === 'male' ? '男' : '女'}</p>
                    <p><EnvironmentOutlined /> 地区: {selectedCoach.location.city} {selectedCoach.location.districts.join('/')}</p>
                    <p>所属院校: {selectedCoach.school}</p>
                    <p>技术等级: {selectedCoach.technical_level}</p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="培训项目" size="small">
                    {selectedCoach.skills.map(skill => (
                      <Tag key={skill} color="blue" style={{ margin: '0 8px 8px 0' }}>{skill}</Tag>
                    ))}
                  </Card>
                </Col>
              </Row>

              <Card title="教练介绍" style={{ marginTop: 16 }}>
                <Paragraph>{selectedCoach.description}</Paragraph>
              </Card>

              <Card title="认证信息" style={{ marginTop: 16 }}>
                <p><CheckCircleOutlined style={{ color: 'green' }} /> {selectedCoach.certification}</p>
              </Card>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Text type="secondary">价格: </Text>
                <Text strong style={{ color: 'red', fontSize: 20 }}>
                  {selectedCoach.price}元/小时
                </Text>
              </div>

              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Space>
                  <Button icon={<MessageOutlined />} onClick={openMessageModal}>发消息</Button>
                  <Button icon={<PhoneOutlined />}>打电话</Button>
                </Space>
              </div>
            </div>
          )}
        </Modal>

        {/* 发送消息模态框 */}
        <Modal
          title="发送消息"
          visible={showMessageModal}
          onCancel={closeMessageModal}
          footer={null}
        >
          {selectedCoach && (
            <Form
              form={messageForm}
              layout="vertical"
              onFinish={handleSendMessage}
            >
              <div style={{ marginBottom: 16 }}>
                <Text strong>发送给: </Text>
                <Text>{selectedCoach.name}</Text>
              </div>
              
              <Form.Item
                name="message"
                label="消息内容"
                rules={[{ required: true, message: '请输入消息内容' }]}
              >
                <TextArea rows={4} placeholder="请输入消息内容" />
              </Form.Item>
              
              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button onClick={closeMessageModal}>取消</Button>
                  <Button type="primary" htmlType="submit">发送</Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Modal>
      </Content>
    </MainLayout>
  );
};

export default CoachAppointment;
