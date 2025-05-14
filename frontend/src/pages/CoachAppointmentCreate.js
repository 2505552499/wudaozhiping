import React, { useState } from 'react';
import { 
  Layout, Typography, Form, Input, Button, Select, 
  Card, InputNumber, message, Checkbox,
  Row, Col, Spin, Alert
} from 'antd';
import { 
  UserOutlined, 
  EnvironmentOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import MainLayout from '../components/MainLayout';
import { appointmentAPI } from '../api';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CoachAppointmentCreate = () => {
  const [form] = Form.useForm();
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

  // 提交表单
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // 准备提交的数据
      const appointmentData = {
        coach_name: values.name,
        phone: values.phone,
        skill: Array.isArray(values.skills) ? values.skills.join(',') : values.skills, // 转换成字符串
        location: values.location,
        price: values.price,
        home_service: values.home_service || false,
        notes: values.notes,
      };
      
      // 发送创建预约请求
      const response = await appointmentAPI.createCoachAppointment(appointmentData);
      
      if (response.data?.success) {
        setSuccessMessage('预约信息发布成功，等待审核');
        form.resetFields();
        
        // 3秒后清除成功消息
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        message.error(response.data?.message || '发布预约失败，请稍后重试');
      }
    } catch (error) {
      console.error('发布预约失败:', error);
      message.error('发布预约失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>发布预约信息</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          发布新的预约信息，学员可以查看并预约。简单填写必要信息即可。
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
          <Spin spinning={submitting}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                price: 120 // 默认价格为120元/小时
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="教练姓名"
                    rules={[{ required: true, message: '请输入教练姓名' }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="联系电话"
                    rules={[{ required: true, message: '请输入联系电话' }]}
                  >
                    <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="skills"
                    label="培训项目"
                    rules={[{ required: true, message: '请选择培训项目' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="可选择多个培训项目"
                      showSearch
                      style={{ width: '100%' }}
                    >
                      {skillOptions.map(skill => (
                        <Option key={skill} value={skill}>{skill}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="培训地点"
                    rules={[{ required: true, message: '请输入培训地点' }]}
                  >
                    <Input 
                      prefix={<EnvironmentOutlined />} 
                      placeholder="请输入详细地址" 
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="培训费用(元/小时)"
                    rules={[{ required: true, message: '请输入培训费用' }]}
                  >
                    <InputNumber 
                      min={0} 
                      step={10}
                      style={{ width: '100%' }} 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="home_service"
                    valuePropName="checked"
                  >
                    <Checkbox>提供上门服务</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="notes"
                label="备注说明"
              >
                <TextArea 
                  rows={3} 
                  placeholder="可以添加额外说明，如培训内容、适合人群等（选填）" 
                />
              </Form.Item>
              
              <Form.Item style={{ marginTop: 24, textAlign: 'center' }}>
                <Button type="primary" htmlType="submit" loading={submitting} size="large">
                  发布预约
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

export default CoachAppointmentCreate;
