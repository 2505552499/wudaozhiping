import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Card, Tag, Rate, Input, Select, Divider, Badge, Pagination } from 'antd';
import { SearchOutlined, StarFilled, FilterOutlined, TeamOutlined, ClockOutlined, PlayCircleOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import GradientTitle from '../components/ui/GradientTitle';
import GradientButton from '../components/ui/GradientButton';

const { Option } = Select;

// 模拟课程数据
const mockCourses = [
  {
    id: 1,
    title: '太极拳入门到精通',
    instructor: '王教练',
    level: '入门',
    rating: 4.9,
    reviews: 128,
    students: 1256,
    price: 299,
    originalPrice: 599,
    duration: '25课时',
    categories: ['太极拳', '传统武术'],
    tags: ['基础入门', '系统课程'],
    image: '',
    featured: true,
    description: '从零基础开始学习正宗太极拳，掌握基本姿势、呼吸方法、太极理念和完整套路，提升身体健康和心灵平衡。',
  },
  {
    id: 2,
    title: '形意拳实战技巧',
    instructor: '李教练',
    level: '中级',
    rating: 4.7,
    reviews: 85,
    students: 753,
    price: 359,
    originalPrice: 499,
    duration: '18课时',
    categories: ['形意拳', '实战技巧'],
    tags: ['中级进阶', '实战应用'],
    image: '',
    featured: false,
    description: '专注形意拳实战应用技巧，融合传统功法与现代搏击理念，提升实战能力和防身本领。',
  },
  {
    id: 3,
    title: '八卦掌基础训练',
    instructor: '张教练',
    level: '入门',
    rating: 4.8,
    reviews: 112,
    students: 986,
    price: 329,
    originalPrice: 459,
    duration: '20课时',
    categories: ['八卦掌', '传统武术'],
    tags: ['基础入门', '身体协调'],
    image: '',
    featured: false,
    description: '系统学习八卦掌基本功法，掌握掌型、步法、身法、转换技巧，提升身体协调性和灵活度。',
  },
  {
    id: 4,
    title: '咏春拳进阶课程',
    instructor: '陈教练',
    level: '高级',
    rating: 4.9,
    reviews: 95,
    students: 672,
    price: 399,
    originalPrice: 599,
    duration: '22课时',
    categories: ['咏春拳', '南拳'],
    tags: ['高级进阶', '实战应用'],
    image: '',
    featured: true,
    description: '专业咏春拳进阶教学，深入学习小念头、寻桥、标指等高级套路和木人桩法，提升实战技巧。',
  },
  {
    id: 5,
    title: '散打基础训练',
    instructor: '赵教练',
    level: '入门',
    rating: 4.6,
    reviews: 76,
    students: 845,
    price: 279,
    originalPrice: 399,
    duration: '15课时',
    categories: ['散打', '搏击'],
    tags: ['基础入门', '实战应用'],
    image: '',
    featured: false,
    description: '系统学习散打基本功法，包括站姿、步法、拳法、腿法和防守技巧，适合零基础学员入门。',
  },
  {
    id: 6,
    title: '武术体能训练专项课',
    instructor: '刘教练',
    level: '不限',
    rating: 4.7,
    reviews: 64,
    students: 723,
    price: 259,
    originalPrice: 359,
    duration: '12课时',
    categories: ['体能训练', '基础强化'],
    tags: ['体能提升', '基础训练'],
    image: '',
    featured: false,
    description: '专注武术体能训练，科学提升力量、灵活性、爆发力和耐力，为各类武术学习打下坚实基础。',
  },
];

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState(mockCourses);
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string[]>([]);
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [priceSort, setPriceSort] = useState<string>('');
  
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterCourses(value, selectedStyle, levelFilter, priceSort);
  };
  
  const handleStyleChange = (value: string[]) => {
    setSelectedStyle(value);
    filterCourses(searchTerm, value, levelFilter, priceSort);
  };
  
  const handleLevelChange = (value: string) => {
    setLevelFilter(value);
    filterCourses(searchTerm, selectedStyle, value, priceSort);
  };
  
  const handlePriceSort = (value: string) => {
    setPriceSort(value);
    filterCourses(searchTerm, selectedStyle, levelFilter, value);
  };
  
  const filterCourses = (search: string, styles: string[], level: string, sort: string) => {
    let filtered = mockCourses;
    
    if (search) {
      filtered = filtered.filter(course => 
        course.title.includes(search) || 
        course.description.includes(search) || 
        course.categories.some(c => c.includes(search))
      );
    }
    
    if (styles.length > 0) {
      filtered = filtered.filter(course => 
        course.categories.some(c => styles.includes(c))
      );
    }
    
    if (level) {
      filtered = filtered.filter(course => course.level === level);
    }
    
    // 排序
    if (sort === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    } else if (sort === 'popular') {
      filtered = [...filtered].sort((a, b) => b.students - a.students);
    }
    
    setFilteredCourses(filtered);
  };

  return (
    <MainLayout>
      <Head>
        <title>精品课程 - 武道智评</title>
        <meta name="description" content="探索武道智评平台提供的专业武术在线课程，从入门到精通，系统学习各种武术流派" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {/* 头部横幅 */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple mb-10">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
          </div>
          
          <div className="relative z-10 py-16 px-8 text-white text-center">
            <motion.h1 
              className="text-3xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              武术精品课程
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              从入门到精通，系统学习各种武术流派，由专业教练指导，随时随地提升武术技能
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="max-w-xl mx-auto">
                <Input 
                  size="large"
                  placeholder="搜索课程、武术流派或教练" 
                  prefix={<SearchOutlined />} 
                  onChange={e => handleSearch(e.target.value)}
                  className="rounded-full shadow-lg px-6"
                />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* 筛选栏 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center">
                <FilterOutlined className="mr-2 text-gray-600" />
                <span className="font-medium">筛选:</span>
              </div>
              
              <div className="flex-grow min-w-[180px]">
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
                  <Option value="散打">散打</Option>
                  <Option value="搏击">搏击</Option>
                  <Option value="南拳">南拳</Option>
                  <Option value="体能训练">体能训练</Option>
                </Select>
              </div>
              
              <div className="min-w-[120px]">
                <Select
                  placeholder="难度级别"
                  style={{ width: '100%' }}
                  onChange={handleLevelChange}
                  className="rounded-lg"
                >
                  <Option value="">全部级别</Option>
                  <Option value="入门">入门</Option>
                  <Option value="中级">中级</Option>
                  <Option value="高级">高级</Option>
                  <Option value="不限">不限</Option>
                </Select>
              </div>
              
              <div className="min-w-[150px] ml-auto">
                <Select
                  placeholder="排序方式"
                  style={{ width: '100%' }}
                  defaultValue="popular"
                  onChange={handlePriceSort}
                  className="rounded-lg"
                >
                  <Option value="popular">最受欢迎</Option>
                  <Option value="rating">评分最高</Option>
                  <Option value="price-asc">价格从低到高</Option>
                  <Option value="price-desc">价格从高到低</Option>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* 精选课程 */}
        {filteredCourses.some(course => course.featured) && (
          <div className="mb-12">
            <GradientTitle as="h2" className="mb-6">精选课程</GradientTitle>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCourses
                .filter(course => course.featured)
                .map((course, index) => (
                  <motion.div 
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full overflow-hidden relative hover:shadow-lg transition-shadow">
                      <Badge.Ribbon text="精选" color="#6E43FF">
                        <div className="flex flex-col md:flex-row h-full">
                          <div className="md:w-2/5 h-48 md:h-auto bg-gray-200 rounded-lg">
                            <div className="w-full h-full bg-gradient-to-br from-xtalpi-dark-blue/20 to-xtalpi-purple/20 flex items-center justify-center">
                              <div className="text-5xl">🥋</div>
                            </div>
                          </div>
                          
                          <div className="md:w-3/5 md:pl-6 pt-4 md:pt-0 flex flex-col">
                            <h3 className="text-xl font-bold hover:text-xtalpi-indigo transition-colors mb-2">{course.title}</h3>
                            
                            <div className="text-gray-700 mb-2">{course.instructor} · {course.duration}</div>
                            
                            <div className="flex items-center mb-2">
                              <Rate disabled defaultValue={course.rating} character={<StarFilled />} style={{ fontSize: 14 }} />
                              <span className="ml-1 text-gray-600 text-sm">{course.rating}</span>
                              <span className="mx-1 text-gray-400">|</span>
                              <span className="text-gray-600 text-sm">{course.reviews} 评价</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {course.categories.map((category, idx) => (
                                <Tag key={idx} color="blue">{category}</Tag>
                              ))}
                              <Tag color="green">{course.level}</Tag>
                              {course.tags.map((tag, idx) => (
                                <Tag key={idx}>{tag}</Tag>
                              ))}
                            </div>
                            
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{course.description}</p>
                            
                            <div className="mt-auto flex justify-between items-center">
                              <div className="flex items-center">
                                <TeamOutlined className="text-gray-500 mr-1" />
                                <span className="text-gray-600 text-sm">{course.students} 学员</span>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-gray-500 line-through text-sm">¥{course.originalPrice}</div>
                                <div className="text-xl font-bold text-xtalpi-indigo">¥{course.price}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Badge.Ribbon>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
        
        {/* 课程列表 */}
        <div>
          <GradientTitle as="h2" className="mb-6">全部课程</GradientTitle>
          
          <div className="mb-4 text-gray-700">
            找到 {filteredCourses.length} 个符合条件的课程
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Card 
                  className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-xtalpi-indigo/20"
                  cover={
                    <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-xtalpi-dark-blue/10 to-xtalpi-purple/10 flex items-center justify-center">
                      <div className="text-5xl">🥋</div>
                    </div>
                  }
                  actions={[
                    <div key="price" className="flex justify-between px-4">
                      <div className="text-gray-600 flex items-center">
                        <TeamOutlined className="mr-1" />
                        <span>{course.students}</span>
                      </div>
                      <div className="text-xtalpi-indigo font-bold">¥{course.price}</div>
                    </div>,
                    <GradientButton key="enroll" className="mx-4 py-1">加入学习</GradientButton>
                  ]}
                >
                  <div className="flex-grow flex flex-col">
                    <div className="mb-2 flex justify-between">
                      <Tag color="green">{course.level}</Tag>
                      <div className="flex items-center">
                        <Rate disabled defaultValue={course.rating} character={<StarFilled />} style={{ fontSize: 12 }} />
                        <span className="ml-1 text-gray-600 text-xs">{course.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 hover:text-xtalpi-indigo transition-colors">{course.title}</h3>
                    
                    <div className="text-gray-600 text-sm mb-3">{course.instructor} · {course.duration}</div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {course.categories.map((category, idx) => (
                        <Tag key={idx} color="blue">{category}</Tag>
                      ))}
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{course.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockOutlined className="mr-1" />
                      <span>最近更新</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Pagination defaultCurrent={1} total={50} />
          </div>
        </div>
        
        {/* 底部 CTA */}
        <div className="mt-16 bg-gradient-to-r from-xtalpi-dark-blue via-xtalpi-indigo to-xtalpi-purple rounded-xl p-8 text-white text-center">
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            开始您的武术学习之旅
          </motion.h2>
          
          <motion.p 
            className="text-lg mb-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            不论您是初学者还是有经验的武术爱好者，我们都有适合您的课程。现在注册还可享受新用户专属优惠！
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GradientButton 
              className="px-8 py-3 text-lg bg-white text-xtalpi-indigo hover:bg-gray-100"
              onClick={() => window.location.href = '/login'}
            >
              免费注册
            </GradientButton>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseList;
