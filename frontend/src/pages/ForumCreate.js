import React, { useState } from 'react';
import { 
  Layout, Typography, Form, Input, Button, 
  message, Card, Select, Space, Divider 
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { forumAPI } from '../api';
import MainLayout from '../components/MainLayout';

const { Title, Text } = Typography;
const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

// 预设的标签选项
const tagOptions = [
  '太极拳', '咏春拳', '少林功夫', '形意拳', '八卦掌', 
  '散打', '武术套路', '传统武术', '现代武术', '武术理论',
  '武德', '健身', '比赛', '教学', '心得体会'
];

const ForumCreate = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  // 处理表单提交
  const handleSubmit = async (values) => {
    if (!values.title || !values.content) {
      message.error('标题和内容不能为空');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        title: values.title,
        content: values.content,
        tags: tags
      };

      const response = await forumAPI.createPost(postData);
      if (response.data.success) {
        message.success('帖子发布成功，等待管理员审核');
        navigate('/forum/my-posts');
      } else {
        message.error(response.data.message || '发布帖子失败');
      }
    } catch (error) {
      console.error('发布帖子出错:', error);
      message.error('发布帖子失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消按钮点击
  const handleCancel = () => {
    navigate('/forum');
  };

  // 处理添加自定义标签
  const handleAddCustomTag = () => {
    if (customTag && customTag.trim() !== '' && !tags.includes(customTag)) {
      setTags([...tags, customTag]);
      setCustomTag('');
    }
  };

  // 处理标签选择变化
  const handleTagChange = (selectedTags) => {
    setTags(selectedTags);
  };

  return (
    <MainLayout selectedKey="forum">
      <Content className="site-layout-content" style={{ padding: '0 50px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 0' }}>
          <Title level={2}>发布帖子</Title>
          <Text type="secondary" style={{ marginBottom: 20, display: 'block' }}>
            分享您的武术心得和体验，帖子发布后需要管理员审核通过才能显示
          </Text>

          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入帖子标题' }]}
              >
                <Input placeholder="请输入帖子标题" maxLength={100} />
              </Form.Item>

              <Form.Item
                name="content"
                label="内容"
                rules={[{ required: true, message: '请输入帖子内容' }]}
              >
                <TextArea 
                  placeholder="请输入帖子内容" 
                  autoSize={{ minRows: 10, maxRows: 20 }}
                  maxLength={10000}
                  showCount
                />
              </Form.Item>

              <Form.Item label="标签">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="选择或输入标签"
                    value={tags}
                    onChange={handleTagChange}
                    maxTagCount={5}
                  >
                    {tagOptions.map(tag => (
                      <Option key={tag} value={tag}>{tag}</Option>
                    ))}
                  </Select>
                  
                  <Space>
                    <Input 
                      placeholder="添加自定义标签" 
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onPressEnter={handleAddCustomTag}
                      maxLength={20}
                    />
                    <Button type="primary" onClick={handleAddCustomTag}>添加</Button>
                  </Space>
                  
                  <Text type="secondary">最多可添加5个标签，每个标签最长20个字符</Text>
                </Space>
              </Form.Item>

              <Divider />

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    发布帖子
                  </Button>
                  <Button onClick={handleCancel}>取消</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
    </MainLayout>
  );
};

export default ForumCreate;
