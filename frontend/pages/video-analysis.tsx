import React, { useState, useRef } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Upload, Button, Card, Progress, Spin, Tabs, Divider, Tooltip, Steps, Timeline } from 'antd';
import { UploadOutlined, VideoCameraOutlined, InfoCircleOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import MainLayout from '../components/layout/MainLayout';
import GradientTitle from '../components/ui/GradientTitle';
import GradientButton from '../components/ui/GradientButton';

const { TabPane } = Tabs;
const { Step } = Steps;

const VideoAnalysis: React.FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 模拟上传和分析过程
  const handleAnalyze = async () => {
    if (fileList.length === 0) return;
    
    setUploading(true);
    setProgress(0);
    setResult(null);
    
    // 模拟上传进度
    const uploadInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
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
          overallScore: 88,
          sections: [
            {
              time: '0:00-0:08',
              name: '起势',
              score: 90,
              issues: [
                '身体重心略有不稳'
              ],
              suggestions: [
                '加强下肢力量训练，增强稳定性'
              ]
            },
            {
              time: '0:09-0:15',
              name: '左掌右拳',
              score: 85,
              issues: [
                '右拳出击力度不足',
                '左掌护体不到位'
              ],
              suggestions: [
                '练习单体右拳发力训练',
                '注意左掌位置，应贴近身体'
              ]
            },
            {
              time: '0:16-0:24',
              name: '下蹲转身',
              score: 92,
              issues: [
                '转身略显僵硬'
              ],
              suggestions: [
                '增加髋关节灵活性训练'
              ]
            },
            {
              time: '0:25-0:35',
              name: '收势',
              score: 86,
              issues: [
                '收势不够稳健',
                '呼吸节奏不协调'
              ],
              suggestions: [
                '练习站桩提升稳定性',
                '加强呼吸与动作的配合'
              ]
            }
          ],
          keyMetrics: {
            poseAccuracy: 87,
            movementSmooth: 89,
            balance: 90,
            power: 85,
            rhythm: 88
          }
        });
      }, 3000);
    }, 3000);
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const jumpToTime = (timeString: string) => {
    if (videoRef.current) {
      const [min, sec] = timeString.split(':').map(Number);
      videoRef.current.currentTime = min * 60 + sec;
      if (!playing) {
        videoRef.current.play();
        setPlaying(true);
      }
    }
  };

  const uploadProps = {
    onRemove: (file: any) => {
      setFileList([]);
      setResult(null);
    },
    beforeUpload: (file: any) => {
      // 检查文件类型
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        message.error('请上传视频文件!');
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <MainLayout>
      <Head>
        <title>视频分析 - 武道智评</title>
        <meta name="description" content="上传武术动作视频，获取连续动作的AI分析和专业评分" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <GradientTitle as="h1" className="mb-4">
              武术动作视频分析
            </GradientTitle>
            <p className="text-gray-600 text-lg">
              上传您的武术动作视频，AI系统将分析整套动作流程，提供分段评估和专业改进建议
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧上传区域 */}
            <div className="lg:col-span-1">
              <Card 
                title="上传视频" 
                className="mb-6 bg-gray-50 border border-gray-200 sticky top-24"
                extra={
                  <Tooltip title="支持MP4、MOV、AVI格式，建议视频长度不超过2分钟，画面中应包含完整人体">
                    <InfoCircleOutlined className="text-gray-400 hover:text-xtalpi-indigo cursor-pointer" />
                  </Tooltip>
                }
              >
                <Upload.Dragger 
                  {...uploadProps}
                  listType="picture"
                  maxCount={1}
                  className="mb-6"
                  accept="video/*"
                >
                  <p className="ant-upload-drag-icon">
                    <VideoCameraOutlined className="text-4xl text-xtalpi-indigo" />
                  </p>
                  <p className="ant-upload-text font-medium">点击或拖拽视频至此区域</p>
                  <p className="ant-upload-hint text-gray-500">
                    视频中应当包含完整的动作流程，光线充足且人物完整可见
                  </p>
                </Upload.Dragger>
                
                <GradientButton 
                  onClick={handleAnalyze} 
                  disabled={fileList.length === 0 || uploading || analyzing}
                  className="w-full py-2"
                >
                  {uploading ? '上传中...' : analyzing ? '分析中...' : '开始分析'}
                </GradientButton>
                
                {(uploading || analyzing) && (
                  <div className="mt-4">
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
                        <p className="mt-4 text-gray-600">AI正在分析视频中的武术动作...</p>
                        <p className="text-gray-500 text-sm">分析复杂视频可能需要几分钟时间</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
              
              {result && (
                <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple mb-2">
                      <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-xtalpi-dark-blue to-xtalpi-purple bg-clip-text text-transparent">
                          {result.overallScore}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-medium">总体评分</div>
                  </div>
                  
                  <Divider className="my-4" />
                  
                  <div>
                    <h4 className="font-medium mb-3">核心指标</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>姿态准确度</span>
                          <span className="font-medium">{result.keyMetrics.poseAccuracy}分</span>
                        </div>
                        <Progress percent={result.keyMetrics.poseAccuracy} strokeColor="#4F49FF" showInfo={false} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>动作流畅性</span>
                          <span className="font-medium">{result.keyMetrics.movementSmooth}分</span>
                        </div>
                        <Progress percent={result.keyMetrics.movementSmooth} strokeColor="#4F49FF" showInfo={false} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>平衡性</span>
                          <span className="font-medium">{result.keyMetrics.balance}分</span>
                        </div>
                        <Progress percent={result.keyMetrics.balance} strokeColor="#4F49FF" showInfo={false} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>力量表现</span>
                          <span className="font-medium">{result.keyMetrics.power}分</span>
                        </div>
                        <Progress percent={result.keyMetrics.power} strokeColor="#4F49FF" showInfo={false} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>节奏把握</span>
                          <span className="font-medium">{result.keyMetrics.rhythm}分</span>
                        </div>
                        <Progress percent={result.keyMetrics.rhythm} strokeColor="#4F49FF" showInfo={false} />
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
            
            {/* 右侧视频预览和结果区域 */}
            <div className="lg:col-span-2 space-y-6">
              {fileList.length > 0 && (
                <Card className="border border-gray-200 overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden relative">
                    <video
                      ref={videoRef}
                      src={fileList[0].url || URL.createObjectURL(fileList[0])}
                      className="w-full h-full object-contain"
                      onTimeUpdate={handleVideoTimeUpdate}
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                      controls
                    />
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                      <button 
                        onClick={togglePlay}
                        className="bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                        aria-label={playing ? '暂停' : '播放'}
                      >
                        {playing ? (
                          <PauseCircleOutlined className="text-2xl text-xtalpi-indigo" />
                        ) : (
                          <PlayCircleOutlined className="text-2xl text-xtalpi-indigo" />
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              )}
              
              {result && (
                <Card 
                  title="动作分段分析" 
                  className="border border-gray-200"
                >
                  <Steps 
                    direction="vertical" 
                    current={-1} 
                    className="mt-4"
                  >
                    {result.sections.map((section: any, index: number) => (
                      <Step 
                        key={index} 
                        title={
                          <div className="flex justify-between">
                            <span className="font-medium">{section.name}</span>
                            <span className="text-xtalpi-indigo">{section.score}分</span>
                          </div>
                        }
                        description={
                          <div className="mt-2">
                            <div className="flex items-center mb-2">
                              <span className="text-gray-500 mr-2">时间段: {section.time}</span>
                              <button 
                                onClick={() => jumpToTime(section.time.split('-')[0])} 
                                className="text-xtalpi-indigo hover:underline text-sm flex items-center"
                              >
                                <PlayCircleOutlined className="mr-1" /> 查看此段
                              </button>
                            </div>
                            
                            {section.issues.length > 0 && (
                              <div className="mb-2">
                                <div className="text-gray-700 font-medium mb-1">存在问题:</div>
                                <ul className="list-disc pl-5">
                                  {section.issues.map((issue: string, i: number) => (
                                    <li key={i} className="text-gray-600">{issue}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {section.suggestions.length > 0 && (
                              <div>
                                <div className="text-gray-700 font-medium mb-1">改进建议:</div>
                                <ul className="list-disc pl-5">
                                  {section.suggestions.map((suggestion: string, i: number) => (
                                    <li key={i} className="text-gray-600">{suggestion}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        }
                        icon={<div className="flex items-center justify-center w-8 h-8 rounded-full bg-xtalpi-indigo text-white">{index + 1}</div>}
                      />
                    ))}
                  </Steps>
                </Card>
              )}
              
              {!result && fileList.length > 0 && (
                <Card className="border border-dashed border-gray-300 bg-gray-50">
                  <div className="text-center text-gray-500 py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-lg">分析视频后将在这里显示详细评估结果</p>
                  </div>
                </Card>
              )}
              
              {!fileList.length && (
                <Card className="border border-dashed border-gray-300 bg-gray-50 h-full">
                  <div className="text-center text-gray-500 py-36">
                    <div className="text-6xl mb-4">🎬</div>
                    <p className="text-lg">请上传视频以进行武术动作分析</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 mt-12"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">视频分析使用提示</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
                <span>拍摄时保持良好光线，穿着与背景有明显区分的服装</span>
              </li>
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
                <span>建议使用三脚架固定拍摄，确保画面稳定且包含全身</span>
              </li>
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
                <span>尽量选择一套完整的动作进行分析，便于系统全面评估</span>
              </li>
              <li className="flex items-start">
                <span className="text-xtalpi-indigo mr-2 mt-1">•</span>
                <span>视频分析结果可以保存在您的账号中，便于后续比对进步情况</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VideoAnalysis;
