import React from 'react';
import { Layout, Typography, Result, Button, Descriptions, Divider } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text } = Typography;

function EnrollmentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const enrollmentData = location.state?.enrollmentData || {};
  
  return (
    <MainLayout>
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            title="课程报名成功"
            subTitle="您已成功报名课程，请按照以下信息完成线下付款"
            extra={[
              <Button type="primary" key="home" onClick={() => navigate('/')}>
                返回首页
              </Button>,
              <Button key="courses" onClick={() => navigate('/courses')}>
                浏览更多课程
              </Button>,
            ]}
          />
          
          <Divider />
          
          {enrollmentData.courseTitle && (
            <div style={{ maxWidth: 600, margin: '0 auto' }}>
              <Descriptions title="报名信息" bordered column={1}>
                <Descriptions.Item label="课程名称">
                  {enrollmentData.courseTitle}
                </Descriptions.Item>
                <Descriptions.Item label="课程费用">
                  <Text type="danger" strong>¥{enrollmentData.price}</Text>
                </Descriptions.Item>
                {enrollmentData.dateRange && (
                  <Descriptions.Item label="课程日期">
                    {enrollmentData.dateRange}
                  </Descriptions.Item>
                )}
                {enrollmentData.location && (
                  <Descriptions.Item label="课程地点">
                    {enrollmentData.location}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="付款方式">
                  线下付款（请在课程开始前完成付款）
                </Descriptions.Item>
                <Descriptions.Item label="联系方式">
                  如有问题，请联系客服电话：13319029526
                </Descriptions.Item>
              </Descriptions>
              
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Text type="secondary">
                  请保存此页面信息，或截图留存。您也可以在个人中心查看报名记录。
                </Text>
              </div>
            </div>
          )}
        </div>
      </Content>
    </MainLayout>
  );
}

export default EnrollmentSuccess;
