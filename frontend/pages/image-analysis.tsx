import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Upload, Button, Card, Progress, Spin, Tabs, Divider, Tooltip } from 'antd';
import { UploadOutlined, CameraOutlined, FileImageOutlined, InfoCircleOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import GradientTitle from '../components/ui/GradientTitle';
import GradientButton from '../components/ui/GradientButton';

const { TabPane } = Tabs;

const ImageAnalysis: React.FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const webcamRef = useRef<any>(null);

  // 模拟上传和分析过程
  const handleAnalyze = async () => {
    if (fileList.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    
    // 模拟上传进度
    const uploadInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return newProgress;
      });
    }, 300);
    
    // 模拟上传完成
    setTimeout(() => {
      clearInterval(uploadInterval);
      setUploading(false);
      setAnalyzing(true);
      
      // 模拟分析过程
      setTimeout(() => {
        setAnalyzing(false);
        // 模拟分析结果
        setResult({
          score: 85,
          poseAccuracy: 87,
          balance: 82,
          power: 88,
          speed: 83,
          issues: [
            '右腿膝盖角度偏小，建议加强腿部力量',
            '躯干稍微前倾，影响整体平衡性',
            '手臂伸展不够充分，减弱了力量传导'
          ],
          suggestions: [
            '增加下肢力量训练，尤其是大腿前侧肌群',
            '练习核心稳定性，保持躯干挺直',
            '增加肩部灵活性训练，提高上肢伸展幅度'
          ]
        });
      }, 2000);
    }, 3000);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setFileList([]);
    setResult(null);
  };

  const handleCaptureWebcam = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      // 处理捕获的图像
      setFileList([{
        uid: '-1',
        name: 'webcam-capture.jpg',
        status: 'done',
        url: imageSrc,
      }]);
    }
  };

  const uploadProps = {
    onRemove: (file: any) => {
      setFileList([]);
      setResult(null);
    },
    beforeUpload: (file: any) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <MainLayout>
      <Head>
        <title>图像分析 - 武道智评</title>
        <meta name="description" content="上传武术动作图片，获取专业姿态分析和评分" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <GradientTitle as="h1" className="mb-4">
              武术姿态图像分析
            </GradientTitle>
            <p className="text-gray-600 text-lg">
              上传您的武术动作图片，AI系统将自动识别姿态并提供专业评分和改进建议
            </p>
          </motion.div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <Tabs activeKey={activeTab} onChange={handleTabChange} className="px-6 pt-6">
              <TabPane 
                tab={
                  <span className="flex items-center">
                    <FileImageOutlined className="mr-2" />
                    上传图片
                  </span>
                } 
                key="upload"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2">
                      <Card 
                        title="选择图片" 
                        className="mb-4 bg-gray-50 border border-gray-200"
                        extra={
                          <Tooltip title="支持JPG、PNG格式，图片中应包含完整的人体姿态">
                            <InfoCircleOutlined className="text-gray-400 hover:text-xtalpi-indigo cursor-pointer" />
                          </Tooltip>
                        }
                      >
                        <Upload.Dragger 
                          {...uploadProps}
                          listType="picture"
                          maxCount={1}
                          className="mb-4"
                        >
                          <p className="ant-upload-drag-icon">
                            <UploadOutlined className="text-4xl text-xtalpi-indigo" />
                          </p>
                          <p className="ant-upload-text font-medium">点击或拖拽图片至此区域</p>
                          <p className="ant-upload-hint text-gray-500">
                            支持单张图片上传，请确保图中人物姿态完整可见
                          </p>
                        </Upload.Dragger>
                        
                        <div className="flex justify-center mt-4">
                          <GradientButton 
                            onClick={handleAnalyze} 
                            disabled={fileList.length === 0 || uploading || analyzing}
                            className="px-8 py-2"
                          >
                            {uploading ? '上传中...' : analyzing ? '分析中...' : '开始分析'}
                          </GradientButton>
                        </div>
                      </Card>
                      
                      {(uploading || analyzing) && (
                        <Card className="mb-4">
                          {uploading && (
                            <div className="mb-4">
                              <div className="flex justify-between mb-2">
                                <span>上传进度</span>
                                <span>{progress}%</span>
                              </div>
                              <Progress percent={progress} status="active" />
                            </div>
                          )}
                          
                          {analyzing && (
                            <div className="flex flex-col items-center py-4">
                              <Spin size="large" />
                              <p className="mt-4 text-gray-600">AI正在分析您的武术姿态...</p>
                            </div>
                          )}
                        </Card>
                      )}
                    </div>
                    
                    <div className="md:w-1/2">
                      {result ? (
                        <Card 
                          title="分析结果" 
                          className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200"
                        >
                          <div className="mb-6 text-center">
                            <div className="inline-block p-4 rounded-full bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple mb-2">
                              <div className="bg-white rounded-full p-3">
                                <div className="text-3xl font-bold bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple bg-clip-text text-transparent">
                                  {result.score}
                                </div>
                              </div>
                            </div>
                            <div className="text-lg font-medium">总体评分</div>
                          </div>
                          
                          <Divider className="my-4" />
                          
                          <div className="mb-6">
                            <h4 className="font-medium mb-3">评分详情</h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>姿态准确度</span>
                                  <span className="font-medium">{result.poseAccuracy}分</span>
                                </div>
                                <Progress percent={result.poseAccuracy} strokeColor="#4F49FF" showInfo={false} />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>平衡性</span>
                                  <span className="font-medium">{result.balance}分</span>
                                </div>
                                <Progress percent={result.balance} strokeColor="#4F49FF" showInfo={false} />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>力量表现</span>
                                  <span className="font-medium">{result.power}分</span>
                                </div>
                                <Progress percent={result.power} strokeColor="#4F49FF" showInfo={false} />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>速度评估</span>
                                  <span className="font-medium">{result.speed}分</span>
                                </div>
                                <Progress percent={result.speed} strokeColor="#4F49FF" showInfo={false} />
                              </div>
                            </div>
                          </div>
                          
                          <Divider className="my-4" />
                          
                          <div className="mb-6">
                            <h4 className="font-medium mb-3">需要改进的问题</h4>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                              {result.issues.map((issue: string, index: number) => (
                                <li key={index}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3">改进建议</h4>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                              {result.suggestions.map((suggestion: string, index: number) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </Card>
                      ) : (
                        <Card className="h-full flex items-center justify-center border border-dashed border-gray-300 bg-gray-50">
                          <div className="text-center text-gray-500 py-12">
                            <div className="text-6xl mb-4">📊</div>
                            <p className="text-lg">上传并分析图片后将在这里显示结果</p>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </TabPane>
              
              <TabPane 
                tab={
                  <span className="flex items-center">
                    <CameraOutlined className="mr-2" />
                    摄像头拍摄
                  </span>
                } 
                key="webcam"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/2">
                      <Card title="摄像头拍摄" className="mb-4 bg-gray-50 border border-gray-200">
                        <div className="aspect-w-4 aspect-h-3 bg-black rounded-lg mb-4 flex items-center justify-center">
                          {/* 此处应集成摄像头组件，如react-webcam */}
                          <div className="text-white text-center">
                            <p>摄像头预览区域</p>
                            <p className="text-sm">请确保您完整地站在画面中</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-center space-x-4">
                          <Button icon={<CameraOutlined />} onClick={handleCaptureWebcam}>拍摄照片</Button>
                          <GradientButton 
                            onClick={handleAnalyze} 
                            disabled={fileList.length === 0 || uploading || analyzing}
                            className="px-6"
                          >
                            {uploading ? '上传中...' : analyzing ? '分析中...' : '开始分析'}
                          </GradientButton>
                        </div>
                      </Card>
                    </div>
                    
                    <div className="md:w-1/2">
                      {fileList.length > 0 ? (
                        <Card title="预览" className="mb-4 bg-gray-50 border border-gray-200">
                          <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
                            <img src={fileList[0].url} alt="预览" className="object-contain" />
                          </div>
                        </Card>
                      ) : (
                        <Card className="h-full flex items-center justify-center border border-dashed border-gray-300 bg-gray-50">
                          <div className="text-center text-gray-500 py-12">
                            <div className="text-6xl mb-4">📸</div>
                            <p className="text-lg">拍摄照片后将在这里显示预览</p>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">图像分析使用提示</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
                <span>选择光线充足的环境，确保姿态清晰可见</span>
              </li>
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
                <span>尽量穿着与背景形成对比的服装，以便系统更准确识别</span>
              </li>
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
                <span>确保完整的身体姿态在画面中，尤其是手脚等关键部位</span>
              </li>
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
                <span>尝试不同角度拍摄同一动作，获取更全面的分析结果</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ImageAnalysis;
