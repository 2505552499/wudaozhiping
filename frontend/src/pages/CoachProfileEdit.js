import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layout, Typography, Form, Input, Button, Select, 
  Upload, message, Card, Row, Col, InputNumber, 
  Spin, Alert, Tag, Space, Divider
} from 'antd';
import { 
  UserOutlined,
  DollarOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { coachAPI } from '../api';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CoachProfileEdit = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [coachProfile, setCoachProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
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

  // 区域选项，根据选择的城市动态加载
  const districtOptions = {
    '北京': ['朝阳区', '海淀区', '丰台区', '西城区', '东城区', '昌平区', '通州区'],
    '上海': ['浦东新区', '徐汇区', '静安区', '长宁区', '黄浦区', '闵行区', '杨浦区'],
    // 其他城市的区域
  };

  // 等级选项
  const levelOptions = [
    '初级教练', '中级教练', '高级教练', '国家级教练', '国际认证教练'
  ];

  // 获取教练个人资料
  const fetchCoachProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await coachAPI.getCoachProfile();
      if (response.data?.success) {
        const profile = response.data.coach;
        setCoachProfile(profile);
        setSkills(profile.skills || []);
        
        // 设置表单初始值
        form.setFieldsValue({
          name: profile.name,
          gender: profile.gender,
          city: profile.location?.city,
          district: profile.location?.district,
          school: profile.school,
          technical_level: profile.technical_level,
          certification: profile.certification,
          price: profile.price,
          description: profile.description,
          phone: profile.phone,
          email: profile.email
        });
      } else {
        message.error('获取个人资料失败');
      }
    } catch (error) {
      console.error('获取个人资料失败:', error);
      message.error('获取个人资料失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [form]);
  
  // 检查用户是否为教练并加载数据
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'coach') {
      message.error('您没有权限访问此页面');
      navigate('/');
      return;
    }
    
    fetchCoachProfile();
  }, [navigate, fetchCoachProfile]);

  // 处理技能标签关闭
  const handleSkillClose = (removedSkill) => {
    const newSkills = skills.filter(skill => skill !== removedSkill);
    setSkills(newSkills);
  };

  // 显示输入框
  const showInput = () => {
    setInputVisible(true);
  };

  // 处理输入框变化
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 处理输入框确认
  const handleInputConfirm = () => {
    if (inputValue && !skills.includes(inputValue)) {
      setSkills([...skills, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  // 处理选择技能
  const handleSkillSelect = (value) => {
    if (!skills.includes(value)) {
      setSkills([...skills, value]);
    }
    setInputVisible(false);
  };

  // 提交表单
  const handleSubmit = async (values) => {
    if (skills.length === 0) {
      message.error('请至少添加一项培训技能');
      return;
    }
    
    setSubmitting(true);
    try {
      // 准备提交的数据
      const profileData = {
        ...values,
        skills: skills,
        location: {
          city: values.city,
          district: values.district
        }
      };
      
      // 删除多余字段
      delete profileData.city;
      delete profileData.district;
      
      // 发送更新个人资料请求
      const response = await coachAPI.updateCoachProfile(profileData);
      
      if (response.data?.success) {
        setSuccessMessage('个人资料更新成功');
        
        // 3秒后清除成功消息
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        message.error(response.data?.message || '更新个人资料失败，请稍后重试');
      }
    } catch (error) {
      console.error('更新个人资料失败:', error);
      message.error('更新个人资料失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = async (info) => {
    if (info.file.status === 'done') {
      if (info.file.response?.success) {
        message.success('头像上传成功');
        // 更新本地头像显示
        setCoachProfile({
          ...coachProfile,
          avatar: info.file.response.avatar_url
        });
      } else {
        message.error(info.file.response?.message || '头像上传失败');
      }
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };

  return (
    <MainLayout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>教练员资料管理</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          完善您的个人资料，以便学员了解您的专业背景、教学特长和收费标准等。资料完整度越高，越能吸引潜在学员。
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
            >
              <Row gutter={24}>
                <Col span={6} style={{ textAlign: 'center' }}>
                  <Form.Item label="教练头像">
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action={`${process.env.REACT_APP_API_URL}/api/coach/avatar`}
                      headers={{
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                      }}
                      onChange={handleAvatarUpload}
                    >
                      {coachProfile?.avatar ? (
                        <img 
                          src={coachProfile.avatar} 
                          alt="头像" 
                          style={{ width: '100%' }} 
                        />
                      ) : (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>上传头像</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
                
                <Col span={18}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '请输入姓名' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="gender"
                        label="性别"
                        rules={[{ required: true, message: '请选择性别' }]}
                      >
                        <Select placeholder="请选择性别">
                          <Option value="male">男</Option>
                          <Option value="female">女</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="city"
                        label="城市"
                        rules={[{ required: true, message: '请选择城市' }]}
                      >
                        <Select 
                          placeholder="请选择城市" 
                          onChange={() => form.setFieldsValue({ district: undefined })}
                        >
                          {cityOptions.map(city => (
                            <Option key={city} value={city}>{city}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="district"
                        label="区域"
                        rules={[{ required: true, message: '请选择区域' }]}
                      >
                        <Select placeholder="请选择区域" disabled={!form.getFieldValue('city')}>
                          {form.getFieldValue('city') && 
                            districtOptions[form.getFieldValue('city')]?.map(district => (
                              <Option key={district} value={district}>{district}</Option>
                            ))
                          }
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              
              <Divider />
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="school"
                    label="所属院校/机构"
                    rules={[{ required: true, message: '请输入所属院校或机构' }]}
                  >
                    <Input placeholder="例如：北京体育大学" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="technical_level"
                    label="技术等级"
                    rules={[{ required: true, message: '请选择技术等级' }]}
                  >
                    <Select placeholder="请选择技术等级">
                      {levelOptions.map(level => (
                        <Option key={level} value={level}>{level}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="certification"
                label="资质认证"
                rules={[{ required: true, message: '请输入您的资质认证' }]}
              >
                <Input placeholder="例如：国际武术联合会认证教练、国家一级武术裁判" />
              </Form.Item>
              
              <Form.Item label="培训技能" required>
                <div style={{ marginBottom: 16 }}>
                  {skills.map(skill => (
                    <Tag 
                      key={skill} 
                      closable 
                      onClose={() => handleSkillClose(skill)}
                      style={{ marginBottom: 8 }}
                    >
                      {skill}
                    </Tag>
                  ))}
                </div>
                
                {inputVisible ? (
                  <Input
                    type="text"
                    size="small"
                    style={{ width: 150 }}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                    autoFocus
                  />
                ) : (
                  <Space>
                    <Button size="small" type="dashed" onClick={showInput} icon={<PlusOutlined />}>
                      添加自定义技能
                    </Button>
                    <Select
                      style={{ width: 200 }}
                      placeholder="选择预设技能"
                      onChange={handleSkillSelect}
                      showSearch
                    >
                      {skillOptions
                        .filter(skill => !skills.includes(skill))
                        .map(skill => (
                          <Option key={skill} value={skill}>{skill}</Option>
                        ))
                      }
                    </Select>
                  </Space>
                )}
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">请添加您擅长的培训技能，学员将根据这些技能选择您</Text>
                </div>
              </Form.Item>
              
              <Form.Item
                name="price"
                label="培训费用(元/小时)"
                rules={[{ required: true, message: '请输入培训费用' }]}
              >
                <InputNumber 
                  min={0} 
                  step={10} 
                  prefix={<DollarOutlined />}
                  style={{ width: '100%' }} 
                />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="教练介绍"
                rules={[{ required: true, message: '请输入教练介绍' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="请介绍您的专业背景、教学风格、培训特点等" 
                />
              </Form.Item>
              
              <Divider />
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="联系电话"
                    rules={[{ required: true, message: '请输入联系电话' }]}
                  >
                    <Input placeholder="请输入联系电话" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="电子邮箱"
                  >
                    <Input placeholder="请输入电子邮箱（选填）" />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item style={{ marginTop: 24, textAlign: 'center' }}>
                <Button type="primary" htmlType="submit" loading={submitting} size="large">
                  保存资料
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

export default CoachProfileEdit;
