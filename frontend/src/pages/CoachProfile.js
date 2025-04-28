import React, { useState, useEffect } from 'react';
import { 
  Layout, Typography, Form, Input, Button, Select, 
  Upload, message, Card, Row, Col, Divider, Space, 
  InputNumber, TimePicker, Tag, Modal
} from 'antd';
import { 
  UserOutlined, 
  UploadOutlined, 
  PlusOutlined, 
  EnvironmentOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { coachAPI } from '../api';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CoachProfile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [coachData, setCoachData] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [skills, setSkills] = useState([]);
  const [inputSkill, setInputSkill] = useState('');
  const [skillInputVisible, setSkillInputVisible] = useState(false);
  const navigate = useNavigate();

  // 检查用户是否为教练
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'coach') {
      message.error('您没有权限访问此页面');
      navigate('/');
    } else {
      fetchCoachProfile();
      fetchCities();
    }
  }, [navigate]);

  // 获取教练个人资料
  const fetchCoachProfile = async () => {
    setLoading(true);
    try {
      // 获取当前登录教练的个人资料
      const response = await coachAPI.getCoachProfile();
      if (response.data.success) {
        const profile = response.data.profile;
        setCoachData(profile);
        setSkills(profile.skills || []);
        
        // 设置表单初始值
        form.setFieldsValue({
          name: profile.name,
          gender: profile.gender,
          city: profile.location?.city,
          districts: profile.location?.districts,
          school: profile.school,
          technical_level: profile.technical_level,
          certification: profile.certification,
          description: profile.description,
          price: profile.price
        });
        
        // 如果有城市，获取对应的区域列表
        if (profile.location?.city) {
          fetchDistricts(profile.location.city);
        }
      }
    } catch (error) {
      console.error('获取教练资料失败:', error);
      message.error('获取教练资料失败，请稍后重试');
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

  // 处理城市变更
  const handleCityChange = (value) => {
    form.setFieldsValue({ districts: [] });
    fetchDistricts(value);
  };

  // 处理技能标签添加
  const handleSkillAdd = () => {
    if (inputSkill && !skills.includes(inputSkill)) {
      setSkills([...skills, inputSkill]);
      setInputSkill('');
    }
    setSkillInputVisible(false);
  };

  // 处理技能标签删除
  const handleSkillDelete = (removedSkill) => {
    const newSkills = skills.filter(skill => skill !== removedSkill);
    setSkills(newSkills);
  };

  // 显示技能输入框
  const showSkillInput = () => {
    setSkillInputVisible(true);
  };

  // 保存教练资料
  const handleSaveProfile = async (values) => {
    setSaveLoading(true);
    try {
      const profileData = {
        ...values,
        skills: skills,
        location: {
          city: values.city,
          districts: values.districts
        }
      };
      
      // 删除已移动到location对象中的字段
      delete profileData.city;
      delete profileData.districts;
      
      console.log('提交的教练资料数据:', profileData);
      
      const response = await coachAPI.updateCoachProfile(profileData);
      console.log('服务器响应:', response);
      
      if (response.data.success) {
        message.success('资料保存成功');
        fetchCoachProfile(); // 刷新数据
      } else {
        console.error('保存失败，服务器返回:', response.data);
        message.error(response.data.message || '保存失败');
      }
    } catch (error) {
      console.error('保存教练资料失败:', error);
      if (error.response) {
        console.error('错误响应:', error.response.data);
        console.error('状态码:', error.response.status);
        message.error(`保存失败: ${error.response.data.message || '未知错误'} (${error.response.status})`);
      } else if (error.request) {
        console.error('请求未收到响应:', error.request);
        message.error('服务器未响应，请检查网络连接');
      } else {
        console.error('请求配置错误:', error.message);
        message.error(`请求错误: ${error.message}`);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // 上传头像
  const handleAvatarUpload = async (info) => {
    if (info.file.status === 'done') {
      if (info.file.response.success) {
        message.success('头像上传成功');
        // 刷新教练资料以获取新头像
        fetchCoachProfile();
      } else {
        message.error(info.file.response.message || '上传失败');
      }
    } else if (info.file.status === 'error') {
      message.error('上传失败，请稍后重试');
    }
  };

  return (
    <MainLayout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>教练资料管理</Title>
        
        <Card loading={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveProfile}
          >
            <Row gutter={24}>
              <Col span={6}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Upload
                    name="avatar"
                    action="/api/coach/avatar"
                    showUploadList={false}
                    onChange={handleAvatarUpload}
                    headers={{
                      Authorization: `Bearer ${localStorage.getItem('token')}`
                    }}
                  >
                    <div style={{ 
                      width: 120, 
                      height: 120, 
                      borderRadius: '50%', 
                      background: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}>
                      {coachData?.avatar ? (
                        <img 
                          src={coachData.avatar} 
                          alt="avatar" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <UserOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />
                      )}
                    </div>
                    <Button 
                      icon={<UploadOutlined />} 
                      style={{ marginTop: 16 }}
                    >
                      上传头像
                    </Button>
                  </Upload>
                </div>
              </Col>
              
              <Col span={18}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label="姓名"
                      rules={[{ required: true, message: '请输入姓名' }]}
                    >
                      <Input placeholder="请输入姓名" />
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
                        onChange={handleCityChange}
                      >
                        {cities.map(city => (
                          <Option key={city} value={city}>{city}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="districts"
                      label="区域"
                      rules={[{ required: true, message: '请选择区域' }]}
                    >
                      <Select 
                        placeholder="请选择区域" 
                        mode="multiple"
                        disabled={!form.getFieldValue('city')}
                      >
                        {districts.map(district => (
                          <Option key={district} value={district}>{district}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="school"
                      label="所属院校/机构"
                    >
                      <Input placeholder="请输入所属院校或机构" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="technical_level"
                      label="技术等级"
                    >
                      <Input placeholder="例如：国家一级教练员" />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Form.Item
                  name="certification"
                  label="认证信息"
                >
                  <Input placeholder="例如：CSEA 体教联盟体育生身份认证" />
                </Form.Item>
                
                <Form.Item
                  name="price"
                  label="课时费用（元/小时）"
                  rules={[{ required: true, message: '请输入课时费用' }]}
                >
                  <InputNumber 
                    min={0} 
                    style={{ width: '100%' }} 
                    placeholder="请输入课时费用"
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Divider />
            
            <Form.Item label="培训项目">
              <div style={{ marginBottom: 16 }}>
                {skills.map(skill => (
                  <Tag 
                    key={skill} 
                    closable 
                    onClose={() => handleSkillDelete(skill)}
                    style={{ marginBottom: 8 }}
                  >
                    {skill}
                  </Tag>
                ))}
                
                {skillInputVisible ? (
                  <Input
                    type="text"
                    size="small"
                    style={{ width: 100 }}
                    value={inputSkill}
                    onChange={e => setInputSkill(e.target.value)}
                    onBlur={handleSkillAdd}
                    onPressEnter={handleSkillAdd}
                    autoFocus
                  />
                ) : (
                  <Tag 
                    onClick={showSkillInput} 
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                  >
                    <PlusOutlined /> 添加项目
                  </Tag>
                )}
              </div>
              <Text type="secondary">添加您擅长的培训项目，如：武术、跆拳道、篮球等</Text>
            </Form.Item>
            
            <Form.Item
              name="description"
              label="个人介绍"
            >
              <TextArea 
                rows={6} 
                placeholder="请介绍您的教学经验、专业特长等信息，帮助学员更好地了解您"
              />
            </Form.Item>
            
            <Divider />
            
            <Form.Item style={{ textAlign: 'center' }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={saveLoading}
                size="large"
              >
                保存资料
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </MainLayout>
  );
};

export default CoachProfile;
