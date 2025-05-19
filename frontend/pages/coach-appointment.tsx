import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Card, Avatar, Rate, Tag, Select, DatePicker, Radio, Modal, Form, Input, message } from 'antd';
import { UserOutlined, StarFilled, FilterOutlined, SearchOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import GradientTitle from '../components/ui/GradientTitle';
import GradientButton from '../components/ui/GradientButton';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// 模拟教练数据
const mockCoaches = [
  {
    id: 1,
    name: '王教练',
    avatar: '',
    title: '太极拳国家一级教练',
    rating: 4.9,
    reviews: 128,
    specialties: ['太极拳', '八卦掌'],
    experience: '15年教学经验',
    price: 299,
    description: '国家级太极拳教练，多次获得全国比赛冠军，擅长杨式太极拳和陈式太极拳教学，注重传统功法与现代科学训练相结合。',
  },
  {
    id: 2,
    name: '李教练',
    avatar: '',
    title: '形意拳专业教练',
    rating: 4.7,
    reviews: 85,
    specialties: ['形意拳', '八极拳'],
    experience: '12年教学经验',
    price: 259,
    description: '形意拳专业教练，专注于实战技巧教学，课程设计科学合理，适合各年龄段学员，尤其擅长传授实用防身技巧。',
  },
  {
    id: 3,
    name: '张教练',
    avatar: '',
    title: '武术散打教练',
    rating: 4.8,
    reviews: 112,
    specialties: ['散打', '搏击'],
    experience: '10年教学经验',
    price: 329,
    description: '中国武术散打专业教练，曾获全国武术散打锦标赛冠军，教学方法灵活多样，重视基本功训练，深受学员喜爱。',
  },
  {
    id: 4,
    name: '陈教练',
    avatar: '',
    title: '咏春拳专业教练',
    rating: 4.6,
    reviews: 76,
    specialties: ['咏春拳', '南拳'],
    experience: '8年教学经验',
    price: 279,
    description: '咏春拳专业教练，师承正宗咏春门派，教学经验丰富，擅长一对一针对性指导，注重实战应用和传统技法的结合。',
  },
];

const CoachAppointment: React.FC = () => {
  const [coaches, setCoaches] = useState(mockCoaches);
  const [filteredCoaches, setFilteredCoaches] = useState(mockCoaches);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  const [form] = Form.useForm();
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterCoaches(value, selectedStyle, priceRange, ratingFilter);
  };
  
  const handleStyleChange = (value: string[]) => {
    setSelectedStyle(value);
    filterCoaches(searchTerm, value, priceRange, ratingFilter);
  };
  
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    filterCoaches(searchTerm, selectedStyle, value, ratingFilter);
  };
  
  const handleRatingChange = (value: number) => {
    setRatingFilter(value);
    filterCoaches(searchTerm, selectedStyle, priceRange, value);
  };
  
  const filterCoaches = (search: string, styles: string[], prices: [number, number], rating: number) => {
    let filtered = mockCoaches;
    
    if (search) {
      filtered = filtered.filter(coach => 
        coach.name.includes(search) || 
        coach.description.includes(search) || 
        coach.specialties.some(s => s.includes(search))
      );
    }
    
    if (styles.length > 0) {
      filtered = filtered.filter(coach => 
        coach.specialties.some(s => styles.includes(s))
      );
    }
    
    filtered = filtered.filter(coach => 
      coach.price >= prices[0] && coach.price <= prices[1]
    );
    
    if (rating > 0) {
      filtered = filtered.filter(coach => coach.rating >= rating);
    }
    
    setFilteredCoaches(filtered);
  };
  
  const openAppointmentModal = (coach: any) => {
    setSelectedCoach(coach);
    setModalVisible(true);
    form.resetFields();
  };
  
  const handleAppointmentSubmit = () => {
    form.validateFields().then(values => {
      // 模拟预约提交
      console.log('预约信息:', { coach: selectedCoach, ...values });
      message.success(`您已成功预约${selectedCoach.name}的课程，请等待教练确认`);
      setModalVisible(false);
    }).catch(errorInfo => {
      console.log('表单验证失败:', errorInfo);
    });
  };

  return (
    <MainLayout>
      <Head>
        <title>教练预约 - 武道智评</title>
        <meta name="description" content="预约专业武术教练，获取一对一指导和个性化训练计划" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 max-w-5xl mx-auto"
        >
          <GradientTitle as="h1" className="mb-4">
            预约专业武术教练
          </GradientTitle>
          <p className="text-gray-600 text-lg">
            寻找最适合您的武术教练，获取一对一专业指导和个性化训练计划，提升您的武术水平
          </p>
        </motion.div>
        
        {/* 搜索和筛选区域 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 max-w-5xl mx-auto">
          <div className="p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-grow min-w-[200px]">
                <Input 
                  placeholder="搜索教练或武术流派" 
                  prefix={<SearchOutlined />} 
                  onChange={e => handleSearch(e.target.value)}
                  className="rounded-lg"
                />
              </div>
              
              <div className="min-w-[200px]">
                <Select
                  mode="multiple"
                  placeholder="武术流派"
                  style={{ width: '100%' }}
                  onChange={handleStyleChange}
                  className="rounded-lg"
                >
                  <Option value="太极拳">太极拳</Option>
                  <Option value="形意拳">形意拳</Option>
                  <Option value="八卦掌">八卦掌</Option>
                  <Option value="咏春拳">咏春拳</Option>
                  <Option value="八极拳">八极拳</Option>
                  <Option value="散打">散打</Option>
                  <Option value="搏击">搏击</Option>
                  <Option value="南拳">南拳</Option>
                </Select>
              </div>
              
              <div>
                <Select
                  placeholder="最低评分"
                  style={{ width: 120 }}
                  onChange={handleRatingChange}
                  className="rounded-lg"
                >
                  <Option value={0}>不限</Option>
                  <Option value={4.5}>4.5+</Option>
                  <Option value={4}>4.0+</Option>
                  <Option value={3.5}>3.5+</Option>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <FilterOutlined />
              <span>价格区间:</span>
              <Radio.Group defaultValue="a">
                <Radio.Button value="a">不限</Radio.Button>
                <Radio.Button value="b">¥100-200</Radio.Button>
                <Radio.Button value="c">¥200-300</Radio.Button>
                <Radio.Button value="d">¥300+</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </div>
        
        {/* 教练列表 */}
        <div className="max-w-5xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">共找到 {filteredCoaches.length} 位教练</h2>
            <Select defaultValue="recommended" style={{ width: 140 }}>
              <Option value="recommended">推荐排序</Option>
              <Option value="rating">评分最高</Option>
              <Option value="price-asc">价格从低到高</Option>
              <Option value="price-desc">价格从高到低</Option>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCoaches.map((coach, index) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className="h-full transition-all duration-300 hover:shadow-lg hover:border-xtalpi-indigo/30"
                  actions={[
                    <div key="price" className="text-xtalpi-indigo font-medium">¥{coach.price}/节</div>,
                    <GradientButton key="book" className="mx-4" onClick={() => openAppointmentModal(coach)}>预约</GradientButton>
                  ]}
                >
                  <div className="flex">
                    <Avatar 
                      size={64} 
                      icon={<UserOutlined />} 
                      className="bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple"
                    />
                    <div className="ml-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">{coach.name}</h3>
                        <div className="flex items-center">
                          <Rate disabled defaultValue={coach.rating} character={<StarFilled />} style={{ fontSize: 14 }} />
                          <span className="ml-1 text-gray-600 text-sm">{coach.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{coach.title}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {coach.specialties.map((specialty, idx) => (
                          <Tag key={idx} color="blue">{specialty}</Tag>
                        ))}
                        <Tag>{coach.experience}</Tag>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{coach.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* 预约表单弹窗 */}
        <Modal
          title={<div className="text-xl font-bold">预约教练</div>}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={560}
        >
          {selectedCoach && (
            <div>
              <div className="mb-6 flex items-center">
                <Avatar 
                  size={48} 
                  icon={<UserOutlined />} 
                  className="bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple"
                />
                <div className="ml-3">
                  <h3 className="text-lg font-bold">{selectedCoach.name}</h3>
                  <p className="text-gray-600">{selectedCoach.title}</p>
                </div>
              </div>
              
              <Form
                form={form}
                layout="vertical"
                initialValues={{ type: '线上' }}
              >
                <Form.Item
                  name="date"
                  label="预约日期"
                  rules={[{ required: true, message: '请选择预约日期' }]}
                >
                  <DatePicker 
                    style={{ width: '100%' }} 
                    placeholder="选择日期"
                    className="rounded-lg"
                  />
                </Form.Item>
                
                <Form.Item
                  name="time"
                  label="预约时段"
                  rules={[{ required: true, message: '请选择预约时段' }]}
                >
                  <Select placeholder="选择时段" className="rounded-lg">
                    <Option value="09:00-10:00">09:00-10:00</Option>
                    <Option value="10:00-11:00">10:00-11:00</Option>
                    <Option value="11:00-12:00">11:00-12:00</Option>
                    <Option value="14:00-15:00">14:00-15:00</Option>
                    <Option value="15:00-16:00">15:00-16:00</Option>
                    <Option value="16:00-17:00">16:00-17:00</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="type"
                  label="预约类型"
                  rules={[{ required: true, message: '请选择预约类型' }]}
                >
                  <Radio.Group>
                    <Radio value="线上">线上指导</Radio>
                    <Radio value="线下">线下课程</Radio>
                  </Radio.Group>
                </Form.Item>
                
                <Form.Item
                  name="focus"
                  label="重点需求"
                  rules={[{ required: true, message: '请选择重点需求' }]}
                >
                  <Select placeholder="选择您的重点需求" className="rounded-lg">
                    <Option value="基础动作指导">基础动作指导</Option>
                    <Option value="技巧提升">技巧提升</Option>
                    <Option value="力量训练">力量训练</Option>
                    <Option value="实战应用">实战应用</Option>
                    <Option value="套路学习">套路学习</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="remark"
                  label="备注说明"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="请描述您的具体需求或问题，以便教练更好地准备课程"
                    className="rounded-lg"
                  />
                </Form.Item>
                
                <div className="flex justify-between items-center border-t border-gray-200 pt-4 mt-4">
                  <div className="text-lg font-bold text-xtalpi-indigo">
                    ¥{selectedCoach.price}
                    <span className="text-sm text-gray-600 font-normal ml-1">/ 节课</span>
                  </div>
                  
                  <div>
                    <button 
                      type="button" 
                      onClick={() => setModalVisible(false)}
                      className="mr-3 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <GradientButton onClick={handleAppointmentSubmit}>
                      确认预约
                    </GradientButton>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Modal>
        
        {/* 预约说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 mt-12 max-w-5xl mx-auto"
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">预约说明</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
              <span>教练预约成功后，需在24小时内完成支付，否则预约将自动取消</span>
            </li>
            <li className="flex items-start">
              <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
              <span>线上指导将通过平台视频会议系统进行，请确保您的设备和网络正常</span>
            </li>
            <li className="flex items-start">
              <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
              <span>如需取消预约，请提前24小时操作，可获得全额退款</span>
            </li>
            <li className="flex items-start">
              <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
              <span>课程结束后，请对教练进行评价，您的反馈将帮助我们提供更好的服务</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default CoachAppointment;
