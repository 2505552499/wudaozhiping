import React, { useState, useEffect } from 'react';
import { 
  Layout, Typography, Form, Input, Button, DatePicker, 
  TimePicker, Select, message, Card, Row, Col, 
  InputNumber, Spin, Alert, Tag
} from 'antd';
import { 
  EnvironmentOutlined,
  DollarOutlined,
  CalendarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import MainLayout from '../components/MainLayout';
import { appointmentAPI } from '../api';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CoachCreateAppointment = () => {
  const [form] = Form.useForm();
  const [loading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

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

  // 城市选项
  const cityOptions = [
    '北京', '上海', '广州', '深圳', '成都', '杭州', '武汉', '西安', 
    '南京', '重庆', '青岛', '长沙', '郑州', '天津', '苏州', '宁波'
  ];

  // 检查用户是否为教练
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'coach') {
      message.error('您没有权限访问此页面');
      navigate('/');
    }
  }, [navigate]);

  // 提交表单
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // 格式化日期和时间
      const formattedDate = values.date.format('YYYY-MM-DD');
      const formattedTime = values.time.format('HH:mm');
      
      // 准备提交的数据
      const appointmentData = {
        date: formattedDate,
        time: formattedTime,
        location: values.location,
        skill: values.skill,
        duration: values.duration || 1,
        price: values.price,
        description: values.description,
        max_students: values.max_students || 1
      };
      
      // 发送创建预约请求
      const response = await appointmentAPI.createCoachAppointment(appointmentData);
      
      if (response.data?.success) {
        setSuccessMessage('预约信息创建成功，等待管理员审核');
        form.resetFields();
        
        // 3秒后清除成功消息
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        message.error(response.data?.message || '创建预约失败，请稍后重试');
      }
    } catch (error) {
      console.error('创建预约失败:', error);
      message.error('创建预约失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>创建预约信息</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          创建新的预约信息，学员可以通过预约系统预约您的课程。预约信息需要经过管理员审核后才会对学员可见。
        </Text>
        
        {successMessage && (
          <Alert 
            message={successMessage} 
            type="success" 
            showIcon 
            style={{ marginBottom: 24 }} 
          />
        )}
        
        <Card>
          <Spin spinning={loading || submitting}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                duration: 1,
                max_students: 1
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="date"
                    label="预约日期"
                    rules={[{ required: true, message: '请选择预约日期' }]}
                  >
                    <DatePicker 
                      style={{ width: '100%' }} 
                      placeholder="选择日期"
                      format="YYYY-MM-DD"
                      disabledDate={(current) => current && current < moment().startOf('day')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="time"
                    label="预约时间"
                    rules={[{ required: true, message: '请选择预约时间' }]}
                  >
                    <TimePicker 
                      style={{ width: '100%' }} 
                      placeholder="选择时间"
                      format="HH:mm"
                      minuteStep={15}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="skill"
                    label="训练项目"
                    rules={[{ required: true, message: '请选择训练项目' }]}
                  >
                    <Select placeholder="选择训练项目" showSearch>
                      {skillOptions.map(skill => (
                        <Option key={skill} value={skill}>{skill}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="训练地点"
                    rules={[{ required: true, message: '请输入训练地点' }]}
                  >
                    <Input 
                      prefix={<EnvironmentOutlined />} 
                      placeholder="请输入详细地址" 
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="duration"
                    label="课程时长(小时)"
                    rules={[{ required: true, message: '请输入课程时长' }]}
                  >
                    <InputNumber 
                      min={0.5} 
                      max={8} 
                      step={0.5} 
                      style={{ width: '100%' }} 
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="price"
                    label="课程价格(元/小时)"
                    rules={[{ required: true, message: '请输入课程价格' }]}
                  >
                    <InputNumber 
                      min={0} 
                      step={10} 
                      prefix={<DollarOutlined />}
                      style={{ width: '100%' }} 
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="max_students"
                    label="最大学员数"
                    rules={[{ required: true, message: '请输入最大学员数' }]}
                  >
                    <InputNumber 
                      min={1} 
                      max={20} 
                      style={{ width: '100%' }} 
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="description"
                label="课程描述"
                rules={[{ required: true, message: '请输入课程描述' }]}
              >
                <TextArea 
                  rows={3} 
                  placeholder="请简要描述课程内容、适合人群等" 
                />
              </Form.Item>
              
              <Form.Item style={{ marginTop: 24, textAlign: 'center' }}>
                <Button type="primary" htmlType="submit" loading={submitting} size="large">
                  发布预约
                </Button>
                <Button onClick={() => form.resetFields()} style={{ marginLeft: 8 }}>
                  重置
                </Button>
                <Button onClick={() => navigate('/coach-dashboard')} style={{ marginLeft: 8 }}>
                  返回
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </Content>
    </MainLayout>
  );
};

export default CoachCreateAppointment;
