import React from 'react';
import { Card, Collapse, Typography, Divider, Alert, List, Space } from 'antd';
import { 
  QuestionCircleOutlined, 
  InfoCircleOutlined, 
  ToolOutlined,
  TeamOutlined
} from '@ant-design/icons';
import MainLayout from '../components/MainLayout';

const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

const Settings = () => {
  return (
    <MainLayout>
      <Card title="帮助与设置" bordered={false}>
        <p>
          欢迎使用武道智评系统，这里提供系统使用帮助和相关设置。
        </p>

        <Divider orientation="left">使用帮助</Divider>

        <Collapse defaultActiveKey={['1']} expandIconPosition="right">
          <Panel 
            header={
              <Space>
                <QuestionCircleOutlined />
                <span>如何使用图像分析功能？</span>
              </Space>
            } 
            key="1"
          >
            <Paragraph>
              图像分析功能可以帮助您分析单张武术动作图片，评估姿势的准确性并提供改进建议。使用步骤如下：
            </Paragraph>
            <List
              bordered
              dataSource={[
                '在图像分析页面，从下拉菜单中选择您要分析的武术动作类型',
                '点击"选择图片"按钮，上传包含您要分析的武术动作的图片',
                '点击"开始分析"按钮，系统将自动分析图片中的姿势',
                '查看分析结果，包括评分、评价和改进建议',
                '您可以根据建议调整姿势，然后上传新图片再次分析'
              ]}
              renderItem={(item, index) => (
                <List.Item>
                  <Text mark>[{index + 1}]</Text> {item}
                </List.Item>
              )}
            />
          </Panel>

          <Panel 
            header={
              <Space>
                <QuestionCircleOutlined />
                <span>如何使用视频分析功能？</span>
              </Space>
            } 
            key="2"
          >
            <Paragraph>
              视频分析功能可以帮助您分析武术动作视频，评估整个动作序列并提供全面评价。使用步骤如下：
            </Paragraph>
            <List
              bordered
              dataSource={[
                '在视频分析页面，从下拉菜单中选择您要分析的武术动作类型',
                '点击"选择视频"按钮，上传包含您要分析的武术动作的视频',
                '点击"开始分析"按钮，系统将自动分析视频中的动作序列',
                '查看分析结果，包括平均评分、关键帧分析和动作评分时间线',
                '您可以根据建议调整动作，然后上传新视频再次分析'
              ]}
              renderItem={(item, index) => (
                <List.Item>
                  <Text mark>[{index + 1}]</Text> {item}
                </List.Item>
              )}
            />
          </Panel>

          <Panel 
            header={
              <Space>
                <QuestionCircleOutlined />
                <span>如何使用摄像头分析功能？</span>
              </Space>
            } 
            key="3"
          >
            <Paragraph>
              摄像头分析功能可以帮助您实时分析武术动作，提供即时反馈。使用步骤如下：
            </Paragraph>
            <List
              bordered
              dataSource={[
                '在摄像头分析页面，从下拉菜单中选择您要分析的武术动作类型',
                '点击"启动摄像头"按钮，允许系统访问您的摄像头',
                '摆好姿势，确保您的全身都在摄像头视野范围内',
                '点击"开始分析"按钮，系统将实时分析您的姿势',
                '查看实时分析结果，根据反馈调整您的姿势',
                '完成后，点击"停止分析"和"停止摄像头"按钮'
              ]}
              renderItem={(item, index) => (
                <List.Item>
                  <Text mark>[{index + 1}]</Text> {item}
                </List.Item>
              )}
            />
            <Alert
              message="注意"
              description="使用摄像头分析功能需要您的浏览器支持摄像头访问，并且您需要授予网站访问摄像头的权限。"
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Panel>
        </Collapse>

        <Divider orientation="left">系统信息</Divider>

        <Card bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <InfoCircleOutlined style={{ marginRight: 8 }} />
              <Text strong>系统版本：</Text> 1.0.0
            </div>
            <div>
              <ToolOutlined style={{ marginRight: 8 }} />
              <Text strong>技术栈：</Text> React, Flask, OpenCV, MediaPipe
            </div>
            <div>
              <TeamOutlined style={{ marginRight: 8 }} />
              <Text strong>支持的武术动作：</Text> 弓步冲拳, 猛虎出洞, 五花坐山, 滚身冲拳, 猿猴纳肘, 马步推掌, 并步崩拳, 狮子张嘴, 马步扣床, 罗汉张掌
            </div>
          </Space>
        </Card>

        <Divider orientation="left">常见问题</Divider>

        <Collapse expandIconPosition="right">
          <Panel header="系统支持哪些浏览器？" key="1">
            <Paragraph>
              武道智评系统支持所有现代浏览器，包括但不限于：
            </Paragraph>
            <ul>
              <li>Google Chrome (推荐)</li>
              <li>Mozilla Firefox</li>
              <li>Microsoft Edge</li>
              <li>Safari</li>
            </ul>
            <Paragraph>
              为了获得最佳体验，我们建议使用最新版本的Google Chrome浏览器。
            </Paragraph>
          </Panel>

          <Panel header="分析结果不准确怎么办？" key="2">
            <Paragraph>
              如果您发现分析结果不够准确，可以尝试以下方法：
            </Paragraph>
            <ol>
              <li>确保光线充足，避免背光或光线过暗的环境</li>
              <li>确保您的全身都在图像或视频中清晰可见</li>
              <li>穿着与背景颜色对比明显的服装</li>
              <li>避免周围有其他人或移动物体干扰</li>
              <li>尝试不同的角度拍摄</li>
            </ol>
          </Panel>

          <Panel header="我的数据会被保存吗？" key="3">
            <Paragraph>
              武道智评系统尊重用户隐私，我们的数据处理原则如下：
            </Paragraph>
            <ul>
              <li>上传的图片和视频仅用于当前分析，不会长期存储</li>
              <li>分析完成后，系统会自动清理临时文件</li>
              <li>用户账户信息仅包含基本登录信息，不包含个人敏感数据</li>
              <li>我们不会将您的数据分享给任何第三方</li>
            </ul>
          </Panel>

          <Panel header="如何提高我的武术姿势评分？" key="4">
            <Paragraph>
              提高武术姿势评分的建议：
            </Paragraph>
            <ul>
              <li>仔细阅读系统提供的改进建议</li>
              <li>参考知识库中的标准姿势描述和关键点</li>
              <li>定期练习，保持动作的一致性</li>
              <li>使用镜子辅助练习，观察自己的姿势</li>
              <li>可以录制视频回看，对比标准姿势</li>
              <li>如有条件，请寻求专业教练的指导</li>
            </ul>
          </Panel>
        </Collapse>
      </Card>
    </MainLayout>
  );
};

export default Settings;
